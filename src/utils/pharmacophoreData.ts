import { ChemicalStructure, PharmacophoreGroup, PharmacophoreRegion } from '../types/reviewModule';

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
      name: 'Piperidine 2° basic amine',
      purpose:
        'Mimics the positively charged basic Arginine (Arg) guanidinium of the RGD motif; forms an ionic salt bridge with Asp224 of the αIIb subunit.',
      category: 'binding',
      region: { x: 6, y: 72, width: 32, height: 26, isRing: true, label: 'Piperidine 2° basic amine' },
    },
    {
      id: 'tiro_tyrosine',
      name: 'Tyrosine phenoxy spacer backbone',
      purpose:
        'Rigid aromatic scaffold that precisely positions the basic piperidine and acidic carboxylate at the ideal ~12-15 Å spatial distance required for GPIIb/IIIa antagonism.',
      category: 'stability',
      region: { x: 38, y: 35, width: 24, height: 36, isRing: true, label: 'Tyrosine phenoxy ring' },
    },
    {
      id: 'tiro_sulfonamide',
      name: 'Butyl sulfonamide (-SO2-nBu)',
      purpose:
        'Hydrophobic sulfonamide moiety that inserts into an adjacent lipophilic pocket of GPIIb/IIIa, dramatically boosting antagonist binding affinity and target selectivity.',
      category: 'binding',
      region: { x: 62, y: 0, width: 36, height: 26, isRing: false, label: 'Butyl sulfonamide' },
    },
    {
      id: 'tiro_cooh',
      name: 'Carboxylic acid (-COOH)',
      purpose:
        'Mimics the Aspartate (Asp) carboxylate residue of the fibrinogen RGD motif; forms an essential electrostatic salt bridge with Arg on the GPIIb/IIIa receptor.',
      category: 'binding',
      region: { x: 68, y: 24, width: 30, height: 24, isRing: false, label: 'Carboxylic acid (-COOH)' },
    },
  ],

  // Ticagrelor (CID 9871419) - Purine nucleoside analogue
  ticagrelor: [
    {
      id: 'tica_cyclopentyl',
      name: 'Cyclopentan-triol core',
      purpose:
        'Replaces the labile ribose ring; provides metabolic stability against glycosidic cleavage without requiring bioactivation or phosphorylation for activity.',
      category: 'pk',
      region: { x: 50, y: 8, width: 34, height: 32, isRing: true, label: 'Cyclopentane-triol' },
    },
    {
      id: 'tica_triazolopyrimidine',
      name: 'Triazolopyrimidine bicyclic base',
      purpose:
        'Purine adenosine isostere that binds directly to the distinct allosteric pocket of the P2Y12 receptor, locking the receptor in an inactive conformation.',
      category: 'binding',
      region: { x: 40, y: 38, width: 34, height: 28, isRing: true, label: 'Triazolopyrimidine' },
    },
    {
      id: 'tica_propylthio',
      name: 'Propylthio ether (-S-Pr)',
      purpose:
        'Lipophilic thioether substituent that anchors the nucleoside analogue in the allosteric hydrophobic groove, preventing ADP receptor activation.',
      category: 'binding',
      region: { x: 18, y: 36, width: 24, height: 24, isRing: false, label: 'Propylthio ether' },
    },
    {
      id: 'tica_difluoro',
      name: 'Difluorophenylcyclopropylamine',
      purpose:
        'High-affinity aromatic motif that interacts with deep lipophilic residues; the cyclopropyl ring enforces rigid conformation while fluorines resist CYP metabolism.',
      category: 'binding',
      region: { x: 28, y: 64, width: 34, height: 32, isRing: true, label: 'Difluorophenyl' },
    },
  ],

  // Aspirin (CID 2244) - Acetylsalicylic acid (Benzene ring left, Acetyl ester right, Carboxylate top-right)
  aspirin: [
    {
      id: 'asp_acetyl',
      name: 'Acetyl ester group',
      purpose:
        'Electrophilic acetyl donor transferred onto Ser529 of COX-1 (and Ser516 of COX-2), irreversibly acetylating and permanently sterically obstructing the catalytic channel.',
      category: 'binding',
      region: { x: 50, y: 34, width: 45, height: 52, isRing: false, label: 'Acetyl ester' },
    },
    {
      id: 'asp_benzene',
      name: 'Benzene aromatic core',
      purpose:
        'Rigid hydrophobic scaffold that docks inside the narrow hydrophobic constriction of the cyclooxygenase channel.',
      category: 'stability',
      region: { x: 5, y: 34, width: 44, height: 50, isRing: true, label: 'Benzene ring' },
    },
    {
      id: 'asp_carboxylate',
      name: 'Salicylate carboxylate (-COOH)',
      purpose:
        'Forms a key ionic salt bridge with Arg120 at the mouth of the COX enzyme active site, properly orienting the acetyl group toward the catalytic serine.',
      category: 'binding',
      region: { x: 45, y: 2, width: 50, height: 36, isRing: false, label: 'Carboxylate (Arg120)' },
    },
  ],

  // Clopidogrel (CID 60606) - 2nd gen thienopyridine
  clopidogrel: [
    {
      id: 'clop_chlorophenyl',
      name: 'o-Chlorophenyl ring',
      purpose:
        'Provides steric hindrance and electronic optimization, ensuring high selectivity for P2Y12 receptors and favorable lipophilic distribution.',
      category: 'binding',
      region: { x: 12, y: 22, width: 32, height: 44, isRing: true, label: 'o-Chlorophenyl' },
    },
    {
      id: 'clop_ester',
      name: 'Methyl ester group',
      purpose:
        'Metabolic vulnerability; ~85% is rapidly hydrolyzed by human carboxylesterase 1 (hCE1) into inactive carboxylic acid metabolite, leaving only ~15% for antiplatelet activation.',
      category: 'pk',
      region: { x: 30, y: 18, width: 30, height: 28, isRing: false, label: 'Methyl ester' },
    },
    {
      id: 'clop_pyridine',
      name: 'Tetrahydropyridine basic nitrogen',
      purpose:
        'Tertiary amine conferring adequate aqueous solubility and proper geometry for the opened active thiol metabolite.',
      category: 'solubility',
      region: { x: 42, y: 44, width: 28, height: 32, isRing: true, label: 'Tetrahydropyridine' },
    },
    {
      id: 'clop_thiophene',
      name: 'Thiophene ring',
      purpose:
        'Obligate site of 2-step hepatic CYP450 bioactivation (CYP2C19/CYP1A2) via 2-oxo-clopidogrel to generate the reactive thiol metabolite that covalently binds P2Y12 Cys residues.',
      category: 'prodrug',
      region: { x: 66, y: 50, width: 28, height: 34, isRing: true, label: 'Thiophene ring' },
    },
  ],

  // Prasugrel (CID 214347) - 3rd gen thienopyridine
  prasugrel: [
    {
      id: 'pras_fluorophenyl',
      name: 'o-Fluorophenyl ring',
      purpose:
        'Replaces clopidogrel\'s chlorine with fluorine to optimize electronic density, increase oral absorption, and tightly fit the P2Y12 binding pocket.',
      category: 'binding',
      region: { x: 10, y: 22, width: 32, height: 44, isRing: true, label: 'o-Fluorophenyl' },
    },
    {
      id: 'pras_cyclopropyl',
      name: 'Cyclopropyl carbonyl group',
      purpose:
        'Sterically hinders inactivating esterase cleavage that degrades clopidogrel, channeling almost 100% of the drug toward single-step CYP3A4/CYP2B6 active thiol generation.',
      category: 'pk',
      region: { x: 30, y: 14, width: 32, height: 32, isRing: true, label: 'Cyclopropyl ketone' },
    },
    {
      id: 'pras_ester_prodrug',
      name: 'Thienopyridine acetyl ester',
      purpose:
        'Rapidly and efficiently hydrolyzed by intestinal hCE2 carboxylesterase before entering the liver, bypassing first-pass inactivation and yielding a rapid 30-minute onset.',
      category: 'prodrug',
      region: { x: 62, y: 42, width: 32, height: 38, isRing: true, label: 'Acetyl thiophene' },
    },
  ],

  // Ticlopidine (CID 5472) - 1st gen thienopyridine
  ticlopidine: [
    {
      id: 'ticl_chlorobenzyl',
      name: 'o-Chlorobenzyl group',
      purpose:
        'Lipophilic aromatic anchor; absence of protective substituents is implicated in toxic reactive quinone-imine metabolites causing rare severe agranulocytosis and TTP.',
      category: 'pk',
      region: { x: 10, y: 22, width: 34, height: 48, isRing: true, label: 'o-Chlorobenzyl (toxic risk)' },
    },
    {
      id: 'ticl_thieno',
      name: 'Thieno[3,2-c]pyridine core',
      purpose:
        'First-generation thienopyridine scaffold requiring multi-step hepatic CYP activation to generate an active thiol, resulting in a delayed onset (~6 hours).',
      category: 'prodrug',
      region: { x: 46, y: 28, width: 38, height: 44, isRing: true, label: 'Thienopyridine core' },
    },
  ],

  // Cangrelor (CID 9854012) - ATP analogue
  cangrelor: [
    {
      id: 'cang_thioethyl',
      name: 'Trifluoroethylthio substituent',
      purpose:
        'Bulky fluorinated thioether that fits into a hydrophobic accessory pocket of P2Y12, increasing affinity >1000-fold over endogenous ATP.',
      category: 'binding',
      region: { x: 6, y: 12, width: 28, height: 32, isRing: false, label: 'Trifluoroethylthio' },
    },
    {
      id: 'cang_adenine',
      name: 'Adenine purine base',
      purpose:
        'Direct competitive antagonist motif that docks in the primary orthosteric ADP binding site of the P2Y12 receptor.',
      category: 'binding',
      region: { x: 32, y: 22, width: 34, height: 36, isRing: true, label: 'Adenine core' },
    },
    {
      id: 'cang_diphosphate',
      name: 'Dichloromethylene diphosphonate',
      purpose:
        'Non-hydrolyzable bioisostere replacing the pyrophosphate oxygen; resists cellular ectonucleotidases (NTPDases), enabling ultra-short (3-5 min) reversible IV inhibition.',
      category: 'binding',
      region: { x: 58, y: 34, width: 38, height: 44, isRing: false, label: 'Dichloromethylene diphosphonate' },
    },
  ],

  // Adenosine Diphosphate (ADP) (CID 6022) - Physiological agonist
  adp: [
    {
      id: 'adp_adenine',
      name: 'Adenine purine base',
      purpose:
        'Planar heterocyclic bicyclic purine base that engages in essential π-stacking and hydrogen-bonding interactions within the orthosteric binding pockets of platelet P2Y1 and P2Y12 receptors.',
      category: 'binding',
      region: { x: 60, y: 0, width: 40, height: 85, isRing: true, label: 'Adenine purine base' },
    },
    {
      id: 'adp_ribose',
      name: 'Ribose furanose ring',
      purpose:
        'Hydrophilic ribofuranose scaffold orienting the 2\'- and 3\'-hydroxyl groups to interact with conserved residues across purinergic GPCRs.',
      category: 'stability',
      region: { x: 34, y: 0, width: 28, height: 92, isRing: true, label: 'Ribose furanose ring' },
    },
    {
      id: 'adp_phosphate',
      name: 'Pyrophosphate ester (alpha and beta phosphates)',
      purpose:
        'Poly-anionic ester forming critical ionic salt bridges and coordinating divalent Mg2+ ions essential for triggering G-protein conformational changes and activating platelets.',
      category: 'binding',
      region: { x: 0, y: 0, width: 34, height: 98, isRing: false, label: 'Pyrophosphate ester' },
    },
  ],

  // Eptifibatide (CID 123806 / 448812) - Cyclic heptapeptide
  eptifibatide: [
    {
      id: 'epti_har',
      name: 'Homo-arginyl (Har) residue',
      purpose:
        'Extended guanidinium side chain mimicking Arginine with an extra methylene; provides optimal geometry for binding Asp224 of the αIIb subunit.',
      category: 'binding',
      region: { x: 6, y: 12, width: 28, height: 34, isRing: false, label: 'Homo-arginine (Har)' },
    },
    {
      id: 'epti_disulfide',
      name: 'Cyclic heptapeptide disulfide bridge',
      purpose:
        'Conformationally constrained cycle (Mpr-Har-Gly-Asp-Trp-Pro-Cys) providing extreme selectivity for platelet αIIbβ3 over endothelial αvβ3 (vitronectin) integrins.',
      category: 'stability',
      region: { x: 28, y: 24, width: 44, height: 46, isRing: true, label: 'Disulfide cycle' },
    },
    {
      id: 'epti_asp',
      name: 'Aspartate (Asp) carboxylate',
      purpose:
        'Coordinates with divalent metal ions (Ca2+/Mg2+) within the MIDAS motif of the β3 integrin subunit, blocking fibrinogen binding.',
      category: 'binding',
      region: { x: 62, y: 50, width: 28, height: 34, isRing: false, label: 'Aspartate (Asp)' },
    },
  ],

  // Vorapaxar (CID 10077130) - PAR-1 antagonist
  vorapaxar: [
    {
      id: 'vora_carbamate',
      name: 'Ethyl carbamate group',
      purpose:
        'Shields the core secondary amine from rapid metabolic N-dealkylation; forms hydrogen bonds within the PAR-1 tethered-ligand binding site.',
      category: 'pk',
      region: { x: 6, y: 50, width: 30, height: 32, isRing: false, label: 'Ethyl carbamate' },
    },
    {
      id: 'vora_tricycle',
      name: 'Fluorophenyl himbacine tricycle',
      purpose:
        'Polycyclic scaffold derived from natural bark himbacine; binds to the thrombin receptor (PAR-1) with virtually irreversible picomolar affinity (t1/2 ~8 days).',
      category: 'binding',
      region: { x: 34, y: 16, width: 58, height: 58, isRing: true, label: 'Himbacine-derived core' },
    },
  ],

  // Cilostazol (CID 2740) - PDE3 inhibitor
  cilostazol: [
    {
      id: 'cilo_tetrazole',
      name: 'Tetrazole ring',
      purpose:
        'Carboxylate bioisostere that lacks negative charge at physiologic pH, promoting membrane permeability while retaining key hydrogen-bonding interactions.',
      category: 'binding',
      region: { x: 6, y: 32, width: 28, height: 36, isRing: true, label: 'Tetrazole isostere' },
    },
    {
      id: 'cilo_quinolinone',
      name: 'Quinolinone bicyclic core',
      purpose:
        'Competitively occupies the catalytic substrate pocket of Phosphodiesterase 3 (PDE3), preventing cAMP breakdown and raising platelet cAMP levels.',
      category: 'binding',
      region: { x: 54, y: 28, width: 40, height: 44, isRing: true, label: 'Quinolinone PDE3 blocker' },
    },
  ],

  // Dipyridamole (CID 3108) - ENT1 & PDE blocker
  dipyridamole: [
    {
      id: 'dipy_diethanolamine',
      name: 'Bis-diethanolamine side chains',
      purpose:
        'Four hydrophilic hydroxyls that impart high water solubility and engage in key hydrogen bonds with nucleoside transporter residues.',
      category: 'solubility',
      region: { x: 24, y: 8, width: 50, height: 26, isRing: false, label: 'Diethanolamine chains' },
    },
    {
      id: 'dipy_pyrimido',
      name: 'Pyrimidopyrimidine core',
      purpose:
        'Planar heterocyclic core that mimics the purine ring of adenosine, competitively inhibiting adenosine uptake via ENT1 transporters and blocking PDE.',
      category: 'binding',
      region: { x: 32, y: 32, width: 34, height: 34, isRing: true, label: 'Pyrimidopyrimidine core' },
    },
    {
      id: 'dipy_piperidine',
      name: 'Bis-piperidine rings',
      purpose:
        'Bulky lipophilic rings that fit into the hydrophobic vestibule of the equilibrative nucleoside transporter, blocking adenosine reuptake.',
      category: 'binding',
      region: { x: 62, y: 42, width: 34, height: 36, isRing: true, label: 'Piperidine rings' },
    },
  ],

  // Nitroglycerin (CID 4945) - Trinitrate
  nitroglycerin: [
    {
      id: 'ntg_nitrate1',
      name: 'Nitrate ester (-ONO2) group 1 (C1)',
      purpose:
        'Substrate for mitochondrial aldehyde dehydrogenase (ALDH2); bioactivated via 3-electron reduction to 1,2-glyceryl dinitrate and nitric oxide (NO).',
      category: 'prodrug',
      region: { x: 10, y: 16, width: 28, height: 34, isRing: false, label: 'Nitrate ester (C1)' },
    },
    {
      id: 'ntg_nitrate2',
      name: 'Nitrate ester (-ONO2) group 2 (C2)',
      purpose:
        'Subject to nitrate tolerance; continuous exposure oxidizes ALDH2 active-site cysteines into disulfides, shutting down bioactivation.',
      category: 'prodrug',
      region: { x: 38, y: 20, width: 28, height: 34, isRing: false, label: 'Nitrate ester (C2)' },
    },
    {
      id: 'ntg_backbone',
      name: 'Glycerol aliphatic backbone',
      purpose:
        'Small lipophilic 3-carbon framework providing high volatility and rapid sublingual mucosal absorption.',
      category: 'pk',
      region: { x: 20, y: 52, width: 56, height: 28, isRing: false, label: 'Glycerol backbone' },
    },
  ],

  // Sodium Nitroprusside (CID 11963579) - Inorganic complex
  nitroprusside: [
    {
      id: 'snp_nitrosyl',
      name: 'Nitrosyl ligand (NO+)',
      purpose:
        'Releases vasoactive nitric oxide (NO) directly and non-enzymatically in the vascular lumen upon single-electron reduction by oxyhemoglobin, bypassing ALDH2.',
      category: 'binding',
      region: { x: 36, y: 10, width: 28, height: 28, isRing: false, label: 'Nitrosyl (NO+ donor)' },
    },
    {
      id: 'snp_iron',
      name: 'Octahedral Fe(II/III) coordination center',
      purpose:
        'Coordinates the five cyanide ligands and one nitrosyl group in a rigid octahedral coordination sphere with d2sp3 hybridization.',
      category: 'stability',
      region: { x: 36, y: 36, width: 26, height: 26, isRing: false, label: 'Fe center' },
    },
    {
      id: 'snp_cyanide',
      name: '5 Cyanide (CN-) ligands',
      purpose:
        'Coordinate the iron core; released in vivo upon photolysis/reduction. Requires hepatic rhodanese and sodium thiosulfate to form non-toxic thiocyanate.',
      category: 'pk',
      region: { x: 12, y: 32, width: 74, height: 46, isRing: false, label: 'Cyanide ligands (toxicity)' },
    },
  ],

  // Hydralazine (CID 3637) - Arteriolar dilator
  hydralazine: [
    {
      id: 'hydr_phthalazine',
      name: 'Phthalazine bicyclic aromatic ring',
      purpose:
        'Planar diazanaphthalene core that binds directly to vascular smooth muscle targets, inducing potassium channel opening and cGMP generation.',
      category: 'binding',
      region: { x: 14, y: 22, width: 44, height: 50, isRing: true, label: 'Phthalazine ring' },
    },
    {
      id: 'hydr_hydrazine',
      name: 'Hydrazine moiety (-NH-NH2)',
      purpose:
        'Reactive group that generates nitric oxide-like hyperpolarization; also the critical substrate for N-acetyltransferase 2 (NAT2) inactivation in slow vs fast acetylators.',
      category: 'prodrug',
      region: { x: 56, y: 32, width: 34, height: 36, isRing: false, label: 'Hydrazine (NAT2 target)' },
    },
  ],

  // Minoxidil (CID 4201) - K_ATP channel opener
  minoxidil: [
    {
      id: 'minox_piperidine',
      name: 'Piperidine ring',
      purpose:
        'Lipophilic alicyclic ring optimizing hydrophobic fit into the SUR2B regulatory subunit of ATP-sensitive potassium channels.',
      category: 'binding',
      region: { x: 8, y: 24, width: 32, height: 42, isRing: true, label: 'Piperidine ring' },
    },
    {
      id: 'minox_pyrimidine',
      name: '2,4-diaminopyrimidine core',
      purpose:
        'Electron-rich aromatic ring engaging in multiple hydrogen bonds that hold the channel complex open, causing vascular hyperpolarization.',
      category: 'binding',
      region: { x: 36, y: 22, width: 36, height: 46, isRing: true, label: 'Diaminopyrimidine' },
    },
    {
      id: 'minox_noxide',
      name: 'N-oxide functional group',
      purpose:
        'Prodrug site sulfated by hepatic SULT1A1 sulfotransferase to form Minoxidil N-O-sulfate, the active metabolite that opens K_ATP channels.',
      category: 'prodrug',
      region: { x: 68, y: 32, width: 26, height: 28, isRing: false, label: 'N-oxide (SULT1A1 site)' },
    },
  ],

  // Felodipine (CID 3333) - 2nd gen DHP Calcium Channel Blocker
  felodipine: [
    {
      id: 'felo_dichlorophenyl',
      name: '2,3-Dichlorophenyl ring',
      purpose:
        'Ortho- and meta-chlorine substituents force perpendicular dihedral conformation with the dihydropyridine core, optimizing steric fit in the Cav1.2 channel pocket.',
      category: 'binding',
      smarts: 'c1c(Cl)c(Cl)ccc1',
      region: { x: 8, y: 16, width: 38, height: 44, isRing: true, label: '2,3-Dichlorophenyl' },
    },
    {
      id: 'felo_dihydropyridine',
      name: '1,4-Dihydropyridine scaffold',
      purpose:
        'Essential flattened boat heterocyclic core required for voltage-gated L-type calcium channel antagonism; ring NH must remain unsubstituted.',
      category: 'binding',
      smarts: 'C1=C(C)NC(C)=C(C1)',
      region: { x: 42, y: 32, width: 34, height: 38, isRing: true, label: '1,4-Dihydropyridine' },
    },
    {
      id: 'felo_ester_methyl',
      name: 'C3 Methyl ester',
      purpose:
        'Asymmetric ester conferring potent vascular smooth muscle selectivity over cardiac myocytes, avoiding negative inotropy.',
      category: 'binding',
      smarts: 'C(=O)OC',
      region: { x: 38, y: 12, width: 28, height: 26, isRing: false, label: 'Methyl ester' },
    },
    {
      id: 'felo_ester_ethyl',
      name: 'C5 Ethyl ester',
      purpose:
        'Lipophilic ester interacting with adjacent hydrophobic channel residues to sustain long vascular duration of action.',
      category: 'pk',
      smarts: 'C(=O)OCC',
      region: { x: 68, y: 44, width: 28, height: 28, isRing: false, label: 'Ethyl ester' },
    },
  ],

  // Amlodipine (CID 2162) - 3rd gen DHP Calcium Channel Blocker
  amlodipine: [
    {
      id: 'amlo_chlorophenyl',
      name: 'o-Chlorophenyl ring',
      purpose:
        'Ortho-chlorine substituent forces perpendicular orientation, maximizing selective affinity for inactive L-type calcium channels.',
      category: 'binding',
      smarts: 'c1c(Cl)cccc1',
      region: { x: 8, y: 18, width: 36, height: 42, isRing: true, label: 'o-Chlorophenyl' },
    },
    {
      id: 'amlo_dihydropyridine',
      name: '1,4-Dihydropyridine ring',
      purpose:
        'Core pharmacophore locking into the allosteric DHP receptor pocket on Cav1.2 channel alpha-1 subunits.',
      category: 'binding',
      region: { x: 40, y: 30, width: 36, height: 40, isRing: true, label: '1,4-Dihydropyridine' },
    },
    {
      id: 'amlo_aminoethoxy',
      name: '2-Aminoethoxymethyl sidechain',
      purpose:
        'Basic amine (pKa ~8.6) predominantly ionized at physiologic pH; creates slow association/dissociation kinetics and extended 35-50h elimination half-life.',
      category: 'pk',
      smarts: 'OCCN',
      region: { x: 66, y: 50, width: 32, height: 36, isRing: false, label: 'Aminoethoxymethyl' },
    },
  ],

  // Lisinopril (CID 5362119) - Non-prodrug ACE inhibitor
  lisinopril: [
    {
      id: 'lisi_carboxylate',
      name: 'Zinc-binding carboxylate',
      purpose:
        'Directly coordinates catalytic Zn2+ within the ACE active site, competitively blocking angiotensin I conversion.',
      category: 'binding',
      smarts: 'C(=O)[O-]',
      region: { x: 38, y: 32, width: 28, height: 28, isRing: false, label: 'Zn2+ carboxylate' },
    },
    {
      id: 'lisi_phenylethyl',
      name: 'Phenylethyl moiety',
      purpose:
        'Inserts into the lipophilic S1 subsite of Angiotensin-Converting Enzyme, boosting inhibitory binding affinity.',
      category: 'binding',
      smarts: 'CCc1ccccc1',
      region: { x: 6, y: 14, width: 34, height: 40, isRing: true, label: 'Phenylethyl (S1)' },
    },
    {
      id: 'lisi_lysine',
      name: 'Lysine basic amino sidechain',
      purpose:
        'Confers hydrophilic zwitterionic character that enables adequate oral bioavailability without requiring an ester prodrug.',
      category: 'pk',
      smarts: 'CCCCN',
      region: { x: 66, y: 12, width: 32, height: 38, isRing: false, label: 'Lysine amino' },
    },
    {
      id: 'lisi_proline',
      name: 'Proline carboxylate ring',
      purpose:
        'Mimics the C-terminal proline of angiotensin I; forms an electrostatic salt bridge with Arg522 in the S2\' pocket of ACE.',
      category: 'binding',
      smarts: 'N1CCCC1C(=O)O',
      region: { x: 60, y: 52, width: 36, height: 38, isRing: true, label: 'Proline ring' },
    },
  ],

  // Losartan (CID 3961) - Angiotensin Receptor Blocker (ARB)
  losartan: [
    {
      id: 'losa_tetrazole',
      name: 'Acidic tetrazole ring',
      purpose:
        'Carboxylate bioisostere with planar delocalized negative charge; forms salt bridge with Arg167 in AT1 receptor while displaying greater lipophilicity than a carboxylic acid.',
      category: 'binding',
      smarts: 'c1nnnn1',
      region: { x: 62, y: 14, width: 32, height: 36, isRing: true, label: 'Tetrazole isostere' },
    },
    {
      id: 'losa_biphenyl',
      name: 'Biphenyl core scaffold',
      purpose:
        'Rigid aromatic bridge holding the acidic tetrazole and the imidazole nucleus at the required spatial orientation.',
      category: 'stability',
      smarts: 'c1ccc(cc1)c2ccccc2',
      region: { x: 32, y: 22, width: 36, height: 42, isRing: true, label: 'Biphenyl spacer' },
    },
    {
      id: 'losa_imidazole',
      name: 'Substituted imidazole ring',
      purpose:
        'Central heterocycle positioning the butyl chain, chlorine atom, and hydroxymethyl group into distinct binding pockets of the AT1 receptor.',
      category: 'binding',
      smarts: 'n1ccnc1',
      region: { x: 12, y: 44, width: 34, height: 38, isRing: true, label: 'Imidazole ring' },
    },
    {
      id: 'losa_alcohol',
      name: 'Hydroxymethyl group',
      purpose:
        'Oxidized in the liver by CYP2C9 and CYP3A4 into EXP3174 (losartan carboxylic acid), which provides 10-40x higher AT1 affinity.',
      category: 'prodrug',
      smarts: 'CO',
      region: { x: 44, y: 64, width: 28, height: 26, isRing: false, label: 'Hydroxymethyl' },
    },
  ],

  // Hydrochlorothiazide (CID 7239) - Thiazide diuretic
  hydrochlorothiazide: [
    {
      id: 'hctz_benzothiadiazine',
      name: 'Benzothiadiazine bicyclic core',
      purpose:
        'Fused bicyclic ring system that competitively inhibits the Na+/Cl- cotransporter (NCC) in the luminal membrane of the distal convoluted tubule.',
      category: 'binding',
      region: { x: 22, y: 24, width: 44, height: 48, isRing: true, label: 'Benzothiadiazine' },
    },
    {
      id: 'hctz_sulfonamide',
      name: '7-Sulfonamide (-SO2NH2)',
      purpose:
        'Crucial free sulfonamide required for diuretic activity; interacts with NCC and weakly inhibits carbonic anhydrase.',
      category: 'binding',
      smarts: 'S(=O)(=O)N',
      region: { x: 64, y: 20, width: 32, height: 34, isRing: false, label: '7-Sulfonamide' },
    },
    {
      id: 'hctz_chloro',
      name: '6-Chloro substituent',
      purpose:
        'Strong electron-withdrawing group essential for potent natriuretic and diuretic efficacy.',
      category: 'binding',
      smarts: 'c(Cl)',
      region: { x: 8, y: 34, width: 24, height: 28, isRing: false, label: '6-Chloro group' },
    },
  ],

  // Clonidine (CID 2803) - Central alpha-2 agonist
  clonidine: [
    {
      id: 'clon_dichlorophenyl',
      name: '2,6-Dichlorophenyl ring',
      purpose:
        'Bulky ortho-dichloro substituents force the phenyl ring out of plane with the imidazoline ring, locking the active conformation required for central alpha-2A receptor agonism.',
      category: 'binding',
      smarts: 'c1c(Cl)cccc1Cl',
      region: { x: 10, y: 24, width: 38, height: 48, isRing: true, label: '2,6-Dichlorophenyl' },
    },
    {
      id: 'clon_imidazoline',
      name: '2-Imidazoline ring',
      purpose:
        'Basic heterocyclic ring (pKa ~8.0) that protonates and interacts with Asp residues in alpha-2 adrenergic receptors.',
      category: 'binding',
      smarts: 'N1CCN=C1',
      region: { x: 56, y: 24, width: 36, height: 48, isRing: true, label: '2-Imidazoline' },
    },
  ],
};

