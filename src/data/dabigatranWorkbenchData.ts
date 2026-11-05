import {
  AntiplateletQuestion,
  ChemicalStructure,
  StructuralWorkbenchData,
} from '../types/reviewModule';

export const DABIGATRAN_STEM_STRUCTURE: ChemicalStructure = {
  id: 'dabigatran_etexilate_stem',
  name: 'Dabigatran etexilate',
  document_label: 'Dabigatran etexilate (Pradaxa double prodrug)',
  tradeName: 'Pradaxa',
  smiles: 'CCCCCCNC(=O)NC1=CC=C(C=C1)C2=NC3=C(N2C)C=C(C=C3)C(=O)N(CCC(=O)OCC)C4=CC=CC=N4',
  canonical_smiles: 'CCCCCCNC(=O)NC1=CC=C(C=C1)C2=NC3=C(N2C)C=C(C=C3)C(=O)N(CCC(=O)OCC)C4=CC=CC=N4',
  cid: 9571074,
  mw: 627.7,
  chemicalClass: 'Benzimidazole-derived double prodrug',
  pharmacologicalClass: 'Direct Thrombin Inhibitor',
  target: 'Thrombin (Factor IIa)',
  target_receptor: 'Thrombin Active Site (Asp189 / S1 Pocket)',
  reversibility: 'Reversible',
  drug_state: 'Prodrug',
  route: 'Oral',
  keyFunctionalGroups: ['Ethyl ester', 'Hexyl carbamate', 'Benzimidazole', 'Pyridine', 'Amide'],
  pkPdHighlights: {
    onset: '1-2 hours',
    duration: '12-14 hours',
    halfLife: '12-17 hours',
    elimination: 'Renal (80%)',
    bioactivation: 'Dual bioactivation by CES1 (liver) and CES2 (intestine)',
  },
  sarNotes:
    'Double prodrug masking both carboxylate and amidine to achieve ~6.5% oral bioavailability. In vivo cleavage releases active zwitterionic dabigatran.',
  moa_summary: 'Competitive, reversible direct thrombin (Factor IIa) inhibitor.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/9571074/PNG',
  pubchemAudit: {
    cid: 9571074,
    status: 'verified',
    verifiedAt: '2026-11-04T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'CCCCCCNC(=O)NC1=CC=C(C=C1)C2=NC3=C(N2C)C=C(C=C3)C(=O)N(CCC(=O)OCC)C4=CC=CC=N4',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/9571074',
    molecularFormula: 'C34H41N7O5',
    molecularWeight: 627.7,
  },
};

