import { ChemicalStructure } from '../types/reviewModule';

export interface TargetResidue {
  residueNumber: number;
  residueName: string;
  chain: string;
  role: string;
  interactionType: 'Metal Coordination' | 'Hydrogen Bond' | 'Ionic / Salt Bridge' | 'Hydrophobic / Pi-Pi' | 'Covalent' | 'Allosteric / Structural';
  color: string;
  description: string;
}

export interface TargetPocketProfile {
  targetId: string;
  targetName: string;
  systematicName: string;
  uniprotId: string;
  pdbId: string;
  alphaFoldId: string;
  resolution?: string;
  organism: string;
  pocketName: string;
  pocketDescription: string;
  coordinatingIons?: string[];
  endogenousLigand?: string;
  keyResidues: TargetResidue[];
  sarTakeaways: string[];
  associatedDrugIds: string[];
  matchingRegex: RegExp;
}

export const TARGET_POCKET_PROFILES: TargetPocketProfile[] = [
  // 1. Angiotensin-Converting Enzyme (ACE) - Review 10
  {
    targetId: 'ace_peptidase',
    targetName: 'Angiotensin-Converting Enzyme (ACE / Peptidyl-dipeptidase A)',
    systematicName: 'Human somatic / testicular Angiotensin-Converting Enzyme',
    uniprotId: 'P12821',
    pdbId: '1UZF',
    alphaFoldId: 'AF-P12821-F1',
    resolution: '2.00 Å',
    organism: 'Homo sapiens',
    pocketName: 'Catalytic Zinc S1 / S1\' / S2\' Subsites',
    pocketDescription:
      'HEXXH zinc-metallopeptidase active cleft containing catalytic Zn2+ tetrahedral coordination and deep hydrophobic S1 and S1\' subpockets accommodating proline/carboxylate peptidomimetics.',
    coordinatingIons: ['Zn2+'],
    endogenousLigand: 'Angiotensin I (Asp-Arg-Val-Tyr-Ile-His-Pro-Phe-His-Leu)',
    keyResidues: [
      {
        residueNumber: 383,
        residueName: 'HIS',
        chain: 'A',
        role: 'Catalytic Zn2+ Coordination',
        interactionType: 'Metal Coordination',
        color: '#10b981',
        description: 'Forms coordinate covalent bond with catalytic Zn2+; essential for electrophilic activation of substrate carbonyl.'
      },
      {
        residueNumber: 387,
        residueName: 'HIS',
        chain: 'A',
        role: 'Catalytic Zn2+ Coordination',
        interactionType: 'Metal Coordination',
        color: '#10b981',
        description: 'Second histidine of the canonical HEXXH motif coordinating the divalent zinc ion.'
      },
      {
        residueNumber: 411,
        residueName: 'GLU',
        chain: 'A',
        role: 'Catalytic Zn2+ Coordination',
        interactionType: 'Metal Coordination',
        color: '#10b981',
        description: 'Glutamate oxygen provides third protein coordination ligand to Zn2+.'
      },
      {
        residueNumber: 384,
        residueName: 'GLU',
        chain: 'A',
        role: 'General Base / Proton Shuttle',
        interactionType: 'Hydrogen Bond',
        color: '#3b82f6',
        description: 'Activates catalytic water for nucleophilic attack on the scissile peptide bond; hydrogen bonds to transition-state mimics.'
      },
      {
        residueNumber: 511,
        residueName: 'LYS',
        chain: 'A',
        role: 'C-terminal Carboxylate Ionic Anchor (S2\' pocket)',
        interactionType: 'Ionic / Salt Bridge',
        color: '#8b5cf6',
        description: 'Forms critical ionic salt bridge with the terminal carboxylate of ACE inhibitors (e.g. proline or dicarboxylate carboxyl).'
      },
      {
        residueNumber: 520,
        residueName: 'TYR',
        chain: 'A',
        role: 'Transition-State Hydrogen Bond Stabilization',
        interactionType: 'Hydrogen Bond',
        color: '#06b6d4',
        description: 'Phenolic hydroxyl forms hydrogen bond with the oxyanion of the tetrahedral transition state.'
      },
      {
        residueNumber: 523,
        residueName: 'GLN',
        chain: 'A',
        role: 'S1\' Subsite Polar Anchor',
        interactionType: 'Hydrogen Bond',
        color: '#f59e0b',
        description: 'Stabilizes central amide backbone of ACE inhibitors through oriented hydrogen bonding.'
      }
    ],
    sarTakeaways: [
      'Zinc-binding groups dictate drug class: Thiol (Captopril - high potency but rash/taste loss), Dicarboxylate (Enalaprilat/Lisinopril - transition state mimics requiring prodrug esterification for oral bioavailability except Lys-containing Lisinopril), Phosphinate (Fosinoprilat).',
      'The S1\' subsite fits hydrophobic phenethyl side chains, vastly increasing binding affinity over the natural substrate.',
      'Proline or ring-constrained bioisosteres (perindopril, ramipril) lock the C-terminal carboxylate into an ideal geometry to salt-bridge with Lys511.'
    ],
    associatedDrugIds: ['Captopril', 'Enalapril', 'Enalaprilat', 'Lisinopril', 'Fosinopril', 'Fosinoprilat', 'Ramipril', 'Benazepril'],
    matchingRegex: /(\bace\b|angiotensin-converting|angiotensin converting|captopril|enalapril|lisinopril|fosinopril|ramipril|benazepril|quinapril|perindopril)/i
  },

  // 2. Na+/K+-ATPase Alpha Subunit - Review 10
  {
    targetId: 'nak_atpase',
    targetName: 'Na+/K+-Transporting ATPase Subunit Alpha-1',
    systematicName: 'Human Na+/K+-transporting ATPase subunit alpha-1',
    uniprotId: 'P05023',
    pdbId: '4HYT',
    alphaFoldId: 'AF-P05023-F1',
    resolution: '3.40 Å',
    organism: 'Sus scrofa / Homo sapiens',
    pocketName: 'Extracellular Cation Pathway & Steroid-Binding Vestibule',
    pocketDescription:
      'Extracellular transmembrane cavity accessed between M1-M6 helices in the E2-P phosphoenzyme state. The steroid core wedges into a hydrophobic cleft while the unsaturated lactone and glycone sugars coordinate specific polar sidechains.',
    coordinatingIons: ['Mg2+', 'K+'],
    endogenousLigand: '3 Na+ (cytoplasmic) / 2 K+ (extracellular) exchange cycle',
    keyResidues: [
      {
        residueNumber: 111,
        residueName: 'GLN',
        chain: 'A',
        role: 'Extracellular Gate / Sugar Coordination',
        interactionType: 'Hydrogen Bond',
        color: '#06b6d4',
        description: 'Interacts with the first digitoxose sugar unit of cardiac glycosides; critical determinant of ouabain vs digoxin sensitivity.'
      },
      {
        residueNumber: 121,
        residueName: 'ASN',
        chain: 'A',
        role: 'Extracellular Loop Stabilizer',
        interactionType: 'Hydrogen Bond',
        color: '#3b82f6',
        description: 'Stabilizes the entrance to the ion pore and hydrogen-bonds with cardiac glycoside carbohydrate chains.'
      },
      {
        residueNumber: 327,
        residueName: 'GLU',
        chain: 'A',
        role: 'Cation Binding Site & Lactone Polar Ring Anchor',
        interactionType: 'Ionic / Salt Bridge',
        color: '#ef4444',
        description: 'Key cation coordinating carboxylate in TM4; orients near the positive dipole of the unsaturated lactone carbonyl.'
      },
      {
        residueNumber: 797,
        residueName: 'THR',
        chain: 'A',
        role: 'Lactone Hydrogen Bond Partner',
        interactionType: 'Hydrogen Bond',
        color: '#10b981',
        description: 'Forms essential hydrogen bond with the C17-beta unsaturated butenolide lactone ring carbonyl.'
      },
      {
        residueNumber: 804,
        residueName: 'ASP',
        chain: 'A',
        role: 'Cation Occlusion / Lactone Coordination',
        interactionType: 'Ionic / Salt Bridge',
        color: '#8b5cf6',
        description: 'Conserved intramembrane acidic residue in TM6 coordinating K+ ions and forming electrostatic contacts with the glycoside pharmacophore.'
      }
    ],
    sarTakeaways: [
      'The cis-trans-cis (U-shaped) steroid nucleus conformation is mandatory: A/B cis, B/C trans, C/D cis geometry places the 3-beta-OH and 17-beta-lactone in a rigid pharmacophoric arrangement.',
      'Unsaturated 17-beta lactone is essential: reduction to saturated lactone or opening of the butenolide ring results in dramatic loss of inotropic potency.',
      'Tridigitoxose sugar chain at C3-OH is not strictly required for binding but drastically modifies pharmacokinetic partitioning, tissue distribution, and half-life (Digoxin t1/2 ~ 36-40h).'
    ],
    associatedDrugIds: ['Digoxin', 'Digitoxin', 'Ouabain'],
    matchingRegex: /digoxin|digitoxin|ouabain|na\+\/k\+|cardiac glycoside/i
  },

  // 3. P2Y12 Purinergic Receptor - Review 8
  {
    targetId: 'p2y12_receptor',
    targetName: 'Platelet P2Y Purinoceptor 12 (P2Y12)',
    systematicName: 'Human P2Y12 purinergic G-protein coupled receptor (Gi-coupled)',
    uniprotId: 'Q9H244',
    pdbId: '4PXZ',
    alphaFoldId: 'AF-Q9H244-F1',
    resolution: '2.60 Å',
    organism: 'Homo sapiens',
    pocketName: 'Orthosteric Nucleotide Pocket & Cysteine Extracellular Vestibule',
    pocketDescription:
      'Extracellular transmembrane cavity of Gi-coupled GPCR featuring an aromatic cage (Phe252, His187) and critical reactive cysteine residues (Cys17 in ECL1, Cys270 in ECL3) that undergo disulfide cross-linking by thienopyridine active sulfhydryl metabolites.',
    endogenousLigand: 'Adenosine 5\'-diphosphate (ADP)',
    keyResidues: [
      {
        residueNumber: 17,
        residueName: 'CYS',
        chain: 'A',
        role: 'Covalent Disulfide Inactivation Target (ECL1)',
        interactionType: 'Covalent',
        color: '#ef4444',
        description: 'Reacts with the nascent thiol (-SH) metabolite of Clopidogrel and Prasugrel to form an irreversible covalent disulfide bond.'
      },
      {
        residueNumber: 270,
        residueName: 'CYS',
        chain: 'A',
        role: 'Alternative Covalent Disulfide Target (ECL3)',
        interactionType: 'Covalent',
        color: '#ef4444',
        description: 'Second extracellular cysteine participating in covalent adduction by active thienopyridine metabolites.'
      },
      {
        residueNumber: 256,
        residueName: 'LYS',
        chain: 'A',
        role: 'Phosphate / Triphosphate Anion Anchor (TM6)',
        interactionType: 'Ionic / Salt Bridge',
        color: '#3b82f6',
        description: 'Positively charged lysine coordinating ADP polyphosphates or the triphosphate bioisostere of Cangrelor.'
      },
      {
        residueNumber: 280,
        residueName: 'ARG',
        chain: 'A',
        role: 'Orthosteric Anionic Pocket Base (TM7)',
        interactionType: 'Ionic / Salt Bridge',
        color: '#8b5cf6',
        description: 'Coordinates nucleotide phosphate groups and acidic substituents of reversible antagonists.'
      },
      {
        residueNumber: 252,
        residueName: 'PHE',
        chain: 'A',
        role: 'Aromatic Pi-Pi Adenine / Nucleobase Stacking',
        interactionType: 'Hydrophobic / Pi-Pi',
        color: '#10b981',
        description: 'Sandwiches the purine/triazolopyrimidine aromatic ring system of ADP, Ticagrelor, and Cangrelor.'
      }
    ],
    sarTakeaways: [
      'Irreversible vs Reversible: Clopidogrel and Prasugrel are prodrugs requiring hepatic CYP oxidation to open the thiophene ring into an active thiol (-SH) that covalently traps Cys17/Cys270.',
      'Ticagrelor is a reversible cyclopentyltriazolopyrimidine allosteric antagonist that binds directly without hepatic CYP bioactivation.',
      'Cangrelor is an injectable direct-acting ATP analog with non-hydrolyzable dichloromethylene and sulfonyl substitutions preventing ectonucleotidase cleavage.'
    ],
    associatedDrugIds: ['Clopidogrel', 'Prasugrel', 'Ticagrelor', 'Cangrelor', 'Ticlopidine'],
    matchingRegex: /p2y12|clopidogrel|prasugrel|ticagrelor|cangrelor|ticlopidine/i
  },

  // 4. Cardiac Nav1.5 Voltage-Gated Sodium Channel - Review 11
  {
    targetId: 'nav1_5_channel',
    targetName: 'Cardiac Voltage-Gated Sodium Channel Alpha Subunit (Nav1.5)',
    systematicName: 'Human SCN5A cardiac sodium channel pore-forming subunit',
    uniprotId: 'Q14524',
    pdbId: '6LQA',
    alphaFoldId: 'AF-Q14524-F1',
    resolution: '3.30 Å',
    organism: 'Homo sapiens',
    pocketName: 'Central Pore Cavity & Local Anesthetic Receptor Site',
    pocketDescription:
      'Hydrophobic inner vestibule accessible from the cytoplasmic gate. Class I antiarrhythmics bind in the pore cavity below the DEKA selectivity filter, physically plugging Na+ flux and shifting channel gating.',
    coordinatingIons: ['Na+'],
    endogenousLigand: 'Hydrated Na+ ions',
    keyResidues: [
      {
        residueNumber: 1760,
        residueName: 'PHE',
        chain: 'A',
        role: 'Local Anesthetic Receptor / Aromatic Anchor (Domain IV S6)',
        interactionType: 'Hydrophobic / Pi-Pi',
        color: '#10b981',
        description: 'Crucial aromatic residue projecting into the pore; interacts with the lipophilic aromatic rings of Lidocaine, Quinidine, and Flecainide.'
      },
      {
        residueNumber: 1767,
        residueName: 'TYR',
        chain: 'A',
        role: 'Inactivation Gate Coupling & Cation-Pi Interaction',
        interactionType: 'Hydrogen Bond',
        color: '#06b6d4',
        description: 'Coordinates the protonated basic tertiary or secondary amine group of Class I agents.'
      },
      {
        residueNumber: 1459,
        residueName: 'ILE',
        chain: 'A',
        role: 'Hydrophobic Pore Wall (Domain III S6)',
        interactionType: 'Hydrophobic / Pi-Pi',
        color: '#f59e0b',
        description: 'Contributes to the lipophilic binding surface that determines state-dependent (open vs inactivated) block kinetics.'
      },
      {
        residueNumber: 400,
        residueName: 'ASP',
        chain: 'A',
        role: 'DEKA Selectivity Filter Entry',
        interactionType: 'Ionic / Salt Bridge',
        color: '#ef4444',
        description: 'Selectivity filter carboxylate coordinating hydrated sodium cations.'
      }
    ],
    sarTakeaways: [
      'Subclass kinetics are driven by association/dissociation rates: Class Ia (Quinidine) intermediate (1-5s), Class Ib (Lidocaine, Mexiletine) fast (<0.5s - ideal for ischemic depolarization), Class Ic (Flecainide, Propafenone) slow (>10s - marked QRS widening).',
      'The protonated alkylamine cation engages Tyr1767 via cation-pi interaction, while the lipophilic aromatic head packs tightly against Phe1760 in the S6 inner cavity.',
      'Lidocaine requires an amide linkage and 2,6-dimethyl steric shielding to prevent rapid enzymatic ester hydrolysis.'
    ],
    associatedDrugIds: ['Quinidine', 'Procainamide', 'Disopyramide', 'Lidocaine', 'Mexiletine', 'Flecainide', 'Propafenone'],
    matchingRegex: /nav1\.5|sodium channel|quinidine|procainamide|disopyramide|lidocaine|mexiletine|flecainide|propafenone/i
  },

  // 5. Cardiac hERG Potassium Channel (Kv11.1) - Review 11
  {
    targetId: 'herg_channel',
    targetName: 'Cardiac hERG Voltage-Gated Potassium Channel (Kv11.1)',
    systematicName: 'Human KCNH2 ether-a-go-go related gene potassium channel',
    uniprotId: 'Q12809',
    pdbId: '5VA1',
    alphaFoldId: 'AF-Q12809-F1',
    resolution: '3.80 Å',
    organism: 'Homo sapiens',
    pocketName: 'Central Pore Cavity & Aromatic Vestibule',
    pocketDescription:
      'Unusually large, highly hydrophobic central cavity lacking the standard Pro-X-Pro kink found in other Kv channels, exposing a wide ring of aromatic residues that avidly accommodate amphiphilic drugs and Class III antiarrhythmics.',
    coordinatingIons: ['K+'],
    endogenousLigand: 'Hydrated K+ ions',
    keyResidues: [
      {
        residueNumber: 652,
        residueName: 'TYR',
        chain: 'A',
        role: 'Aromatic Pi-Stacking & Electrostatic Cation-Pi Cage',
        interactionType: 'Hydrophobic / Pi-Pi',
        color: '#10b981',
        description: 'Pivotal tyrosine facing into the central cavity; forms strong cation-pi and pi-stacking interactions with aromatic rings of Amiodarone, Dofetilide, and Sotalol.'
      },
      {
        residueNumber: 656,
        residueName: 'PHE',
        chain: 'A',
        role: 'Hydrophobic Vestibule Anchor',
        interactionType: 'Hydrophobic / Pi-Pi',
        color: '#3b82f6',
        description: 'Hydrophobic phenylalanine projecting inward from S6 helix; defines drug entrapment and high-affinity hERG blockade.'
      },
      {
        residueNumber: 624,
        residueName: 'THR',
        chain: 'A',
        role: 'Selectivity Filter Base (T-S-V-G-F-G motif)',
        interactionType: 'Hydrogen Bond',
        color: '#06b6d4',
        description: 'Positioned immediately beneath the K+ selectivity filter; coordinates polar or sulfonamide substituents of Class III drugs.'
      },
      {
        residueNumber: 620,
        residueName: 'SER',
        chain: 'A',
        role: 'Selectivity Filter Oxygen Ring',
        interactionType: 'Hydrogen Bond',
        color: '#f59e0b',
        description: 'Hydroxyl group contributing to pore cavity polarity and drug gating modulation.'
      }
    ],
    sarTakeaways: [
      'The unique lack of proline kinks in hERG S6 helices creates a massive hydrophobic vestibule lined by four Tyr652 and four Phe656 residues, explaining why diverse drugs cause off-target hERG block and Torsades de Pointes.',
      'Amiodarone contains two bulky, lipophilic iodine atoms on its benzofuran core that lodge deep into this aromatic vestibule.',
      'Dofetilide contains bis-methanesulfonamide pharmacophores that bridge between the hydrophobic cavity and the polar filter base Thr624.'
    ],
    associatedDrugIds: ['Amiodarone', 'Dronedarone', 'Sotalol', 'Dofetilide', 'Ibutilide'],
    matchingRegex: /herg|kv11\.1|potassium channel|amiodarone|dronedarone|sotalol|dofetilide|ibutilide/i
  },

  // 6. Beta-1 Adrenergic Receptor - Reviews 10 & 11
  {
    targetId: 'beta1_adrenergic',
    targetName: 'Beta-1 Adrenergic Receptor (ADRB1)',
    systematicName: 'Human Beta-1 adrenergic G-protein coupled receptor (Gs-coupled)',
    uniprotId: 'P08588',
    pdbId: '7JJO',
    alphaFoldId: 'AF-P08588-F1',
    resolution: '2.70 Å',
    organism: 'Homo sapiens / Meleagris gallopavo',
    pocketName: 'Orthosteric Catecholamine-Binding Pocket',
    pocketDescription:
      'Deep 7-TM helical pocket with conserved Asp121 (TM3) ionic anchor and Ser211/Ser215 (TM5) hydrogen-bonding partners for catechol hydroxyls.',
    endogenousLigand: 'Norepinephrine / Epinephrine',
    keyResidues: [
      {
        residueNumber: 121,
        residueName: 'ASP',
        chain: 'A',
        role: 'Positively Charged Amine Ionic Salt Bridge (TM3)',
        interactionType: 'Ionic / Salt Bridge',
        color: '#ef4444',
        description: 'Crucial carboxylate forming salt bridge with protonated secondary amine head of beta-blockers and Dobutamine.'
      },
      {
        residueNumber: 211,
        residueName: 'SER',
        chain: 'A',
        role: 'Catechol meta-OH Hydrogen Bond (TM5)',
        interactionType: 'Hydrogen Bond',
        color: '#10b981',
        description: 'Forms essential hydrogen bond with meta-hydroxyl in agonists like Dobutamine.'
      },
      {
        residueNumber: 215,
        residueName: 'SER',
        chain: 'A',
        role: 'Catechol para-OH Hydrogen Bond (TM5)',
        interactionType: 'Hydrogen Bond',
        color: '#10b981',
        description: 'Forms hydrogen bond with para-hydroxyl; required for full Gs activation and cAMP stimulation.'
      },
      {
        residueNumber: 322,
        residueName: 'ASN',
        chain: 'A',
        role: 'Beta-Hydroxyl Hydrogen Bond Partner (TM7)',
        interactionType: 'Hydrogen Bond',
        color: '#3b82f6',
        description: 'Stereospecifically coordinates the (R)-beta-hydroxyl group of adrenergic ligands.'
      }
    ],
    sarTakeaways: [
      'The aryloxypropanolamine backbone (-O-CH2-CH(OH)-CH2-NH-) is the hallmark of beta-blockers (Metoprolol, Atenolol, Esmolol).',
      'The (S)-enantiomer of aryloxypropanolamines (equivalent to (R)-phenylethanolamines) provides ~100x higher receptor affinity due to optimal Asn322 hydrogen bonding.',
      'Para-substitutions on the phenoxy ring with polar hydrogen-bonding groups (e.g. acetamide in Atenolol, methoxyethyl in Metoprolol) confer Beta-1 cardioselectivity over Beta-2.'
    ],
    associatedDrugIds: ['Dobutamine', 'Metoprolol', 'Atenolol', 'Esmolol', 'Propranolol', 'Carvedilol', 'Bisoprolol'],
    matchingRegex: /beta-?1|adrenergic|dobutamine|metoprolol|atenolol|esmolol|propranolol|carvedilol|bisoprolol/i
  },

  // 7. Phosphodiesterase-3A (PDE3A) - Review 10
  {
    targetId: 'pde3a_enzyme',
    targetName: 'cGMP-Inhibited Phosphodiesterase 3A (PDE3A)',
    systematicName: 'Human cyclic nucleotide phosphodiesterase 3A catalytic domain',
    uniprotId: 'Q14432',
    pdbId: '1SO2',
    alphaFoldId: 'AF-Q14432-F1',
    resolution: '2.00 Å',
    organism: 'Homo sapiens',
    pocketName: 'Bimetallic Catalytic Hydrolysis Cavity & Purine Mimic Cleft',
    pocketDescription:
      'Deep catalytic pocket containing dual divalent metal ions (Zn2+ and Mg2+) with an invariant glutamine switch (Gln975) that dictates cyclic nucleotide base selectivity.',
    coordinatingIons: ['Zn2+', 'Mg2+'],
    endogenousLigand: 'cAMP / cGMP',
    keyResidues: [
      {
        residueNumber: 975,
        residueName: 'GLN',
        chain: 'A',
        role: 'Invariant Nucleotide Base Selectivity Switch',
        interactionType: 'Hydrogen Bond',
        color: '#3b82f6',
        description: 'Bidentate hydrogen bonding partner mimicking the adenine base of cAMP.'
      },
      {
        residueNumber: 988,
        residueName: 'PHE',
        chain: 'A',
        role: 'Hydrophobic Clamp Pi-Pi Stacking',
        interactionType: 'Hydrophobic / Pi-Pi',
        color: '#10b981',
        description: 'Forms aromatic sandwich with the pyridone / quinolinone ring of Milrinone and Cilostazol.'
      },
      {
        residueNumber: 843,
        residueName: 'HIS',
        chain: 'A',
        role: 'Bimetallic Catalytic Center Coordination',
        interactionType: 'Metal Coordination',
        color: '#ef4444',
        description: 'Coordinates catalytic Zn2+ responsible for activating hydroxide to hydrolyze the cyclic 3\',5\'-phosphodiester bond.'
      }
    ],
    sarTakeaways: [
      'Bipyridine / Pyridinone core in Milrinone acts as a bioisosteric mimic of the purine ring of cAMP, competitively inhibiting cAMP breakdown.',
      'The electron-withdrawing cyano group (-C≡N) at C3 of Milrinone enhances the dipole moment and increases inotropic potency over older agents like Amrinone.',
      'Elevation of intracellular cAMP in cardiomyocytes increases PKA-mediated L-type Ca2+ channel opening (positive inotropy), while in vascular smooth muscle it stimulates SERCA/MLCK inhibition (vasodilation / inodilator).'
    ],
    associatedDrugIds: ['Milrinone', 'Inamrinone', 'Cilostazol'],
    matchingRegex: /pde-?3|milrinone|inamrinone|cilostazol/i
  },

  // 8. Neprilysin / Neutral Endopeptidase (NEP / CD10) - Review 10
  {
    targetId: 'neprilysin_nep',
    targetName: 'Neprilysin (NEP / Membrane Metallo-endopeptidase / CD10)',
    systematicName: 'Human membrane metallo-endopeptidase',
    uniprotId: 'P08473',
    pdbId: '5T58',
    alphaFoldId: 'AF-P08473-F1',
    resolution: '1.95 Å',
    organism: 'Homo sapiens',
    pocketName: 'Extracellular Zinc Metallopeptidase Cavity',
    pocketDescription:
      'Large catalytic chamber containing catalytic Zn2+ coordinated by Glu584, His583, His587, with hydrophobic S1 and S2\' subpockets degrading natriuretic peptides (ANP, BNP, CNP), bradykinin, and substance P.',
    coordinatingIons: ['Zn2+'],
    endogenousLigand: 'Atrial / B-type Natriuretic Peptides (ANP / BNP)',
    keyResidues: [
      {
        residueNumber: 583,
        residueName: 'HIS',
        chain: 'A',
        role: 'Catalytic Zn2+ Coordination',
        interactionType: 'Metal Coordination',
        color: '#10b981',
        description: 'First histidine of the HEXXH motif coordinating catalytic Zn2+.'
      },
      {
        residueNumber: 587,
        residueName: 'HIS',
        chain: 'A',
        role: 'Catalytic Zn2+ Coordination',
        interactionType: 'Metal Coordination',
        color: '#10b981',
        description: 'Second histidine coordinating Zn2+.'
      },
      {
        residueNumber: 646,
        residueName: 'GLU',
        chain: 'A',
        role: 'Catalytic Zn2+ Coordination',
        interactionType: 'Metal Coordination',
        color: '#10b981',
        description: 'Third ligand coordinating Zn2+ in neprilysin active center.'
      },
      {
        residueNumber: 711,
        residueName: 'ARG',
        chain: 'A',
        role: 'S2\' Subsite Carboxylate Anchor',
        interactionType: 'Ionic / Salt Bridge',
        color: '#8b5cf6',
        description: 'Forms salt bridge with the terminal carboxylate of Sacubitrilat.'
      }
    ],
    sarTakeaways: [
      'Sacubitril is an ethyl ester prodrug bioactivated by carboxylesterases to Sacubitrilat (LBQ657).',
      'Sacubitrilat contains a 5-biphenylmethyl group that nests deeply into the expansive S1 hydrophobic pocket of neprilysin.',
      'Must be combined with an ARB (Valsartan) rather than an ACE inhibitor because dual ACE + NEP inhibition causes severe life-threatening angioedema from bradykinin accumulation.'
    ],
    associatedDrugIds: ['Sacubitril', 'Sacubitrilat', 'Entresto'],
    matchingRegex: /neprilysin|sacubitril|sacubitrilat|entresto/i
  },

  // 9. Platelet Glycoprotein IIb/IIIa (Integrin alpha-IIb / beta-3) - Review 8
  {
    targetId: 'gpiib_iiia_integrin',
    targetName: 'Platelet Glycoprotein IIb/IIIa Receptor (Integrin αIIbβ3)',
    systematicName: 'Human platelet fibrinogen receptor complex',
    uniprotId: 'P08514',
    pdbId: '2VDN',
    alphaFoldId: 'AF-P08514-F1',
    resolution: '2.50 Å',
    organism: 'Homo sapiens',
    pocketName: 'MIDAS (Metal Ion-Dependent Adhesion Site) & RGD Cleft',
    pocketDescription:
      'Inter-subunit cleft between the beta-propeller of alpha-IIb and the beta-A domain of beta-3, featuring a central Mg2+/Mn2+ MIDAS ion coordinating aspartate/carboxylate groups and a basic pocket binding arginine/piperidine/amidine motifs.',
    coordinatingIons: ['Mg2+', 'Ca2+'],
    endogenousLigand: 'Fibrinogen / von Willebrand Factor (Arg-Gly-Asp [RGD] motif)',
    keyResidues: [
      {
        residueNumber: 217,
        residueName: 'ASP',
        chain: 'B',
        role: 'MIDAS Ion Coordination & Aspartate Carboxylate Mimic Binding',
        interactionType: 'Metal Coordination',
        color: '#ef4444',
        description: 'Coordinates MIDAS divalent cation coordinating carboxylate of Tirofiban and Eptifibatide.'
      },
      {
        residueNumber: 214,
        residueName: 'ASP',
        chain: 'A',
        role: 'Basic Amidine / Piperidine Ionic Clamp',
        interactionType: 'Ionic / Salt Bridge',
        color: '#3b82f6',
        description: 'Coordinates positively charged basic head (piperidine of Tirofiban or homoarginine of Eptifibatide).'
      },
      {
        residueNumber: 157,
        residueName: 'TYR',
        chain: 'A',
        role: 'Aromatic Spacer Pi-Pi Interaction',
        interactionType: 'Hydrophobic / Pi-Pi',
        color: '#10b981',
        description: 'Interacts with the central hydrophobic sulfonamide or tyrosine spacer of peptidomimetics.'
      }
    ],
    sarTakeaways: [
      'The RGD peptidomimetic pharmacophore requires a strict 10-15 Å spatial distance between a basic positive charge (piperidine/guanidine) and an acidic carboxylate.',
      'Tirofiban uses an N-butylsulfonamide tyrosine backbone that places the piperidine and carboxylate in the ideal geometry to bridge alpha-IIb and beta-3 MIDAS.',
      'Eptifibatide is a synthetic cyclic heptapeptide with a KGD (Lys-Gly-Asp) sequence modified to homoarginine, conferring high selectivity for alpha-IIb/beta-3 over alpha-v/beta-3 vitronectin receptors.'
    ],
    associatedDrugIds: ['Tirofiban', 'Eptifibatide', 'Abciximab'],
    matchingRegex: /gpiib|iiia|integrin|tirofiban|eptifibatide|abciximab/i
  }
];

