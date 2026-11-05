import {
  ChemicalStructure,
  StructuralWorkbenchData,
} from '../types/reviewModule';

export const DIGOXIN_STEM_STRUCTURE: ChemicalStructure = {
  id: 'digoxin_stem',
  name: 'Digoxin',
  document_label: 'Digoxin (Lanoxin)',
  tradeName: 'Lanoxin',
  smiles: 'CC1C(C(C(C(O1)OC2C(OC(CC2O)OC3C(OC(CC3O)OC4CCC5(C(C4)CCC6C5CCC7(C6(CCC7C8=CC(=O)OC8)O)C)C)C)C)O)O)O',
  canonical_smiles: 'CC1C(C(C(C(O1)OC2C(OC(CC2O)OC3C(OC(CC3O)OC4CCC5(C(C4)CCC6C5CCC7(C6(CCC7C8=CC(=O)OC8)O)C)C)C)C)O)O)O',
  cid: 2724385,
  mw: 780.9,
  chemicalClass: 'Cardiac Glycoside (Digitalis O-glycoside)',
  pharmacologicalClass: 'Positive Inotropic Agent / Cardiac Glycoside',
  target: 'Na+/K+-ATPase Membrane Pump',
  target_receptor: 'Na+/K+-ATPase Extracellular Alpha Subunit (PDB: 4RET)',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral / IV',
  keyFunctionalGroups: ['Trisaccharide Glycone', 'Steroid Aglycone', 'Unsaturated Butyrolactone', 'C14-beta OH'],
  pkPdHighlights: {
    onset: '1-2 hours (oral), 5-30 min (IV)',
    duration: '3-4 days',
    halfLife: '36-48 hours',
    elimination: 'Renal (60-80% unchanged), Enterohepatic recirculation',
    bioactivation: 'Active as parent; normal flora can reduce lactone to inactive dihydrodigoxin',
  },
  sarNotes:
    'Requires cis/trans/cis (A-B cis, B-C trans, C-D cis) U-shaped steroid conformation. Glycone governs PK (distribution, half-life). Aglycone mediates Na+/K+-ATPase inhibition. Competes with K+ at extracellular pump face.',
  moa_summary:
    'Inhibits Na+/K+-ATPase pump -> increases intracellular Na+ -> suppresses Na+/Ca2+ exchanger (NCX) -> raises sarcoplasmic reticulum Ca2+ storage -> enhances myocardial contractility.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/2724385/PNG',
  pubchemAudit: {
    cid: 2724385,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'CC1C(C(C(C(O1)OC2C(OC(CC2O)OC3C(OC(CC3O)OC4CCC5(C(C4)CCC6C5CCC7(C6(CCC7C8=CC(=O)OC8)O)C)C)C)C)O)O)O',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/2724385',
    molecularFormula: 'C41H64O14',
    molecularWeight: 780.9,
  },
};

