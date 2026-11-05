import { ChemicalStructure, PharmacophoreGroup, PharmacophoreRegion } from '../types/reviewModule';
import { getCorrectedSmarts } from './smartsDictionary';

export interface ColorPaletteItem {
  id: string;
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  glowRgba: string;
  pinBg: string;
}

export const PHARMACOPHORE_COLOR_PALETTE: ColorPaletteItem[] = [
  {
    id: 'emerald',
    name: 'Emerald',
    hex: '#10B981',
    bgClass: 'bg-emerald-500',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    borderClass: 'border-emerald-500',
    glowRgba: 'rgba(16, 185, 129, 0.4)',
    pinBg: '#059669',
  },
  {
    id: 'violet',
    name: 'Violet',
    hex: '#8B5CF6',
    bgClass: 'bg-violet-500',
    textClass: 'text-violet-700 dark:text-violet-300',
    borderClass: 'border-violet-500',
    glowRgba: 'rgba(139, 92, 246, 0.4)',
    pinBg: '#7C3AED',
  },
  {
    id: 'amber',
    name: 'Amber',
    hex: '#F59E0B',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-700 dark:text-amber-300',
    borderClass: 'border-amber-500',
    glowRgba: 'rgba(245, 158, 11, 0.4)',
    pinBg: '#D97706',
  },
  {
    id: 'cyan',
    name: 'Cyan',
    hex: '#06B6D4',
    bgClass: 'bg-cyan-500',
    textClass: 'text-cyan-700 dark:text-cyan-300',
    borderClass: 'border-cyan-500',
    glowRgba: 'rgba(6, 182, 212, 0.4)',
    pinBg: '#0891B2',
  },
  {
    id: 'rose',
    name: 'Rose',
    hex: '#F43F5E',
    bgClass: 'bg-rose-500',
    textClass: 'text-rose-700 dark:text-rose-300',
    borderClass: 'border-rose-500',
    glowRgba: 'rgba(244, 63, 94, 0.4)',
    pinBg: '#E11D48',
  },
  {
    id: 'blue',
    name: 'Blue',
    hex: '#3B82F6',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-700 dark:text-blue-300',
    borderClass: 'border-blue-500',
    glowRgba: 'rgba(59, 130, 246, 0.4)',
    pinBg: '#2563EB',
  },
  {
    id: 'fuchsia',
    name: 'Fuchsia',
    hex: '#D946EF',
    bgClass: 'bg-fuchsia-500',
    textClass: 'text-fuchsia-700 dark:text-fuchsia-300',
    borderClass: 'border-fuchsia-500',
    glowRgba: 'rgba(217, 70, 239, 0.4)',
    pinBg: '#C026D3',
  },
  {
    id: 'orange',
    name: 'Orange',
    hex: '#EA580C',
    bgClass: 'bg-orange-500',
    textClass: 'text-orange-700 dark:text-orange-300',
    borderClass: 'border-orange-500',
    glowRgba: 'rgba(234, 88, 12, 0.4)',
    pinBg: '#C2410C',
  },
];

export const getColorForItem = (index: number): ColorPaletteItem => {
  return PHARMACOPHORE_COLOR_PALETTE[index % PHARMACOPHORE_COLOR_PALETTE.length];
};

