import { ChemicalStructure, PharmacophoreGroup } from '../types/reviewModule';
import {
  getPharmacophoresForStructure,
  ColorPaletteItem,
} from './pharmacophoreData';

export type PharmacophoreCategory =
  | 'binding'
  | 'prodrug'
  | 'pk'
  | 'solubility'
  | 'stability'
  | 'all';

export interface GlobalPharmacophore {
  id: string;
  name: string;
  chemicalFormulaOrSymbol: string;
  category: 'binding' | 'prodrug' | 'pk' | 'solubility' | 'stability';
  description: string;
  sarRationale: string;
  clinicalSignificance: string;
  commonTargets: string[];
  matchKeywords: string[];
  drugIdsKnown?: string[]; // known drug IDs or keys
}

/**
 * Curated Global Catalog of Medicinal Chemistry Pharmacophores & Functional Groups
 */
export const GLOBAL_PHARMACOPHORES_CATALOG: GlobalPharmacophore[] = [
  // --- 1. ACIDIC & CARBOXYLATE BIOISOSTERES ---
  {
    id: 'gp_carboxylic_acid',
    name: 'Carboxylic Acid (-COOH) / Carboxylate',
    chemicalFormulaOrSymbol: '-COOH / -COO⁻',
    category: 'binding',
    description:
      'Negatively charged acidic moiety at physiologic pH that acts as a hydrogen-bond acceptor and electrostatic anchor.',
    sarRationale:
      'Mimics the Aspartate (Asp) residue of the Arg-Gly-Asp (RGD) peptide motif; forms key ionic salt bridges with Arg on platelet GPIIb/IIIa or COX Arg120.',
    clinicalSignificance:
      'Provides high nanomolar binding affinity for target integrin/enzyme; ionized form limits passive blood-brain barrier penetration.',
    commonTargets: ['GPIIb/IIIa (αIIbβ3)', 'COX-1 / COX-2', 'Angiotensin AT1'],
    matchKeywords: ['carboxylic acid', 'carboxylate', 'cooh', 'asp', 'salicyl', 'salicylate', 'propionic'],
    drugIdsKnown: ['tirofiban', 'aspirin', 'eptifibatide'],
  },
  {
    id: 'gp_tetrazole',
    name: 'Tetrazole Bioisostere',
    chemicalFormulaOrSymbol: 'CN4H',
    category: 'binding',
    description:
      'Planar, 5-membered heterocyclic isostere for carboxylic acid with a pKa ~4.5–4.9, retaining hydrogen-bonding capacity.',
    sarRationale:
      'Distributes negative charge over 4 ring nitrogens; significantly more lipophilic than carboxylic acid, enhancing passive cell permeation while maintaining active-site hydrogen bonding.',
    clinicalSignificance:
      'Enhances oral bioavailability and duration of action in PDE3 inhibitors and ARBs; resists glucuronidation metabolism.',
    commonTargets: ['Phosphodiesterase 3 (PDE3)', 'Angiotensin II AT1 Receptor'],
    matchKeywords: ['tetrazole', 'tetrazol', 'tetrazole isostere'],
    drugIdsKnown: ['cilostazol'],
  },
  {
    id: 'gp_diphosphonate',
    name: 'Dichloromethylene Diphosphonate',
    chemicalFormulaOrSymbol: '-P(O)(OH)2-CCl2-P(O)(OH)2',
    category: 'binding',
    description:
      'Non-hydrolyzable methylene-substituted bisphosphonate isostere for pyrophosphate.',
    sarRationale:
      'Substitutes the bridging ester oxygen with a dichloromethylene (-CCl2-) unit, rendering the polyphosphate completely resistant to vascular ectonucleotidases (NTPDases/CD39).',
    clinicalSignificance:
      'Enables direct, reversible, un-metabolized P2Y12 antagonism with immediate onset and ultra-rapid off-rate (plasma t1/2 ~3-5 min) via IV infusion.',
    commonTargets: ['P2Y12 ADP Receptor'],
    matchKeywords: ['diphosphonate', 'phosphonate', 'dichloromethylene', 'pyrophosphate'],
    drugIdsKnown: ['cangrelor'],
  },

  // --- 2. BASIC AMINES & CATIONIC ANCHORS ---
  {
    id: 'gp_basic_amine',
    name: 'Piperidine 2°/3° Basic Amine',
    chemicalFormulaOrSymbol: 'C5H11N',
    category: 'binding',
    description:
      'Protonated aliphatic saturated 6-membered nitrogen heterocycle acting as a basic cationic anchor (pKa ~9–10).',
    sarRationale:
      'Mimics the basic Arginine (Arg) guanidinium group of fibrinogen RGD motif; forms an essential electrostatic salt bridge with Asp224 of the αIIb subunit or occupies the K_ATP regulatory vestibule.',
    clinicalSignificance:
      'Critical for high-affinity integrin antagonism in tirofiban, and channel gating in minoxidil and dipyridamole.',
    commonTargets: ['GPIIb/IIIa (αIIb subunit)', 'SUR2B K_ATP Channels', 'Adenosine Transporters (ENT1)'],
    matchKeywords: ['piperidine', 'basic amine', 'alicyclic amine', 'arg mimic', 'amine'],
    drugIdsKnown: ['tirofiban', 'minoxidil', 'dipyridamole'],
  },
  {
    id: 'gp_guanidinium',
    name: 'Guanidinium / Homo-arginine (Har)',
    chemicalFormulaOrSymbol: '-NH-C(=NH2+)-NH2',
    category: 'binding',
    description:
      'Strongly basic resonance-stabilized planar cation (pKa ~12.5) that remains 100% protonated under all physiological pH conditions.',
    sarRationale:
      'Supplies direct bidentate electrostatic and hydrogen-bonding interactions with Asp224 in the αIIb subunit pocket, with the extended Har chain providing optimal spatial geometry.',
    clinicalSignificance:
      'Drives the picomolar selectivity of eptifibatide for platelet αIIbβ3 over endothelial vitronectin (αvβ3) integrins, reducing off-target bleeding complications.',
    commonTargets: ['Platelet Integrin αIIbβ3 (GPIIb/IIIa)', 'Thrombin Exosite I'],
    matchKeywords: ['guanidinium', 'homo-arginyl', 'homo-arginine', 'har', 'arginine'],
    drugIdsKnown: ['eptifibatide'],
  },
  {
    id: 'gp_tetrahydropyridine',
    name: 'Tetrahydropyridine Core',
    chemicalFormulaOrSymbol: 'C5H9N',
    category: 'solubility',
    description:
      'Partially hydrogenated 6-membered nitrogen ring fusing the thienopyridine skeleton.',
    sarRationale:
      'Provides conformational flexibility to position the sulfur-containing ring toward CYP active sites while maintaining adequate basicity for systemic solubility.',
    clinicalSignificance:
      'Forms the chemical backbone of clopidogrel and ticlopidine, dictating the orientation of the reactive thiol after oxidative ring opening.',
    commonTargets: ['P2Y12 Receptor Active Pocket', 'Hepatic CYP2C19/CYP3A4'],
    matchKeywords: ['tetrahydropyridine', 'thienopyridine core', 'pyridine nitrogen', 'pyridine'],
    drugIdsKnown: ['clopidogrel', 'ticlopidine', 'prasugrel'],
  },

  // --- 3. BIOACTIVATION & PRODRUG MOIETIES ---
  {
    id: 'gp_thiophene',
    name: 'Thiophene Ring (Bioactivation Site)',
    chemicalFormulaOrSymbol: 'C4H4S',
    category: 'prodrug',
    description:
      'Electron-rich sulfur-containing 5-membered heteroaromatic ring susceptible to oxidative bioactivation by cytochrome P450 enzymes.',
    sarRationale:
      'Undergoes initial CYP2C19/CYP1A2 hydroxylation to a 2-oxo-intermediate, followed by oxidative ring fission to generate a transient, highly reactive thiol (-SH) group.',
    clinicalSignificance:
      'The generated thiol covalently bonds via a disulfide bridge to Cys97/Cys175 of P2Y12, producing permanent, irreversible platelet inhibition for the platelet lifespan (~7-10 days).',
    commonTargets: ['Cytochrome P450 (CYP2C19, CYP3A4, CYP2B6)', 'P2Y12 Cys Residues'],
    matchKeywords: ['thiophene', 'thienopyridine', 'thiol metabolite', 'reactive thiol', 'cyp site'],
    drugIdsKnown: ['clopidogrel', 'prasugrel', 'ticlopidine'],
  },
  {
    id: 'gp_ester_prodrug',
    name: 'Ester Prodrug / Acetyl Ester',
    chemicalFormulaOrSymbol: '-COO-R / -OCOCH3',
    category: 'prodrug',
    description:
      'Ester linkage cleavable by human carboxylesterases (hCE1 / hCE2) or acting as an active acylating group.',
    sarRationale:
      'In prasugrel: Rapidly hydrolyzed by intestinal hCE2 to initiate activation, avoiding CYP2C19 dependency. In clopidogrel: Hydrolyzed by hCE1 into inactive acid (~85% wasted). In aspirin: Transfers acetyl onto COX-1 Ser529.',
    clinicalSignificance:
      'Differentiates prasugrel (fast 30-min onset, consistent response) from clopidogrel (variable CYP2C19 resistance). Dictates irreversible COX acetylation by aspirin.',
    commonTargets: ['Human Carboxylesterase 1 & 2 (hCE1/hCE2)', 'COX-1 Ser529'],
    matchKeywords: ['ester', 'acetyl', 'methyl ester', 'carboxylesterase', 'hce1', 'hce2', 'acetyl ester'],
    drugIdsKnown: ['aspirin', 'clopidogrel', 'prasugrel'],
  },
  {
    id: 'gp_nitrate_ester',
    name: 'Organic Nitrate Ester (-ONO2)',
    chemicalFormulaOrSymbol: '-O-NO2',
    category: 'prodrug',
    description:
      'Nitrogen trioxide ester bound to a carbon backbone that serves as a direct source of vasoactive nitric oxide (NO).',
    sarRationale:
      'Serves as a substrate for mitochondrial aldehyde dehydrogenase (ALDH2); reduced via a 3-electron pathway to 1,2-glyceryl dinitrate and nitric oxide gas.',
    clinicalSignificance:
      'Produces rapid venodilation and preload reduction; chronic un-interrupted exposure induces ALDH2 oxidation and clinical nitrate tolerance.',
    commonTargets: ['Mitochondrial ALDH2', 'Soluble Guanylyl Cyclase (sGC)'],
    matchKeywords: ['nitrate', 'nitrate ester', 'ono2', 'glyceryl', 'aldh2'],
    drugIdsKnown: ['nitroglycerin'],
  },
  {
    id: 'gp_nitrosyl_iron',
    name: 'Nitrosyl (NO+) Ligand & Iron Center',
    chemicalFormulaOrSymbol: '[Fe(CN)5(NO)]²⁻',
    category: 'prodrug',
    description:
      'Inorganic coordination complex featuring an Fe(II/III) ion coordinated to five cyanide ligands and one linear nitrosyl cation (NO+).',
    sarRationale:
      'Releases NO non-enzymatically in the vascular lumen upon single-electron reduction by oxyhemoglobin, entirely bypassing ALDH2 and cellular tolerance.',
    clinicalSignificance:
      'Equipotent arteriolar and venous dilation for hypertensive emergencies; requires sodium thiosulfate co-administration to prevent toxic cyanide accumulation.',
    commonTargets: ['Oxyhemoglobin Reduction', 'Soluble Guanylyl Cyclase (sGC)'],
    matchKeywords: ['nitrosyl', 'no+', 'iron center', 'cyanide', 'nitroprusside'],
    drugIdsKnown: ['nitroprusside'],
  },
  {
    id: 'gp_hydrazine',
    name: 'Hydrazine Functional Group (-NH-NH2)',
    chemicalFormulaOrSymbol: '-NH-NH2',
    category: 'prodrug',
    description:
      'Nucleophilic diamino substituent directly bound to a heteroaromatic ring.',
    sarRationale:
      'Induces vascular smooth muscle hyperpolarization and antioxidant/NO generation; major substrate for hepatic N-acetyltransferase 2 (NAT2).',
    clinicalSignificance:
      'Pharmacokinetics and toxicity depend on acetylator phenotype: slow acetylators experience prolonged drug exposure and high risk of Drug-Induced Lupus Erythematosus (DILE).',
    commonTargets: ['Vascular Smooth Muscle K+ Channels', 'N-Acetyltransferase 2 (NAT2)'],
    matchKeywords: ['hydrazine', 'nh-nh2', 'nat2', 'phthalazine'],
    drugIdsKnown: ['hydralazine'],
  },
  {
    id: 'gp_n_oxide',
    name: 'Heterocyclic N-Oxide Group',
    chemicalFormulaOrSymbol: 'N⁺-O⁻',
    category: 'prodrug',
    description:
      'Dipolar nitrogen-oxygen bond on a pyrimidine heterocycle, conferring water solubility and metabolic reactivity.',
    sarRationale:
      'Target for hepatic sulfotransferase SULT1A1; sulfated into minoxidil N-O-sulfate, which directly opens ATP-sensitive K+ channels (K_ATP).',
    clinicalSignificance:
      'True active drug is the charged sulfate conjugate; potency correlates with cutaneous and hepatic SULT1A1 expression.',
    commonTargets: ['Sulfotransferase SULT1A1', 'SUR2B / Kir6.1 Channels'],
    matchKeywords: ['n-oxide', 'sult1a1', 'n-o-sulfate', 'oxide'],
    drugIdsKnown: ['minoxidil'],
  },

  // --- 4. HETEROCYCLIC & AROMATIC CORES ---
  {
    id: 'gp_triazolopyrimidine',
    name: 'Triazolopyrimidine Bicyclic Core',
    chemicalFormulaOrSymbol: 'C6H4N6',
    category: 'binding',
    description:
      'Purine isostere with alternating nitrogens that acts as an adenosine mimetic.',
    sarRationale:
      'Binds allosterically to P2Y12 (distinct from ADP orthosteric site); locks the receptor in an inactive conformation without covalent reaction or metabolic bioactivation.',
    clinicalSignificance:
      'Enables non-competitive, fully reversible oral antiplatelet inhibition (ticagrelor); faster platelet recovery on drug cessation compared to thienopyridines.',
    commonTargets: ['P2Y12 Allosteric Binding Site'],
    matchKeywords: ['triazolopyrimidine', 'purine isostere', 'adenosine isostere'],
    drugIdsKnown: ['ticagrelor'],
  },
  {
    id: 'gp_pyrimidopyrimidine',
    name: 'Pyrimidopyrimidine Heteropolycycle',
    chemicalFormulaOrSymbol: 'C8H6N4',
    category: 'binding',
    description:
      'Planar fused bicyclic aromatic framework with four symmetrically placed nitrogen atoms.',
    sarRationale:
      'Competitively mimics the purine core of endogenous adenosine; blocks adenosine reuptake via equilibrative nucleoside transporter 1 (ENT1) and weakly inhibits PDE.',
    clinicalSignificance:
      'Elevates interstitial adenosine levels, inducing localized coronary vasodilation and antiplatelet synergy with aspirin.',
    commonTargets: ['Equilibrative Nucleoside Transporter 1 (ENT1)', 'cAMP-Phosphodiesterases'],
    matchKeywords: ['pyrimidopyrimidine', 'adenosine mimic', 'ent1'],
    drugIdsKnown: ['dipyridamole'],
  },
  {
    id: 'gp_quinolinone',
    name: 'Quinolinone Bicyclic Core',
    chemicalFormulaOrSymbol: 'C9H7NO',
    category: 'binding',
    description:
      'Bicyclic system containing a benzene ring fused to a pyridone ring with a carbonyl oxygen.',
    sarRationale:
      'Intercalates into the catalytic substrate cleft of Phosphodiesterase 3 (PDE3), selectively preventing cAMP hydrolysis in platelets and vascular smooth muscle.',
    clinicalSignificance:
      'Produces simultaneous antiplatelet aggregation and peripheral arterial vasodilation, approved for intermittent claudication.',
    commonTargets: ['Phosphodiesterase 3A & 3B (PDE3)'],
    matchKeywords: ['quinolinone', 'pde3 blocker', 'quinolin'],
    drugIdsKnown: ['cilostazol'],
  },
  {
    id: 'gp_phthalazine',
    name: 'Phthalazine Diazanaphthalene Ring',
    chemicalFormulaOrSymbol: 'C8H6N2',
    category: 'binding',
    description:
      'Planar bicyclic aromatic ring consisting of a benzene ring fused to a pyridazine ring.',
    sarRationale:
      'Positions the hydrazine group at an optimal distance and angle to trigger smooth muscle cell relaxation and cGMP accumulation.',
    clinicalSignificance:
      'Preferentially relaxes resistance arterioles over capacitance venules, avoiding orthostatic hypotension.',
    commonTargets: ['Vascular Arteriolar Smooth Muscle'],
    matchKeywords: ['phthalazine', 'diazanaphthalene'],
    drugIdsKnown: ['hydralazine'],
  },
  {
    id: 'gp_benzene_core',
    name: 'Aromatic Benzene / Phenyl Scaffold',
    chemicalFormulaOrSymbol: 'C6H5-',
    category: 'stability',
    description:
      'Rigid planar six-carbon aromatic ring providing hydrophobic and π-stacking interactions.',
    sarRationale:
      'Inserts into deep hydrophobic channels (such as the COX-1 constriction or integrin aromatic pockets), anchoring the pharmacophores in a rigid geometry.',
    clinicalSignificance:
      'Provides high thermal, chemical, and conformational stability to medicinal compounds.',
    commonTargets: ['Cyclooxygenase (COX-1/2) Channel', 'Aromatic Integrin Pockets'],
    matchKeywords: ['benzene', 'phenyl ring', 'aromatic ring', 'benzene core', 'tyrosine spacer'],
    drugIdsKnown: ['aspirin', 'tirofiban', 'clopidogrel', 'prasugrel'],
  },

  // --- 5. HALOGENATED & LIPOPHILIC SUBSTITUENTS ---
  {
    id: 'gp_chlorophenyl',
    name: 'o-Chlorophenyl / o-Chlorobenzyl Ring',
    chemicalFormulaOrSymbol: 'o-Cl-C6H4-',
    category: 'binding',
    description:
      'Aromatic ring substituted at the ortho position with an electronegative, lipophilic chlorine atom.',
    sarRationale:
      'Provides steric hindrance preventing planar conformation; fits tightly into a selective lipophilic sub-pocket of P2Y12, maximizing target affinity.',
    clinicalSignificance:
      'Essential for P2Y12 receptor recognition in thienopyridines; unshielded positions in ticlopidine carry agranulocytosis risk.',
    commonTargets: ['P2Y12 Receptor Hydrophobic Pocket'],
    matchKeywords: ['chlorophenyl', 'chlorobenzyl', 'ortho-chloro', 'o-chlorophenyl', 'chlorine'],
    drugIdsKnown: ['clopidogrel', 'ticlopidine'],
  },
  {
    id: 'gp_fluorophenyl',
    name: 'o-Fluorophenyl / Difluorophenyl Ring',
    chemicalFormulaOrSymbol: 'F-C6H4- / F2-C6H3-',
    category: 'binding',
    description:
      'Aromatic ring bearing one or more fluorine atoms that increase lipophilicity and metabolic stability.',
    sarRationale:
      'Replaces vulnerable aromatic C-H bonds with ultra-strong C-F bonds (dissociation energy ~130 kcal/mol), completely blocking CYP-mediated aromatic para-hydroxylation.',
    clinicalSignificance:
      'Increases oral bioavailability and metabolic duration; enhances binding affinity in prasugrel and ticagrelor.',
    commonTargets: ['P2Y12 Accessory Lipophilic Grooves', 'PAR-1 Binding Pocket'],
    matchKeywords: ['fluorophenyl', 'difluorophenyl', 'fluorine', 'fluoro'],
    drugIdsKnown: ['prasugrel', 'ticagrelor', 'vorapaxar'],
  },
  {
    id: 'gp_sulfonamide',
    name: 'Sulfonamide / Sulfonyl Group (-SO2-)',
    chemicalFormulaOrSymbol: '-SO2-NH- / -SO2-R',
    category: 'binding',
    description:
      'Tetrahedral sulfur center flanked by two oxygen atoms, acting as a strong hydrogen-bond acceptor with a dipole moment.',
    sarRationale:
      'Inserts into a distinct hydrophobic/electrostatic pocket on GPIIb/IIIa, providing critical spatial orientation for the tyrosine spacer.',
    clinicalSignificance:
      'Grants tirofiban its high selectivity for platelet GPIIb/IIIa over endothelial vitronectin (αvβ3) and fibronectin receptors.',
    commonTargets: ['GPIIb/IIIa Hydrophobic Pocket'],
    matchKeywords: ['sulfonamide', 'sulfonyl', 'butyl sulfonamide', 'so2'],
    drugIdsKnown: ['tirofiban'],
  },
  {
    id: 'gp_thioether',
    name: 'Thioether Substituent (-S-R)',
    chemicalFormulaOrSymbol: '-S-CH2- / -S-Pr',
    category: 'binding',
    description:
      'Divalent sulfur atom bridging aliphatic chains, providing polarizable lipophilic bulk.',
    sarRationale:
      'Anchors nucleoside analogues deep inside an accessory lipophilic groove of the P2Y12 receptor.',
    clinicalSignificance:
      'Boosts binding potency >1000-fold over endogenous adenine nucleotides in ticagrelor and cangrelor.',
    commonTargets: ['P2Y12 Lipophilic Groove'],
    matchKeywords: ['thioether', 'propylthio', 'trifluoroethylthio', 'sulfide'],
    drugIdsKnown: ['ticagrelor', 'cangrelor'],
  },

  // --- 6. MACROCYCLES & CONFORMATIONALLY CONSTRAINED MOTIFS ---
  {
    id: 'gp_disulfide_cycle',
    name: 'Cyclic Disulfide Bridge (Peptidomimetic)',
    chemicalFormulaOrSymbol: '-S-S- (Cys-Mpr)',
    category: 'stability',
    description:
      'Covalent disulfide bond locking a peptide sequence into a rigid cyclic conformation.',
    sarRationale:
      'Restricts the peptide backbone (Mpr-Har-Gly-Asp-Trp-Pro-Cys) into a stable hairpin that presents the Har-Asp distance at the precise ~14 Å requirement for αIIbβ3.',
    clinicalSignificance:
      'Prevents enzymatic proteolysis by circulating aminopeptidases and grants near 1000:1 selectivity over vitronectin integrin.',
    commonTargets: ['αIIbβ3 (GPIIb/IIIa) Active Conformation'],
    matchKeywords: ['disulfide', 'cyclic peptide', 'disulfide bridge', 'mpr-cys'],
    drugIdsKnown: ['eptifibatide'],
  },
  {
    id: 'gp_polycyclic_tricycle',
    name: 'Himbacine-Derived Tricyclic Core',
    chemicalFormulaOrSymbol: 'Polycyclic Himbacine',
    category: 'binding',
    description:
      'Conformationally rigid non-peptide natural product scaffold derived from the bark of Galbulimima belgraveana.',
    sarRationale:
      'Locks the molecule in a complementary fit for the tethered-ligand binding pocket of Protease-Activated Receptor 1 (PAR-1), competitively blocking thrombin-induced platelet activation.',
    clinicalSignificance:
      'Provides pseudo-irreversible picomolar affinity with an extraordinarily long clinical half-life of ~8 days.',
    commonTargets: ['Thrombin Receptor (PAR-1)'],
    matchKeywords: ['himbacine', 'tricycle', 'polycyclic', 'carbamate', 'vorapaxar core'],
    drugIdsKnown: ['vorapaxar'],
  },
];