export const DIGOXIN_WORKBENCH_DATA: StructuralWorkbenchData = {
  stemStructure: DIGOXIN_STEM_STRUCTURE,
  instructions:
    'Complete the medicinal chemistry analysis of Digoxin: (1) encircle the glycone vs aglycone domains, (2) identify key inotropic pharmacophores on the steroid nucleus, (3) assign their pharmacodynamic vs pharmacokinetic roles, and (4) identify candidate steroid scaffolds with positive inotropic activity.',
  step2a_amides: {
    title: 'Step 1: Encircle Glycone and Aglycone Domains',
    prompt:
      'Click the dashed halos on the Digoxin canvas to identify the Glycone moiety (sugar chain) and the Aglycone nucleus (steroid core).',
    targets: [
      {
        id: 'glycone_sugars',
        label: 'Glycone (Trisaccharide Domain)',
        smarts: 'OC1CC(O)C(OC2CC(O)C(OC3CC(O)C(O)C(C)O3)C(C)O2)C(C)O1',
        isCorrect: true,
        rationale:
          'Glycone moiety: Composed of 3 identical D-digitoxose sugars linked via beta-glycosidic bonds. Crucial for pharmacokinetics (tissue distribution, protein binding, 36-48h half-life), but not strictly required for target enzyme inhibition.',
        x: 230,
        y: 155,
        radius: 46,
      },
      {
        id: 'aglycone_nucleus',
        label: 'Aglycone (Digoxigenin Steroid Core)',
        smarts: 'C1CCC2(C(C1)CCC3C2CCC4(C3(CCC4C5=CC(=O)OC5)O)C)C',
        isCorrect: true,
        rationale:
          'Aglycone moiety (Digoxigenin): Tetracyclic steroid core with characteristic cis/trans/cis U-shaped ring junctions and C14-beta OH. Directly binds and inhibits the myocardial Na+/K+-ATPase pump (pharmacodynamics).',
        x: 580,
        y: 155,
        radius: 46,
      },
      {
        id: 'distractor_c12_hydroxyl',
        label: 'C12-beta Hydroxyl Substituent',
        isCorrect: false,
        rationale:
          'Distractor: The C12-OH differentiates digoxin from digitoxin (rendering digoxin more polar and renally excreted), but represents only a single substituent rather than the glycone or aglycone domain.',
        x: 615,
        y: 110,
        radius: 28,
      },
      {
        id: 'distractor_lactone_alone',
        label: 'Isolated Lactone Ring',
        isCorrect: false,
        rationale:
          'Distractor: The C17 unsaturated lactone is an essential pharmacophore component of the aglycone, not the complete aglycone moiety.',
        x: 710,
        y: 155,
        radius: 30,
      },
    ],
  },
  step2b_moieties: {
    title: 'Step 2: Delineate Inotropic Pharmacophoric Features',
    prompt:
      'Select the critical pharmacophoric substituents required for high-affinity Na+/K+-ATPase pump inhibition.',
    targets: [
      {
        id: 'c17_unsaturated_lactone',
        label: 'C17-beta Unsaturated Butyrolactone',
        smarts: 'C1=CC(=O)OC1',
        isCorrect: true,
        rationale:
          'Essential pharmacophore: C17-beta alpha,beta-unsaturated 5-membered lactone ring binds the target pump cleft. Can be isosterically replaced with an alpha,beta-unsaturated nitrile without loss of inotropy.',
        x: 710,
        y: 155,
        radius: 32,
      },
      {
        id: 'c14_beta_oh',
        label: 'C14-beta Tertiary Hydroxyl Group',
        smarts: '[C;R]([OH])([C;R])[C;R]',
        isCorrect: true,
        rationale:
          'Essential pharmacophore: C14-beta OH is a hallmark of cardiac steroids, orienting the cis C-D ring junction essential for inotropic receptor fit.',
        x: 595,
        y: 165,
        radius: 28,
      },
      {
        id: 'cis_trans_cis_junction',
        label: 'cis/trans/cis Steroid Ring Junction',
        isCorrect: true,
        rationale:
          'Essential conformation: A/B cis, B/C trans, and C/D cis junctions force the molecule into a rigid U-shaped curve matching the Na+/K+-ATPase binding pocket.',
        x: 520,
        y: 155,
        radius: 38,
      },
      {
        id: 'distractor_c19_methyl',
        label: 'Angular C19-beta Methyl Group',
        isCorrect: false,
        rationale:
          'Distractor: Angular methyl groups are common structural features across all steroids (including non-inotropic androgens/glucocorticoids) and do not uniquely confer inotropic activity.',
        x: 480,
        y: 115,
        radius: 25,
      },
    ],
  },
  step2c_nature: {
    title: 'Step 3: Pharmacodynamic vs Pharmacokinetic Role Assignment',
    prompt:
      'Assign each domain of Digoxin to its primary pharmacological function.',
    badgeBank: [
      'Pharmacodynamics (Na+/K+-ATPase pump inhibition)',
      'Pharmacokinetics (Distribution, polarity, 36-48h half-life)',
      'Metabolic Inactivation Site (Normal flora lactone reduction)',
    ],
    dropZones: [
      {
        id: 'zone_aglycone_role',
        label: 'Aglycone Steroid Nucleus + C17-Lactone',
        expectedBadge: 'Pharmacodynamics (Na+/K+-ATPase pump inhibition)',
        rationale:
          'The aglycone steroid nucleus with C14-beta OH and C17 lactone directly intercalates into the alpha-subunit pocket of Na+/K+-ATPase.',
      },
      {
        id: 'zone_glycone_role',
        label: 'Glycone (Trisaccharide Sugar Chain)',
        expectedBadge: 'Pharmacokinetics (Distribution, polarity, 36-48h half-life)',
        rationale:
          'The glycone moiety governs slow tissue distribution, extensive volume of distribution, enterohepatic recycling, and prolonged 36-48h half-life.',
      },
      {
        id: 'zone_lactone_reduction_role',
        label: 'C17 Lactone Double Bond (GIT Flora Susceptibility)',
        expectedBadge: 'Metabolic Inactivation Site (Normal flora lactone reduction)',
        rationale:
          'Bacterial reduction in the gut by Eggerthella lenta saturates the lactone to dihydrodigoxin, completely abolishing cardiotonic activity in ~10% of patients.',
      },
    ],
  },
  step2d_activeForm: {
    title: 'Step 4: Select Steroid Scaffolds Retaining Positive Inotropic Activity',
    prompt:
      'Select the candidate steroid structure that retains positive inotropic activity (U-shaped cis/trans/cis steroid conformation with unsaturated lactone or conjugated nitrile bioisostere).',
    candidates: [
      {
        id: 'steroid_a_cardiac_aglycone',
        label: 'Steroid A: U-shaped cis/trans/cis Aglycone with C17-beta Unsaturated Lactone',
        smarts: 'CC12CCC3C(C1CCC2(C4=CC(=O)OC4)O)CCC5C3(CCC(C5)O)C',
        isCorrect: true,
        rationale:
          'Retains positive inotropic activity: Features the required A/B cis, B/C trans, and C/D cis U-shaped steroid core with beta-oriented C14-OH and C17-beta alpha,beta-unsaturated butyrolactone.',
      },
      {
        id: 'steroid_b_planar_glucocorticoid',
        label: 'Steroid B: Planar trans/anti/trans Glucocorticoid Core',
        isCorrect: false,
        rationale:
          'Inactive on Na+/K+-ATPase: Glucocorticoids have a flat, planar trans/trans/trans steroid ring junction that cannot fit into the curved cardiac pump receptor pocket.',
      },
      {
        id: 'steroid_c_alpha_lactone_isomer',
        label: 'Steroid C: C17-alpha Lactone Inverted Diastereomer',
        isCorrect: false,
        rationale:
          'Inactive: Inverting the C17 lactone to the alpha-face misdirects hydrogen-bonding with the pump alpha-subunit, abolishing binding affinity.',
      },
      {
        id: 'steroid_d_saturated_lactone',
        label: 'Steroid D: Saturated C17 Butyrolactone (Dihydroaglycone)',
        isCorrect: false,
        rationale:
          'Inactive: Saturating the lactone double bond removes pi-electron conjugation required for essential hydrogen-bonding interactions with target Gln111 and Glu117.',
      },
    ],
  },
};

