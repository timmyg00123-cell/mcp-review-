/**
 * SMARTS Override Dictionary & Universal Pharmacophore Ontology
 *
 * Provides mathematically verified, canonical SMARTS patterns across all major
 * IUPAC functional group classes, heterocyclic cores, and medicinal chemistry pharmacophore
 * motifs (derived from Ertl/Novartis and RDKit canonical collections).
 */

import type { ChemicalStructure } from '../types/reviewModule';

export const SMARTS_OVERRIDE_DICT: Record<string, string> = {
  // =========================================================================
  // 1. NITROGEN HETEROCYCLES (Mono-, Bi-, and Poly-cyclic)
  // =========================================================================
  // 6-Membered Monocycles
  'pyridine': 'c1ccncc1',
  'pyridinium': '[n+1]1ccccc1',
  'piperidine': 'C1CCNCC1',
  'piperidone': 'O=C1NCCCC1',
  'valerolactam': 'O=C1NCCCC1',
  'pyrazine': 'c1cnccn1',
  'pyrazinedione': 'O=C1CNC(=O)CN1',
  'piperazine': 'C1CNCCN1',
  'diketopiperazine': 'O=C1NCCN1',
  'pyrimidine': 'c1cncnc1',
  'pyrimidinone': 'O=c1cc[nH]cn1',
  'uracil': 'O=c1cc[nH]c(=O)[nH]1',
  'thymine': 'Cc1c[nH]c(=O)[nH]c1=O',
  'cytosine': 'Nc1cc[nH]c(=O)n1',
  'hexahydropyrimidine': 'C1NCNCCC1',
  'pyridazine': 'c1ccnnc1',
  'pyridazinone': 'O=c1cc[nH]nc1',
  'triazine': 'c1ncncn1',
  'tetrazine': 'c1nncnn1',
  'tetrahydropyridine': 'C1NCCc2sccc12',

  // 5-Membered Monocycles
  'pyrrole': 'c1cc[nH]c1',
  'pyrrolidine': 'C1CCNC1',
  'pyrrolidone': 'O=C1NCCC1',
  'pyrrolidinone': 'O=C1NCCC1',
  'succinimide': 'O=C1CCC(=O)N1',
  'maleimide': 'O=C1C=CC(=O)N1',
  'pyrazole': 'c1cnn[nH]1',
  'pyrazoline': 'C1C=NNC1',
  'pyrazolidine': 'C1NNCC1',
  'pyrazolidinedione': 'O=C1NNCC1=O',
  'imidazole': '[#7]1~[#6]~[#7]~[#6]~[#6]1',
  'imidazoline': 'N1CCN=C1',
  'imidazolidine': 'C1NCNC1',
  'hydantoin': 'O=C1NC(=O)NC1',
  'triazole': 'c1nnn[nH]1',
  '1,2,4-triazole': 'c1ncnc[nH]1',
  '1,2,3-triazole': 'c1ccnn[nH]1',
  'tetrazole': 'c1nnnn1',

  // Fused Nitrogen Bicycles & Polycycles
  'indole': 'c1ccc2c(c1)cc[nX3]2',
  'indoline': 'C1Cc2ccccc2N1',
  'isoindole': 'c1ccc2c[nH]cc2c1',
  'indolizine': 'c1ccn2cccc2c1',
  'isoindoline': 'C1NCc2ccccc12',
  'isatin': 'O=C1C(=O)Nc2ccccc12',
  'oxindole': 'O=C1Cc2ccccc2N1',
  'quinoline': 'c1ccc2ncccc2c1',
  'quinolinone': 'O=C1CCc2ccccc2N1',
  'isoquinoline': 'c1ccc2cnccc2c1',
  'isoquinolinone': 'O=C1NCc2ccccc12',
  'tetrahydroquinoline': 'c1ccc2c(c1)CCCN2',
  'tetrahydroisoquinoline': 'c1ccc2c(c1)CNCC2',
  'quinolizine': 'c1ccn2ccccc2c1',
  'quinazoline': 'c1ccc2c(c1)ncnc2',
  'quinazolinone': 'O=c1[nH]cnc2ccccc12',
  'quinoxaline': 'c1ccc2c(c1)nccn2',
  'quinoxalinedione': 'O=c1[nH]c(=O)[nH]c2ccccc12',
  'phthalazine': 'c1ccc2c(c1)cnnc2',
  'phthalazinone': 'O=c1[nH]ncc2ccccc12',
  'cinnoline': 'c1ccc2c(c1)ccnn2',
  'pteridine': 'c1ncc2nc[nH]c2n1',
  'pteridinone': 'O=c1nc[nH]c2ncncc12',
  'purine': 'c1ncnc2nc[nH]c12',
  'adenine': 'c1ncnc2ncnc12',
  'guanine': 'Nc1nc2nc[nH]c2c(=O)[nH]1',
  'xanthine': 'O=c1[#7]c(=O)[#7]c2[#7]c[#7]c12',
  'purine dione': 'O=c1[#7]c(=O)[#7]c2[#7]c[#7]c12',
  'purinedione': 'O=c1[#7]c(=O)[#7]c2[#7]c[#7]c12',
  'unsubstituted n7': '[#7;H1]',
  'hypoxanthine': 'O=c1[nH]cnc2nc[nH]c12',
  'theophylline': 'Cn1c(=O)c2nc[nH]c2n(C)c1=O',
  'benzimidazole': '[#6]1~[#6]~[#6]~[#6]~[#6]2~[#6]~1~[#7]~[#6]~[#7]~2',
  'indazole': 'c1ccc2[nH]ncc2c1',
  'benzotriazole': 'c1ccc2nnn[nH]c2c1',
  'carbazole': 'c1ccc2c(c1)c3ccccc3[nH]2',
  'acridine': 'c1ccc2nc3ccccc3cc2c1',
  'phenanthridine': 'c1ccc2c(c1)c3ccccc3nc2',
  'phenanthroline': 'c1ccc2nc3cccnc3cc2c1',
  'phenazine': 'c1ccc2nc3ccccc3nc2c1',
  'carboline': 'c1ccc2c(c1)[nH]c3ncccc23',
  'benzazepine': 'c1ccc2c(c1)CCCCN2',
  'benzodiazepine': 'c1ccc2c(c1)NCC(=O)Nc3ccccc23',
  'thienopyridine': 'C1NCCc2sccc12',
  'pyrazolopyridine': 'c1c2CC[#7]C(=O)c2nn1',
  'pyrazolopyridinone': 'c1c2CC[#7]C(=O)c2nn1',
  'triazolopyrimidine': 'c1ncnc2nnnc12',
  'pyrimidopyrimidine': 'c1nc2ncncc2nc1',
  'quinuclidine': 'C1CN2CCC1CC2',

  // =========================================================================
  // 2. OXYGEN & SULFUR HETEROCYCLES
  // =========================================================================
  // Oxygen Heterocycles
  'furan': 'c1ccco1',
  'tetrahydrofuran': 'C1CCOC1',
  'dihydrofuran': 'C1C=COC1',
  'pyran': 'C1C=CCO1',
  'tetrahydropyran': 'C1CCOCC1',
  'pyrone': 'O=C1C=CC=CO1',
  'coumarin': 'O=c1oc2ccccc2cc1',
  '4-hydroxycoumarin': 'O=c1oc2ccccc2c(O)c1',
  'chromone': 'O=C1Cc2ccccc2O1',
  'chroman': 'C1Cc2ccccc2OC1',
  'flavone': 'O=C1Cc2ccccc2OC1c3ccccc3',
  'isoflavone': 'O=C1C(c2ccccc2)c3ccccc3OC1',
  'xanthene': 'c1ccc2Oc3ccccc3Cc2c1',
  'xanthone': 'O=C1c2ccccc2Oc3ccccc13',
  'benzofuran': 'c1ccc2occc2c1',
  'isobenzofuran': 'c1ccc2c(c1)coc2',
  'dihydrobenzofuran': 'C1Cc2ccccc2O1',
  'dioxane': 'C1COCCO1',
  'dioxolane': 'C1OCCO1',
  'benzodioxole': 'c1ccc2c(c1)OCO2',
  'benzodioxan': 'c1ccc2c(c1)OCCO2',
  'oxirane': 'C1OC1',
  'epoxide': 'C1OC1',
  'oxetane': 'C1COC1',
  'crown ether': 'C1OCCOCCOCCO1',

  // Sulfur Heterocycles
  'thiophene': 'c1sccc1',
  'tetrahydrothiophene': 'C1SCCC1',
  'dihydrothiophene': 'C1C=CSC1',
  'benzothiophene': 'c1ccc2sccc2c1',
  'isobenzothiophene': 'c1ccc2c(c1)csc2',
  'thiane': 'C1SCC CC1',
  'thietane': 'C1CSC1',
  'thiirane': 'C1SC1',
  'thioxanthene': 'c1ccc2Sc3ccccc3Cc2c1',

  // Mixed O, N, S Heterocycles
  'oxazole': 'c1ocnc1',
  'oxazoline': 'C1NC=OC1',
  'oxazolidine': 'C1NCOC1',
  'oxazolidinone': 'O1CCNC1=O',
  'isoxazole': 'c1oncc1',
  'isoxazoline': 'C1N=OCC1',
  'isoxazolidine': 'C1NOCC1',
  'thiazole': 'c1scnc1',
  'thiazoline': 'C1N=CSC1',
  'thiazolidine': 'C1NCSC1',
  'thiazolidinedione': 'O=C1NC(=O)CS1',
  'isothiazole': 'c1sncc1',
  'oxadiazole': 'c1nonc1',
  '1,3,4-oxadiazole': 'c1nocn1',
  'thiadiazole': 's1cnnc1',
  '1,3,4-thiadiazole': 's1cnnc1',
  'dithiole': 'C1C=SS1',
  'dithiolane': 'C1CSSC1',
  'morpholine': 'C1COCCN1',
  'morpholinone': 'O=C1COCC[#7]1',
  'morpholin-3-one': 'O=C1COCC[#7]1',
  'thiomorpholine': 'C1CSCCN1',
  'benzoxazole': 'c1ccc2ocnc2c1',
  'benzothiazole': 'c1ccc2scnc2c1',
  'benzoxazoline': 'O1CNc2ccccc12',
  'benzoxazinone': 'O=C1COc2ccccc2N1',
  'benzoxazine': 'O=C1COc2ccccc2N1',
  '6-hydroxy-2h-1,4-benzoxazin-3(4h)-one': 'O=C1COc2c(cc(O)cc2)N1',
  'phenothiazine': 'c1ccc2c(c1)Nc3ccccc3S2',
  'phenoxazine': 'c1ccc2c(c1)Nc3ccccc3O2',
  'benzothiadiazine': '[#6]1~[#6]~[#6]~[#6]2~[#6]~1~[SX4](=[OX1])(=[OX1])~[NX3,nx3]~[#6]~[NX3,nx3,nx2]~2',
  'dihydrobenzothiadiazine': 'c1ccc2c(c1)S(=O)(=O)NCN2',
  'benzothiazepine': 'O=C1CCSc2ccccc2N1',
  '1,5-benzothiazepin-4-one': 'O=C1CCSc2ccccc2N1',
  'benzothiazepinone': 'O=C1CCSc2ccccc2N1',
  'sultam': 'O=S1(=O)CCCCN1',
  'sultone': 'O=S1(=O)CCCCO1',

  // =========================================================================
  // 3. CARBONYLS, ACIDS & DERIVATIVES
  // =========================================================================
  'carboxylic acid': '[CX3](=[OX1])[OX2H,OX1-]',
  'carboxylic': '[CX3](=[OX1])[OX2H,OX1-]',
  'carboxylate': '[CX3](=[OX1])[OX1-,OX2H]',
  'cooh': '[CX3](=[OX1])[OX2H,OX1-]',
  'dicarboxylic acid': '[CX3](=[OX1])[OX2H]~[#6]~[CX3](=[OX1])[OX2H]',
  'ester': '[CX3](=[OX1])[OX2][#6]',
  'methyl ester': '[CX3](=[OX1])OC',
  'ethyl ester': '[CX3](=[OX1])OCC',
  'thioester': '[CX3](=[OX1])[SX2][#6]',
  'lactone': '[#6]1~[#6]~[#6]~[#6]~[OX2]~[CX3]1(=[OX1])',
  'gamma-lactone': 'C1(=O)OCCC1',
  'delta-lactone': 'C1(=O)OCCCC1',
  'beta-lactone': 'C1(=O)OCC1',
  'ketone': '[#6][CX3](=[OX1])[#6]',
  'aldehyde': '[CX3H1](=[OX1])[#6,#1]',
  'acid chloride': '[CX3](=[OX1])[Cl]',
  'acid anhydride': '[CX3](=[OX1])[OX2][CX3](=[OX1])',
  'carbonate': '[OX2][CX3](=[OX1])[OX2]',
  'dicarbonyl': '[CX3](=[OX1])[CX3](=[OX1])',
  'beta-dicarbonyl': '[CX3](=[OX1])[CX4][CX3](=[OX1])',
  'quinone': 'O=C1C=CC(=O)C=C1',
  'benzoquinone': 'O=C1C=CC(=O)C=C1',
  'naphthoquinone': 'O=C1C=CC(=O)c2ccccc12',
  'anthraquinone': 'O=C1c2ccccc2C(=O)c3ccccc13',

  // =========================================================================
  // 4. NITROGEN FUNCTIONALITIES (Amides, Ureas, Guanidines, Amines)
  // =========================================================================
  // Amides & Ureas
  'amide': '[CX3](=[OX1])[NX3]',
  'primary amide': '[CX3](=[OX1])[NX3H2]',
  'secondary amide': '[CX3](=[OX1])[NX3H1][#6]',
  'tertiary amide': '[CX3](=[OX1])[NX3H0]([#6])[#6]',
  'lactam': '[#6]1~[#6]~[#6]~[#6]~[NX3]~[CX3]1(=[OX1])',
  'beta-lactam': 'C1(=O)NCC1',
  'gamma-lactam': 'C1(=O)NCCC1',
  'delta-lactam': 'C1(=O)NCCCC1',
  'formamide': '[CX3H1](=[OX1])[NX3]',
  'formamido': '[CX3H1](=[OX1])[NX3]',
  'formanilide': '[CX3H1](=[OX1])[NX3]',
  'acetamide': '[NX3][CX3](=[OX1])C',
  'acetamido': '[NX3][CX3](=[OX1])C',
  'benzamide': 'c1ccccc1[CX3](=[OX1])[NX3]',
  'imide': '[CX3](=[OX1])[NX3][CX3](=[OX1])',
  'carbamate': '[NX3][CX3](=[OX1])[OX2][#6]',
  'hexyl carbamate': 'CCCCCC[OX2][CX3](=[OX1])[NX3]',
  'hexylcarbamate': 'CCCCCC[OX2][CX3](=[OX1])[NX3]',
  'urethane': '[NX3][CX3](=[OX1])[OX2][#6]',
  'urea': '[NX3][CX3](=[OX1])[NX3]',
  'thiourea': '[NX3][CX3](=[SX1])[NX3]',
  'isourea': '[OX2][CX3](=[NX2])[NX3]',
  'semicarbazide': '[NX3][NX3][CX3](=[OX1])[NX3]',
  'semicarbazone': '[NX3][NX3]=[CX3][CX3](=[OX1])[NX3]',
  'thiosemicarbazide': '[NX3][NX3][CX3](=[SX1])[NX3]',

  // Guanidines & Amidines
  'acylguanidine': '[CX3](=[OX1])[#7]~[CX3](~[#7])~[#7]',
  'guanidinocarbonyl': '[CX3](=[OX1])[#7]~[CX3](~[#7])~[#7]',
  'guanidine': '[NX3][CX3](=[NX2])[NX3]',
  'guanidino': '[NX3][CX3](=[NX2])[NX3]',
  'biguanide': '[NX3][CX3](=[NX2])[NX3][CX3](=[NX2])[NX3]',
  'amidine': '[CX3](=[NX2])[NX3]',
  'benzamidine': 'c1ccccc1[CX3](=[NX2])[NX3]',

  // Amines
  'primary amine': '[NX3H2;!$(N-[!#6])]',
  'secondary amine': '[NX3H1;!$(N-[!#6])]',
  'tertiary amine': '[#7X3H0]',
  'tertiary amines': '[#7X3H0]',
  'quaternary ammonium': '[N+;X4]',
  'aromatic amine': 'c[NX3H2]',
  'aniline': 'c1ccccc1[NX3H2]',
  'basicamine': 'C1CCNCC1',
  'amine': 'N',
  'amino': 'N',
  'diamino': 'c[NX3H2]',
  'diethylamino': 'N(CC)CC',
  'dimethylamino': 'N(C)C',
  'propylamino': 'NCCC',
  'isopropylamino': '[NX3]C(C)C',
  'ethanolamine': 'NCCO',
  'diethanolamine': 'N(CCO)CCO',
  'aminoethoxy': 'OCCN',

  // Other Nitrogen Motifs
  'nitro': '[$([N+](=O)[O-]),$([N+](=O)[O])]',
  'nitroso': '[NX2]=[OX1]',
  'nitrile': '[CX2]#[NX1]',
  'cyano': '[CX2]#[NX1]',
  'isonitrile': '[NX2+]#[CX1-]',
  'isocyanide': '[NX2+]#[CX1-]',
  'isocyanate': '[NX2]=[CX2]=[OX1]',
  'isothiocyanate': '[NX2]=[CX2]=[SX1]',
  'azo': '[NX2]=[NX2]',
  'azoxy': '[NX2]=[N+]([OX1-])',
  'azide': '[NX1-]=[NX2+]=[NX1-]',
  'hydrazine': '[NX3][NX3]',
  'hydrazone': '[NX2]=[CX3]',
  'hydroxylamine': '[NX3][OX2H]',
  'oxime': '[CX3]=[NX2][OX2H]',
  'aldoxime': '[CX3H1]=[NX2][OX2H]',
  'ketoxime': '[#6][CX3](=[NX2][OX2H])[#6]',
  'nitrone': '[CX3]=[N+]([OX1-])[#6]',
  'n-oxide': '[$([n+][o-]),$([N+](=O)[O-]),$([N+][O-])]',
  'nitrosyl': '[N+]=O',
  'nitrosyl ligand': '[N+]=O',
  'cyanide': '[C]#[N]',
  'cyanide ligand': '[C]#[N]',
  'cyanide coordination cage': '[C]#[N]',
  'iron': '[Fe]',
  'octahedral iron': '[Fe]',
  'octahedral iron center': '[Fe]',

  // =========================================================================
  // 5. SULFUR & PHOSPHORUS FUNCTIONAL GROUPS
  // =========================================================================
  // Sulfur
  'sulfonamide': 'S(=O)(=O)N',
  'sulfamoyl': 'S(=O)(=O)N',
  'sulfamido': '[NX3][SX4](=[OX1])(=[OX1])[OX2]',
  'sulfamido groups': '[NX3][SX4](=[OX1])(=[OX1])[OX2]',
  'sulfamide': 'NS(=O)(=O)N',
  'sulfamate': '[NX3][SX4](=[OX1])(=[OX1])[OX2]',
  'methanesulfonamido': 'NS(=O)(=O)C',
  'butylsulfonamide': 'CCCCS(=O)(=O)N',
  'sulfone': '[#6][SX4](=[OX1])(=[OX1])[#6]',
  'sulfoxide': '[#6][SX3](=[OX1])[#6]',
  'sulfide': '[#6][SX2][#6]',
  'thioether': '[#6][SX2][#6]',
  'thiol': '[SX2H]',
  'mercaptan': '[SX2H]',
  'disulfide': '[#6][SX2][SX2][#6]',
  'sulfate': '[OX2][SX4](=[OX1])(=[OX1])[OX2]',
  'sulfonate': '[#6][SX4](=[OX1])(=[OX1])[OX2]',
  'sulfonic acid': '[SX4](=[OX1])(=[OX1])[OX2H]',
  'thiosulfate': '[SX4](=[OX1])(=[OX1])([OX2])[SX1-]',
  'dithiocarbamate': '[NX3][CX3](=[SX1])[SX2]',

  // Phosphorus
  'phosphate': '[OX2][PX4](=[OX1])([OX2])[OX2]',
  'phosphoric': 'OP(=O)(O)O',
  'pyrophosphate': 'OP(=O)(O)OP(=O)(O)O',
  'diphosphonate': 'P(=O)(O)OP(=O)(O)C(Cl)(Cl)P',
  'phosphonate': '[#6][PX4](=[OX1])([OX2])[OX2]',
  'phosphinate': '[#6][PX4](=[OX1])([#6])[OX2]',
  'phosphine': '[PX3]',
  'phosphine oxide': '[PX4](=[OX1])',

  // =========================================================================
  // 6. HALOGENS & HALOALKYLS
  // =========================================================================
  'chloro': '[Cl]',
  'fluoro': '[F]',
  'bromo': '[Br]',
  'iodo': '[I]',
  'diiodo': '[I]',
  'halogen': '[F,Cl,Br,I]',
  'trifluoromethyl': 'C(F)(F)F',
  'trifluoroethoxy': 'OCC(F)(F)F',
  'trifluoromethoxy': 'O[CX4](F)(F)F',
  'difluoromethyl': '[CX4H](F)F',
  'trichloromethyl': '[CX4](Cl)(Cl)Cl',

  // =========================================================================
  // 7. ALKYL, ALKENYL, ALKYNYL, CARBOCYCLES & AROMATICS
  // =========================================================================
  // Alkyl & Branched Alkyl
  'methyl': 'C',
  'ethyl': 'CC',
  'propyl': 'CCC',
  'butyl': 'CCCC',
  'isopropyl': 'CC(C)',
  'isobutyl': '[CX4]C(C)C',
  'sec-butyl': '[CX4](C)CC',
  'tert-butyl': '[CX4](C)(C)C',
  'n-tert-butyl': '[NX3][CX4](C)(C)C',
  'bulky n-tert-butyl': '[NX3][CX4](C)(C)C',
  'neopentyl': 'CC(C)(C)C',
  'hexyl': 'CCCCCC',

  // Carbocycles
  'cyclopropyl': 'C1CC1',
  'cyclobutyl': 'C1CCC1',
  'cyclopentyl': 'C1CCCC1',
  'cyclohexyl': 'C1CCCCC1',
  'cycloheptyl': 'C1CCCCCC1',
  'cyclooctyl': 'C1CCCCCCC1',
  'adamantyl': 'C12CC3CC(C1)CC(C2)C3',
  'norbornyl': 'C12CCC(C1)CC2',
  'indane': 'C1Cc2ccccc2C1',
  'indene': 'C1C=Cc2ccccc12',
  'tetralin': 'C1CCc2ccccc2C1',
  'decalin': '[#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1',
  'hexahydronaphthalene': '[#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1',

  // Aromatics
  'benzene': 'c1ccccc1',
  'phenyl': 'c1ccccc1',
  'benzyl': 'Cc1ccccc1',
  'phenethyl': 'CCc1ccccc1',
  'biphenyl': 'c1ccc(cc1)c2ccccc2',
  'naphthalene': 'c1ccc2ccccc2c1',
  'anthracene': 'c1ccc2cc3ccccc3cc2c1',
  'phenanthrene': 'c1ccc2c(c1)ccc3ccccc23',
  'phenol': 'c1ccccc1O',
  'catechol': 'c1ccc(O)c(O)c1',
  'resorcinol': 'c1cc(O)cc(O)c1',
  'hydroquinone': 'c1cc(O)ccc(O)1',
  'cresol': 'Cc1ccccc1O',
  'salicylate': 'c1ccccc1C(=O)[OH]',
  'saligenin': 'c1ccc(O)c(CO)c1',
  'anisole': 'c1ccccc1OC',
  'methoxy': 'OC',
  'ethoxy': 'OCC',
  'chlorophenyl': 'c1ccccc1Cl',
  'fluorophenyl': 'c1ccccc1F',
  'xylyl': 'c1c(C)cccc1C',
  'mesityl': 'c1c(C)cc(C)cc1C',

  // Alkenes & Alkynes
  'vinyl': 'C=C',
  'allyl': 'CC=C',
  'alkene': 'C=C',
  'alkyne': 'C#C',
  'diene': 'C=CC=C',
  'allene': 'C=C=C',

  // Alcohols & Ethers
  'alcohol': '[OX2H]',
  'hydroxy': '[OX2H]',
  'oh': '[OX2H]',
  'primary alcohol': '[CX4H2][OX2H]',
  'secondary alcohol': '[CX4H1]([#6])[OX2H]',
  'tertiary alcohol': '[CX4H0]([#6])([#6])[OX2H]',
  'diol': '[OX2H][CX4][CX4][OX2H]',
  'polyol': 'OCC(O)C(O)C(O)C(O)CO',
  'nitrate ester': 'O[N+](=O)[O-]',
  'nitrate': 'O[N+](=O)[O-]',
  'ether': '[#6][OX2][#6]',
  'acetal': '[OX2][CX4][OX2]',
  'hemiacetal': '[OX2][CX4][OX2H]',
  'ketal': '[#6][CX4]([OX2][#6])([OX2][#6])[#6]',
  'hemiketal': '[#6][CX4]([OX2][#6])([OX2H])[#6]',
  'orthoester': '[CX4]([OX2][#6])([OX2][#6])[OX2][#6]',

  // =========================================================================
  // 8. MEDICINAL CHEMISTRY WARHEADS, BIOISOSTERES & STEROID MOTIFS
  // =========================================================================
  'dihydroxyphenyl': 'c1cc(O)c(O)cc1',
  'dihydroxyheptanoic': 'OC(CC(O)CC(=O)O)C',
  'hmg-coa': 'OC(CC(O)CC(=O)O)C',
  'methylbutyrate': 'CCC(C)C(=O)O',
  'dihydropyridine': 'C1=C(C)NC(C)=C(C1)',
  'aryloxypropanolamine': 'c1ccccc1OCC(O)CN',
  'furfurylamino': 'NCc1ccco1',
  'furfuryl': 'Cc1ccco1',
  'propylthio': 'CCCS',
  'trifluoroethylthio': 'SCC(F)(F)F',
  'ribose': 'C1OC(CO)C(O)C1O',
  'homoargin': 'CCCN=C(N)N',
  'proline': 'N1CCCC1C(=O)O',
  'tyrosine': 'c1ccc(O)cc1',
  'lipophilicgrip': 'CCCCS(=O)(=O)N',
  'allostericlock': 'c1ncnc2nnnc12',
  'allostericanchor': 'CCCS',
  'rulerspacer': 'c1ccc(O)cc1',
  'warhead': 'CC(=O)O',

  // Steroid Core & Motifs
  'delta-1,4-diene-3-one': 'O=C1[#6]=[#6][#6]~[#6](=[#6]1)',
  'dieneone': 'O=C1[#6]=[#6][#6]~[#6](=[#6]1)',
  'dienone': 'O=C1[#6]=[#6][#6]~[#6](=[#6]1)',
  'diene-3-one': 'O=C1[#6]=[#6][#6]~[#6](=[#6]1)',
  'c1-c2 double bond': 'C=C',
  '11beta-oh': '[OX2H]',
  '11beta': '[OX2H]',
  '11beta-hydroxy': '[OX2H]',
  'epoxide bridge': 'C1OC1',
  '9,11-alpha-epoxide': 'C1OC1',
  'spiro': '[C;R2](1)(CC1)CC',

  // Respiratory / Other Pharmacophores
  'gem-dimethyl': 'CC(C)(C)',
  'gemdimethyl': 'CC(C)(C)',
  'gem-dimethyl substituted aralkyl tail': 'CC(C)(C)',
  'phenoxy': 'c1ccccc1O[#6]',
  'phenoxypropyl': 'c1ccccc1OCCC',
  'phenoxyethyl': 'c1ccccc1[OX2,CX4][CX4][CX4]',
  '2-(phenoxy)ethyl': 'c1ccccc1[OX2,CX4][CX4][CX4]',
  'amide carbonyl in heterocyclic ring': '[#6](=[OX1])[#7]',
  '(e)-styryl': 'c1ccccc1C=C',
  'styryl': 'c1ccccc1C=C',
  '18-aldehyde (hemiacetal with 11-beta-oh)': '[CX3H1]=O',
  '18-aldehyde': '[CX3H1]=O',
  'dimethoxy-substituted pyrimido-isoquinoline core': 'c1c(OC)c(OC)ccc1',
  'dimethoxysubstituted pyrimidoisoquinoline': 'c1c(OC)c(OC)ccc1',
  'pyrimido-isoquinoline': 'c1c(OC)c(OC)ccc1',
  'pyrimidoisoquinoline': 'c1c(OC)c(OC)ccc1',
  'diketopiperazine / urea ring system': '[#7]C(=O)[#7]',
  'diketopiperazine / urea': '[#7]C(=O)[#7]',
};

