import {
  ChemicalStructure,
  StructuralWorkbenchData,
} from '../types/reviewModule';

export const CLOPIDOGREL_STEM_STRUCTURE: ChemicalStructure = {
  id: 'clopidogrel_stem',
  name: 'Clopidogrel',
  document_label: 'Clopidogrel (Plavix) - Thienopyridine Prodrug',
  tradeName: 'Plavix',
  smiles: 'COC(=O)[C@@H](c1ccccc1Cl)N2CCc3sccc3C2',
  canonical_smiles: 'COC(=O)[C@@H](c1ccccc1Cl)N2CCc3sccc3C2',
  cid: 60606,
  mw: 321.82,
  chemicalClass: 'Thienopyridine (Tetrahydrothienopyridine ester)',
  pharmacologicalClass: 'P2Y12 Platelet Adenosine Diphosphate (ADP) Receptor Irreversible Antagonist',
  target: 'Platelet P2Y12 Purinergic Receptor (Gi-coupled)',
  target_receptor: 'P2Y12 Extracellular Cys17 & Cys270 Residues (PDB: 4PXZ)',
  reversibility: 'Irreversible (Covalent Mixed Disulfide Adduct)',
  drug_state: 'Prodrug (Requires 2-step hepatic CYP activation)',
  route: 'Oral',
  keyFunctionalGroups: ['Thiophene fused ring', 'Piperidine nitrogen', 'Methyl ester (-COOCH3)', 'ortho-Chlorophenyl chiral center (S-enantiomer)'],
  pkPdHighlights: {
    onset: '2 hours (loading dose)',
    duration: 'Platelet lifespan (~7-10 days)',
    halfLife: '6 hours (parent drug) / ~30 minutes (active metabolite)',
    elimination: '85% inactivated by human carboxylesterase-1 (CES1) to carboxylic acid SR 26334; ~15% undergoes hepatic CYP2C19/CYP1A2/CYP2B6 2-step oxidation',
    bioactivation: 'CYP oxidation generates 2-oxo-clopidogrel thiolactone, then opens to reactive cis-thiol active metabolite',
  },
  sarNotes:
    'Requires the S-(+) stereoisomer; the R-(-) isomer is biologically inactive and causes severe convulsions. The methyl ester is vulnerable to CES1 hydrolysis, which diverts 85% of the dose into inactive carboxylic acid. The active opened thiolactone exposes a free sulfhydryl (-SH) that attacks Cys17/Cys270 on P2Y12.',
  moa_summary:
    'Active thiol metabolite covalently forms a mixed disulfide bridge with Cys17 and Cys270 on platelet P2Y12 receptors, irreversibly blocking ADP binding, adenylyl cyclase inhibition, and GPIIb/IIIa integrin activation for the 7-10 day lifespan of the platelet.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/60606/PNG',
  pubchemAudit: {
    cid: 60606,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'COC(=O)[C@@H](c1ccccc1Cl)N2CCc3sccc3C2',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/60606',
    molecularFormula: 'C16H16ClNO2S',
    molecularWeight: 321.82,
  },
};