// Rich curated database of pharmacophores with normalized region coordinates (0-100%) and molecular purpose
const CURATED_PHARMACOPHORES: Record<string, PharmacophoreGroup[]> = {
  // Tirofiban (CID 60947) - Linear peptidomimetic across 2D plane
  tirofiban: [
    {
      id: 'tiro_piperidine',
      name: 'Piperidine (Basic Amine Anchor)',
      purpose:
        'Mimics the positively charged basic Arginine (Arg) guanidinium of the RGD motif; forms an ionic salt bridge with Asp224 of the αIIb subunit.',
      category: 'binding',
      smarts: 'C1CCNCC1',
      region: { x: 6, y: 72, width: 32, height: 26, isRing: true, label: 'Piperidine (Basic Amine Anchor)' },
    },
    {
      id: 'tiro_tyrosine',
      name: 'Tyrosine Phenoxy (12Å Ruler Spacer)',
      purpose:
        'Rigid aromatic scaffold that precisely positions the basic piperidine and acidic carboxylate at the ideal ~12-15 Å spatial distance required for GPIIb/IIIa antagonism.',
      category: 'stability',
      smarts: 'c1ccc(O)cc1',
      region: { x: 38, y: 35, width: 24, height: 36, isRing: true, label: 'Tyrosine Phenoxy (12Å Ruler Spacer)' },
    },
    {
      id: 'tiro_sulfonamide',
      name: 'Butyl Sulfonamide (Lipophilic Grip)',
      purpose:
        'Hydrophobic sulfonamide moiety that inserts into an adjacent lipophilic pocket of GPIIb/IIIa, dramatically boosting antagonist binding affinity and target selectivity.',
      category: 'binding',
      smarts: 'CCCCS(=O)(=O)N',
      region: { x: 62, y: 0, width: 36, height: 26, isRing: false, label: 'Butyl Sulfonamide (Lipophilic Grip)' },
    },
    {
      id: 'tiro_cooh',
      name: 'Carboxylic Acid (Acidic Warhead)',
      purpose:
        'Mimics the Aspartate (Asp) carboxylate residue of the fibrinogen RGD motif; forms an essential electrostatic salt bridge with Arg on the GPIIb/IIIa receptor.',
      category: 'binding',
      smarts: 'C(=O)[OH]',
      region: { x: 68, y: 24, width: 30, height: 24, isRing: false, label: 'Carboxylic Acid (Acidic Warhead)' },
    },
  ],

  // Ticagrelor (CID 9871419) - Purine nucleoside analogue
  ticagrelor: [
    {
      id: 'tica_cyclopentyl',
      name: 'Cyclopentan-triol (Metabolic Shield)',
      purpose:
        'Replaces the labile ribose ring; provides metabolic stability against glycosidic cleavage without requiring bioactivation or phosphorylation for activity.',
      category: 'pk',
      smarts: 'C1CC(O)C(O)C1',
      region: { x: 50, y: 8, width: 34, height: 32, isRing: true, label: 'Cyclopentan-triol (Metabolic Shield)' },
    },
    {
      id: 'tica_triazolopyrimidine',
      name: 'Triazolopyrimidine (Allosteric Lock)',
      purpose:
        'Purine adenosine isostere that binds directly to the distinct allosteric pocket of the P2Y12 receptor, locking the receptor in an inactive conformation.',
      category: 'binding',
      smarts: 'c1ncnc2nnnc12',
      region: { x: 40, y: 38, width: 34, height: 28, isRing: true, label: 'Triazolopyrimidine (Allosteric Lock)' },
    },
    {
      id: 'tica_propylthio',
      name: 'Propylthio Ether (Allosteric Anchor)',
      purpose:
        'Lipophilic thioether substituent that anchors the nucleoside analogue in the allosteric hydrophobic groove, preventing ADP receptor activation.',
      category: 'binding',
      smarts: 'CCCS',
      region: { x: 18, y: 36, width: 24, height: 24, isRing: false, label: 'Propylthio Ether (Allosteric Anchor)' },
    },
    {
      id: 'tica_difluoro',
      name: 'Difluorophenyl (Fluorine Shield)',
      purpose:
        'High-affinity aromatic motif that interacts with deep lipophilic residues; the cyclopropyl ring enforces rigid conformation while fluorines resist CYP metabolism.',
      category: 'binding',
      smarts: 'c1cc(F)c(F)cc1',
      region: { x: 28, y: 64, width: 34, height: 32, isRing: true, label: 'Difluorophenyl (Fluorine Shield)' },
    },
  ],

  // Aspirin (CID 2244) - Acetylsalicylic acid
  aspirin: [
    {
      id: 'asp_acetyl',
      name: 'Acetyl Ester (Active Warhead)',
      purpose:
        'Electrophilic acetyl donor transferred onto Ser529 of COX-1 (and Ser516 of COX-2), irreversibly acetylating and permanently sterically obstructing the catalytic channel.',
      category: 'binding',
      smarts: 'CC(=O)O',
      region: { x: 50, y: 34, width: 45, height: 52, isRing: false, label: 'Acetyl Ester (Active Warhead)' },
    },
    {
      id: 'asp_benzene',
      name: 'Benzene Ring (Aromatic Core)',
      purpose:
        'Rigid hydrophobic scaffold that docks inside the narrow hydrophobic constriction of the cyclooxygenase channel.',
      category: 'stability',
      smarts: 'c1ccccc1',
      region: { x: 5, y: 34, width: 44, height: 50, isRing: true, label: 'Benzene Ring (Aromatic Core)' },
    },
    {
      id: 'asp_carboxylate',
      name: 'Carboxylic Acid (Arg120 Anchor)',
      purpose:
        'Forms a key ionic salt bridge with Arg120 at the mouth of the COX enzyme active site, properly orienting the acetyl group toward the catalytic serine.',
      category: 'binding',
      smarts: 'c1ccccc1C(=O)[OH]',
      region: { x: 45, y: 2, width: 50, height: 36, isRing: false, label: 'Carboxylic Acid (Arg120 Anchor)' },
    },
  ],

  // Clopidogrel (CID 60606) - 2nd gen thienopyridine
  clopidogrel: [
    {
      id: 'clop_chlorophenyl',
      name: 'o-Chlorophenyl (Conformational Lock)',
      purpose:
        'Provides steric hindrance and electronic optimization, ensuring high selectivity for P2Y12 receptors and favorable lipophilic distribution.',
      category: 'binding',
      smarts: 'c1ccccc1Cl',
      region: { x: 12, y: 22, width: 32, height: 44, isRing: true, label: 'o-Chlorophenyl (Conformational Lock)' },
    },
    {
      id: 'clop_ester',
      name: 'Methyl Ester (Esterase Vulnerability)',
      purpose:
        'Metabolic vulnerability; ~85% is rapidly hydrolyzed by human carboxylesterase 1 (hCE1) into inactive carboxylic acid metabolite, leaving only ~15% for antiplatelet activation.',
      category: 'pk',
      smarts: 'C(=O)OC',
      region: { x: 30, y: 18, width: 30, height: 28, isRing: false, label: 'Methyl Ester (Esterase Vulnerability)' },
    },
    {
      id: 'clop_pyridine',
      name: 'Tetrahydropyridine (Basic Nitrogen)',
      purpose:
        'Tertiary amine conferring adequate aqueous solubility and proper geometry for the opened active thiol metabolite.',
      category: 'solubility',
      smarts: 'C1NCCc2sccc12',
      region: { x: 42, y: 44, width: 28, height: 32, isRing: true, label: 'Tetrahydropyridine (Basic Nitrogen)' },
    },
    {
      id: 'clop_thiophene',
      name: 'Thiophene Ring (CYP2C19 Bioactivation Lock)',
      purpose:
        'Obligate site of 2-step hepatic CYP450 bioactivation (CYP2C19/CYP1A2) via 2-oxo-clopidogrel to generate the reactive thiol metabolite that covalently binds P2Y12 Cys residues.',
      category: 'prodrug',
      smarts: 'c1sccc1',
      region: { x: 66, y: 50, width: 28, height: 34, isRing: true, label: 'Thiophene Ring (CYP2C19 Bioactivation Lock)' },
    },
  ],

  // Prasugrel (CID 6918456) - 3rd gen thienopyridine
  prasugrel: [
    {
      id: 'pras_fluorophenyl',
      name: 'o-Fluorophenyl (Receptor Fit)',
      purpose:
        'Replaces clopidogrel\'s chlorine with fluorine to optimize electronic density, increase oral absorption, and tightly fit the P2Y12 binding pocket.',
      category: 'binding',
      smarts: 'c1ccccc1F',
      region: { x: 10, y: 22, width: 32, height: 44, isRing: true, label: 'o-Fluorophenyl (Receptor Fit)' },
    },
    {
      id: 'pras_cyclopropyl',
      name: 'Cyclopropyl Ketone (Esterase Shield)',
      purpose:
        'Sterically hinders inactivating esterase cleavage that degrades clopidogrel, channeling almost 100% of the drug toward single-step CYP3A4/CYP2B6 active thiol generation.',
      category: 'pk',
      smarts: 'C(=O)C1CC1',
      region: { x: 30, y: 14, width: 32, height: 32, isRing: true, label: 'Cyclopropyl Ketone (Esterase Shield)' },
    },
    {
      id: 'pras_ester_prodrug',
      name: 'Thienopyridine Ester (Intestinal Prodrug)',
      purpose:
        'Rapidly and efficiently hydrolyzed by intestinal hCE2 carboxylesterase before entering the liver, bypassing first-pass inactivation and yielding a rapid 30-minute onset.',
      category: 'prodrug',
      smarts: 'CC(=O)O',
      region: { x: 62, y: 42, width: 32, height: 38, isRing: true, label: 'Thienopyridine Ester (Intestinal Prodrug)' },
    },
    {
      id: 'pras_thieno_core',
      name: 'Thienopyridine Scaffold (CYP3A4 Warhead)',
      purpose:
        'Core pharmacophore that positions the reactive thiophene ring for single-step CYP3A4 bioactivation into the active platelet-inhibiting thiol.',
      category: 'prodrug',
      smarts: 'C1NCCc2sccc12',
      region: { x: 46, y: 36, width: 36, height: 42, isRing: true, label: 'Thienopyridine Scaffold (CYP3A4 Warhead)' },
    },
  ],

  // Ticlopidine (CID 5472) - 1st gen thienopyridine
  ticlopidine: [
    {
      id: 'ticl_chlorobenzyl',
      name: 'o-Chlorobenzyl (Lipophilic Anchor)',
      purpose:
        'Lipophilic aromatic anchor; absence of protective substituents is implicated in toxic reactive quinone-imine metabolites causing rare severe agranulocytosis and TTP.',
      category: 'pk',
      smarts: 'Cc1ccccc1Cl',
      region: { x: 10, y: 22, width: 34, height: 48, isRing: true, label: 'o-Chlorobenzyl (Lipophilic Anchor)' },
    },
    {
      id: 'ticl_thieno',
      name: 'Thienopyridine Core (CYP Activation Scaffold)',
      purpose:
        'First-generation thienopyridine scaffold requiring multi-step hepatic CYP activation to generate an active thiol, resulting in a delayed onset (~6 hours).',
      category: 'prodrug',
      smarts: 'C1NCCc2sccc12',
      region: { x: 46, y: 28, width: 38, height: 44, isRing: true, label: 'Thienopyridine Core (CYP Activation Scaffold)' },
    },
  ],

  // Cangrelor (CID 9854012) - ATP analogue
  cangrelor: [
    {
      id: 'cang_thioethyl',
      name: 'Trifluoroethylthio (Lipophilic Grip)',
      purpose:
        'Bulky fluorinated thioether that fits into a hydrophobic accessory pocket of P2Y12, increasing affinity >1000-fold over endogenous ATP.',
      category: 'binding',
      smarts: 'CCCS',
      region: { x: 6, y: 12, width: 28, height: 32, isRing: false, label: 'Trifluoroethylthio (Lipophilic Grip)' },
    },
    {
      id: 'cang_adenine',
      name: 'Adenine Core (Orthosteric Purine)',
      purpose:
        'Direct competitive antagonist motif that docks in the primary orthosteric ADP binding site of the P2Y12 receptor.',
      category: 'binding',
      smarts: 'c1ncnc2nnnc12',
      region: { x: 32, y: 22, width: 34, height: 36, isRing: true, label: 'Adenine Core (Orthosteric Purine)' },
    },
    {
      id: 'cang_diphosphate',
      name: 'Dichloromethylene Diphosphonate (Metabolic Bioisostere)',
      purpose:
        'Non-hydrolyzable bioisostere replacing the pyrophosphate oxygen; resists cellular ectonucleotidases (NTPDases), enabling ultra-short (3-5 min) reversible IV inhibition.',
      category: 'binding',
      smarts: 'P(=O)(O)OP(=O)(O)C(Cl)(Cl)P',
      region: { x: 58, y: 34, width: 38, height: 44, isRing: false, label: 'Dichloromethylene Diphosphonate (Metabolic Bioisostere)' },
    },
  ],

  // Adenosine Diphosphate (ADP) (CID 6022) - Physiological agonist
  adp: [
    {
      id: 'adp_adenine',
      name: 'Adenine Purine Base (Purinergic Agonist)',
      purpose:
        'Planar heterocyclic bicyclic purine base that engages in essential π-stacking and hydrogen-bonding interactions within the orthosteric binding pockets of platelet P2Y1 and P2Y12 receptors.',
      category: 'binding',
      smarts: 'c1ncnc2ncnc12',
      region: { x: 60, y: 0, width: 40, height: 85, isRing: true, label: 'Adenine Purine Base (Purinergic Agonist)' },
    },
    {
      id: 'adp_ribose',
      name: 'Ribose Ring (Hydrophilic Scaffold)',
      purpose:
        'Hydrophilic ribofuranose scaffold orienting the 2\'- and 3\'-hydroxyl groups to interact with conserved residues across purinergic GPCRs.',
      category: 'stability',
      smarts: 'C1OC(CO)C(O)C1O',
      region: { x: 34, y: 0, width: 28, height: 92, isRing: true, label: 'Ribose Ring (Hydrophilic Scaffold)' },
    },
    {
      id: 'adp_phosphate',
      name: 'Pyrophosphate Ester (Mg2+ Coordination)',
      purpose:
        'Poly-anionic ester forming critical ionic salt bridges and coordinating divalent Mg2+ ions essential for triggering G-protein conformational changes and activating platelets.',
      category: 'binding',
      smarts: 'OP(=O)(O)OP(=O)(O)O',
      region: { x: 0, y: 0, width: 34, height: 98, isRing: false, label: 'Pyrophosphate Ester (Mg2+ Coordination)' },
    },
  ],

  // Eptifibatide (CID 123806 / 448812) - Cyclic heptapeptide
  eptifibatide: [
    {
      id: 'epti_har',
      name: 'Homo-Arginine (Arg Mimic Anchor)',
      purpose:
        'Extended guanidinium side chain mimicking Arginine with an extra methylene; provides optimal geometry for binding Asp224 of the αIIb subunit.',
      category: 'binding',
      smarts: 'CCCN=C(N)N',
      region: { x: 6, y: 12, width: 28, height: 34, isRing: false, label: 'Homo-Arginine (Arg Mimic Anchor)' },
    },
    {
      id: 'epti_disulfide',
      name: 'Disulfide Bridge (Integrin Selectivity Cycle)',
      purpose:
        'Conformationally constrained cycle (Mpr-Har-Gly-Asp-Trp-Pro-Cys) providing extreme selectivity for platelet αIIbβ3 over endothelial αvβ3 (vitronectin) integrins.',
      category: 'stability',
      smarts: 'CSSC',
      region: { x: 28, y: 24, width: 44, height: 46, isRing: true, label: 'Disulfide Bridge (Integrin Selectivity Cycle)' },
    },
    {
      id: 'epti_asp',
      name: 'Aspartate Carboxylate (MIDAS Metal Coordinator)',
      purpose:
        'Coordinates with divalent metal ions (Ca2+/Mg2+) within the MIDAS motif of the β3 integrin subunit, blocking fibrinogen binding.',
      category: 'binding',
      smarts: 'CC(=O)O',
      region: { x: 62, y: 50, width: 28, height: 34, isRing: false, label: 'Aspartate Carboxylate (MIDAS Metal Coordinator)' },
    },
  ],

  // Vorapaxar (CID 10077130) - PAR-1 antagonist
  vorapaxar: [
    {
      id: 'vora_carbamate',
      name: 'Ethyl Carbamate (Metabolic Shield)',
      purpose:
        'Shields the core secondary amine from rapid metabolic N-dealkylation; forms hydrogen bonds within the PAR-1 tethered-ligand binding site.',
      category: 'pk',
      smarts: 'CCOC(=O)N',
      region: { x: 6, y: 50, width: 30, height: 32, isRing: false, label: 'Ethyl Carbamate (Metabolic Shield)' },
    },
    {
      id: 'vora_tricycle',
      name: 'Fluorophenyl Himbacine (PAR-1 Irreversible Core)',
      purpose:
        'Polycyclic scaffold derived from natural bark himbacine; binds to the thrombin receptor (PAR-1) with virtually irreversible picomolar affinity (t1/2 ~8 days).',
      category: 'binding',
      smarts: 'c1cc(F)ccc1',
      region: { x: 34, y: 16, width: 58, height: 58, isRing: true, label: 'Fluorophenyl Himbacine (PAR-1 Irreversible Core)' },
    },
  ],

  // Cilostazol (CID 2740) - PDE3 inhibitor
  cilostazol: [
    {
      id: 'cilo_tetrazole',
      name: 'Tetrazole Ring (Permeability Bioisostere)',
      purpose:
        'Carboxylate bioisostere that lacks negative charge at physiologic pH, promoting membrane permeability while retaining key hydrogen-bonding interactions.',
      category: 'binding',
      smarts: 'c1nnnn1',
      region: { x: 6, y: 32, width: 28, height: 36, isRing: true, label: 'Tetrazole Ring (Permeability Bioisostere)' },
    },
    {
      id: 'cilo_quinolinone',
      name: 'Quinolinone Core (PDE3 Catalytic Blocker)',
      purpose:
        'Competitively occupies the catalytic substrate pocket of Phosphodiesterase 3 (PDE3), preventing cAMP breakdown and raising platelet cAMP levels.',
      category: 'binding',
      smarts: 'O=C1CCc2ccccc2N1',
      region: { x: 54, y: 28, width: 40, height: 44, isRing: true, label: 'Quinolinone Core (PDE3 Catalytic Blocker)' },
    },
  ],

  // Dipyridamole (CID 3108) - ENT1 & PDE blocker
  dipyridamole: [
    {
      id: 'dipy_diethanolamine',
      name: 'Bis-Diethanolamine (Solubility & H-Bond Wings)',
      purpose:
        'Four hydrophilic hydroxyls that impart high water solubility and engage in key hydrogen bonds with nucleoside transporter residues.',
      category: 'solubility',
      smarts: 'N(CCO)CCO',
      region: { x: 24, y: 8, width: 50, height: 26, isRing: false, label: 'Bis-Diethanolamine (Solubility & H-Bond Wings)' },
    },
    {
      id: 'dipy_pyrimido',
      name: 'Pyrimidopyrimidine Core (Adenosine Mimic Core)',
      purpose:
        'Planar heterocyclic core that mimics the purine ring of adenosine, competitively inhibiting adenosine uptake via ENT1 transporters and blocking PDE.',
      category: 'binding',
      smarts: 'c1nc2ncncc2nc1',
      region: { x: 32, y: 32, width: 34, height: 34, isRing: true, label: 'Pyrimidopyrimidine Core (Adenosine Mimic Core)' },
    },
    {
      id: 'dipy_piperidine',
      name: 'Bis-Piperidine (Hydrophobic Pocket Plug)',
      purpose:
        'Bulky lipophilic rings that fit into the hydrophobic vestibule of the equilibrative nucleoside transporter, blocking adenosine reuptake.',
      category: 'binding',
      smarts: 'C1CCNCC1',
      region: { x: 62, y: 42, width: 34, height: 36, isRing: true, label: 'Bis-Piperidine (Hydrophobic Pocket Plug)' },
    },
  ],

  // Nitroglycerin (CID 4945) - Trinitrate
  nitroglycerin: [
    {
      id: 'ntg_nitrate1',
      name: 'Nitrate Ester C1 (ALDH2 Nitric Oxide Donor)',
      purpose:
        'Substrate for mitochondrial aldehyde dehydrogenase (ALDH2); bioactivated via 3-electron reduction to 1,2-glyceryl dinitrate and nitric oxide (NO).',
      category: 'prodrug',
      smarts: 'O[N+](=O)[O-]',
      region: { x: 10, y: 16, width: 28, height: 34, isRing: false, label: 'Nitrate Ester C1 (ALDH2 Nitric Oxide Donor)' },
    },
    {
      id: 'ntg_nitrate2',
      name: 'Nitrate Ester C2 (Secondary Bioactivation Site)',
      purpose:
        'Subject to nitrate tolerance; continuous exposure oxidizes ALDH2 active-site cysteines into disulfides, shutting down bioactivation.',
      category: 'prodrug',
      smarts: 'O[N+](=O)[O-]',
      region: { x: 38, y: 20, width: 28, height: 34, isRing: false, label: 'Nitrate Ester C2 (Secondary Bioactivation Site)' },
    },
    {
      id: 'ntg_backbone',
      name: 'Glycerol Backbone (Rapid Mucosal Vehicle)',
      purpose:
        'Small lipophilic 3-carbon framework providing high volatility and rapid sublingual mucosal absorption.',
      category: 'pk',
      smarts: 'CCCO',
      region: { x: 20, y: 52, width: 56, height: 28, isRing: false, label: 'Glycerol Backbone (Rapid Mucosal Vehicle)' },
    },
  ],

  // Sodium Nitroprusside (CID 11963579) - Inorganic complex
  nitroprusside: [
    {
      id: 'snp_nitrosyl',
      name: 'Nitrosyl Ligand (Direct NO+ Releaser)',
      purpose:
        'Releases vasoactive nitric oxide (NO) directly and non-enzymatically in the vascular lumen upon single-electron reduction by oxyhemoglobin, bypassing ALDH2.',
      category: 'binding',
      region: { x: 36, y: 10, width: 28, height: 28, isRing: false, label: 'Nitrosyl Ligand (Direct NO+ Releaser)' },
    },
    {
      id: 'snp_iron',
      name: 'Octahedral Fe Center (Metal Coordination Hub)',
      purpose:
        'Coordinates the five cyanide ligands and one nitrosyl group in a rigid octahedral coordination sphere with d2sp3 hybridization.',
      category: 'stability',
      region: { x: 36, y: 36, width: 26, height: 26, isRing: false, label: 'Octahedral Fe Center (Metal Coordination Hub)' },
    },
    {
      id: 'snp_cyanide',
      name: 'Cyanide Ligands (Coordination Cage)',
      purpose:
        'Coordinate the iron core; released in vivo upon photolysis/reduction. Requires hepatic rhodanese and sodium thiosulfate to form non-toxic thiocyanate.',
      category: 'pk',
      region: { x: 12, y: 32, width: 74, height: 46, isRing: false, label: 'Cyanide Ligands (Coordination Cage)' },
    },
  ],

  // Hydralazine (CID 3637) - Arteriolar dilator
  hydralazine: [
    {
      id: 'hydr_phthalazine',
      name: 'Phthalazine Ring (Vasodilator Scaffold)',
      purpose:
        'Planar diazanaphthalene core that binds directly to vascular smooth muscle targets, inducing potassium channel opening and cGMP generation.',
      category: 'binding',
      smarts: 'c1ccc2cnncc2c1',
      region: { x: 14, y: 22, width: 44, height: 50, isRing: true, label: 'Phthalazine Ring (Vasodilator Scaffold)' },
    },
    {
      id: 'hydr_hydrazine',
      name: 'Hydrazine Moiety (NAT2 Target Warhead)',
      purpose:
        'Reactive group that generates nitric oxide-like hyperpolarization; also the critical substrate for N-acetyltransferase 2 (NAT2) inactivation in slow vs fast acetylators.',
      category: 'prodrug',
      smarts: 'NN',
      region: { x: 56, y: 32, width: 34, height: 36, isRing: false, label: 'Hydrazine Moiety (NAT2 Target Warhead)' },
    },
  ],

  // Minoxidil (CID 4201) - K_ATP channel opener
  minoxidil: [
    {
      id: 'minox_piperidine',
      name: 'Piperidine Ring (Lipophilic Anchor)',
      purpose:
        'Lipophilic alicyclic ring optimizing hydrophobic fit into the SUR2B regulatory subunit of ATP-sensitive potassium channels.',
      category: 'binding',
      smarts: 'C1CCNCC1',
      region: { x: 8, y: 24, width: 32, height: 42, isRing: true, label: 'Piperidine Ring (Lipophilic Anchor)' },
    },
    {
      id: 'minox_pyrimidine',
      name: '2,4-Diaminopyrimidine (K-ATP Channel Opener)',
      purpose:
        'Electron-rich aromatic ring engaging in multiple hydrogen bonds that hold the channel complex open, causing vascular hyperpolarization.',
      category: 'binding',
      smarts: 'c1c(N)nc(N)nc1',
      region: { x: 36, y: 22, width: 36, height: 46, isRing: true, label: '2,4-Diaminopyrimidine (K-ATP Channel Opener)' },
    },
    {
      id: 'minox_noxide',
      name: 'N-Oxide Moiety (SULT1A1 Activation Target)',
      purpose:
        'Prodrug site sulfated by hepatic SULT1A1 sulfotransferase to form Minoxidil N-O-sulfate, the active metabolite that opens K_ATP channels.',
      category: 'prodrug',
      smarts: '[N+][O-]',
      region: { x: 68, y: 32, width: 26, height: 28, isRing: false, label: 'N-Oxide Moiety (SULT1A1 Activation Target)' },
    },
  ],

  // Felodipine (CID 3333) - 2nd gen DHP Calcium Channel Blocker
  felodipine: [
    {
      id: 'felo_dichlorophenyl',
      name: '2,3-Dichlorophenyl (Perpendicular Conformer Lock)',
      purpose:
        'Ortho- and meta-chlorine substituents force perpendicular dihedral conformation with the dihydropyridine core, optimizing steric fit in the Cav1.2 channel pocket.',
      category: 'binding',
      smarts: 'c1c(Cl)c(Cl)ccc1',
      region: { x: 8, y: 16, width: 38, height: 44, isRing: true, label: '2,3-Dichlorophenyl (Perpendicular Conformer Lock)' },
    },
    {
      id: 'felo_dihydropyridine',
      name: '1,4-Dihydropyridine (Cav1.2 Channel Pharmacophore)',
      purpose:
        'Essential flattened boat heterocyclic core required for voltage-gated L-type calcium channel antagonism; ring NH must remain unsubstituted.',
      category: 'binding',
      smarts: 'C1=C(C)NC(C)=C(C1)',
      region: { x: 42, y: 32, width: 34, height: 38, isRing: true, label: '1,4-Dihydropyridine (Cav1.2 Channel Pharmacophore)' },
    },
    {
      id: 'felo_ester_methyl',
      name: 'C3 Methyl Ester (Vascular Selectivity Switch)',
      purpose:
        'Asymmetric ester conferring potent vascular smooth muscle selectivity over cardiac myocytes, avoiding negative inotropy.',
      category: 'binding',
      smarts: 'C(=O)OC',
      region: { x: 38, y: 12, width: 28, height: 26, isRing: false, label: 'C3 Methyl Ester (Vascular Selectivity Switch)' },
    },
    {
      id: 'felo_ester_ethyl',
      name: 'C5 Ethyl Ester (Lipophilic Pocket Anchor)',
      purpose:
        'Lipophilic ester interacting with adjacent hydrophobic channel residues to sustain long vascular duration of action.',
      category: 'pk',
      smarts: 'C(=O)OCC',
      region: { x: 68, y: 44, width: 28, height: 28, isRing: false, label: 'C5 Ethyl Ester (Lipophilic Pocket Anchor)' },
    },
  ],

  // Amlodipine (CID 2162) - 3rd gen DHP Calcium Channel Blocker
  amlodipine: [
    {
      id: 'amlo_chlorophenyl',
      name: 'o-Chlorophenyl (Perpendicular Conformer Lock)',
      purpose:
        'Ortho-chlorine substituent forces perpendicular orientation, maximizing selective affinity for inactive L-type calcium channels.',
      category: 'binding',
      smarts: 'c1c(Cl)cccc1',
      region: { x: 8, y: 18, width: 36, height: 42, isRing: true, label: 'o-Chlorophenyl (Perpendicular Conformer Lock)' },
    },
    {
      id: 'amlo_dihydropyridine',
      name: '1,4-Dihydropyridine (Cav1.2 Channel Pharmacophore)',
      purpose:
        'Core pharmacophore locking into the allosteric DHP receptor pocket on Cav1.2 channel alpha-1 subunits.',
      category: 'binding',
      smarts: 'C1=C(C)NC(C)=C(C1)',
      region: { x: 40, y: 30, width: 36, height: 40, isRing: true, label: '1,4-Dihydropyridine (Cav1.2 Channel Pharmacophore)' },
    },
    {
      id: 'amlo_aminoethoxy',
      name: '2-Aminoethoxymethyl (Long Half-Life Ion Anchor)',
      purpose:
        'Basic amine (pKa ~8.6) predominantly ionized at physiologic pH; creates slow association/dissociation kinetics and extended 35-50h elimination half-life.',
      category: 'pk',
      smarts: 'OCCN',
      region: { x: 66, y: 50, width: 32, height: 36, isRing: false, label: '2-Aminoethoxymethyl (Long Half-Life Ion Anchor)' },
    },
  ],

  // Lisinopril (CID 5362119) - Non-prodrug ACE inhibitor
  lisinopril: [
    {
      id: 'lisi_carboxylate',
      name: 'Zinc-Binding Carboxylate (Catalytic Zn2+ Pincer)',
      purpose:
        'Directly coordinates catalytic Zn2+ within the ACE active site, competitively blocking angiotensin I conversion.',
      category: 'binding',
      smarts: 'C(=O)[OH]',
      region: { x: 38, y: 32, width: 28, height: 28, isRing: false, label: 'Zinc-Binding Carboxylate (Catalytic Zn2+ Pincer)' },
    },
    {
      id: 'lisi_phenylethyl',
      name: 'Phenylethyl Moiety (S1 Lipophilic Anchor)',
      purpose:
        'Inserts into the lipophilic S1 subsite of Angiotensin-Converting Enzyme, boosting inhibitory binding affinity.',
      category: 'binding',
      smarts: 'CCc1ccccc1',
      region: { x: 6, y: 14, width: 34, height: 40, isRing: true, label: 'Phenylethyl Moiety (S1 Lipophilic Anchor)' },
    },
    {
      id: 'lisi_lysine',
      name: 'Lysine Amino Sidechain (Oral Bioavailability Booster)',
      purpose:
        'Confers hydrophilic zwitterionic character that enables adequate oral bioavailability without requiring an ester prodrug.',
      category: 'pk',
      smarts: 'CCCCN',
      region: { x: 66, y: 12, width: 32, height: 38, isRing: false, label: 'Lysine Amino Sidechain (Oral Bioavailability Booster)' },
    },
    {
      id: 'lisi_proline',
      name: 'Proline Carboxylate Ring (S2\' Pocket Salt Bridge)',
      purpose:
        'Mimics the C-terminal proline of angiotensin I; forms an electrostatic salt bridge with Arg522 in the S2\' pocket of ACE.',
      category: 'binding',
      smarts: 'N1CCCC1C(=O)O',
      region: { x: 60, y: 52, width: 36, height: 38, isRing: true, label: 'Proline Carboxylate Ring (S2\' Pocket Salt Bridge)' },
    },
  ],

  // Losartan (CID 3961) - Angiotensin Receptor Blocker (ARB)
  losartan: [
    {
      id: 'losa_tetrazole',
      name: 'Acidic Tetrazole Ring (Salt Bridge Isostere)',
      purpose:
        'Carboxylate bioisostere with planar delocalized negative charge; forms salt bridge with Arg167 in AT1 receptor while displaying greater lipophilicity than a carboxylic acid.',
      category: 'binding',
      smarts: 'c1nnnn1',
      region: { x: 62, y: 14, width: 32, height: 36, isRing: true, label: 'Acidic Tetrazole Ring (Salt Bridge Isostere)' },
    },
    {
      id: 'losa_biphenyl',
      name: 'Biphenyl Scaffold (Rigid Spatial Spacer)',
      purpose:
        'Rigid aromatic bridge holding the acidic tetrazole and the imidazole nucleus at the required spatial orientation.',
      category: 'stability',
      smarts: 'c1ccc(cc1)c2ccccc2',
      region: { x: 32, y: 22, width: 36, height: 42, isRing: true, label: 'Biphenyl Scaffold (Rigid Spatial Spacer)' },
    },
    {
      id: 'losa_imidazole',
      name: 'Substituted Imidazole (Core Heterocycle)',
      purpose:
        'Central heterocycle positioning the butyl chain, chlorine atom, and hydroxymethyl group into distinct binding pockets of the AT1 receptor.',
      category: 'binding',
      smarts: 'n1ccnc1',
      region: { x: 12, y: 44, width: 34, height: 38, isRing: true, label: 'Substituted Imidazole (Core Heterocycle)' },
    },
    {
      id: 'losa_alcohol',
      name: 'Hydroxymethyl Group (CYP Activation Site)',
      purpose:
        'Oxidized in the liver by CYP2C9 and CYP3A4 into EXP3174 (losartan carboxylic acid), which provides 10-40x higher AT1 affinity.',
      category: 'prodrug',
      smarts: 'CO',
      region: { x: 44, y: 64, width: 28, height: 26, isRing: false, label: 'Hydroxymethyl Group (CYP Activation Site)' },
    },
  ],

  // Hydrochlorothiazide (CID 7239) - Thiazide diuretic
  hydrochlorothiazide: [
    {
      id: 'hctz_benzothiadiazine',
      name: 'Benzothiadiazine Core (NCC Transporter Blocker)',
      purpose:
        'Fused bicyclic ring system that competitively inhibits the Na+/Cl- cotransporter (NCC) in the luminal membrane of the distal convoluted tubule.',
      category: 'binding',
      smarts: 'c1ccc2NS(=O)(=O)NCc2c1',
      region: { x: 22, y: 24, width: 44, height: 48, isRing: true, label: 'Benzothiadiazine Core (NCC Transporter Blocker)' },
    },
    {
      id: 'hctz_sulfonamide',
      name: '7-Sulfonamide (Diuretic Anchor)',
      purpose:
        'Crucial free sulfonamide required for diuretic activity; interacts with NCC and weakly inhibits carbonic anhydrase.',
      category: 'binding',
      smarts: 'S(=O)(=O)N',
      region: { x: 64, y: 20, width: 32, height: 34, isRing: false, label: '7-Sulfonamide (Diuretic Anchor)' },
    },
    {
      id: 'hctz_chloro',
      name: '6-Chloro Group (Efficacy Booster)',
      purpose:
        'Strong electron-withdrawing group essential for potent natriuretic and diuretic efficacy.',
      category: 'binding',
      smarts: 'c(Cl)',
      region: { x: 8, y: 34, width: 24, height: 28, isRing: false, label: '6-Chloro Group (Efficacy Booster)' },
    },
  ],

  // Clonidine (CID 2803) - Central alpha-2 agonist
  clonidine: [
    {
      id: 'clon_dichlorophenyl',
      name: '2,6-Dichlorophenyl (Conformational Twist Lock)',
      purpose:
        'Bulky ortho-dichloro substituents force the phenyl ring out of plane with the imidazoline ring, locking the active conformation required for central alpha-2A receptor agonism.',
      category: 'binding',
      smarts: 'c1c(Cl)cccc1Cl',
      region: { x: 10, y: 24, width: 38, height: 48, isRing: true, label: '2,6-Dichlorophenyl (Conformational Twist Lock)' },
    },
    {
      id: 'clon_imidazoline',
      name: '2-Imidazoline Ring (Alpha-2 Proton Anchor)',
      purpose:
        'Basic heterocyclic ring (pKa ~8.0) that protonates and interacts with Asp residues in alpha-2 adrenergic receptors.',
      category: 'binding',
      smarts: 'N1CCN=C1',
      region: { x: 56, y: 24, width: 36, height: 48, isRing: true, label: '2-Imidazoline Ring (Alpha-2 Proton Anchor)' },
    },
  ],

  // Pravastatin (CID 54687) - Hydrophilic HMG-CoA reductase inhibitor
  pravastatin: [
    {
      id: 'prava_dihydroxy_acid',
      name: '3,5-Dihydroxyheptanoic Acid (HMG-CoA Transition Mimic)',
      purpose:
        'Active transition-state mimic of HMG-CoA intermediate; forms extensive ionic interactions (Arg590, Lys735) and hydrogen bonds (Ser684) in the catalytic pocket.',
      category: 'binding',
      smarts: 'OC(CC(O)CC(=O)O)C',
      region: { x: 50, y: 12, width: 44, height: 38, isRing: false, label: '3,5-Dihydroxyheptanoic Acid (HMG-CoA Transition Mimic)' },
    },
    {
      id: 'prava_6_hydroxyl',
      name: '6-beta-Hydroxyl Group (Hepatoselectivity Switch)',
      purpose:
        'Key polar substituent conferring marked hydrophilicity (logP ~0.59) and hepatoselectivity; prevents passive extrahepatic cell entry and eliminates dependency on CYP3A4 metabolism.',
      category: 'solubility',
      smarts: 'CC(O)C=C',
      region: { x: 8, y: 44, width: 32, height: 32, isRing: false, label: '6-beta-Hydroxyl Group (Hepatoselectivity Switch)' },
    },
    {
      id: 'prava_decalin_core',
      name: 'Decalin Scaffold (Hydrophobic Pocket Anchor)',
      purpose:
        'Bicyclic hydrophobic decalin scaffold anchoring the molecule into the nonpolar binding groove of HMG-CoA reductase.',
      category: 'binding',
      smarts: '[#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1',
      region: { x: 18, y: 32, width: 44, height: 44, isRing: true, label: 'Decalin Scaffold (Hydrophobic Pocket Anchor)' },
    },
    {
      id: 'prava_ester_sidechain',
      name: '2-Methylbutyrate Ester (Auxiliary Binding Finger)',
      purpose:
        'Lipophilic branched ester side chain occupying an auxiliary hydrophobic groove within the catalytic pocket, critical for binding affinity.',
      category: 'pk',
      smarts: 'OC(=O)C(C)CC',
      region: { x: 12, y: 10, width: 36, height: 32, isRing: false, label: '2-Methylbutyrate Ester (Auxiliary Binding Finger)' },
    },
  ],

  // Fluvastatin (CID 446155) - 2nd gen synthetic statin
  fluvastatin: [
    {
      id: 'fluva_heptenoate',
      name: '3,5-Dihydroxyhept-6-enoate (Olefinic Transition Mimic)',
      purpose:
        'HMG-CoA pharmacophore with a rigid trans-double bond spacer that orients the dihydroxy acid into the catalytic cleft.',
      category: 'binding',
      smarts: 'C=CC(O)CC(O)CC(=O)O',
      region: { x: 50, y: 12, width: 46, height: 38, isRing: false, label: '3,5-Dihydroxyhept-6-enoate (Olefinic Transition Mimic)' },
    },
    {
      id: 'fluva_indole_core',
      name: 'Indole Heteroaromatic Core (Pi-Stacking Anchor)',
      purpose:
        'Planar bicyclic heteroaromatic core replacing fungal decalin; provides extensive hydrophobic and pi-stacking interactions.',
      category: 'binding',
      smarts: 'c1ccc2[nH]ccc2c1',
      region: { x: 28, y: 28, width: 40, height: 40, isRing: true, label: 'Indole Heteroaromatic Core (Pi-Stacking Anchor)' },
    },
    {
      id: 'fluva_fluorophenyl',
      name: '4-Fluorophenyl (Metabolic Shield & Grip)',
      purpose:
        'Essential halogenated aromatic ring fitting into an auxiliary hydrophobic cleft; fluorine enhances metabolic stability and binding affinity.',
      category: 'binding',
      smarts: 'Fc1ccccc1',
      region: { x: 8, y: 48, width: 38, height: 42, isRing: true, label: '4-Fluorophenyl (Metabolic Shield & Grip)' },
    },
    {
      id: 'fluva_isopropyl',
      name: 'N-Isopropyl Substituent (Valine Pocket Filler)',
      purpose:
        'Branched lipophilic group filling a dedicated hydrophobic pocket near Val residues of the enzyme active site.',
      category: 'binding',
      smarts: 'CC(C)n1',
      region: { x: 20, y: 12, width: 32, height: 28, isRing: false, label: 'N-Isopropyl Substituent (Valine Pocket Filler)' },
    },
  ],

  // Atorvastatin (CID 60823) - Pyrrole-based synthetic statin
  atorvastatin: [
    {
      id: 'ator_heptanoic_acid',
      name: '3,5-Dihydroxyheptanoic Acid (HMG-CoA Transition Mimic)',
      purpose:
        'Flexible dihydroxy acid headgroup mimicking HMG-CoA catalytic intermediate and coordinating Lys735 and Arg590.',
      category: 'binding',
      smarts: 'CCC(O)CC(O)CC(=O)O',
      region: { x: 52, y: 12, width: 44, height: 38, isRing: false, label: '3,5-Dihydroxyheptanoic Acid (HMG-CoA Transition Mimic)' },
    },
    {
      id: 'ator_pyrrole_core',
      name: 'Pyrrole Central Scaffold (Four-Arm Hub)',
      purpose:
        'Five-membered heteroaromatic core projecting four diverse pharmacophoric arms into distinct enzyme subpockets.',
      category: 'binding',
      smarts: 'c1cc[nH]c1',
      region: { x: 30, y: 30, width: 36, height: 36, isRing: true, label: 'Pyrrole Central Scaffold (Four-Arm Hub)' },
    },
    {
      id: 'ator_fluorophenyl',
      name: '4-Fluorophenyl (Subpocket Grip)',
      purpose:
        'Crucial pharmacophore feature of high-potency statins engaging in multipolar and hydrophobic active site interactions.',
      category: 'binding',
      smarts: 'Fc1ccccc1',
      region: { x: 8, y: 52, width: 38, height: 42, isRing: true, label: '4-Fluorophenyl (Subpocket Grip)' },
    },
    {
      id: 'ator_anilide',
      name: 'Phenylcarbamoyl Anilide (Potency Booster Arm)',
      purpose:
        'Unique anilide substituent establishing additional hydrogen bonding with Arg568 and Leu562, conferring superior inhibitory potency.',
      category: 'binding',
      smarts: 'c1ccccc1NC(=O)',
      region: { x: 52, y: 48, width: 44, height: 44, isRing: true, label: 'Phenylcarbamoyl Anilide (Potency Booster Arm)' },
    },
    {
      id: 'ator_isopropyl',
      name: 'Isopropyl Substituent (Hydrophobic Anchor)',
      purpose:
        'Lipophilic branched alkyl group filling a dedicated hydrophobic subpocket at the pyrrole C5 position.',
      category: 'binding',
      smarts: 'CC(C)c1',
      region: { x: 10, y: 16, width: 32, height: 30, isRing: false, label: 'Isopropyl Substituent (Hydrophobic Anchor)' },
    },
  ],

  // Rosuvastatin (CID 446157) - Pyrimidine-based super-statin
  rosuvastatin: [
    {
      id: 'rosu_heptenoate',
      name: '3,5-Dihydroxyhept-6-enoate (Rigid Transition Mimic)',
      purpose:
        'Rigidified olefinic dihydroxy acid headgroup coordinating catalytic Arg590, Lys735, and Asp690 residues.',
      category: 'binding',
      smarts: 'C=CC(O)CC(O)CC(=O)O',
      region: { x: 52, y: 12, width: 44, height: 38, isRing: false, label: '3,5-Dihydroxyhept-6-enoate (Rigid Transition Mimic)' },
    },
    {
      id: 'rosu_pyrimidine_core',
      name: 'Pyrimidine Core (Electron-Deficient Core)',
      purpose:
        'Electron-deficient heterocyclic ring providing high affinity polar and pi-interactions with the HMG-CoA reductase catalytic cleft.',
      category: 'binding',
      smarts: 'c1cncnc1',
      region: { x: 30, y: 30, width: 38, height: 38, isRing: true, label: 'Pyrimidine Core (Electron-Deficient Core)' },
    },
    {
      id: 'rosu_sulfonamide',
      name: 'N-Methylmethanesulfonamide (Polar Hydrogen-Bond Tether)',
      purpose:
        'Highly polar sulfonamide creating an extra H-bond with Arg568 and Ser565; confers hydrophilic character (logP -0.33) and minimal CYP metabolism.',
      category: 'solubility',
      smarts: 'NS(=O)(=O)C',
      region: { x: 52, y: 50, width: 44, height: 44, isRing: false, label: 'N-Methylmethanesulfonamide (Polar Hydrogen-Bond Tether)' },
    },
    {
      id: 'rosu_fluorophenyl',
      name: '4-Fluorophenyl (Hydrophobic Cleft Anchor)',
      purpose:
        'Optimal halogenated phenyl substituent engaging in key hydrophobic contacts within the enzyme binding pocket.',
      category: 'binding',
      smarts: 'Fc1ccccc1',
      region: { x: 8, y: 50, width: 38, height: 42, isRing: true, label: '4-Fluorophenyl (Hydrophobic Cleft Anchor)' },
    },
  ],

  // Simvastatin (CID 54454) - Lipophilic lactone prodrug
  simvastatin: [
    {
      id: 'simva_lactone',
      name: 'beta-Hydroxy-delta-Lactone (Lipophilic Prodrug Cage)',
      purpose:
        'Cyclic ester (lactone) prodrug form; uncharged and highly lipophilic (logP ~4.68), facilitating passive GI absorption before hepatic bioactivation to active dihydroxy acid.',
      category: 'prodrug',
      smarts: 'C1CC(O)CC(=O)O1',
      region: { x: 50, y: 12, width: 44, height: 38, isRing: true, label: 'beta-Hydroxy-delta-Lactone (Lipophilic Prodrug Cage)' },
    },
    {
      id: 'simva_dimethylbutyrate',
      name: '2,2-Dimethylbutyrate Ester (High-Potency Gem-Dimethyl)',
      purpose:
        'Gem-dimethyl branched ester (differs from lovastatin by an additional alpha-methyl group); provides enhanced hydrophobic surface area and 2-fold higher potency.',
      category: 'binding',
      smarts: 'OC(=O)C(C)(C)CC',
      region: { x: 10, y: 12, width: 38, height: 34, isRing: false, label: '2,2-Dimethylbutyrate Ester (High-Potency Gem-Dimethyl)' },
    },
    {
      id: 'simva_decalin_core',
      name: 'Decalin Scaffold (Hydrophobic Pocket Anchor)',
      purpose:
        'Hydrophobic bicyclic decalin scaffold anchoring simvastatin deeply into the nonpolar catalytic binding groove.',
      category: 'binding',
      smarts: '[#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1',
      region: { x: 18, y: 34, width: 42, height: 44, isRing: true, label: 'Decalin Scaffold (Hydrophobic Pocket Anchor)' },
    },
  ],

  // Lovastatin (CID 53232) - Prototype fungal lactone prodrug
  lovastatin: [
    {
      id: 'lova_lactone',
      name: 'beta-Hydroxy-delta-Lactone (Lipophilic Prodrug Cage)',
      purpose:
        'Neutral lactone prodrug form converted in vivo by hepatic esterases into the active 3,5-dihydroxy acid HMG-CoA reductase inhibitor.',
      category: 'prodrug',
      smarts: 'C1CC(O)CC(=O)O1',
      region: { x: 50, y: 12, width: 44, height: 38, isRing: true, label: 'beta-Hydroxy-delta-Lactone (Lipophilic Prodrug Cage)' },
    },
    {
      id: 'lova_methylbutyrate',
      name: '2-Methylbutyrate Ester (Lipophilic Pocket Finger)',
      purpose:
        'Monobranched ester occupying the hydrophobic groove of the catalytic site.',
      category: 'binding',
      smarts: 'OC(=O)C(C)CC',
      region: { x: 10, y: 12, width: 38, height: 34, isRing: false, label: '2-Methylbutyrate Ester (Lipophilic Pocket Finger)' },
    },
    {
      id: 'lova_decalin_core',
      name: 'Decalin Scaffold (Hydrophobic Pocket Anchor)',
      purpose:
        'Bicyclic decalin scaffold anchoring the molecule to the enzyme hydrophobic surface.',
      category: 'binding',
      smarts: '[#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1',
      region: { x: 18, y: 34, width: 42, height: 44, isRing: true, label: 'Decalin Scaffold (Hydrophobic Pocket Anchor)' },
    },
  ],
};