/**
 * Normalizes drug name or CID to lookup key in CURATED_PHARMACOPHORES
 */
export const normalizeDrugKey = (structure: ChemicalStructure): string => {
  const name = (structure.name || '').toLowerCase();
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
  if (group.region && typeof group.region.x === 'number' && typeof group.region.y === 'number') {
    return group.region;
  }

  const smarts = (group.smarts || '').trim();
  const name = (group.name || '').toLowerCase();
  const purpose = (group.purpose || group.description || '').toLowerCase();

  // Heuristic ring detection from SMARTS or name
  const isRing =
    smarts.includes('1') ||
    smarts.includes('2') ||
    smarts.includes(':') ||
    /phenyl|benzene|pyridine|dihydropyridine|thiophene|tetrazole|imidazole|furan|pyrrole|cycle|ring/i.test(name) ||
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
  } else if (/dihydropyridine|pyridine|n1/i.test(smarts) || /dihydropyridine|pyridine core/i.test(name)) {
    regionCoords = { x: 34, y: 28, width: 36, height: 40 };
  } else if (/c\(=o\)o|coo|carboxylate|carboxylic/i.test(smarts) || /carboxylic|carboxylate/i.test(name)) {
    regionCoords = { x: 58, y: 15, width: 34, height: 32 };
  } else if (/s\(=o\)\(=o\)n|sulfonamide|so2/i.test(smarts) || /sulfonamide/i.test(name)) {
    regionCoords = { x: 12, y: 14, width: 36, height: 36 };
  } else if (/tetrazole/i.test(smarts) || /tetrazole/i.test(name)) {
    regionCoords = { x: 58, y: 44, width: 34, height: 40 };
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
  if (structure.pharmacophores && structure.pharmacophores.length > 0) {
    const total = structure.pharmacophores.length;
    return structure.pharmacophores.map((p, idx) => ({
      ...p,
      region: p.region || resolvePharmacophoreRegion(p, idx, total),
    }));
  }

  const key = normalizeDrugKey(structure);
  if (CURATED_PHARMACOPHORES[key]) {
    return CURATED_PHARMACOPHORES[key];
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