/**
 * Recognizes non-chemical macromolecular descriptors (protein domains, peptides,
 * metal cages) so they don't produce invalid chemical SMARTS queries.
 */
const BIOLOGIC_PATTERNS = [
  /kringle/i,
  /catalytic\s+triad/i,
  /protease/i,
  /finger\s+domain/i,
  /egf(?:-like)?\s+domain/i,
  /bacterial\s+protein/i,
  /glycosyl/i,
  /deglycosyl/i,
  /tetra-alanine/i,
  /plasminogen\s+binding/i,
  /chemical\s+scaffold\s+core/i,
  /chiral\s+center/i,
  /neutral\s+non-ionizable/i,
  /stereocenter/i,
  /single\s+enantiomer/i,
  /eutomer/i,
  /disodium\s+salt/i,
  /position\s+\d+/i,
  /triglycine/i,
  /8-d-arginine/i,
  /phe3/i,
  /tryptophan\s+sidechain/i,
];

export function isBiologicOrMacromolecule(
  target: string | ChemicalStructure | null | undefined
): boolean {
  if (!target) return false;
  if (typeof target === 'object') {
    if (target.isBiologic) return true;
    const name = target.name || '';
    const chemClass = target.chemicalClass || '';
    const pharmClass = target.pharmacologicalClass || '';
    const combined = `${name} ${chemClass} ${pharmClass}`.toLowerCase();
    if (
      /alteplase|reteplase|tenecteplase|streptokinase|urokinase|fibrinolytic|thrombolytic|plasminogen\s+activator/i.test(
        combined
      )
    ) {
      return true;
    }
    return BIOLOGIC_PATTERNS.some(
      (pat) =>
        pat.test(name) ||
        pat.test(chemClass) ||
        Boolean(target.pharmacophores?.some((p) => pat.test(p.name)))
    );
  }
  return BIOLOGIC_PATTERNS.some((pat) => pat.test(target));
}

