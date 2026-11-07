import type {
  ReviewModule,
  ReviewPage,
  ChemicalStructure,
} from '../types/reviewModule';

// =============================================================================
// LANDMARK CHEMICAL STRUCTURES FOR RENAL DRUGS REVIEW (Exam 1)
// Audited with PubChem PUG REST identifiers, canonical SMILES, MW, LogP & SAR
// =============================================================================

export const AMILORIDE_STRUCTURE: ChemicalStructure = {
  id: 'amiloride',
  document_label: 'Structure I (Amiloride)',
  name: 'Amiloride',
  tradeName: 'Midamor',
  smiles: 'NC(=O)C1=NC(Cl)=C(N)N=C1N=C(N)N',
  canonical_smiles: 'NC(=O)C1=NC(Cl)=C(N)N=C1N=C(N)N',
  canonicalSmiles: 'NC(=O)C1=NC(Cl)=C(N)N=C1N=C(N)N',
  cid: 2162,
  mw: 229.63,
  logP: -0.4,
  chemicalClass: 'Pyrazinopyrimidine derivative',
  pharmacologicalClass: 'Potassium-Sparing Diuretic (ENaC Blocker)',
  target: 'Epithelial Sodium Channel (ENaC)',
  target_receptor: 'Late Distal Tubule & Cortical Collecting Duct Luminal ENaC Pore',
  reversibility: 'Reversible Channel Blocker',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: [
    'Pyrazine ring',
    'Guanidinocarbonyl moiety',
    'Primary amino substituents (C3, C5)',
    '6-Chloro electron-withdrawing group',
  ],
  pkPdHighlights: {
    onset: '2 hours',
    duration: '24 hours',
    halfLife: '6-9 hours',
    elimination: 'Renal unchanged (~50%) and fecal (~40%)',
    bioactivation: 'Active parent drug (no hepatic metabolism)',
  },
  sarNotes:
    'Pyrazine ring with an acylguanidino side chain. The strongly basic guanidino group (pKa 8.7) is protonated (positively charged) at physiological pH, electrostatically mimicking hydrated Na+ to plug the selectivity filter of the luminal ENaC channel. Lacks sulfonamide (no sulfa cross-reactivity).',
  moa_summary:
    'Directly blocks luminal ENaC channels in principal cells of late distal tubules and cortical collecting ducts, preventing Na+ influx, dissipating the lumen-negative transepithelial potential, and halting secondary K+ and H+ secretion.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/2162/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/2162',
};

export const FUROSEMIDE_STRUCTURE: ChemicalStructure = {
  id: 'furosemide',
  document_label: 'Structure II (Furosemide)',
  name: 'Furosemide',
  tradeName: 'Lasix',
  smiles: 'NS(=O)(=O)C1=CC(=C(C=C1Cl)NCC2=CC=CO2)C(=O)O',
  canonical_smiles: 'NS(=O)(=O)C1=CC(=C(C=C1Cl)NCC2=CC=CO2)C(=O)O',
  canonicalSmiles: 'NS(=O)(=O)C1=CC(=C(C=C1Cl)NCC2=CC=CO2)C(=O)O',
  cid: 3440,
  mw: 330.74,
  logP: 2.0,
  chemicalClass: 'Sulfamoyl anthranilic acid',
  pharmacologicalClass: 'Loop Diuretic (High-Ceiling NKCC2 Inhibitor)',
  target: 'Na+/K+/2Cl- Symporter (NKCC2)',
  target_receptor: 'Thick Ascending Limb of Henle (TAL Luminal NKCC2 Cl- Site)',
  reversibility: 'Reversible Competitive',
  drug_state: 'Active drug',
  route: 'Oral / IV',
  keyFunctionalGroups: [
    'Carboxylic acid at C1 (pKa ~3.9)',
    'Furfurylamino substituent at C2',
    'Chloro substituent at C4',
    'Unsubstituted sulfonamide at C5',
  ],
  pkPdHighlights: {
    onset: '30-60 min (oral), 5 min (IV)',
    duration: '6-8 hours ("Lasix" = lasts six hours)',
    halfLife: '1.5-2 hours',
    elimination: 'Active tubular secretion via OAT1/OAT3; 65% excreted unchanged in urine',
    bioactivation: 'Active parent drug',
  },
  sarNotes:
    'Sulfamoyl anthranilic acid scaffold. The free carboxyl group at C1 imparts high acidity (pKa ~3.9), which is essential for active organic anion transporter (OAT) uptake into the tubular lumen. The C2 furfurylamino group confers lipophilicity and NKCC2 affinity. The unsubstituted C5 sulfonamide group carries cross-reactivity risk in sulfa-allergic patients.',
  moa_summary:
    'Inhibits luminal NKCC2 cotransporter in the thick ascending limb of Henle by competing for chloride binding sites, blocking reabsorption of 20-25% of filtered sodium load and abolishing the corticomedullary osmotic gradient.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/3440/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/3440',
};

export const HYDROCHLOROTHIAZIDE_STRUCTURE: ChemicalStructure = {
  id: 'hydrochlorothiazide',
  document_label: 'Structure III (Hydrochlorothiazide)',
  name: 'Hydrochlorothiazide',
  tradeName: 'Microzide',
  smiles: 'NS(=O)(=O)C1=CC2=C(NCNS2(=O)=O)C=C1Cl',
  canonical_smiles: 'NS(=O)(=O)C1=CC2=C(NCNS2(=O)=O)C=C1Cl',
  canonicalSmiles: 'NS(=O)(=O)C1=CC2=C(NCNS2(=O)=O)C=C1Cl',
  cid: 3639,
  mw: 297.74,
  logP: -0.1,
  chemicalClass: 'Benzothiadiazine-dioxide (3,4-Dihydrobenzothiadiazine 1,1-dioxide)',
  pharmacologicalClass: 'Thiazide Diuretic (NCC Symporter Inhibitor)',
  target: 'Na+/Cl- Symporter (NCC)',
  target_receptor: 'Early Distal Convoluted Tubule (DCT Luminal NCC Cl- Site)',
  reversibility: 'Reversible Competitive',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: [
    '3,4-Dihydrobenzothiadiazine 1,1-dioxide core',
    'Unsubstituted C7 sulfonamide',
    '6-Chloro electron-withdrawing group',
    'Secondary amine at N2 and N4',
  ],
  pkPdHighlights: {
    onset: '1-2 hours',
    duration: '6-12 hours',
    halfLife: '6-15 hours',
    elimination: 'Renal excretion unchanged (>95%)',
    bioactivation: 'Active parent drug',
  },
  sarNotes:
    'Saturation of the 3,4-double bond in chlorothiazide produces 3,4-dihydrochlorothiazide (HCTZ), boosting diuretic potency 10-fold. The C7 unsubstituted sulfonamide is strictly required for NCC binding and carries sulfa allergy risk. Acidic pKa values of 7.9 and 9.2 (sulfonamide & heterocyclic NH). Long-term antihypertensive efficacy is mediated by reduction of peripheral vascular resistance.',
  moa_summary:
    'Competitively inhibits chloride binding to the luminal NCC cotransporter in the early distal convoluted tubule, blocking reabsorption of 5-8% of filtered sodium and secondarily reducing vascular resistance.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/3639/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/3639',
};

export const ACETAZOLAMIDE_STRUCTURE: ChemicalStructure = {
  id: 'acetazolamide',
  document_label: 'Structure IV (Acetazolamide)',
  name: 'Acetazolamide',
  tradeName: 'Diamox',
  smiles: 'CC(=O)NC1=NN=C(S1)S(=O)(=O)N',
  canonical_smiles: 'CC(=O)NC1=NN=C(S1)S(=O)(=O)N',
  canonicalSmiles: 'CC(=O)NC1=NN=C(S1)S(=O)(=O)N',
  cid: 1986,
  mw: 222.25,
  logP: -0.26,
  chemicalClass: 'Thiadiazole sulfonamide (1,3,4-Thiadiazole-2-sulfonamide)',
  pharmacologicalClass: 'Carbonic Anhydrase Inhibitor (CAI)',
  target: 'Carbonic Anhydrase (CA-II Cytosolic & CA-IV Luminal)',
  target_receptor: 'Proximal Convoluted Tubule & Ocular Ciliary Body CA Active Site Zn2+',
  reversibility: 'Reversible Non-Covalent Enzyme Inhibitor',
  drug_state: 'Active drug',
  route: 'Oral / IV',
  keyFunctionalGroups: [
    'Unsubstituted sulfonamide (-SO2NH2)',
    '1,3,4-Thiadiazole heterocyclic ring',
    '2-Acetamido substituent',
  ],
  pkPdHighlights: {
    onset: '1-1.5 hours',
    duration: '8-12 hours',
    halfLife: '2-6 hours',
    elimination: 'Renal excretion unchanged (>90%) via tubular secretion',
    bioactivation: 'Active parent drug',
  },
  sarNotes:
    '1,3,4-Thiadiazole ring provides weak acidity (pKa ~7.2) for optimal sulfonamide nitrogen ionization. The ionized sulfonamide nitrogen (-SO2NH-) coordinates directly to the catalytic Zn2+ ion in carbonic anhydrase, mimicking bicarbonate/water. Any N-substitution abolishes CA inhibition. Contains unsubstituted sulfonamide (sulfa hypersensitivity risk). Pure enzyme inhibitor; lowest diuretic efficacy because distal segments compensate for proximal inhibition.',
  moa_summary:
    'Reversibly inhibits carbonic anhydrase (CA-II and CA-IV) in proximal tubular cells, impairing H+ secretion and HCO3- reabsorption. Also inhibits CA in the ocular ciliary process, reducing aqueous humor secretion and lowering intraocular pressure in glaucoma.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/1986/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/1986',
};