/**
 * Resolves the matching target macromolecule and pocket profile for any given ChemicalStructure
 */
export function findTargetPocketForStructure(structure: ChemicalStructure): TargetPocketProfile | null {
  if (!structure) return null;

  // 1. Direct PDB ID match if specified in target_receptor
  if (structure.target_receptor) {
    for (const profile of TARGET_POCKET_PROFILES) {
      if (
        structure.target_receptor.toUpperCase().includes(profile.pdbId.toUpperCase()) ||
        (profile.targetId === 'nak_atpase' && structure.target_receptor.includes('4RET')) ||
        (profile.targetId === 'herg_channel' && structure.target_receptor.includes('7CN0'))
      ) {
        return profile;
      }
    }
  }

  const drugName = (structure.name || '').toLowerCase();
  const textToScan = [
    structure.name || '',
    structure.target || '',
    structure.target_receptor || '',
    structure.chemicalClass || '',
    structure.pharmacologicalClass || '',
    structure.sarNotes || '',
    structure.moa_summary || ''
  ].join(' ').toLowerCase();

  // 2. Direct Drug Name / associatedDrugIds match
  for (const profile of TARGET_POCKET_PROFILES) {
    if (profile.associatedDrugIds.some((drug) => drugName.includes(drug.toLowerCase()) || textToScan.includes(drug.toLowerCase()))) {
      return profile;
    }
  }

  // 3. Regular Expression Pattern Match
  for (const profile of TARGET_POCKET_PROFILES) {
    if (profile.matchingRegex.test(textToScan)) {
      return profile;
    }
  }

  return null;
}