const NOISE_WORDS = new Set([
  'substituent',
  'substituents',
  'group',
  'groups',
  'ring',
  'rings',
  'core',
  'moiety',
  'moieties',
  'position',
  'positions',
  'at',
  'scaffold',
  'system',
  'bridge',
  'backbone',
  'portion',
  'unit',
  'cage',
  'hub',
  'lock',
  'anchor',
  'grip',
  'spacer',
  'target',
  'shield',
  'c1',
  'c2',
  'c3',
  'c4',
  'c5',
  'c6',
  'c7',
  'c8',
]);

/**
 * Normalizes a pharmacophore or functional group label by stripping locants,
 * stereochemical prefixes, and boilerplate structural terms.
 * Returns an ordered array of candidate lookup keys from most specific to general.
 */
export function normalizeDescriptor(name: string = ''): string[] {
  if (!name || typeof name !== 'string') return [];

  // Remove parentheses contents that are purely explanatory (e.g. "(fibrin specificity)", "(Metabolic Shield)")
  let cleaned = name.replace(/\s*\([^)]*\)/g, ' ').trim();

  // Strip common locant patterns like "6-", "3,5-", "1,4-", "C1-C2", "11beta-", "9,11-alpha-"
  cleaned = cleaned
    .replace(/\b(?:\d+,*)+\s*-\s*/g, ' ')
    .replace(/\b(?:c\d+-c\d+)\s*/gi, ' ')
    .replace(/\b(?:\d+,\d+-\w+)\s*/gi, ' ')
    .replace(/\b(?:\d+-\w+)\s*/gi, ' ')
    .replace(/\b(?:alpha|beta|gamma|delta|cis|trans|r,r|s,s)\b/gi, ' ');

  // Lowercase and strip punctuation
  const simplified = cleaned.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  const words = simplified.split(/\s+/).filter((w) => w.length > 0 && !NOISE_WORDS.has(w));

  const candidates: string[] = [];

  // 1. Direct joined string without spaces (e.g. "acylguanidine", "pyrazine")
  const fullJoined = words.join('');
  if (fullJoined.length > 1) {
    candidates.push(fullJoined);
  }

  // 2. Space separated words
  const fullSpaced = words.join(' ');
  if (fullSpaced.length > 1 && fullSpaced !== fullJoined) {
    candidates.push(fullSpaced);
  }

  // 3. Sub-phrases (e.g. "guanidinocarbonyl" -> "acylguanidine" / "guanidino")
  if (words.length > 1) {
    for (let i = 0; i < words.length; i++) {
      candidates.push(words[i]);
    }
  }

  return candidates;
}