export const THIENOPYRIDINE_WORKBENCH_DATA: StructuralWorkbenchData = {
  stemStructure: CLOPIDOGREL_STEM_STRUCTURE,
  instructions:
    'Analyze the metabolic bioactivation, ester diversion, and covalent receptor trapping of Thienopyridines (Clopidogrel vs Prasugrel): (1) identify the reactive sulfhydryl pharmacophore on the opened thiol active form, (2) encircle the thiolactone/thiophene core that undergoes oxidative opening, (3) assign the comparative esterase vs CYP metabolic pathways, and (4) identify the active cis-thiol metabolite structure that forms the mixed disulfide adduct with P2Y12 Cys17/Cys270.',
  step2a_amides: {
    title: 'Step 1: Encircle Reactive Nucleophilic Sulfhydryl (-SH)',
    prompt:
      'Identify the free thiol group on the active metabolite responsible for nucleophilic attack on platelet P2Y12 disulfide bonds.',
    targets: [
      {
        id: 'thiol_group',
        label: 'Nucleophilic Free Thiol (-SH / Sulfhydryl)',
        smarts: '[SH]',
        isCorrect: true,
        rationale:
          'The exposed free thiol (-SH) is the essential covalent warhead. It attacks disulfide linkages between Cys17 and Cys270 on the platelet P2Y12 receptor, locking the receptor in an inactive conformation permanently.',
        x: 80,
        y: 45,
        radius: 14,
      },
      {
        id: 'methyl_ester_carbonyl',
        label: 'Methyl Ester Carbonyl (-C(=O)OCH3)',
        smarts: 'C(=O)OC',
        isCorrect: false,
        rationale:
          'The ester carbonyl is the target of inactivating carboxylesterase-1 (CES1) hydrolysis, not the covalent receptor-binding nucleophile.',
        x: 32,
        y: 42,
        radius: 12,
      },
      {
        id: 'chloro_substituent',
        label: 'ortho-Chloro Substituent on Benzene',
        smarts: 'c1ccccc1Cl',
        isCorrect: false,
        rationale:
          'The ortho-chlorine atom contributes to steric positioning and van der Waals interactions in the pocket, not covalent trapping.',
        x: 18,
        y: 65,
        radius: 12,
      },
    ],
  },
  step2b_moieties: {
    title: 'Step 2: Encircle Thienopyridine Heterocyclic Ring System',
    prompt:
      'Encircle the sulfur-containing ring that undergoes CYP-mediated oxidation into the 2-oxo thiolactone intermediate.',
    targets: [
      {
        id: 'thiolactone_ring',
        label: 'Thienopyridine Thiophene Ring (Pro-thiolactone)',
        smarts: 'c1sccc1',
        isCorrect: true,
        rationale:
          'CYP2C19/CYP1A2 oxidizes the alpha-position of the thiophene ring to yield 2-oxo-clopidogrel (a thiolactone intermediate), which is subsequently hydrolyzed to liberate the active free thiol.',
        x: 72,
        y: 55,
        radius: 18,
      },
      {
        id: 'phenyl_ring',
        label: 'ortho-Chlorophenyl Ring',
        smarts: 'c1ccccc1Cl',
        isCorrect: false,
        rationale:
          'The aromatic phenyl ring is metabolically stable and does not participate in the oxidative ring-opening bioactivation pathway.',
        x: 20,
        y: 55,
        radius: 16,
      },
    ],
  },
  step2c_nature: {
    title: 'Step 3: Comparative Inactivation vs Bioactivation Pathways',
    prompt:
      'Assign the metabolic activation hallmarks distinguishing Clopidogrel (Plavix) from Prasugrel (Effient).',
    badgeBank: [
      'CYP2C19 (2-step oxidation, 85% CES1 ester inactivation)',
      'CES2 (rapid intestinal ester hydrolysis, 1-step CYP bioactivation)',
      'Direct Acting (No bioactivation required)',
      'Reversible P2Y12 Antagonist (Nucleoside analogue)',
      'COX-1 Ser529 Irreversible Acetylation',
    ],
    dropZones: [
      {
        id: 'clopidogrel_bioactivation',
        targetMoietyId: 'clopidogrel_pathway',
        label: 'Clopidogrel Metabolic Bioactivation & Inactivation Hallmark',
        correctBadge: 'CYP2C19 (2-step oxidation, 85% CES1 ester inactivation)',
        rationale:
          'Clopidogrel requires two successive CYP oxidation steps (predominantly CYP2C19). However, ~85% of an oral dose is rapidly shunted into inactive carboxylic acid (SR 26334) by carboxylesterase-1 (CES1), resulting in slow onset, low active metabolite yields, and resistance in CYP2C19 loss-of-function (*2, *3) poor metabolizers.',
        x: 30,
        y: 80,
      },
      {
        id: 'prasugrel_bioactivation',
        targetMoietyId: 'prasugrel_pathway',
        label: 'Prasugrel Metabolic Bioactivation & Inactivation Hallmark',
        correctBadge: 'CES2 (rapid intestinal ester hydrolysis, 1-step CYP bioactivation)',
        rationale:
          'Prasugrel was engineered with an ester on the thiophene ring that is rapidly hydrolyzed by intestinal carboxylesterase-2 (CES2) to an intermediate thiolactone, which then requires only a single, efficient CYP step (CYP3A4/CYP2B6). This avoids CES1 inactivation and yields faster, more potent, and more consistent platelet inhibition unaffected by CYP2C19 status.',
        x: 75,
        y: 80,
      },
    ],
  },
  step2d_activeForm: {
    title: 'Step 4: Identify Active Free-Thiol Metabolite',
    prompt:
      'Select the active chemical structure possessing the opened thiolactone with an exposed free nucleophilic sulfhydryl (-SH) group.',
    candidates: [
      {
        id: 'active_cis_thiol_metabolite',
        name: 'Active cis-Thiol Metabolite (Opened Thiolactone)',
        smiles: 'COC(=O)[C@@H](c1ccccc1Cl)N2CCC(=C2S)C=O',
        cid: 10183144,
        isCorrect: true,
        classification: 'active',
        rationale:
          'This structure represents the active form of Clopidogrel: the thiolactone ring has been oxidatively cleaved into an alpha,beta-unsaturated aldehyde and a free sulfhydryl (-SH). This nucleophilic thiol covalently captures Cys17 and Cys270 on P2Y12.',
      },
      {
        id: 'clopidogrel_carboxylic_acid',
        name: 'SR 26334 (Inactive Carboxylic Acid Metabolite)',
        smiles: 'OC(=O)[C@@H](c1ccccc1Cl)N2CCc3sccc3C2',
        cid: 11957448,
        isCorrect: false,
        classification: 'degradant',
        rationale:
          'SR 26334 is the inactive carboxylic acid formed when human carboxylesterase-1 (CES1) cleaves the methyl ester (~85% of clopidogrel clearance). It has zero antiplatelet activity.',
      },
      {
        id: 'clopidogrel_thiolactone_intermediate',
        name: '2-Oxo-Clopidogrel (Thiolactone Intermediate)',
        smiles: 'COC(=O)[C@@H](c1ccccc1Cl)N2CCc3sc(=O)cc3C2',
        cid: 11957449,
        isCorrect: false,
        classification: 'intermediate',
        rationale:
          '2-Oxo-clopidogrel is the first metabolic intermediate produced by CYP1A2/2C19 oxidation. It is not yet active because the sulfur atom remains trapped in a closed lactone ring.',
      },
      {
        id: 'smethyl_inactive_metabolite',
        name: 'S-Methylated Inactive Metabolite',
        smiles: 'COC(=O)[C@@H](c1ccccc1Cl)N2CCC(=C2SC)C=O',
        cid: 11957450,
        isCorrect: false,
        classification: 'degradant',
        rationale:
          'Rapid S-methylation of the free thiol group by cellular thiol methyltransferases inactivates the metabolite and accounts for its short half-life.',
      },
    ],
  },
};