export const MANNITOL_STRUCTURE: ChemicalStructure = {
  id: 'mannitol',
  document_label: 'Structure V (Mannitol)',
  name: 'Mannitol',
  tradeName: 'Osmitrol',
  smiles: 'OC[C@@H](O)[C@@H](O)[C@H](O)[C@H](O)CO',
  canonical_smiles: 'OC[C@@H](O)[C@@H](O)[C@H](O)[C@H](O)CO',
  canonicalSmiles: 'OC[C@@H](O)[C@@H](O)[C@H](O)[C@H](O)CO',
  cid: 6251,
  mw: 182.17,
  logP: -3.1,
  chemicalClass: 'Aliphatic polyalcohol (Sugar alcohol)',
  pharmacologicalClass: 'Osmotic Diuretic',
  target: 'Physicochemical Osmotic Gradient (No receptor or transporter target)',
  target_receptor: 'Tubular Lumen Osmotic Fluid Pressure',
  reversibility: 'Non-receptor mediated',
  drug_state: 'Active substance',
  route: 'IV Infusion only',
  keyFunctionalGroups: [
    'Six aliphatic secondary/primary hydroxyl groups',
    'Linear 6-carbon polyol backbone',
    'Neutral non-ionizable skeleton',
  ],
  pkPdHighlights: {
    onset: '15-30 min',
    duration: '3-8 hours',
    halfLife: '1-2 hours',
    elimination: 'Freely filtered at glomerulus with zero tubular reabsorption',
    bioactivation: 'Not metabolized',
  },
  sarNotes:
    'Hexahydric polyalcohol (D-mannitol) with 6 hydrophilic hydroxyl groups (logP -3.1). Neutral molecule with no ionizable groups. Lacks sulfonamide (no sulfa cross-reactivity). Critical PK requirement: freely filtered at the glomerulus, undergoes NO tubular reabsorption, and is not metabolized, retaining water in the proximal tubule and descending limb of Henle by pure osmotic force.',
  moa_summary:
    'Elevates intraluminal tubular fluid osmolality, hindering passive water reabsorption primarily in the proximal tubule and descending thin limb of Henle. Also extracts water from intracellular cranial tissue into circulation to reduce intracranial pressure (ICP).',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/6251/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6251',
};