/**
 * Checks if a specific ChemicalStructure contains a given GlobalPharmacophore.
 * Evaluates both curated drug IDs, actual pharmacophore group regions, and key functional groups.
 */
export const checkStructureMatchesGlobalPharmacophore = (
  structure: ChemicalStructure,
  pharmacophore: GlobalPharmacophore
): { matches: boolean; matchingGroupIds: string[]; reason: string } => {
  const structureGroups = getPharmacophoresForStructure(structure);
  const matchingGroupIds: string[] = [];

  const drugNameLower = (structure.name || '').toLowerCase();
  const tradeLower = (structure.tradeName || '').toLowerCase();
  const chemicalClassLower = (structure.chemicalClass || '').toLowerCase();
  const functionalGroupsLower = (structure.keyFunctionalGroups || []).map((f) =>
    f.toLowerCase()
  );

  // 1. Direct drug known match
  if (pharmacophore.drugIdsKnown) {
    for (const known of pharmacophore.drugIdsKnown) {
      if (
        drugNameLower.includes(known) ||
        tradeLower.includes(known) ||
        structure.id.toLowerCase() === known
      ) {
        // Find which structure groups match
        for (const g of structureGroups) {
          const gName = g.name.toLowerCase();
          const gPurp = g.purpose.toLowerCase();
          const gLabel = (g.region?.label || '').toLowerCase();

          for (const kw of pharmacophore.matchKeywords) {
            if (
              gName.includes(kw) ||
              gPurp.includes(kw) ||
              gLabel.includes(kw)
            ) {
              matchingGroupIds.push(g.id);
              break;
            }
          }
        }
        if (matchingGroupIds.length === 0 && structureGroups.length > 0) {
          matchingGroupIds.push(structureGroups[0].id);
        }
        return {
          matches: true,
          matchingGroupIds: Array.from(new Set(matchingGroupIds)),
          reason: `Documented feature in ${structure.name} (${pharmacophore.name})`,
        };
      }
    }
  }

  // 2. Match against structure's pharmacophores by keywords
  for (const g of structureGroups) {
    const gName = g.name.toLowerCase();
    const gPurp = g.purpose.toLowerCase();
    const gLabel = (g.region?.label || '').toLowerCase();

    for (const kw of pharmacophore.matchKeywords) {
      if (
        gName.includes(kw) ||
        gPurp.includes(kw) ||
        gLabel.includes(kw)
      ) {
        matchingGroupIds.push(g.id);
        break;
      }
    }
  }

  // 3. Match against keyFunctionalGroups
  let kwMatchedInFunctionalGroups = false;
  for (const kw of pharmacophore.matchKeywords) {
    if (
      chemicalClassLower.includes(kw) ||
      functionalGroupsLower.some((f) => f.includes(kw))
    ) {
      kwMatchedInFunctionalGroups = true;
      break;
    }
  }

  if (matchingGroupIds.length > 0 || kwMatchedInFunctionalGroups) {
    // If matched via keywords but no specific region ID was found, match the first relevant group
    if (matchingGroupIds.length === 0 && structureGroups.length > 0) {
      matchingGroupIds.push(structureGroups[0].id);
    }
    return {
      matches: true,
      matchingGroupIds: Array.from(new Set(matchingGroupIds)),
      reason: `Matches functional chemistry keywords in ${structure.name}`,
    };
  }

  return { matches: false, matchingGroupIds: [], reason: '' };
};