export const DABIGATRAN_WORKBENCH_DATA: StructuralWorkbenchData = {
  stemStructure: DABIGATRAN_STEM_STRUCTURE,
  instructions:
    'Complete the 4-step medicinal chemistry analysis of Dabigatran etexilate: (2a) encircle hydrolyzable amide / amide-like bonds, (2b) delineate the bioreversible prodrug moieties, (2c) classify their functional group nature, and (2d) select the active metabolite structure at the bottom.',
  step2a_amides: {
    title: 'Step 2a: Encircle the amide and/or amide-like bonds',
    prompt:
      'Click the dashed halos on the chemical canvas to select the hydrolyzable amide or amide-like bonds. Beware of non-amide distractor bonds.',
    targets: [
      {
        id: 'amide_central',
        label: 'Tertiary Methylamide',
        smarts: 'C(=O)N(C)',
        isCorrect: true,
        rationale:
          'Genuine amide bond: Tertiary amide connecting the benzimidazole core to the pyridin-2-yl-beta-alanine scaffold.',
        x: 340,
        y: 155,
        radius: 32,
      },
      {
        id: 'amide_carbamate',
        label: 'Carbamate Linkage',
        smarts: 'OC(=O)N',
        isCorrect: true,
        rationale:
          'Amide-like bond: Hexyloxycarbonyl carbamate linkage (O-C(=O)-N) masking the strongly basic amidine.',
        x: 690,
        y: 155,
        radius: 32,
      },
      {
        id: 'distractor_ester',
        label: 'Ethyl Ester Carbonyl',
        isCorrect: false,
        rationale:
          'Distractor: This is an ester bond (C(=O)O-Et), which is an ester rather than an amide or amide-like linkage.',
        x: 175,
        y: 155,
        radius: 30,
      },
      {
        id: 'distractor_benzimidazole_n',
        label: 'Benzimidazole N-Heteroatom',
        isCorrect: false,
        rationale:
          'Distractor: This is an aromatic benzimidazole heteroaromatic amine ring nitrogen, not an amide bond.',
        x: 540,
        y: 155,
        radius: 28,
      },
      {
        id: 'distractor_pyridine_n',
        label: 'Pyridine Ring Nitrogen',
        isCorrect: false,
        rationale:
          'Distractor: This is an aromatic pyridine ring nitrogen, not an amide bond.',
        x: 285,
        y: 155,
        radius: 28,
      },
    ],
  },
  step2b_moieties: {
    title: 'Step 2b: Encircle the prodrug moieties',
    prompt:
      'Click the dashed halos to identify the bioreversible prodrug masking moieties that are enzymatically cleaved in vivo to release the active drug.',
    targets: [
      {
        id: 'moiety_ester',
        label: 'Ethyl Ester Masking Group',
        isCorrect: true,
        rationale:
          'Genuine prodrug moiety: Lipophilic ethyl ester masking the negative/ionized carboxylate of dabigatran, enhancing passive GI permeability.',
        x: 140,
        y: 160,
        radius: 65,
      },
      {
        id: 'moiety_carbamate',
        label: 'Hexyloxycarbonyl Masking Group',
        isCorrect: true,
        rationale:
          'Genuine prodrug moiety: Hydrophobic hexyl carbamate masking the strongly basic, protonated benzamidine group (pKa ~12), reducing ionization at physiological pH.',
        x: 740,
        y: 160,
        radius: 68,
      },
      {
        id: 'distractor_pyridine_ring',
        label: 'Pyridine Pharmacophore Ring',
        isCorrect: false,
        rationale:
          'Distractor: Pyridine is an essential part of the core pharmacophore binding in the thrombin active site; it is NOT a cleavable prodrug group.',
        x: 285,
        y: 160,
        radius: 40,
      },
      {
        id: 'distractor_benzimidazole_core',
        label: 'Benzimidazole Scaffold Core',
        isCorrect: false,
        rationale:
          'Distractor: The benzimidazole core provides crucial hydrophobic contacts in the thrombin active site; it remains intact in the active drug.',
        x: 485,
        y: 155,
        radius: 45,
      },
      {
        id: 'distractor_phenyl_linker',
        label: 'Central Phenyl Linker',
        isCorrect: false,
        rationale:
          'Distractor: The central phenyl ring correctly spaces and orientates the benzamidine into the deep S1 specificity pocket; it is NOT a prodrug moiety.',
        x: 625,
        y: 155,
        radius: 35,
      },
    ],
  },
  step2c_nature: {
    title: 'Step 2c: Drag & drop / assign the chemical nature of each prodrug moiety',
    prompt:
      'Drag or click functional group badges from the bank below onto the corresponding prodrug dropzones.',
    badgeBank: ['Ester', 'Carbamate', 'Phosphonate', 'Sulfonate'],
    dropZones: [
      {
        id: 'drop_left',
        targetMoietyId: 'moiety_ester',
        label: 'Left Prodrug Moiety',
        correctBadge: 'Ester',
        rationale:
          'Left moiety: Hydrolyzed by carboxylesterase-1 (CES1) in hepatocytes to expose the free carboxylic acid.',
        x: 140,
        y: 95,
      },
      {
        id: 'drop_right',
        targetMoietyId: 'moiety_carbamate',
        label: 'Right Prodrug Moiety',
        correctBadge: 'Carbamate',
        rationale:
          'Right moiety: Cleaved primarily by carboxylesterase-2 (CES2) in intestinal enterocytes to unmask the strongly basic amidine group.',
        x: 740,
        y: 95,
      },
    ],
  },
  step2d_activeForm: {
    title: 'Step 2d: Select the chemical structure of the active form',
    prompt:
      'Which chemical structure represents the pharmacologically active direct thrombin inhibitor (Dabigatran)?',
    candidates: [
      {
        id: 'cand_a',
        name: 'Dabigatran (Active Form)',
        smiles: 'O=C(O)CCN(C(=O)c1ccc2nc(c3ccc(C(=N)N)cc3)n(C)c2c1)c4ccccn4',
        cid: 216210,
        isCorrect: true,
        classification: 'active',
        rationale:
          'CORRECT: Dabigatran (active zwitterion). Both the ethyl ester and hexyl carbamate prodrug groups have been fully hydrolyzed to expose the free carboxylic acid on the left and the free benzamidine on the right, which forms a crucial salt bridge with Asp189 in the thrombin S1 pocket.',
      },
      {
        id: 'cand_b',
        name: 'Mono-prodrug Intermediate BDPN',
        smiles:
          'CCCCCCNC(=O)NC1=CC=C(C=C1)C2=NC3=C(N2C)C=C(C=C3)C(=O)N(CCC(=O)O)C4=CC=CC=N4',
        isCorrect: false,
        classification: 'intermediate',
        rationale:
          'INCORRECT: Intermediate BDPN. The ethyl ester has been cleaved to the free carboxylic acid, but the bulky hexyl carbamate remains intact, preventing amidine binding in the S1 pocket.',
      },
      {
        id: 'cand_c',
        name: 'Mono-prodrug Intermediate BIBR 1087',
        smiles: 'CCOC(=O)CCN(C(=O)c1ccc2nc(c3ccc(C(=N)N)cc3)n(C)c2c1)c4ccccn4',
        isCorrect: false,
        classification: 'intermediate',
        rationale:
          'INCORRECT: Intermediate BIBR 1087. The hexyl carbamate has been cleaved to expose the amidine, but the ethyl ester is still intact, meaning the molecule is still a partial prodrug.',
      },
      {
        id: 'cand_d',
        name: 'Scaffold Cleavage Product (Inactive Degradant)',
        smiles: 'O=C(O)c1ccc2nc(c3ccc(C(=N)N)cc3)n(C)c2c1',
        isCorrect: false,
        classification: 'degradant',
        rationale:
          'INCORRECT: Inactive degradant resulting from non-bioreversible cleavage of the central tertiary amide bond.',
      },
    ],
  },
};