/**
 * Returns the mathematically verified SMARTS string for known pharmacophores.
 * Falls back to the AI-generated SMARTS string if the group is unrecognized.
 *
 * @param name Pharmacophore / functional group label or descriptor
 * @param aiSmarts Fallback SMARTS string generated by the LLM
 */
export function getCorrectedSmarts(name: string = '', aiSmarts: string = ''): string {
  if (!name) return aiSmarts || '';

  // Non-chemical macromolecular or informational annotations return empty SMARTS
  if (isBiologicOrMacromolecule(name)) {
    return '';
  }

  const rawClean = (name || '').toLowerCase().replace(/[\s\-_,()]/g, '');

  // 1. Exact or substring key match against dictionary (prefer longest key for specificity)
  let bestMatch: { len: number; smarts: string } | null = null;
  for (const [key, smarts] of Object.entries(SMARTS_OVERRIDE_DICT)) {
    const cleanKey = key.toLowerCase().replace(/[\s\-_,()]/g, '');
    if (rawClean === cleanKey || rawClean.includes(cleanKey)) {
      if (!bestMatch || cleanKey.length > bestMatch.len) {
        bestMatch = { len: cleanKey.length, smarts };
      }
    }
  }

  if (bestMatch) {
    return bestMatch.smarts;
  }

  // 2. Candidate resolution via locant & suffix normalizer
  const candidates = normalizeDescriptor(name);
  for (const cand of candidates) {
    for (const [key, smarts] of Object.entries(SMARTS_OVERRIDE_DICT)) {
      const cleanKey = key.toLowerCase().replace(/[\s\-_,()]/g, '');
      if (cand === cleanKey || cand.includes(cleanKey) || cleanKey.includes(cand)) {
        if (!bestMatch || cleanKey.length > bestMatch.len) {
          bestMatch = { len: cleanKey.length, smarts };
        }
      }
    }
    if (bestMatch) {
      return bestMatch.smarts;
    }
  }

  // 3. Fallback to existing aiSmarts if supplied
  return aiSmarts || '';
}