export interface ModulePharmacophoreSummary {
  pharmacophore: GlobalPharmacophore;
  matchingStructures: ChemicalStructure[];
  matchingStructureIds: string[];
}

/**
 * Scans all structures in the current module and returns matching summaries for each global pharmacophore
 */
export const getModulePharmacophoreSummaries = (
  structures: ChemicalStructure[]
): ModulePharmacophoreSummary[] => {
  const summaries: ModulePharmacophoreSummary[] = [];

  for (const gp of GLOBAL_PHARMACOPHORES_CATALOG) {
    const matching: ChemicalStructure[] = [];
    const matchingIds: string[] = [];

    for (const s of structures) {
      const { matches } = checkStructureMatchesGlobalPharmacophore(s, gp);
      if (matches) {
        matching.push(s);
        matchingIds.push(s.id);
      }
    }

    summaries.push({
      pharmacophore: gp,
      matchingStructures: matching,
      matchingStructureIds: matchingIds,
    });
  }

  return summaries;
};

/**
 * Merges local card pharmacophore state with global explorer pharmacophores for any structure.
 */
export const resolveActivePharmacophoresForStructure = (
  structure: ChemicalStructure,
  localActive: Record<string, ColorPaletteItem> = {},
  localHovered: string | null = null,
  globalActive: Record<string, ColorPaletteItem> = {},
  globalHovered: string | null = null
): {
  mergedActive: Record<string, ColorPaletteItem>;
  mergedHovered: string | null;
  matchedGlobalPharmacophores: Array<{ gp: GlobalPharmacophore; color: ColorPaletteItem }>;
  hasAnyMatch: boolean;
  isDimmed: boolean;
} => {
  const mergedActive: Record<string, ColorPaletteItem> = { ...localActive };
  let mergedHovered: string | null = localHovered;
  const matchedGlobal: Array<{ gp: GlobalPharmacophore; color: ColorPaletteItem }> = [];

  const hasGlobalFilter = Object.keys(globalActive).length > 0;

  // Check each active global pharmacophore
  for (const [gpId, color] of Object.entries(globalActive)) {
    const gp = GLOBAL_PHARMACOPHORES_CATALOG.find((g) => g.id === gpId);
    if (!gp) continue;
    const { matches, matchingGroupIds } = checkStructureMatchesGlobalPharmacophore(
      structure,
      gp
    );
    if (matches) {
      matchedGlobal.push({ gp, color });
      for (const gId of matchingGroupIds) {
        if (!mergedActive[gId]) {
          mergedActive[gId] = color;
        }
      }
    }
  }

  // Check hovered global pharmacophore
  if (globalHovered) {
    const gp = GLOBAL_PHARMACOPHORES_CATALOG.find((g) => g.id === globalHovered);
    if (gp) {
      const { matches, matchingGroupIds } = checkStructureMatchesGlobalPharmacophore(
        structure,
        gp
      );
      if (matches && matchingGroupIds.length > 0) {
        mergedHovered = matchingGroupIds[0];
      }
    }
  }

  const hasAnyMatch = matchedGlobal.length > 0;
  // If global filter active and no match
  const isDimmed = hasGlobalFilter && !hasAnyMatch;

  return {
    mergedActive,
    mergedHovered,
    matchedGlobalPharmacophores: matchedGlobal,
    hasAnyMatch,
    isDimmed,
  };
};