/**
 * Checks whether a given chemical structure has hand-curated pharmacophore coordinates.
 */
export const isCuratedStructure = (structure: ChemicalStructure): boolean => {
  const key = normalizeDrugKey(structure);
  return Boolean(CURATED_PHARMACOPHORES[key]);
};

/**
 * Normalizes drug name or CID to lookup key in CURATED_PHARMACOPHORES
 */
export const normalizeDrugKey = (structure: ChemicalStructure): string => {
  const name = (structure.name || '').toLowerCase();
  const id = (structure.id || '').toLowerCase();
  if (name.includes('pravastatin') || id.includes('pravastatin') || structure.cid === 54687) return 'pravastatin';
  if (name.includes('fluvastatin') || id.includes('fluvastatin') || structure.cid === 446155) return 'fluvastatin';
  if (name.includes('atorvastatin') || id.includes('atorvastatin') || structure.cid === 60823) return 'atorvastatin';
  if (name.includes('rosuvastatin') || id.includes('rosuvastatin') || structure.cid === 446157) return 'rosuvastatin';
  if (name.includes('simvastatin') || id.includes('simvastatin') || structure.cid === 54454) return 'simvastatin';
  if (name.includes('lovastatin') || id.includes('lovastatin') || structure.cid === 53232) return 'lovastatin';
  if (name.includes('tirofiban') || structure.cid === 60947) return 'tirofiban';
  if (name.includes('ticagrelor') || structure.cid === 9871419) return 'ticagrelor';
  if (name.includes('aspirin') || name.includes('salicyl') || structure.cid === 2244) return 'aspirin';
  if (name.includes('clopidogrel') || structure.cid === 60606 || structure.cid === 93460) return 'clopidogrel';
  if (name.includes('prasugrel') || structure.cid === 214347 || structure.cid === 6918456) return 'prasugrel';
  if (name.includes('ticlopidine') || structure.cid === 5472) return 'ticlopidine';
  if (name.includes('cangrelor') || structure.cid === 9854012) return 'cangrelor';
  if (name.includes('adp') || name.includes('adenosine diphosphate') || structure.cid === 6022) return 'adp';
  if (name.includes('eptifibatide') || structure.cid === 123806 || structure.cid === 448812) return 'eptifibatide';
  if (name.includes('vorapaxar') || structure.cid === 10077130) return 'vorapaxar';
  if (name.includes('cilostazol') || structure.cid === 2740 || structure.cid === 2754) return 'cilostazol';
  if (name.includes('dipyridamole') || structure.cid === 3108) return 'dipyridamole';
  if (name.includes('nitroglycerin') || structure.cid === 4945 || structure.cid === 4510) return 'nitroglycerin';
  if (name.includes('nitroprusside') || structure.cid === 11963579) return 'nitroprusside';
  if (name.includes('hydralazine') || structure.cid === 3637) return 'hydralazine';
  if (name.includes('minoxidil') || structure.cid === 4201) return 'minoxidil';
  if (name.includes('felodipine') || structure.cid === 3333) return 'felodipine';
  if (name.includes('amlodipine') || structure.cid === 2162) return 'amlodipine';
  if (name.includes('lisinopril') || structure.cid === 5362119) return 'lisinopril';
  if (name.includes('losartan') || structure.cid === 3961) return 'losartan';
  if (name.includes('hydrochlorothiazide') || name.includes('hctz') || structure.cid === 7239) return 'hydrochlorothiazide';
  if (name.includes('clonidine') || structure.cid === 2803) return 'clonidine';
  return name.replace(/[^a-z0-9]/g, '');
};