export const ACE_INHIBITOR_WORKBENCH_DATA: StructuralWorkbenchData = {
  stemStructure: {
    id: 'captopril_stem',
    name: 'Captopril',
    document_label: 'Captopril (Capoten)',
    tradeName: 'Capoten',
    smiles: 'CC(CS)C(=O)N1CCCC1C(=O)O',
    canonical_smiles: 'CC(CS)C(=O)N1CCCC1C(=O)O',
    cid: 44093,
    mw: 217.29,
    chemicalClass: 'Sulfhydryl-containing ACE Inhibitor',
    pharmacologicalClass: 'Angiotensin-Converting Enzyme Inhibitor',
    target: 'Angiotensin-Converting Enzyme (ACE)',
    target_receptor: 'ACE Catalytic Zinc Active Site (PDB: 1UZF)',
    reversibility: 'Reversible Competitive',
    drug_state: 'Active drug',
    route: 'Oral',
    keyFunctionalGroups: ['Free Thiol (-SH)', 'L-Proline', 'Methyl group', 'Amide'],
    pkPdHighlights: {
      onset: '15-30 min',
      duration: '6-12 hours',
      halfLife: '< 2 hours (shortest in class)',
      elimination: 'Renal (disulfide dimer & unchanged drug)',
      bioactivation: 'Active without metabolism; food reduces absorption by 30-40%',
    },
    sarNotes:
      'Sulfhydryl (-SH) group binds catalytic Zn2+ with extreme avidity. Free thiol causes high incidence of skin rashes, dysgeusia (metallic taste), and short duration due to disulfide dimerization.',
    moa_summary:
      'Competitive inhibitor of ACE peptidyldipeptidase, preventing Angiotensin I conversion to Angiotensin II and blocking bradykinin degradation.',
    pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/44093/PNG',
  },
  instructions:
    'Classify the landmark ACE inhibitors by their catalytic zinc-binding pharmacophore and evaluate their pharmacokinetic implications.',
  step2a_amides: {
    title: 'Step 1: Encircle Catalytic Zinc-Binding Group',
    prompt:
      'Click the halo identifying the functional group that coordinates the catalytic Zn2+ ion in Captopril.',
    targets: [
      {
        id: 'thiol_zn_binder',
        label: 'Free Sulfhydryl / Thiol Group (-SH)',
        smarts: '[SH]',
        isCorrect: true,
        rationale:
          'Sulfhydryl group (-SH): Directly chelates the catalytic Zn2+ ion in the ACE active site. Responsible for high potency, metallic taste, skin rash, and rapid disulfide dimerization (short t1/2).',
        x: 210,
        y: 155,
        radius: 34,
      },
      {
        id: 'proline_carboxylate',
        label: 'C-terminal Carboxylate (-COOH)',
        smarts: 'C(=O)[OH]',
        isCorrect: false,
        rationale:
          'Distractor: The C-terminal carboxylate mimics the C-terminus of Angiotensin I and binds a positively charged Lys/Arg residue in the enzyme pocket, not the Zn2+ ion.',
        x: 480,
        y: 155,
        radius: 32,
      },
      {
        id: 'central_amide',
        label: 'Central Amide Carbonyl',
        isCorrect: false,
        rationale:
          'Distractor: The amide carbonyl engages in hydrogen bonding, but does not coordinate Zn2+.',
        x: 340,
        y: 155,
        radius: 28,
      },
    ],
  },
  step2b_moieties: {
    title: 'Step 2: Delineate ACE Active Site Complementary Domains',
    prompt:
      'Select the auxiliary substituents required for mimicry of the tripeptide substrate.',
    targets: [
      {
        id: 'l_proline_ring',
        label: 'L-Proline Heterocycle',
        smarts: 'N1CCCC1',
        isCorrect: true,
        rationale:
          'L-Proline ring: Fits the hydrophobic S2 pocket of ACE, mimicking the C-terminal proline residue of endogenous snake venom peptide inhibitors (Teprotide).',
        x: 410,
        y: 155,
        radius: 36,
      },
      {
        id: 'alpha_methyl_group',
        label: 'Alpha-Methyl Chiral Branch',
        isCorrect: true,
        rationale:
          'Alpha-methyl group: Enforces S-stereochemistry matching L-alanine, packing favorably into the S1 pocket.',
        x: 275,
        y: 185,
        radius: 26,
      },
    ],
  },
  step2c_nature: {
    title: 'Step 3: Classify ACE Inhibitors by Catalytic Zinc-Binding Domain',
    prompt:
      'Assign each ACE inhibitor molecule to its specific catalytic zinc-binding chemical class.',
    badgeBank: [
      'Sulfhydryl (-SH) Zinc-Binding Class',
      'Dicarboxylate (-COO-) Zinc-Binding Class',
      'Phosphinate (-PO2-) Zinc-Binding Class',
    ],
    dropZones: [
      {
        id: 'zone_captopril_class',
        label: 'Captopril',
        expectedBadge: 'Sulfhydryl (-SH) Zinc-Binding Class',
        rationale:
          'Captopril is the prototype sulfhydryl ACE inhibitor. Associated with skin rash, metallic taste, and short duration.',
      },
      {
        id: 'zone_lisinopril_class',
        label: 'Lisinopril / Enalaprilat',
        expectedBadge: 'Dicarboxylate (-COO-) Zinc-Binding Class',
        rationale:
          'Lisinopril and Enalaprilat utilize a dicarboxylate group (-COO-) to bind Zn2+, eliminating sulfhydryl-specific adverse effects.',
      },
      {
        id: 'zone_fosinopril_class',
        label: 'Fosinopril / Fosinoprilat',
        expectedBadge: 'Phosphinate (-PO2-) Zinc-Binding Class',
        rationale:
          'Fosinoprilat utilizes a phosphinate group (-PO2-) to bind catalytic Zn2+, mimicking the tetrahedral transition state of peptide bond cleavage.',
      },
    ],
  },
  step2d_activeForm: {
    title: 'Step 4: Select the Active Dicarboxylate Metabolite',
    prompt:
      'Select the active de-esterified dicarboxylate ACE inhibitor form from the prodrug ester pairs.',
    candidates: [
      {
        id: 'enalaprilat_active',
        label: 'Enalaprilat: Active Dicarboxylate Diacid',
        smarts: 'CCC(C(=O)O)NC(C)C(=O)N1CCCC1C(=O)O',
        isCorrect: true,
        rationale:
          'Active dicarboxylate diacid with both carboxylic acid groups free to chelate catalytic Zn2+ and salt-bridge the S2 subsite.',
      },
      {
        id: 'enalapril_prodrug',
        label: 'Enalapril: Monoethyl Ester Prodrug',
        isCorrect: false,
        rationale:
          'Enalapril is a monoethyl ester prodrug synthesized to improve oral bioavailability; it has low direct affinity for ACE until cleaved by hepatic esterases.',
      },
    ],
  },
};

export const HEART_FAILURE_WORKBENCHES: Record<string, StructuralWorkbenchData> = {
  digoxin: DIGOXIN_WORKBENCH_DATA,
  ace_inhibitor: ACE_INHIBITOR_WORKBENCH_DATA,
};