export const ISOSORBIDE_STRUCTURE: ChemicalStructure = {
  id: 'isosorbide',
  document_label: 'Isosorbide (Osmotic Polyol)',
  name: 'Isosorbide',
  tradeName: 'Ismotic',
  smiles: 'O[C@H]1CO[C@@H]2[C@@H]1OC[C@@H]2O',
  canonical_smiles: 'O[C@H]1CO[C@@H]2[C@@H]1OC[C@@H]2O',
  canonicalSmiles: 'O[C@H]1CO[C@@H]2[C@@H]1OC[C@@H]2O',
  cid: 12597,
  mw: 146.14,
  logP: -1.4,
  chemicalClass: 'Bicyclic dianhydrohexitol (1,4:3,6-Dianhydro-D-glucitol)',
  pharmacologicalClass: 'Osmotic Diuretic / Ophthalmic Osmotic Agent',
  target: 'Physicochemical Osmotic Pressure',
  target_receptor: 'Tubular lumen & plasma osmotic compartment',
  reversibility: 'Non-receptor mediated',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: [
    'Two fused tetrahydrofuran rings',
    'Two secondary hydroxyl groups (endo and exo)',
    'Bicyclic diether backbone',
  ],
  pkPdHighlights: {
    onset: '30 min',
    duration: '5-6 hours',
    halfLife: '7-8 hours',
    elimination: 'Freely filtered at glomerulus with negligible tubular reabsorption',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Bicyclic ether polyol derived by dual dehydration of D-glucitol. Unlike mannitol, it has sufficient gastrointestinal absorption for oral administration to rapidly reduce intraocular pressure (IOP) in acute angle-closure glaucoma or before ocular surgery via systemic osmotic dehydration.',
  moa_summary:
    'Establishes a trans-luminal and trans-ocular osmotic pressure gradient, drawing fluid from the eye into the vascular bed and inhibiting renal tubular water reabsorption.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/12597/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/12597',
};

export const TOLVAPTAN_STRUCTURE: ChemicalStructure = {
  id: 'tolvaptan',
  document_label: 'Structure III (Tolvaptan) - V2 Antagonist',
  name: 'Tolvaptan',
  tradeName: 'Samsca / Jynarque',
  smiles: 'CC1=CC=C(C=C1C(=O)NC2=CC=C(C=C2)C(=O)N3CCC(CC3)O)NC(=O)C4=CC=CC=C4Cl',
  canonical_smiles: 'CC1=CC=C(C=C1C(=O)NC2=CC=C(C=C2)C(=O)N3CCC(CC3)O)NC(=O)C4=CC=CC=C4Cl',
  canonicalSmiles: 'CC1=CC=C(C=C1C(=O)NC2=CC=C(C=C2)C(=O)N3CCC(CC3)O)NC(=O)C4=CC=CC=C4Cl',
  cid: 216239,
  mw: 448.94,
  logP: 3.4,
  chemicalClass: 'Benzamide-benzazepine derivative (Non-peptide small molecule)',
  pharmacologicalClass: 'Selective V2 Vasopressin Receptor Antagonist (Aquaretic)',
  target: 'Vasopressin V2 Receptor (Gs-coupled GPCR)',
  target_receptor: 'Basolateral membrane of principal cells in renal collecting ducts',
  reversibility: 'Reversible Competitive Antagonist',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: [
    'Benzazepine core ring',
    '7-Chloro-2-methylbenzamide moiety',
    'Chiral secondary alcohol',
    'Aromatic amide linkages',
  ],
  pkPdHighlights: {
    onset: '2-4 hours',
    duration: '24 hours',
    halfLife: '12 hours',
    elimination: 'Extensive hepatic CYP3A4 metabolism; <1% excreted unchanged in urine',
    bioactivation: 'Active parent drug',
  },
  sarNotes:
    'Non-peptide V2 antagonist ("vaptan"). The 7-chloro-2-methylbenzamide and hydroxy-benzazepine scaffold imparts >29-fold selectivity for renal V2 over vascular V1a receptors. Acts as an "aquaretic" promoting pure electrolyte-free water excretion without kaliuresis or natriuresis.',
  moa_summary:
    'Competitively blocks arginine vasopressin (AVP) from binding basolateral V2 receptors in collecting ducts, blocking adenylyl cyclase activation, preventing intracellular cAMP rise, and preventing aquaporin-2 channel exocytosis.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/216239/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/216239',
};

export const VASOPRESSIN_STRUCTURE: ChemicalStructure = {
  id: 'vasopressin',
  document_label: 'Vasopressin (AVP / Antidiuretic Hormone)',
  name: 'Arginine Vasopressin (AVP)',
  tradeName: 'Pitressin / Vasostrict',
  smiles: 'C[C@H](N)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](Cc2ccccc2)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CC(=O)N)C(=O)N[C@H]3CSSC[C@H](NC(=O)[C@H](CC(=O)N)NC3=O)C(=O)N4CCC[C@H]4C(=O)N[C@@H](CCCNC(=N)N)C(=O)NCC(=O)N',
  canonical_smiles: 'C[C@H](N)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](Cc2ccccc2)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CC(=O)N)C(=O)N[C@H]3CSSC[C@H](NC(=O)[C@H](CC(=O)N)NC3=O)C(=O)N4CCC[C@H]4C(=O)N[C@@H](CCCNC(=N)N)C(=O)NCC(=O)N',
  canonicalSmiles: 'C[C@H](N)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](Cc2ccccc2)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CC(=O)N)C(=O)N[C@H]3CSSC[C@H](NC(=O)[C@H](CC(=O)N)NC3=O)C(=O)N4CCC[C@H]4C(=O)N[C@@H](CCCNC(=N)N)C(=O)NCC(=O)N',
  cid: 50293,
  mw: 1084.23,
  logP: -3.5,
  chemicalClass: 'Nonapeptide neurohypophyseal hormone',
  pharmacologicalClass: 'Endogenous Antidiuretic Hormone (Non-Diuretic / V1a/V2 Agonist)',
  target: 'Vasopressin Receptors (V1a, V1b, V2)',
  target_receptor: 'V1a (Vascular Gq) & V2 (Collecting Duct Gs)',
  reversibility: 'Reversible GPCR Agonist',
  drug_state: 'Active endogenous peptide',
  route: 'IV / Subcutaneous / IM',
  keyFunctionalGroups: [
    'Intramolecular disulfide bridge (Cys1-Cys6)',
    'Position 8 L-Arginine (basic)',
    'Position 1 intact N-terminal primary amine',
    'Position 3 Phenylalanine',
  ],
  pkPdHighlights: {
    onset: 'Immediate IV',
    duration: '30-60 min',
    halfLife: '10-20 minutes',
    elimination: 'Rapid cleavage by tissue and serum aminopeptidases and vasopressinases',
    bioactivation: 'Active as secreted',
  },
  sarNotes:
    'Sequence: Cys-Tyr-Phe-Gln-Asn-Cys-Pro-L-Arg-Gly-NH2 with Cys1-Cys6 disulfide cyclic loop. Non-selectively stimulates both vascular V1a receptors (causing potent vasoconstriction and blood pressure elevation) and renal V2 receptors (causing antidiuresis). Intact N-terminal Cys1 amine is rapidly digested by aminopeptidases, explaining its very short half-life.',
  moa_summary:
    'Endogenous hormone that causes water retention (NOT diuresis!). Binds basolateral V2 receptors in collecting duct principal cells, triggering cAMP-mediated insertion of aquaporin-2 water channels, concentrating urine.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/50293/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/50293',
};

export const DESMOPRESSIN_STRUCTURE: ChemicalStructure = {
  id: 'desmopressin',
  document_label: 'Desmopressin (DDAVP)',
  name: 'Desmopressin (DDAVP)',
  tradeName: 'DDAVP / Nocdurna',
  smiles: 'O=C1N[C@@H](Cc2ccc(O)cc2)C(=O)N[C@@H](Cc3ccccc3)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CC(=O)N)C(=O)N[C@H]4CSSCC(=O)N[C@H](C(=O)N5CCC[C@H]5C(=O)N[C@H](C(=O)NCC(=O)N)CCCNC(=N)N)CSSC4',
  canonical_smiles: 'O=C1N[C@@H](Cc2ccc(O)cc2)C(=O)N[C@@H](Cc3ccccc3)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CC(=O)N)C(=O)N[C@H]4CSSCC(=O)N[C@H](C(=O)N5CCC[C@H]5C(=O)N[C@H](C(=O)NCC(=O)N)CCCNC(=N)N)CSSC4',
  canonicalSmiles: 'O=C1N[C@@H](Cc2ccc(O)cc2)C(=O)N[C@@H](Cc3ccccc3)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CC(=O)N)C(=O)N[C@H]4CSSCC(=O)N[C@H](C(=O)N5CCC[C@H]5C(=O)N[C@H](C(=O)NCC(=O)N)CCCNC(=N)N)CSSC4',
  cid: 279,
  mw: 1069.22,
  logP: -3.8,
  chemicalClass: 'Synthetic modified nonapeptide (1-Deamino-8-D-arginine vasopressin)',
  pharmacologicalClass: 'Selective V2 Receptor Agonist / Antidiuretic Agent',
  target: 'Vasopressin V2 Receptor (Gs)',
  target_receptor: 'Collecting Duct Basolateral V2 Receptor',
  reversibility: 'Reversible GPCR Agonist',
  drug_state: 'Active drug',
  route: 'Nasal spray / Oral / Sublingual / Subcutaneous / IV',
  keyFunctionalGroups: [
    '1-Deamino modification (eliminates N-terminal NH2)',
    '8-D-Arginine (inversion from L to D stereocenter)',
    'Cys1-Cys6 disulfide ring',
    'Phe3 aromatic ring',
  ],
  pkPdHighlights: {
    onset: '15-30 min',
    duration: '6-14 hours',
    halfLife: '1.5-2.5 hours',
    elimination: 'Resistant to N-terminal aminopeptidases; renal clearance',
    bioactivation: 'Active parent peptide',
  },
  sarNotes:
    'Two critical SAR modifications: (1) 1-Deamination at position 1 eliminates the N-terminal amino group, conferring high resistance against aminopeptidases and extending half-life from 15 min to 2 hours. (2) Substitution of L-Arg with D-Arg at position 8 dramatically eliminates V1a pressor/vasoconstrictor activity while preserving potent V2 antidiuretic affinity (>2000:1 V2:V1 selectivity ratio).',
  moa_summary:
    'Selectively activates renal V2 receptors to promote aquaporin-2 water channel insertion, treating central diabetes insipidus, nocturnal enuresis, and stimulating endothelial von Willebrand factor release in hemophilia A and von Willebrand disease.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/279/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/279',
};

export const OXYTOCIN_STRUCTURE: ChemicalStructure = {
  id: 'oxytocin',
  document_label: 'Oxytocin (Pitocin)',
  name: 'Oxytocin',
  tradeName: 'Pitocin',
  smiles: 'CC[C@H](C)[C@H]1C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@@H](CSSC[C@@H](C(=O)N[C@H](C(=O)N1)CC2=CC=C(C=C2)O)N)C(=O)N3CCC[C@H]3C(=O)N[C@@H](CC(C)C)C(=O)NCC(=O)N)CC(=O)N)CCC(=O)N',
  canonical_smiles: 'CC[C@H](C)[C@H]1C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@@H](CSSC[C@@H](C(=O)N[C@H](C(=O)N1)CC2=CC=C(C=C2)O)N)C(=O)N3CCC[C@H]3C(=O)N[C@@H](CC(C)C)C(=O)NCC(=O)N)CC(=O)N)CCC(=O)N',
  canonicalSmiles: 'CC[C@H](C)[C@H]1C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@@H](CSSC[C@@H](C(=O)N[C@H](C(=O)N1)CC2=CC=C(C=C2)O)N)C(=O)N3CCC[C@H]3C(=O)N[C@@H](CC(C)C)C(=O)NCC(=O)N)CC(=O)N)CCC(=O)N',
  cid: 439302,
  mw: 1007.19,
  logP: -2.6,
  chemicalClass: 'Neurohypophyseal nonapeptide hormone',
  pharmacologicalClass: 'Uterotonic / Oxytocic Agent',
  target: 'Oxytocin Receptor (Gq-coupled GPCR)',
  target_receptor: 'Uterine myometrium and mammary myoepithelial cells',
  reversibility: 'Reversible GPCR Agonist',
  drug_state: 'Active drug',
  route: 'IV Infusion / IM',
  keyFunctionalGroups: [
    'Position 3 Isoleucine (aliphatic)',
    'Position 8 Leucine (neutral aliphatic)',
    'Disulfide bridge (Cys1-Cys6)',
    'Position 2 Tyrosine',
  ],
  pkPdHighlights: {
    onset: 'Immediate IV',
    duration: '1 hour',
    halfLife: '3-5 minutes',
    elimination: 'Hepatic and renal oxytocinase degradation',
    bioactivation: 'Active peptide',
  },
  sarNotes:
    'Sequence: Cys-Tyr-Ile-Gln-Asn-Cys-Pro-Leu-Gly-NH2. Differs from vasopressin at position 3 (Isoleucine instead of Phenylalanine) and position 8 (Leucine instead of Arginine). The replacement of basic Arg8 with neutral lipophilic Leu8 drastically reduces V2 antidiuretic affinity, redirecting selectivity toward uterine and mammary oxytocin receptors for labor induction and milk ejection.',
  moa_summary:
    'Selectively stimulates Gq-coupled oxytocin receptors on uterine smooth muscle, mobilizing intracellular calcium to stimulate rhythmic uterine contractions and postpartum hemostasis.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/439302/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/439302',
};

// =============================================================================
// REVIEW PAGES DEFINITION (3 SLIDES MATCHING DR. AL-HORANI'S REVIEW DECK)
// =============================================================================

export function getRenalReviewPages(): ReviewPage[] {
  return [
    // =========================================================================
    // PAGE 1: Core Diuretics Classification & Pharmacology (Slide 1)
    // Questions 1 - 14
    // =========================================================================
    {
      pageNumber: 1,
      pageTitle: 'Review for Renal Drugs — Slide 1 (Core Diuretic Classes & Pharmacology)',
      title: 'Core Diuretics Classification & Pharmacology',
      subtitle:
        'Structures I–V (Amiloride, Furosemide, Hydrochlorothiazide, Acetazolamide, Mannitol): Chemical Classes, Acid/Base, Mechanisms, Sites of Action, Sulfa Allergy & Osmotic PK',
      sections: [
        {
          id: 'renal_p1_s1',
          sectionTitle: 'Slide 1: Diuretic Structures I – V & Mechanistic Matrix',
          headerNote:
            'Consider the chemical structures of Diuretics I – V (Amiloride, Furosemide, Hydrochlorothiazide, Acetazolamide, Mannitol) to evaluate chemical class, acid/base character, transporter targets, and clinical pharmacology:',
          structures: [
            AMILORIDE_STRUCTURE,
            FUROSEMIDE_STRUCTURE,
            HYDROCHLOROTHIAZIDE_STRUCTURE,
            ACETAZOLAMIDE_STRUCTURE,
            MANNITOL_STRUCTURE,
          ],
          questions: [
            // Q1: Matching chemical classes
            {
              id: 1,
              type: 'matching',
              title: 'Chemical Class Matching (Structures I – V)',
              prompt:
                'What is the chemical class of each of the above diuretics (Structures I – V)?',
              options: [
                'Pyrazinopyrimidine derivative (Amiloride - Drug I)',
                'Sulfamoyl anthranilic acid (Furosemide - Drug II)',
                'Benzothiadiazine-dioxide (Hydrochlorothiazide - Drug III)',
                'Thiadiazole sulfonamide (Acetazolamide - Drug IV)',
                'Aliphatic polyalcohol (Mannitol - Drug V)',
              ],
              correctAnswer:
                'I: Pyrazinopyrimidine derivative; II: Sulfamoyl anthranilic acid; III: Benzothiadiazine-dioxide; IV: Thiadiazole sulfonamide; V: Aliphatic polyalcohol',
              explanation:
                'Drug I (Amiloride) is a pyrazinopyrimidine derivative with an acylguanidino side chain. Drug II (Furosemide) is a sulfamoyl anthranilic acid (5-sulfamoyl-2-aminobenzoic acid congener). Drug III (Hydrochlorothiazide) is a benzothiadiazine 1,1-dioxide. Drug IV (Acetazolamide) is a heterocyclic 1,3,4-thiadiazole-2-sulfonamide. Drug V (Mannitol) is a 6-carbon hexahydric aliphatic polyalcohol (sugar alcohol).',
              matchingTargets: [
                {
                  id: 'target-chem-amiloride',
                  label: 'Pyrazinopyrimidine derivative',
                  acceptedStructureIds: ['amiloride', 'I'],
                  rationale:
                    'Structure I (Amiloride): Pyrazine ring with amino and chloro substituents coupled to an acylguanidine side chain.',
                },
                {
                  id: 'target-chem-furosemide',
                  label: 'Sulfamoyl anthranilic acid',
                  acceptedStructureIds: ['furosemide', 'II'],
                  rationale:
                    'Structure II (Furosemide): Anthranilic acid (o-aminobenzoic acid) core bearing a C5 sulfonamide, C4 chloro, and C2 furfurylamino group.',
                },
                {
                  id: 'target-chem-hctz',
                  label: 'Benzothiadiazine-dioxide',
                  acceptedStructureIds: ['hydrochlorothiazide', 'III'],
                  rationale:
                    'Structure III (Hydrochlorothiazide): Bicyclic 3,4-dihydro-1,2,4-benzothiadiazine 1,1-dioxide ring with C7 sulfonamide and C6 chloro.',
                },
                {
                  id: 'target-chem-acetazolamide',
                  label: 'Thiadiazole sulfonamide',
                  acceptedStructureIds: ['acetazolamide', 'IV'],
                  rationale:
                    'Structure IV (Acetazolamide): Heterocyclic 1,3,4-thiadiazole nucleus substituted with a C5 sulfonamide and C2 acetamido group.',
                },
                {
                  id: 'target-chem-mannitol',
                  label: 'Aliphatic polyalcohol',
                  acceptedStructureIds: ['mannitol', 'V'],
                  rationale:
                    'Structure V (Mannitol): Non-aromatic acyclic 6-carbon hexitol carrying six aliphatic hydroxyl groups.',
                },
              ],
              structuresDisplayed: [
                AMILORIDE_STRUCTURE,
                FUROSEMIDE_STRUCTURE,
                HYDROCHLOROTHIAZIDE_STRUCTURE,
                ACETAZOLAMIDE_STRUCTURE,
                MANNITOL_STRUCTURE,
              ],
            },

            // Q2: Acid/base classification
            {
              id: 2,
              type: 'matching',
              title: 'Acid, Base, or Neutral Classification',
              prompt:
                'Classify each of the above drugs (Structures I – V) as acid, base, or neutral based on its ionizable functional groups:',
              options: [
                'Weak base (Amiloride - Drug I)',
                'Strongly acidic carboxylic acid (Furosemide - Drug II)',
                'Weakly acidic sulfonamide / benzothiadiazine (Hydrochlorothiazide - Drug III)',
                'Weakly acidic heterocyclic sulfonamide (Acetazolamide - Drug IV)',
                'Neutral polyol (Mannitol - Drug V)',
              ],
              correctAnswer:
                'I: Weak Base; II: Acid (Carboxylic Acid); III: Weak Acid; IV: Weak Acid; V: Neutral',
              explanation:
                'Structure I (Amiloride) is a WEAK BASE due to its strongly basic acylguanidine group (pKa 8.7), which is protonated/cationic at pH 7.4. Structure II (Furosemide) is an ACID due to its free carboxylic acid (pKa 3.9), supplemented by a secondary sulfonamide (pKa ~10). Structure III (Hydrochlorothiazide) is WEAKLY ACIDIC with pKa values of 7.9 and 9.2 (sulfonamide and heterocyclic NH). Structure IV (Acetazolamide) is WEAKLY ACIDIC (pKa 7.2 due to the electron-withdrawing thiadiazole ring activating the sulfonamide). Structure V (Mannitol) is NEUTRAL because aliphatic alcohol hydroxyls do not ionize at physiological pH.',
              matchingTargets: [
                {
                  id: 'target-acidbase-base',
                  label: 'Weak Base (pKa ~8.7 cationic guanidinium)',
                  acceptedStructureIds: ['amiloride', 'I'],
                  rationale:
                    'Structure I (Amiloride): Acylguanidine moiety has pKa 8.7, existing predominantly in protonated, positively charged form.',
                },
                {
                  id: 'target-acidbase-strong-acid',
                  label: 'Acidic (Carboxylic acid pKa ~3.9)',
                  acceptedStructureIds: ['furosemide', 'II'],
                  rationale:
                    'Structure II (Furosemide): Anthranilic carboxylic acid has pKa 3.9, existing >99.9% as an anion at pH 7.4 for OAT secretion.',
                },
                {
                  id: 'target-acidbase-weak-acid-hctz',
                  label: 'Weakly Acidic Sulfonamide / Benzothiadiazine (pKa 7.9 & 9.2)',
                  acceptedStructureIds: ['hydrochlorothiazide', 'III'],
                  rationale:
                    'Structure III (HCTZ): C7 primary sulfonamide and thiadiazine ring NH act as weak proton donors with pKa 7.9 and 9.2.',
                },
                {
                  id: 'target-acidbase-weak-acid-cai',
                  label: 'Weakly Acidic Heterocyclic Sulfonamide (pKa ~7.2)',
                  acceptedStructureIds: ['acetazolamide', 'IV'],
                  rationale:
                    'Structure IV (Acetazolamide): 1,3,4-Thiadiazole ring withdraws electron density, depressing sulfonamide pKa to 7.2 for Zn2+ coordination.',
                },
                {
                  id: 'target-acidbase-neutral',
                  label: 'Neutral Polyol (Zero ionizable groups at pH 1–14)',
                  acceptedStructureIds: ['mannitol', 'V'],
                  rationale:
                    'Structure V (Mannitol): Aliphatic sugar alcohol with neutral -OH groups that remain completely un-ionized.',
                },
              ],
              subStatements: [
                {
                  id: '2a',
                  text: 'Structure I (Amiloride) is a weak base that carries a net positive charge at physiological pH (7.4) due to its guanidino group (pKa 8.7).',
                  isCorrect: true,
                  explanation:
                    'True: The guanidino group has a pKa of ~8.7, meaning >95% is protonated at physiological pH (7.4), electrostatically mimicking Na+.',
                },
                {
                  id: '2b',
                  text: 'Structure II (Furosemide) is the most acidic drug among Structures I–V because its aromatic carboxylic acid has a pKa of ~3.9.',
                  isCorrect: true,
                  explanation:
                    'True: Furosemide has a carboxylic acid (pKa 3.9), making it by far the strongest acid in this set (>99.9% ionized at pH 7.4).',
                },
                {
                  id: '2c',
                  text: 'Structure V (Mannitol) is an acidic substance because it possesses six hydroxyl groups that readily donate protons in aqueous solution.',
                  isCorrect: false,
                  explanation:
                    'False: Aliphatic alcohols have pKa values >14; mannitol is strictly neutral and carries zero charge in biological fluids.',
                },
              ],
              structuresDisplayed: [
                AMILORIDE_STRUCTURE,
                FUROSEMIDE_STRUCTURE,
                HYDROCHLOROTHIAZIDE_STRUCTURE,
                ACETAZOLAMIDE_STRUCTURE,
                MANNITOL_STRUCTURE,
              ],
            },

            // Q3: Mechanistic class
            {
              id: 3,
              type: 'matching',
              title: 'Pharmacological Mechanistic Class Matching',
              prompt:
                'What is the pharmacological mechanistic class of each of the above diuretics (Structures I – V)?',
              options: [
                'Epithelial sodium channel (ENaC) inhibitor (Amiloride - Drug I)',
                'Na+/K+/2Cl- symporter (NKCC2) inhibitor (Furosemide - Drug II)',
                'Na+/Cl- symporter (NCC) inhibitor (Hydrochlorothiazide - Drug III)',
                'Carbonic anhydrase inhibitor (Acetazolamide - Drug IV)',
                'Osmotic diuretic agent (Mannitol - Drug V)',
              ],
              correctAnswer:
                'I: ENaC inhibitor; II: NKCC2 inhibitor; III: NCC inhibitor; IV: Carbonic anhydrase inhibitor; V: Osmotic diuretic',
              explanation:
                'Drug I (Amiloride) directly blocks luminal ENaC channels in collecting ducts. Drug II (Furosemide) competitively inhibits chloride binding at NKCC2 cotransporters in the thick ascending limb. Drug III (Hydrochlorothiazide) inhibits NCC cotransporters in the distal convoluted tubule. Drug IV (Acetazolamide) reversibly inhibits carbonic anhydrase (CA-II and CA-IV) in proximal tubules. Drug V (Mannitol) establishes a non-absorbable intraluminal osmotic gradient.',
              matchingTargets: [
                {
                  id: 'target-mech-enac',
                  label: 'Epithelial Sodium Channel (ENaC) Blocker / K+-Sparing',
                  acceptedStructureIds: ['amiloride', 'I'],
                  rationale:
                    'Structure I (Amiloride): Plugs the pore of luminal ENaC channels, preventing Na+ entry and sparing potassium.',
                },
                {
                  id: 'target-mech-nkcc2',
                  label: 'Na+/K+/2Cl- Symporter (NKCC2) Inhibitor / High-Ceiling Loop',
                  acceptedStructureIds: ['furosemide', 'II'],
                  rationale:
                    'Structure II (Furosemide): Competes with Cl- at the luminal NKCC2 cotransporter, producing profound high-ceiling diuresis.',
                },
                {
                  id: 'target-mech-ncc',
                  label: 'Na+/Cl- Symporter (NCC) Inhibitor / Thiazide',
                  acceptedStructureIds: ['hydrochlorothiazide', 'III'],
                  rationale:
                    'Structure III (HCTZ): Blocks electroneutral NaCl cotransport across luminal membranes of distal convoluted tubules.',
                },
                {
                  id: 'target-mech-cai',
                  label: 'Carbonic Anhydrase (CA) Inhibitor',
                  acceptedStructureIds: ['acetazolamide', 'IV'],
                  rationale:
                    'Structure IV (Acetazolamide): Reversibly binds active-site Zn2+ in carbonic anhydrase to block H+ secretion and HCO3- reabsorption.',
                },
                {
                  id: 'target-mech-osmotic',
                  label: 'Colligative Osmotic Diuretic Agent',
                  acceptedStructureIds: ['mannitol', 'V'],
                  rationale:
                    'Structure V (Mannitol): Non-reabsorbable solute that holds water in tubular lumens by colligative osmotic pressure.',
                },
              ],
              structuresDisplayed: [
                AMILORIDE_STRUCTURE,
                FUROSEMIDE_STRUCTURE,
                HYDROCHLOROTHIAZIDE_STRUCTURE,
                ACETAZOLAMIDE_STRUCTURE,
                MANNITOL_STRUCTURE,
              ],
            },

            // Q4: Site of action in nephron
            {
              id: 4,
              type: 'matching',
              title: 'Anatomical Site of Action in Nephron',
              prompt:
                'What is the primary anatomical site of action in the nephron for each of the above diuretics (Structures I – V)?',
              options: [
                'Late distal convoluted tubule and cortical collecting duct (Drug I)',
                'Thick ascending limb of Henle (TAL) (Drug II)',
                'Early distal convoluted tubule (DCT) (Drug III)',
                'Proximal convoluted tubule (PCT) (Drug IV)',
                'Proximal convoluted tubule and descending thin limb of Henle (Drug V)',
              ],
              correctAnswer:
                'I: Collecting Duct; II: Thick Ascending Limb; III: Distal Convoluted Tubule; IV: Proximal Convoluted Tubule; V: Proximal Tubule & Loop of Henle',
              explanation:
                'Drug I (Amiloride) acts at principal cells of the late distal tubule and cortical collecting duct (2-3% filtered Na+). Drug II (Furosemide) acts at the thick ascending limb of Henle (20-25% filtered Na+). Drug III (Hydrochlorothiazide) acts at the early distal convoluted tubule (5-8% filtered Na+). Drug IV (Acetazolamide) acts at the proximal convoluted tubule (blocks HCO3- reabsorption). Drug V (Mannitol) acts along water-permeable segments: the proximal tubule and descending thin limb of Henle.',
              matchingTargets: [
                {
                  id: 'target-site-collecting-duct',
                  label: 'Late Distal Tubule & Cortical Collecting Duct (Principal Cells)',
                  acceptedStructureIds: ['amiloride', 'I'],
                  rationale:
                    'Structure I (Amiloride): Luminal ENaC channels are exclusively located in principal cells of late distal tubules and collecting ducts.',
                },
                {
                  id: 'target-site-tal',
                  label: 'Thick Ascending Limb of the Loop of Henle (TAL)',
                  acceptedStructureIds: ['furosemide', 'II'],
                  rationale:
                    'Structure II (Furosemide): NKCC2 cotransporters are uniquely expressed along the luminal border of the medullary and cortical TAL.',
                },
                {
                  id: 'target-site-dct',
                  label: 'Early Distal Convoluted Tubule (DCT)',
                  acceptedStructureIds: ['hydrochlorothiazide', 'III'],
                  rationale:
                    'Structure III (HCTZ): NCC symporters are strictly confined to the apical membrane of early distal convoluted tubule cells.',
                },
                {
                  id: 'target-site-pct',
                  label: 'Proximal Convoluted Tubule (PCT)',
                  acceptedStructureIds: ['acetazolamide', 'IV'],
                  rationale:
                    'Structure IV (Acetazolamide): High concentrations of brush-border CA-IV and cytoplasmic CA-II reside in proximal tubular epithelia.',
                },
                {
                  id: 'target-site-osmotic-loop',
                  label: 'Proximal Tubule & Descending Thin Limb of Henle',
                  acceptedStructureIds: ['mannitol', 'V'],
                  rationale:
                    'Structure V (Mannitol): Osmotic water extraction occurs along aquaporin-1 rich water-permeable segments (PCT and descending limb).',
                },
              ],
              structuresDisplayed: [
                AMILORIDE_STRUCTURE,
                FUROSEMIDE_STRUCTURE,
                HYDROCHLOROTHIAZIDE_STRUCTURE,
                ACETAZOLAMIDE_STRUCTURE,
                MANNITOL_STRUCTURE,
              ],
            },

            // Q5: Fastest and shortest-acting diuretic
            {
              id: 5,
              type: 'sub-statements',
              title: 'Fastest-Acting and Shortest-Acting Diuretic (Acid/Base Correlation)',
              prompt:
                'Which one of the above drugs is the fast-acting and short-acting diuretic? (Hint: Most acidic)',
              questionStem:
                'Evaluate the following propositions regarding diuretic onset, duration, and pharmacokinetic acidity:',
              subStatements: [
                {
                  id: '5a',
                  text: 'Structure II (Furosemide) is the fastest-acting and shortest-acting diuretic among Structures I–V.',
                  isCorrect: true,
                  explanation:
                    'True: Furosemide has an oral onset of 30-60 minutes (IV onset < 5 minutes) and a short duration of ~6 hours, giving rise to its trade name "Lasix" (lasts six hours).',
                },
                {
                  id: '5b',
                  text: 'Its strong acidity (carboxylic acid pKa 3.9) ensures it is ionized at pH 7.4, enabling rapid active secretion into tubular lumens via organic anion transporters (OAT1/OAT3).',
                  isCorrect: true,
                  explanation:
                    'True: The ionized carboxylate is a high-affinity substrate for proximal tubular basolateral OAT1/OAT3 transporters, rapidly concentrating furosemide at its luminal NKCC2 site.',
                },
                {
                  id: '5c',
                  text: 'Structure I (Amiloride) has the fastest onset because its basic guanidino group allows instant passive non-ionic diffusion into tubular cells.',
                  isCorrect: false,
                  explanation:
                    'False: Amiloride has a delayed oral onset of 2 hours and an extended duration of 24 hours due to high tubular accumulation and slow elimination.',
                },
                {
                  id: '5d',
                  text: 'Structure III (Hydrochlorothiazide) has a faster onset and shorter half-life than furosemide.',
                  isCorrect: false,
                  explanation:
                    'False: HCTZ has an onset of 1-2 hours and an elimination half-life of 6-15 hours (much longer than furosemide\'s 1.5-2 hour half-life).',
                },
              ],
            },

            // Q6: Most effective / High-ceiling diuretic
            {
              id: 6,
              type: 'sub-statements',
              title: 'Most Effective / High-Ceiling Diuretic Efficacy',
              prompt:
                'Which of the above drugs is the most effective as a diuretic (highest ceiling of natriuresis)?',
              questionStem:
                'Evaluate the following propositions regarding maximal natriuretic ceiling and nephron handling:',
              subStatements: [
                {
                  id: '6a',
                  text: 'Structure II (Furosemide / Loop Diuretics) is the most effective diuretic because it inhibits reabsorption of up to 20% to 25% of filtered sodium load.',
                  isCorrect: true,
                  explanation:
                    'True: The thick ascending limb reabsorbs ~25% of filtered Na+. Loop diuretics are designated "high-ceiling" because their dose-response curve extends far beyond thiazides.',
                },
                {
                  id: '6b',
                  text: 'Structure III (Hydrochlorothiazide) achieves greater maximal sodium excretion than furosemide because the distal convoluted tubule is downstream of the loop of Henle.',
                  isCorrect: false,
                  explanation:
                    'False: The DCT only reabsorbs 5% to 8% of filtered Na+. Thiazides have a "low ceiling" where increasing dose yields no further natriuresis.',
                },
                {
                  id: '6c',
                  text: 'Loop diuretics retain powerful saluretic efficacy even in patients with severe renal impairment (creatinine clearance / GFR < 30 mL/min).',
                  isCorrect: true,
                  explanation:
                    'True: Loop diuretics remain effective at low GFR where thiazides become ineffective, making furosemide the drug of choice in acute renal failure and severe congestive heart failure.',
                },
                {
                  id: '6d',
                  text: 'Structure I (Amiloride) is a high-ceiling diuretic capable of excreting 30% of filtered sodium.',
                  isCorrect: false,
                  explanation:
                    'False: Amiloride blocks ENaC in the late distal tubule/collecting duct, which only handles 2% to 3% of filtered sodium (low ceiling).',
                },
              ],
            },

            // Q7: Least effective diuretic
            {
              id: 7,
              type: 'sub-statements',
              title: 'Least Effective Diuretic Efficacy & Distal Compensation',
              prompt:
                'Which of the above diuretics is the least effective as a net diuretic?',
              questionStem:
                'Evaluate the following propositions regarding diuretic potency limitations and downstream nephron compensation:',
              subStatements: [
                {
                  id: '7a',
                  text: 'Structure IV (Acetazolamide) is clinically the least effective net diuretic because proximal bicarbonate and sodium rejection is largely compensated downstream.',
                  isCorrect: true,
                  explanation:
                    'True: Although CA inhibition rejects ~20% of HCO3- and Na+ in the PCT, the downstream TAL, DCT, and collecting ducts vigorously reabsorb this excess Na+, resulting in net fractional Na+ excretion of only ~2-5%.',
                },
                {
                  id: '7b',
                  text: 'Continuous administration of acetazolamide causes rapid development of tolerance (self-limiting diuresis within 48–72 hours) as metabolic acidosis depletes filtered bicarbonate.',
                  isCorrect: true,
                  explanation:
                    'True: As systemic metabolic acidosis develops, the concentration of filtered HCO3- drops dramatically, leaving CA inhibitors with insufficient substrate to sustain diuresis.',
                },
                {
                  id: '7c',
                  text: 'Structure I (Amiloride) also has very low single-agent efficacy (2-3% fractional excretion) because collecting ducts reabsorb only a minor fraction of filtered sodium.',
                  isCorrect: true,
                  explanation:
                    'True: ENaC blockers are weak single-agent diuretics (2-3% fractional Na+ excretion); they are used primarily for their potassium-sparing action in combination regimens.',
                },
                {
                  id: '7d',
                  text: 'Structure II (Furosemide) is the least effective diuretic because of extensive hepatic first-pass metabolism.',
                  isCorrect: false,
                  explanation:
                    'False: Furosemide is the most effective (high-ceiling) diuretic; its primary route is active tubular excretion, not hepatic breakdown.',
                },
              ],
            },

            // Q8: Antihypertensive therapy
            {
              id: 8,
              type: 'sub-statements',
              title: 'Antihypertensive Diuretic Therapy (Thiazides vs Loops)',
              prompt:
                'Which of the above diuretics is(are) generally used as primary antihypertensive agent(s)?',
              questionStem:
                'Evaluate the following propositions regarding clinical antihypertensive pharmacology:',
              subStatements: [
                {
                  id: '8a',
                  text: 'Structure III (Hydrochlorothiazide / Thiazide diuretics) is the standard first-line diuretic class recommended for long-term management of essential hypertension.',
                  isCorrect: true,
                  explanation:
                    'True: Thiazides (and thiazide-like diuretics such as chlorthalidone) are first-line antihypertensives supported by major clinical guidelines (JNC 8, ACC/AHA).',
                },
                {
                  id: '8b',
                  text: 'The sustained, long-term blood pressure lowering effect of thiazides is mediated by a persistent reduction in total peripheral vascular resistance (PVR), rather than continuous volume depletion.',
                  isCorrect: true,
                  explanation:
                    'True: Plasma volume normalizes after 4-6 weeks of thiazide therapy; sustained BP reduction is driven by direct vasodilation and reduced vascular sensitivity to vasoconstrictors.',
                },
                {
                  id: '8c',
                  text: 'Loop diuretics (Furosemide) are preferred over thiazides for uncomplicated primary hypertension because their short half-life prevents nocturia.',
                  isCorrect: false,
                  explanation:
                    'False: Loop diuretics are NOT preferred for uncomplicated hypertension due to their short half-life and rebound renin-angiotensin activation; they are reserved for hypertension complicated by heart failure or renal failure (GFR < 30).',
                },
                {
                  id: '8d',
                  text: 'Structure I (Amiloride) is frequently co-formulated with Hydrochlorothiazide (e.g., Moduretic) to prevent thiazide-induced hypokalemia and metabolic alkalosis.',
                  isCorrect: true,
                  explanation:
                    'True: Combining ENaC blockers with thiazides offsets potassium wasting (kaliuresis) while providing complementary natriuretic synergy.',
                },
              ],
            },

            // Q9: Glaucoma management
            {
              id: 9,
              type: 'sub-statements',
              title: 'Glaucoma Management & Aqueous Humor Dynamics',
              prompt:
                'Which of the above drugs is commonly used to treat glaucoma?',
              questionStem:
                'Evaluate the following propositions regarding carbonic anhydrase inhibition and ocular pharmacology:',
              subStatements: [
                {
                  id: '9a',
                  text: 'Structure IV (Acetazolamide) is commonly used to treat glaucoma (e.g., acute angle-closure crises and preoperative IOP lowering).',
                  isCorrect: true,
                  explanation:
                    'True: Acetazolamide is a potent oral/parenteral agent used to rapidly lower intraocular pressure (IOP) in acute glaucoma.',
                },
                {
                  id: '9b',
                  text: 'Its antiglaucoma mechanism involves inhibition of carbonic anhydrase II in the ciliary processes of the eye, decreasing bicarbonate and fluid secretion into the posterior chamber.',
                  isCorrect: true,
                  explanation:
                    'True: Aqueous humor formation requires active HCO3- secretion by ciliary epithelium; CA-II inhibition reduces aqueous humor secretion by 50-60%.',
                },
                {
                  id: '9c',
                  text: 'Structure I (Amiloride) lowers intraocular pressure by blocking sodium channels in corneal endothelial cells.',
                  isCorrect: false,
                  explanation:
                    'False: Amiloride has no clinical role in glaucoma management; ocular fluid dynamics depend on carbonic anhydrase and trabecular outflow, not renal ENaC.',
                },
                {
                  id: '9d',
                  text: 'Topical ophthalmic carbonic anhydrase inhibitors (e.g., dorzolamide, brinzolamide) were developed to target ocular CA-II without causing systemic metabolic acidosis.',
                  isCorrect: true,
                  explanation:
                    'True: Topical CAIs achieve high ocular bioavailability with minimal systemic drug exposure, eliminating systemic side effects like metabolic acidosis and paresthesias.',
                },
              ],
            },

            // Q10: Pure enzyme inhibition mechanism
            {
              id: 10,
              type: 'sub-statements',
              title: 'Pure Enzyme Inhibition Mechanism of Action',
              prompt:
                'Which of the above drugs only possess an enzyme inhibition mechanism of action?',
              questionStem:
                'Evaluate the following propositions regarding enzyme vs transporter/channel mechanisms among diuretics:',
              subStatements: [
                {
                  id: '10a',
                  text: 'Structure IV (Acetazolamide) is the only drug among Structures I–V whose sole pharmacodynamic mechanism is direct enzyme inhibition.',
                  isCorrect: true,
                  explanation:
                    'True: Acetazolamide acts solely as a reversible inhibitor of the enzyme Carbonic Anhydrase (CA-II and CA-IV).',
                },
                {
                  id: '10b',
                  text: 'Acetazolamide binds the catalytic site of carbonic anhydrase by coordinating its deprotonated sulfonamide nitrogen (-SO2NH-) directly to the essential Zn2+ metalloenzyme cofactor.',
                  isCorrect: true,
                  explanation:
                    'True: The ionized sulfonamide nitrogen mimics the transition state of water/bicarbonate, forming a strong coordinate covalent bond with active-site Zn2+.',
                },
                {
                  id: '10c',
                  text: 'Structure II (Furosemide) acts as a suicide enzyme inhibitor of the basolateral Na+/K+-ATPase pump.',
                  isCorrect: false,
                  explanation:
                    'False: Furosemide does NOT inhibit Na+/K+-ATPase; it is a competitive inhibitor of the apical NKCC2 symporter (transporter).',
                },
                {
                  id: '10d',
                  text: 'Structures I, II, and III inhibit membrane transport proteins (channels and symporters), while Structure V acts purely through colligative physical osmosis.',
                  isCorrect: true,
                  explanation:
                    'True: Amiloride = ENaC ion channel; Furosemide = NKCC2 symporter; HCTZ = NCC symporter; Mannitol = physical osmotic gradient.',
                },
              ],
            },

            // Q11: Sulfa hypersensitivity risk
            {
              id: 11,
              type: 'sub-statements',
              title: 'Sulfonamide Cross-Reactivity & Sulfa Allergy Risk',
              prompt:
                'Which of the above drugs is(are) likely to be associated with the risk of sulfa hypersensitivity?',
              questionStem:
                'Evaluate the following propositions regarding primary sulfonamide functional groups and immunological cross-reactivity:',
              subStatements: [
                {
                  id: '11a',
                  text: 'Structure II (Furosemide), Structure III (Hydrochlorothiazide), and Structure IV (Acetazolamide) all contain an unsubstituted aromatic/heterocyclic primary sulfonamide (-SO2NH2) and carry sulfa cross-reactivity warnings.',
                  isCorrect: true,
                  explanation:
                    'True: All three contain an unsubstituted primary sulfonamide (-SO2NH2) moiety that can cross-react in patients with severe sulfonamide hypersensitivity.',
                },
                {
                  id: '11b',
                  text: 'Structure I (Amiloride) contains zero sulfur atoms and poses zero risk of sulfonamide hypersensitivity.',
                  isCorrect: true,
                  explanation:
                    'True: Amiloride is a pyrazinopyrimidine devoid of sulfur; it is completely safe for patients with severe sulfa allergies.',
                },
                {
                  id: '11c',
                  text: 'Structure V (Mannitol) is an aliphatic hexitol containing only carbon, hydrogen, and oxygen, posing zero risk of sulfa cross-reactivity.',
                  isCorrect: true,
                  explanation:
                    'True: Mannitol contains no sulfur or nitrogen, making sulfa cross-reactivity chemically impossible.',
                },
                {
                  id: '11d',
                  text: 'Ethacrynic acid is a loop diuretic that lacks a sulfonamide group, serving as the classic non-sulfa loop alternative for patients with severe anaphylactic sulfa allergies.',
                  isCorrect: true,
                  explanation:
                    'True: Ethacrynic acid is a phenoxyacetic acid derivative without a sulfonamide group, widely tested as the non-sulfa loop diuretic alternative.',
                },
              ],
            },

            // Q12: Osmotic diuretic identification (Slide 1 Bottom Structures I & II)
            {
              id: 12,
              type: 'sub-statements',
              title: 'Osmotic Diuretic Structure Identification (Slide 1 Bottom)',
              prompt:
                'Consider the two chemical structures I and II on Slide 1 bottom. Which of the two structures is an osmotic diuretic?',
              questionStem:
                'Evaluate the following propositions regarding Structure I (Mannitol) vs Structure II (Glucose / Congener):',
              subStatements: [
                {
                  id: '12a',
                  text: 'Structure I (Mannitol) is the osmotic diuretic.',
                  isCorrect: true,
                  explanation:
                    'True: Structure I is D-mannitol, the prototype osmotic diuretic.',
                },
                {
                  id: '12b',
                  text: 'Unlike D-glucose (Structure II), mannitol is not recognized by sodium-glucose luminal cotransporters (SGLT1 / SGLT2) and therefore remains trapped inside the tubular lumen.',
                  isCorrect: true,
                  explanation:
                    'True: Glucose is actively reabsorbed by SGLT2 in the proximal tubule; mannitol lacks recognition by renal glucose transporters and is not reabsorbed.',
                },
                {
                  id: '12c',
                  text: 'Mannitol is an effective systemic diuretic when administered orally.',
                  isCorrect: false,
                  explanation:
                    'False: Mannitol is poorly absorbed from the GI tract; oral ingestion causes water retention in the colon resulting in severe osmotic diarrhea.',
                },
                {
                  id: '12d',
                  text: 'Structure I contains six aliphatic hydroxyl groups on a linear six-carbon skeleton, imparting extreme water solubility (logP ~ -3.1).',
                  isCorrect: true,
                  explanation:
                    'True: Mannitol is a hexahydric polyalcohol with high polarity and water solubility, ideal for intravenous osmotic expansion.',
                },
              ],
            },

            // Q13: Site of action of osmotic diuretics
            {
              id: 13,
              type: 'sub-statements',
              title: 'Nephron Site of Action of Osmotic Diuretics',
              prompt:
                'What is the site of action of osmotic diuretics in the nephron?',
              questionStem:
                'Evaluate the following propositions regarding nephron handling and osmotic diuresis:',
              subStatements: [
                {
                  id: '13a',
                  text: 'The primary sites of action of osmotic diuretics are the proximal convoluted tubule (PCT) and the thin descending limb of the loop of Henle.',
                  isCorrect: true,
                  explanation:
                    'True: These two segments exhibit high baseline water permeability (via aquaporin-1), allowing non-reabsorbed mannitol to exert maximal osmotic counter-pressure against water reabsorption.',
                },
                {
                  id: '13b',
                  text: 'Osmotic diuretics also expand extracellular volume, increasing renal blood flow and washing out the medullary hypertonic osmotic gradient.',
                  isCorrect: true,
                  explanation:
                    'True: Intravenous mannitol expands circulating volume, lowering blood viscosity, increasing renal medullary blood flow, and dissipating the corticomedullary osmolar gradient.',
                },
                {
                  id: '13c',
                  text: 'Osmotic diuretics act primarily by blocking the Na+/Cl- cotransporter in the thick ascending limb.',
                  isCorrect: false,
                  explanation:
                    'False: Osmotic diuretics do NOT interact with NKCC2 or any ion cotransporter; their action is purely physical/osmotic.',
                },
                {
                  id: '13d',
                  text: 'The thick ascending limb is completely impermeable to water, so mannitol cannot prevent water reabsorption in that specific segment.',
                  isCorrect: true,
                  explanation:
                    'True: The TAL is physiologically water-impermeable; osmotic diuretics exert their fluid-retaining effect upstream in the PCT and descending limb.',
                },
              ],
            },

            // Q14: Pharmacokinetic requirement for osmotic diuretics
            {
              id: 14,
              type: 'multiple-choice',
              title: 'Critical Pharmacokinetic Requirement for Osmotic Diuretics',
              prompt:
                'Which of the following pharmacokinetic phenomena is the most important for the action of osmotic diuretics?',
              options: [
                'Rapid and complete oral absorption',
                'Extensive hepatic metabolism',
                'Lack of free glomerular filtration',
                'Renal tubular secretion',
                'Lack of renal tubular reabsorption',
              ],
              correctAnswer: 'e) Lack of renal tubular reabsorption',
              correctIndex: 4,
              optionExplanations: [
                'Incorrect: Osmotic diuretics must be given intravenously; oral administration causes severe osmotic diarrhea without systemic diuresis.',
                'Incorrect: Osmotic diuretics must resist hepatic metabolism so that intact, osmotically active solute reaches the renal filtrate.',
                'Incorrect: Osmotic diuretics must undergo FREE glomerular filtration to reach the tubular lumen.',
                'Incorrect: Osmotic diuretics do not require tubular secretion; they enter the filtrate freely at the glomerulus.',
                'Correct: Lack of renal tubular reabsorption is the essential requirement. If the solute were reabsorbed (like glucose), the intraluminal osmotic gradient would dissipate and water would be reabsorbed with it.',
              ],
              overallExplanation:
                'To function as an osmotic diuretic, a compound must: (1) be freely filtered at the glomerulus, (2) undergo NEGLIGIBLE OR ZERO renal tubular reabsorption, and (3) be pharmacologically inert. Once trapped in the lumen, its colligative presence obligates water retention throughout the nephron.',
              highYieldPearl:
                'Osmotic Diuretic Requirements: Freely filtered + NOT reabsorbed from tubules + pharmacologically inert. Lack of tubular reabsorption is mandatory!',
            },
          ],
        },
      ],
    },

    // =========================================================================
    // PAGE 2: Osmotic Diuretics, Non-Diuretics & Peptide Hormone Vaptans (Slide 2)
    // Questions 15 - 18
    // =========================================================================
    {
      pageNumber: 2,
      pageTitle: 'Review for Renal Drugs — Slide 2 (Osmotics, Non-Diuretics & Peptides)',
      title: 'Osmotic Diuretics, Non-Diuretics & Peptide Hormone Vaptans',
      subtitle:
        'Structures I–IV (Mannitol, Isosorbide, Tolvaptan, Peptides): Osmotic Polyols, Aquaretics, and Vasopressin vs Desmopressin vs Oxytocin SAR',
      sections: [
        {
          id: 'renal_p2_s1',
          sectionTitle: 'Slide 2: Osmotic Diuretics, Aquaretics & Neurohypophyseal Peptides',
          headerNote:
            'Consider chemical structures I–IV on Slide 2 (Mannitol, Isosorbide, Tolvaptan, and Neurohypophyseal Peptides) to evaluate non-diuretic molecules, osmotic polyols, carbonic anhydrase inhibitors, and peptide SAR:',
          structures: [
            MANNITOL_STRUCTURE,
            ISOSORBIDE_STRUCTURE,
            TOLVAPTAN_STRUCTURE,
            VASOPRESSIN_STRUCTURE,
            DESMOPRESSIN_STRUCTURE,
            OXYTOCIN_STRUCTURE,
          ],
          questions: [
            // Q15: Non-diuretic identification
            {
              id: 15,
              type: 'sub-statements',
              title: 'Identification of Non-Diuretic Molecule (Vasopressin vs Diuretics)',
              prompt:
                'Consider the structures on Slide 2. Which of the molecules is NOT a diuretic?',
              questionStem:
                'Evaluate the following propositions regarding diuretic vs antidiuretic molecules:',
              subStatements: [
                {
                  id: '15a',
                  text: 'Vasopressin (Antidiuretic Hormone / AVP) is NOT a diuretic; it is an endogenous hormone that promotes renal water reabsorption and urine concentration.',
                  isCorrect: true,
                  explanation:
                    'True: AVP stimulates basolateral V2 receptors to insert aquaporin-2 water channels into collecting duct membranes, reducing urine output (antidiuresis).',
                },
                {
                  id: '15b',
                  text: 'Tolvaptan is an aquaretic agent that promotes free water excretion by antagonizing collecting duct V2 receptors.',
                  isCorrect: true,
                  explanation:
                    'True: Tolvaptan blocks AVP binding at V2 receptors, preventing aquaporin-2 translocation and inducing pure solute-free water excretion (aquaresis).',
                },
                {
                  id: '15c',
                  text: 'Mannitol and Isosorbide are osmotic diuretics that increase urine volume through colligative intraluminal fluid retention.',
                  isCorrect: true,
                  explanation:
                    'True: Both are polyhydroxy osmotic agents that drive significant water and solute excretion.',
                },
                {
                  id: '15d',
                  text: 'Vasopressin is clinically indicated to induce rapid natriuresis in congestive heart failure.',
                  isCorrect: false,
                  explanation:
                    'False: Vasopressin causes water retention and vasoconstriction; it would dangerously exacerbate volume overload in heart failure.',
                },
              ],
            },

            // Q16: Osmotic diuretic identification
            {
              id: 16,
              type: 'sub-statements',
              title: 'Identification of Osmotic Diuretic Agents (Mannitol & Isosorbide)',
              prompt:
                'Which of the molecules on Slide 2 is(are) osmotic diuretic(s)?',
              questionStem:
                'Evaluate the following propositions regarding osmotic diuretic chemistry and administration:',
              subStatements: [
                {
                  id: '16a',
                  text: 'Both Structure I (Mannitol) and Structure II (Isosorbide) are osmotic diuretic agents.',
                  isCorrect: true,
                  explanation:
                    'True: Mannitol is an acyclic hexitol and Isosorbide is a bicyclic dianhydrohexitol; both function as non-reabsorbable osmotic solutes.',
                },
                {
                  id: '16b',
                  text: 'Isosorbide is orally bioavailable and can be given by mouth to reduce intraocular pressure prior to ophthalmic surgery.',
                  isCorrect: true,
                  explanation:
                    'True: Unlike mannitol, isosorbide is well absorbed orally and produces rapid ocular dehydration without requiring IV infusion.',
                },
                {
                  id: '16c',
                  text: 'Tolvaptan operates via an intraluminal osmotic mechanism rather than receptor-mediated signaling.',
                  isCorrect: false,
                  explanation:
                    'False: Tolvaptan is a high-affinity GPCR small-molecule antagonist of the vasopressin V2 receptor; it does not act osmotically.',
                },
                {
                  id: '16d',
                  text: 'Osmotic diuretics do not require any macromolecular protein target, receptor, or ion pump interaction to exert their diuretic effect.',
                  isCorrect: true,
                  explanation:
                    'True: Osmotic diuresis is a colligative physicochemical property dependent strictly on the number of solute molecules dissolved in the tubular lumen.',
                },
              ],
            },

            // Q17: Carbonic anhydrase inhibitor identification
            {
              id: 17,
              type: 'sub-statements',
              title: 'Carbonic Anhydrase Inhibition-Dependent Diuretics',
              prompt:
                'Which of the molecules is(are) carbonic anhydrase inhibition-dependent diuretic agent(s)?',
              questionStem:
                'Evaluate the following propositions regarding carbonic anhydrase inhibitor specificity and pharmacophores:',
              subStatements: [
                {
                  id: '17a',
                  text: 'Acetazolamide (Structure IV from Slide 1) is the prototypical carbonic anhydrase inhibition-dependent diuretic agent.',
                  isCorrect: true,
                  explanation:
                    'True: Acetazolamide depends entirely on inhibiting carbonic anhydrase in the proximal tubule to produce mild saluresis and urinary alkalinization.',
                },
                {
                  id: '17b',
                  text: 'Osmotic diuretics (Mannitol, Isosorbide) and vaptans (Tolvaptan) have zero inhibitory activity against carbonic anhydrase.',
                  isCorrect: true,
                  explanation:
                    'True: They lack the mandatory unsubstituted primary sulfonamide (-SO2NH2) pharmacophore required to bind active-site Zn2+ in carbonic anhydrase.',
                },
                {
                  id: '17c',
                  text: 'A primary unsubstituted sulfonamide group (-SO2NH2) is strictly required for binding to the catalytic zinc ion in carbonic anhydrase.',
                  isCorrect: true,
                  explanation:
                    'True: Any substitution on the sulfonamide nitrogen (e.g., -SO2NHCH3) completely abolishes carbonic anhydrase inhibitory potency.',
                },
                {
                  id: '17d',
                  text: 'Tolvaptan inhibits renal carbonic anhydrase to block sodium bicarbonate reabsorption.',
                  isCorrect: false,
                  explanation:
                    'False: Tolvaptan is a selective vasopressin V2 receptor antagonist and has no effect on carbonic anhydrase.',
                },
              ],
            },

            // Q18: Compare and contrast 3 peptides
            {
              id: 18,
              type: 'sub-statements',
              title: 'Comparative Peptide Pharmacology: Vasopressin vs Desmopressin vs Oxytocin',
              prompt:
                'Compare and contrast the three neurohypophyseal peptides: Vasopressin (AVP), Desmopressin (DDAVP), and Oxytocin (everything!):',
              questionStem:
                'Evaluate the following comprehensive structure-activity relationship (SAR) and pharmacological propositions comparing the three peptides:',
              subStatements: [
                {
                  id: '18a',
                  text: 'Desmopressin (DDAVP) possesses a 1-deamino modification at position 1 (Cys1) that removes the N-terminal amino group, conferring high resistance against aminopeptidases and dramatically prolonging its elimination half-life relative to native vasopressin.',
                  isCorrect: true,
                  explanation:
                    'True: Deamination at position 1 prevents degradation by ubiquitous circulating and tissue aminopeptidases, extending the half-life from 15 minutes (vasopressin) to 1.5–2.5 hours (desmopressin).',
                },
                {
                  id: '18b',
                  text: 'Inversion of stereochemistry from L-Arginine to D-Arginine at position 8 in desmopressin virtually eliminates vascular V1a pressor/vasoconstrictor activity while preserving potent renal V2 antidiuretic affinity (>2000:1 V2:V1 selectivity).',
                  isCorrect: true,
                  explanation:
                    'True: The 8-D-Arg substitution alters spatial conformation so the peptide can no longer activate V1a receptors on vascular smooth muscle, preventing hypertensive spikes while providing pure antidiuresis.',
                },
                {
                  id: '18c',
                  text: 'Natural arginine vasopressin (AVP) non-selectively stimulates both V1a vascular receptors (causing arteriolar vasoconstriction) and V2 renal collecting duct receptors (causing water reabsorption).',
                  isCorrect: true,
                  explanation:
                    'True: Endogenous AVP acts non-selectively, increasing systemic vascular resistance via V1a (Gq/PLC pathway) and concentrating urine via V2 (Gs/cAMP pathway).',
                },
                {
                  id: '18d',
                  text: 'Oxytocin differs from vasopressin by possessing Isoleucine at position 3 (instead of Phenylalanine) and Leucine at position 8 (instead of Arginine), conferring high uterotonic activity and negligible renal V2 antidiuretic activity.',
                  isCorrect: true,
                  explanation:
                    'True: The Ile3 and Leu8 substitutions eliminate affinity for V2 collecting duct receptors and confer selective binding to Gq-coupled oxytocin receptors on uterine myometrium and mammary myoepithelial cells.',
                },
                {
                  id: '18e',
                  text: 'Natural vasopressin is orally bioavailable because of its internal Cys1–Cys6 disulfide ring.',
                  isCorrect: false,
                  explanation:
                    'False: Natural vasopressin is rapidly destroyed by gastrointestinal endopeptidases and has <0.1% oral bioavailability; it must be administered parenterally.',
                },
                {
                  id: '18f',
                  text: 'Desmopressin is clinically indicated for central diabetes insipidus, nocturnal enuresis, and type 1 von Willebrand disease / mild hemophilia A (by stimulating endothelial Weibel-Palade release of Factor VIII and vWF).',
                  isCorrect: true,
                  explanation:
                    'True: Desmopressin activates extra-renal endothelial V2 receptors, releasing stored von Willebrand factor and Factor VIII into circulation to promote hemostasis.',
                },
              ],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // PAGE 3: Nephron Site of Action Matching & Efficacy Ranking (Slide 3)
    // Question 19
    // =========================================================================
    {
      pageNumber: 3,
      pageTitle: 'Review for Renal Drugs — Slide 3 (Nephron Site Matching & Efficacy Ranking)',
      title: 'Nephron Site of Action Matching & Efficacy Ranking',
      subtitle:
        'Matching Diuretics 1–4 to Nephron Regions a–e (Proximal Tubule, Thick Ascending Limb, Distal Convoluted Tubule, Collecting Duct, Glomerulus) & Maximal Saluretic Ceiling',
      sections: [
        {
          id: 'renal_p3_s1',
          sectionTitle: 'Slide 3: Nephron Site of Action & Relative Diuretic Efficacy',
          headerNote:
            'Match the chemical structures of Diuretics 1–4 to their anatomical site of action in the nephron (Regions a–e) and evaluate which is the most effective and which is the least effective:',
          structures: [
            ACETAZOLAMIDE_STRUCTURE,
            FUROSEMIDE_STRUCTURE,
            HYDROCHLOROTHIAZIDE_STRUCTURE,
            AMILORIDE_STRUCTURE,
            MANNITOL_STRUCTURE,
          ],
          questions: [
            // Q19: Matching Diuretics 1-4 to Regions a-e + Efficacy ranking sub-statements
            {
              id: 19,
              type: 'matching',
              title: 'Nephron Site of Action Matching (Diuretics 1–4 to Regions a–e)',
              prompt:
                'Match the structures of Diuretics 1–4 with their anatomical site of action in the nephron (Regions a–e) and determine their relative diuretic efficacy:',
              options: [
                'Region a: Proximal Convoluted Tubule (PCT) — Carbonic Anhydrase Inhibitors (Acetazolamide / Diuretic 1) & Osmotics',
                'Region b: Thick Ascending Limb of Henle (TAL) — Loop Diuretics (Furosemide / Diuretic 2)',
                'Region c: Early Distal Convoluted Tubule (DCT) — Thiazide Diuretics (Hydrochlorothiazide / Diuretic 3)',
                'Region d: Late Distal Tubule & Cortical Collecting Duct — Potassium-Sparing Diuretics (Amiloride / Diuretic 4)',
                'Region e: Glomerulus & Descending Thin Limb — Osmotic filtration & passive water extraction',
              ],
              correctAnswer:
                'Diuretic 1 (CAI) -> Region a (PCT); Diuretic 2 (Loop) -> Region b (TAL); Diuretic 3 (Thiazide) -> Region c (DCT); Diuretic 4 (K-sparing) -> Region d (Collecting Duct); Osmotics -> Region e',
              explanation:
                'Diuretic 1 (Acetazolamide) acts at Region a (Proximal Convoluted Tubule), inhibiting carbonic anhydrase. Diuretic 2 (Furosemide) acts at Region b (Thick Ascending Limb of Henle), inhibiting the luminal NKCC2 cotransporter. Diuretic 3 (Hydrochlorothiazide) acts at Region c (Early Distal Convoluted Tubule), inhibiting the luminal NCC cotransporter. Diuretic 4 (Amiloride) acts at Region d (Late Distal Tubule & Cortical Collecting Duct), plugging luminal ENaC channels. Region e corresponds to glomerulus and descending thin limb of Henle (site of osmotic filtration and fluid equilibration). Diuretic 2 is the MOST effective (high-ceiling, up to 25% filtered Na+), while Diuretic 4 and Diuretic 1 are the LEAST effective net natriuretic agents (2-3% fractional excretion).',
              matchingTargets: [
                {
                  id: 'target-region-a',
                  label: 'Region a: Proximal Convoluted Tubule (PCT)',
                  acceptedStructureIds: ['acetazolamide', 'diuretic_1', 'I', 'IV', 'mannitol'],
                  rationale:
                    'Region a is the proximal convoluted tubule, where carbonic anhydrase inhibitors (Acetazolamide / Diuretic 1) inhibit CA-II and CA-IV, and osmotic diuretics retain intraluminal fluid.',
                },
                {
                  id: 'target-region-b',
                  label: 'Region b: Thick Ascending Limb of the Loop of Henle (TAL)',
                  acceptedStructureIds: ['furosemide', 'diuretic_2', 'II'],
                  rationale:
                    'Region b is the thick ascending limb of Henle, where loop diuretics (Furosemide / Diuretic 2) block NKCC2 with high-ceiling maximal efficacy (20-25% filtered Na+).',
                },
                {
                  id: 'target-region-c',
                  label: 'Region c: Early Distal Convoluted Tubule (DCT)',
                  acceptedStructureIds: ['hydrochlorothiazide', 'diuretic_3', 'III'],
                  rationale:
                    'Region c is the early distal convoluted tubule, where thiazide diuretics (Hydrochlorothiazide / Diuretic 3) competitively block NCC symporters (5-8% filtered Na+).',
                },
                {
                  id: 'target-region-d',
                  label: 'Region d: Late Distal Tubule & Cortical Collecting Duct',
                  acceptedStructureIds: ['amiloride', 'diuretic_4', 'IV', 'I'],
                  rationale:
                    'Region d is the late distal tubule and cortical collecting duct, where potassium-sparing diuretics (Amiloride / Diuretic 4) plug luminal ENaC channels (2-3% filtered Na+).',
                },
                {
                  id: 'target-region-e',
                  label: 'Region e: Glomerulus & Descending Thin Limb of Henle',
                  acceptedStructureIds: ['mannitol', 'V', 'isosorbide'],
                  rationale:
                    'Region e represents glomerular filtration and the water-permeable descending thin limb of Henle, where non-reabsorbed osmotic diuretics create trans-epithelial osmotic drag.',
                },
              ],
              subStatements: [
                {
                  id: '19a',
                  text: 'Diuretic 2 (Loop Diuretic / Furosemide acting at Region b) is the MOST effective diuretic among all classes, inhibiting the reabsorption of up to 20% to 25% of the total filtered sodium load.',
                  isCorrect: true,
                  explanation:
                    'True: Loop diuretics have the highest ceiling of efficacy because the thick ascending limb reabsorbs roughly a quarter of all filtered NaCl and lacks capacity for downstream compensation.',
                },
                {
                  id: '19b',
                  text: 'Diuretic 4 (ENaC Blocker / Amiloride acting at Region d) is the LEAST effective net natriuretic agent as monotherapy, accounting for only 2% to 3% fractional sodium excretion.',
                  isCorrect: true,
                  explanation:
                    'True: The cortical collecting duct reabsorbs only ~2-3% of filtered sodium. ENaC blockers are used primarily for their potassium-sparing effect, not robust volume depletion.',
                },
                {
                  id: '19c',
                  text: 'Diuretic 1 (CAI / Acetazolamide acting at Region a) is also clinically among the least effective net diuretics because rejected proximal sodium is vigorously reabsorbed downstream in the loop of Henle.',
                  isCorrect: true,
                  explanation:
                    'True: Proximal natriuresis from CA inhibition is offset by massive downstream reabsorption in the thick ascending limb and distal nephron, yielding minimal net saluresis.',
                },
                {
                  id: '19d',
                  text: 'Diuretic 3 (Thiazide / HCTZ acting at Region c) possesses intermediate efficacy, typically inhibiting 5% to 8% of filtered sodium load.',
                  isCorrect: true,
                  explanation:
                    'True: The distal convoluted tubule reabsorbs 5% to 8% of filtered sodium; thiazides exhibit a moderate saluretic ceiling ideal for outpatient blood pressure control.',
                },
                {
                  id: '19e',
                  text: 'Diuretics acting at Region a are the most powerful because 65% of filtered sodium is reabsorbed in the proximal tubule.',
                  isCorrect: false,
                  explanation:
                    'False: Despite high proximal reabsorption, agents acting in Region a (like CAIs) have very low net efficacy because the thick ascending limb and distal nephron readily compensate by absorbing the excess sodium.',
                },
              ],
              structuresDisplayed: [
                ACETAZOLAMIDE_STRUCTURE,
                FUROSEMIDE_STRUCTURE,
                HYDROCHLOROTHIAZIDE_STRUCTURE,
                AMILORIDE_STRUCTURE,
                MANNITOL_STRUCTURE,
              ],
            },
          ],
        },
      ],
    },
  ];
}

// =============================================================================
// DEFAULT MODULE EXPORT
// =============================================================================

export function getDefaultRenalReviewModule(): ReviewModule {
  return {
    id: 'renal_review_mcp2',
    title: 'Review for Renal Drugs',
    subtitle:
      'Diuretic Classes, Nephron Sites of Action, Acid/Base, Sulfa Allergies & Osmotic PK',
    course: 'Medicinal Chemistry (MCP II)',
    semester: 'Fall 2026',
    code: 'Exam 1',
    examId: 'exam_1',
    examTitle: 'Exam 1: Renal & Respiratory Medicinal Chemistry',
    isBuiltIn: true,
    createdAt: '2026-11-06',
    version: '1.0.0',
    chemicalStructures: [
      AMILORIDE_STRUCTURE,
      FUROSEMIDE_STRUCTURE,
      HYDROCHLOROTHIAZIDE_STRUCTURE,
      ACETAZOLAMIDE_STRUCTURE,
      MANNITOL_STRUCTURE,
      ISOSORBIDE_STRUCTURE,
      TOLVAPTAN_STRUCTURE,
      VASOPRESSIN_STRUCTURE,
      DESMOPRESSIN_STRUCTURE,
      OXYTOCIN_STRUCTURE,
    ],
    pages: getRenalReviewPages(),
  };
}