/**
 * Intelligently resolves or synthesizes a normalized 2D region (0-100%) for any pharmacophore,
 * utilizing SMARTS substructure heuristics, functional group classification, and spatial distribution.
 */
export function resolvePharmacophoreRegion(
  group: PharmacophoreGroup,
  index: number = 0,
  total: number = 1
): PharmacophoreRegion {
  if (
    group.region &&
    typeof group.region === 'object' &&
    typeof (group.region as any).x === 'number' &&
    typeof (group.region as any).y === 'number'
  ) {
    return group.region;
  }

  const smarts = (group.smarts || '').trim();
  const name = (group.name || '').toLowerCase();
  const purpose = (group.purpose || group.description || '').toLowerCase();
  const rawRegion = typeof group.region === 'string' ? (group.region as string).toLowerCase() : '';

  // Heuristic ring detection from SMARTS or name
  const isRing =
    smarts.includes('1') ||
    smarts.includes('2') ||
    smarts.includes(':') ||
    /phenyl|benzene|pyridine|dihydropyridine|thiophene|tetrazole|imidazole|furan|pyrrole|indole|pyrimidine|decalin|cycle|ring/i.test(name) ||
    /phenyl|benzene|pyridine|dihydropyridine|ring/i.test(purpose);

  // Deterministic spatial distribution across 2D plane based on index, category, and substructure type
  const layoutPresets: Array<{ x: number; y: number; width: number; height: number }> = [
    { x: 8, y: 22, width: 38, height: 42 },
    { x: 54, y: 20, width: 38, height: 44 },
    { x: 34, y: 10, width: 36, height: 34 },
    { x: 28, y: 56, width: 44, height: 36 },
    { x: 10, y: 8, width: 34, height: 34 },
    { x: 56, y: 56, width: 36, height: 36 },
  ];

  let regionCoords: { x: number; y: number; width: number; height: number };

  if (/c1c\(cl\)c\(cl\)ccc1|dichlorophenyl|chlorophenyl/i.test(smarts) || /dichlorophenyl|chlorophenyl/i.test(name)) {
    regionCoords = { x: 8, y: 18, width: 38, height: 46 };
  } else if (/fc1ccccc1|4-fluorophenyl|fluorophenyl/i.test(smarts) || /4-fluorophenyl|fluorophenyl/i.test(name)) {
    regionCoords = { x: 8, y: 48, width: 38, height: 44 };
  } else if (/dihydropyridine|pyridine|n1/i.test(smarts) || /dihydropyridine|pyridine core/i.test(name)) {
    regionCoords = { x: 34, y: 28, width: 36, height: 40 };
  } else if (/c1ccc2\[nh\]ccc2c1|c1cc\[nh\]c1|c1cncnc1|c1=ccc2ccccc2c1|indole|pyrrole|pyrimidine|naphthalene|decalin/i.test(smarts) || /indole|pyrrole|pyrimidine|naphthalene|decalin core/i.test(name)) {
    regionCoords = { x: 26, y: 28, width: 42, height: 42 };
  } else if (/dihydroxy|heptanoate|hept-6-enoate|heptanoic|lactone/i.test(name) || /c\(=o\)o|coo|carboxylate|carboxylic/i.test(smarts) || /carboxylic|carboxylate/i.test(name)) {
    regionCoords = { x: 52, y: 12, width: 44, height: 38 };
  } else if (/s\(=o\)\(=o\)n|sulfonamide|methanesulfonamide|so2/i.test(smarts) || /sulfonamide|methanesulfonamide/i.test(name)) {
    regionCoords = { x: 52, y: 48, width: 42, height: 42 };
  } else if (/tetrazole/i.test(smarts) || /tetrazole/i.test(name)) {
    regionCoords = { x: 58, y: 44, width: 34, height: 40 };
  } else if (/butyrate|ester/i.test(name) || /oc\(=o\)c/i.test(smarts)) {
    regionCoords = { x: 10, y: 10, width: 36, height: 34 };
  } else if (rawRegion.includes('warhead')) {
    regionCoords = { x: 52, y: 14, width: 44, height: 38 };
  } else if (rawRegion.includes('core')) {
    regionCoords = { x: 28, y: 28, width: 42, height: 42 };
  } else if (rawRegion.includes('metabolic')) {
    regionCoords = { x: 28, y: 56, width: 42, height: 36 };
  } else {
    const slot = index % layoutPresets.length;
    regionCoords = layoutPresets[slot];
  }

  return {
    ...regionCoords,
    isRing,
    label: group.name,
  };
}