export const DABIGATRAN_WORKBENCH_QUESTION: AntiplateletQuestion = {
  id: 2,
  questionNumberLabel: 'Question 2',
  category: 'Anticoagulants - Direct Thrombin Inhibitors (Prodrugs & SAR)',
  questionStem:
    'Dabigatran etexilate is an orally bioavailable direct thrombin inhibitor administered as a double prodrug. Analyze the chemical structure using the interactive structural workbench below:',
  type: 'structural-workbench',
  structuralWorkbench: DABIGATRAN_WORKBENCH_DATA,
  overallExplanation:
    'Dabigatran itself has extremely poor oral bioavailability due to high polarity: a strongly basic amidine (pKa ~12, ionized at GI pH) and a carboxylic acid. Dabigatran etexilate is engineered as a neutral double prodrug: (1) an ethyl ester masks the carboxylate, and (2) a hexyloxycarbonyl carbamate masks the basic amidine. In vivo bioactivation requires two sequential cleavages: carboxylesterase-2 (CES2) in the intestine cleaves the carbamate to yield intermediate BIBR 1087, while carboxylesterase-1 (CES1) in the liver cleaves the ethyl ester to yield intermediate BDPN. Complete hydrolysis of both masking groups liberates the active zwitterion dabigatran, which binds directly to thrombin.',
  highYieldPearl:
    'Dabigatran etexilate uses a double prodrug strategy (ester + carbamate) to overcome both amidine charge and carboxylate polarity. Intermediate metabolites (BIBR 1087 and BDPN) retain minor activity (~10%), but complete dual hydrolysis is required for full thrombin inhibition.',
  sourceReference: 'Anticoagulants Review Worksheet, Page 1, Question 2',
  sourcePageNumber: 1,
};
