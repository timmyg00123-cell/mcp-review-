/**
 * Canonical medicinal chemistry drug targets and curated PDB complexes.
 * Provides high-confidence PDB structures for curricular pharmacology and
 * medicinal chemistry drug targets.
 */

export interface TargetPdbMapping {
  targetName: string;
  geneSymbol: string;
  pdbId: string;
  description: string;
  exampleDrugs: string[];
  chemblTargetId?: string;
}

export const CANONICAL_MEDCHEM_TARGETS: TargetPdbMapping[] = [
  {
    targetName: 'P2Y12 platelet receptor',
    geneSymbol: 'P2RY12',
    pdbId: '4NTJ',
    description: 'P2Y12 purinergic receptor involved in platelet aggregation inhibition',
    exampleDrugs: ['Clopidogrel', 'Prasugrel', 'Ticagrelor', 'Cangrelor'],
    chemblTargetId: 'CHEMBL4821',
  },
  {
    targetName: 'Angiotensin-Converting Enzyme',
    geneSymbol: 'ACE',
    pdbId: '1O86',
    description: 'Zinc metallopeptidase converting angiotensin I to angiotensin II',
    exampleDrugs: ['Captopril', 'Enalapril', 'Lisinopril', 'Ramipril'],
    chemblTargetId: 'CHEMBL1824',
  },
  {
    targetName: 'Angiotensin II Type 1 Receptor',
    geneSymbol: 'AGTR1',
    pdbId: '4Z9O',
    description: 'Angiotensin II type 1 G-protein coupled receptor mediating vasoconstriction',
    exampleDrugs: ['Losartan', 'Valsartan', 'Candesartan', 'Irbesartan'],
    chemblTargetId: 'CHEMBL233',
  },
  {
    targetName: 'HMG-CoA Reductase',
    geneSymbol: 'HMGCR',
    pdbId: '1HWK',
    description: 'Rate-limiting enzyme in cholesterol biosynthesis pathway',
    exampleDrugs: ['Atorvastatin', 'Rosuvastatin', 'Simvastatin', 'Pravastatin'],
    chemblTargetId: 'CHEMBL402',
  },
  {
    targetName: 'Beta-1 Adrenergic Receptor',
    geneSymbol: 'ADRB1',
    pdbId: '7JJO',
    description: 'G-protein coupled adrenergic receptor regulating cardiac rate and inotropy',
    exampleDrugs: ['Metoprolol', 'Atenolol', 'Bisoprolol', 'Esmolol'],
    chemblTargetId: 'CHEMBL213',
  },
  {
    targetName: 'Beta-2 Adrenergic Receptor',
    geneSymbol: 'ADRB2',
    pdbId: '2RH1',
    description: 'Adrenergic receptor mediating bronchial smooth muscle relaxation',
    exampleDrugs: ['Albuterol', 'Salmeterol', 'Formoterol'],
    chemblTargetId: 'CHEMBL210',
  },
  {
    targetName: 'Cyclooxygenase-2',
    geneSymbol: 'PTGS2',
    pdbId: '3LN1',
    description: 'Inducible prostaglandin-endoperoxide synthase responsible for inflammatory prostanoids',
    exampleDrugs: ['Celecoxib', 'Meloxicam', 'Diclofenac'],
    chemblTargetId: 'CHEMBL230',
  },
  {
    targetName: 'Cyclooxygenase-1',
    geneSymbol: 'PTGS1',
    pdbId: '1CQE',
    description: 'Constitutive cyclooxygenase producing cytoprotective prostaglandins and thromboxane A2',
    exampleDrugs: ['Aspirin', 'Ibuprofen', 'Naproxen', 'Indomethacin'],
    chemblTargetId: 'CHEMBL221',
  },
  {
    targetName: 'Dihydrofolate Reductase',
    geneSymbol: 'DHFR',
    pdbId: '1U72',
    description: 'Key enzyme in tetrahydrofolate synthesis for purine and thymidylate generation',
    exampleDrugs: ['Methotrexate', 'Trimethoprim'],
    chemblTargetId: 'CHEMBL202',
  },
  {
    targetName: 'EGFR Tyrosine Kinase',
    geneSymbol: 'EGFR',
    pdbId: '1M17',
    description: 'Receptor tyrosine kinase controlling cell proliferation and survival signaling',
    exampleDrugs: ['Erlotinib', 'Gefitinib', 'Osimertinib'],
    chemblTargetId: 'CHEMBL203',
  },
  {
    targetName: 'HIV-1 Protease',
    geneSymbol: 'POL',
    pdbId: '1HXB',
    description: 'Viral aspartyl protease essential for cleavage of HIV gag-pol polyproteins',
    exampleDrugs: ['Ritonavir', 'Saquinavir', 'Darunavir', 'Atazanavir'],
    chemblTargetId: 'CHEMBL243',
  },
  {
    targetName: 'Bacterial Penicillin-Binding Protein',
    geneSymbol: 'PBP',
    pdbId: '1VQQ',
    description: 'Transpeptidase responsible for bacterial peptidoglycan cell wall crosslinking',
    exampleDrugs: ['Amoxicillin', 'Ampicillin', 'Penicillin', 'Ceftriaxone'],
    chemblTargetId: 'CHEMBL4005',
  },
];

/**
 * Finds a canonical curricular drug target matching the given drug name or keyword.
 * Performs case-insensitive matching across example drug names, target names,
 * gene symbols, PDB IDs, and target descriptions.
 */
export function findCanonicalTargetForDrug(drugName: string): TargetPdbMapping | undefined {
  if (!drugName || typeof drugName !== 'string') return undefined;
  const query = drugName.trim().toLowerCase();
  if (!query) return undefined;

  // 1. Check example drug names (exact match or substring match)
  for (const target of CANONICAL_MEDCHEM_TARGETS) {
    for (const drug of target.exampleDrugs) {
      const d = drug.toLowerCase();
      if (query === d || query.includes(d) || d.includes(query)) {
        return target;
      }
    }
  }

  // 2. Check gene symbols, target names, descriptions, or PDB IDs
  for (const target of CANONICAL_MEDCHEM_TARGETS) {
    if (
      target.geneSymbol.toLowerCase() === query ||
      target.pdbId.toLowerCase() === query ||
      target.targetName.toLowerCase().includes(query) ||
      target.description.toLowerCase().includes(query)
    ) {
      return target;
    }
  }

  return undefined;
}