/**
 * Retrieves the pharmacophore groups for any chemical structure.
 * Always guarantees that all pharmacophore groups have valid, defined region coordinates
 * to ensure robust visual highlight rendering across all decks.
 */
export const getPharmacophoresForStructure = (
  structure: ChemicalStructure
): PharmacophoreGroup[] => {
  // 1. Prioritize hand-curated, gold-standard pharmacophores if defined
  const key = normalizeDrugKey(structure);
  if (CURATED_PHARMACOPHORES[key]) {
    return CURATED_PHARMACOPHORES[key].map((p) => ({
      ...p,
      smarts: getCorrectedSmarts(p.name, p.smarts || '') || undefined,
    }));
  }

  // 2. Map structure.pharmacophores ensuring region is an object with valid numeric coordinates
  if (structure.pharmacophores && structure.pharmacophores.length > 0) {
    const total = structure.pharmacophores.length;
    return structure.pharmacophores.map((p, idx) => {
      const validRegion =
        p.region &&
        typeof p.region === 'object' &&
        typeof (p.region as any).x === 'number' &&
        typeof (p.region as any).y === 'number'
          ? (p.region as PharmacophoreRegion)
          : resolvePharmacophoreRegion(p, idx, total);
      return {
        ...p,
        smarts: getCorrectedSmarts(p.name, p.smarts || '') || undefined,
        region: validRegion,
      };
    });
  }

  // Graceful fallback: construct from keyFunctionalGroups with sensible positions & purpose
  const groups = structure.keyFunctionalGroups || [];
  if (groups.length > 0) {
    return groups.map((g, idx) => {
      // distribute default regions across the 2D image
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = col === 0 ? 15 : 55;
      const y = row === 0 ? 20 : 55;

      let category: PharmacophoreGroup['category'] = 'binding';
      let purpose = `Key functional group in ${structure.name} contributing to target selectivity, pharmacological potency, and physicochemical properties.`;

      const lower = g.toLowerCase();
      if (lower.includes('ester') || lower.includes('prodrug') || lower.includes('thiol')) {
        category = 'prodrug';
        purpose = `Crucial metabolic / bioactivation site for ${structure.name}; converted in vivo into the active pharmacophore.`;
      } else if (lower.includes('acid') || lower.includes('amine') || lower.includes('ring') || lower.includes('base')) {
        category = 'binding';
        purpose = `Core pharmacophoric anchor that interacts via ionic, hydrogen bonding, or van der Waals interactions with the receptor pocket.`;
      } else if (lower.includes('hydroxy') || lower.includes('poly') || lower.includes('chain')) {
        category = 'solubility';
        purpose = `Hydrophilic / pharmacokinetic modulator optimizing absorption, distribution, and overall bioavailability.`;
      }

      return {
        id: `pg_${idx}_${g.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`,
        name: g,
        purpose,
        category,
        smarts: getCorrectedSmarts(g, '') || undefined,
        region: {
          x,
          y,
          width: 32,
          height: 30,
          label: g,
        },
      };
    });
  }

  // Ultimate fallback if nothing defined
  return [
    {
      id: 'default_core',
      name: `${structure.chemicalClass || 'Chemical Scaffold'} Core`,
      purpose: `Essential molecular framework anchoring ${structure.name} to its pharmacological target (${structure.target}).`,
      category: 'binding',
      region: { x: 25, y: 25, width: 50, height: 50, label: 'Pharmacophoric Core' },
    },
  ];
};

/**
 * Splits a dual-named pharmacophore string "IUPAC (Casual Functional Nickname)"
 * into structured IUPAC and casual components for enhanced UI presentation.
 */
export function parsePharmacophoreName(fullName: string): { iupac: string; casual: string | null } {
  if (!fullName) return { iupac: '', casual: null };
  const match = fullName.match(/^(.*?)\s*\((.*?)\)$/);
  if (match && match[1] && match[2]) {
    return {
      iupac: match[1].trim(),
      casual: match[2].trim(),
    };
  }
  return {
    iupac: fullName.trim(),
    casual: null,
  };
}

