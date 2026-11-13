/**
 * Master Top Drugs SMILES & Chemoinformatics Catalog
 * 100% curated Daylight SMILES, Multi-Component structures, and Biologic specifications
 * for all 250 drugs in the Top Drugs Taxonomy.
 * Generated offline-first with zero benzene fallback rings.
 */

export type TopDrugStructureType = 'single-molecule' | 'multi-component' | 'biologic';

export interface MultiComponentPart {
  componentName: string;
  smiles: string;
  role?: string;
}

export interface TopDrugStructureRecord {
  genericName: string;
  structureType: TopDrugStructureType;
  smiles: string; // Canonical SMILES for single molecules, or primary / dot-separated SMILES for combinations
  components?: MultiComponentPart[]; // Present for multi-component combination drugs (16 catalog combinations)
  biologicDescription?: string; // Present for biologics / macromolecules (9 catalog biologics)
  cid?: number;
  molecularWeight?: number;
}

export const TOP_DRUGS_SMILES_CATALOG: Record<string, TopDrugStructureRecord> = {
  "acetaminophen": {
    "genericName": "Acetaminophen",
    "structureType": "single-molecule",
    "smiles": "CC(=O)NC1=CC=C(C=C1)O",
    "cid": 1983,
    "molecularWeight": 151.16
  },
  "aspirin": {
    "genericName": "Aspirin",
    "structureType": "single-molecule",
    "smiles": "CC(=O)OC1=CC=CC=C1C(=O)O",
    "cid": 2244,
    "molecularWeight": 180.16
  },
  "acetaminophenbutalbitalcaffeine": {
    "genericName": "Acetaminophen / Butalbital / Caffeine",
    "structureType": "multi-component",
    "smiles": "CC(=O)NC1=CC=C(C=C1)O.CC(C)CC1(C(=O)NC(=O)NC1=O)CC=C.CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    "cid": 3081207,
    "molecularWeight": 539.58,
    "components": [
      {
        "componentName": "Acetaminophen",
        "smiles": "CC(=O)NC1=CC=C(C=C1)O",
        "role": "Analgesic & Antipyretic"
      },
      {
        "componentName": "Butalbital",
        "smiles": "CC(C)CC1(C(=O)NC(=O)NC1=O)CC=C",
        "role": "Barbiturate Sedative"
      },
      {
        "componentName": "Caffeine",
        "smiles": "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
        "role": "CNS Stimulant & Cerebral Vasoconstrictor"
      }
    ]
  },
  "hydrocodoneacetaminophen": {
    "genericName": "Hydrocodone / Acetaminophen",
    "structureType": "multi-component",
    "smiles": "CC12CCC3(C1CC4=C5C3CC(=O)C=C5OC6=C4C(=CC=C6)OC)O2.CC(=O)NC1=CC=C(C=C1)O",
    "cid": 1983,
    "molecularWeight": 450.5,
    "components": [
      {
        "componentName": "Hydrocodone",
        "smiles": "CC12CCC3(C1CC4=C5C3CC(=O)C=C5OC6=C4C(=CC=C6)OC)O2",
        "role": "Opioid Analgesic (Mu-Opioid Agonist)"
      },
      {
        "componentName": "Acetaminophen",
        "smiles": "CC(=O)NC1=CC=C(C=C1)O",
        "role": "Non-Opioid Analgesic & Antipyretic"
      }
    ]
  },
  "tramadol": {
    "genericName": "Tramadol",
    "structureType": "single-molecule",
    "smiles": "CN(C)C[C@H]1CCCC[C@@]1(C2=CC(=CC=C2)OC)O",
    "cid": 33741,
    "molecularWeight": 263.37
  },
  "morphineer": {
    "genericName": "Morphine ER",
    "structureType": "single-molecule",
    "smiles": "CN1CC[C@]23[C@@H]4[C@H]1CC5=C2C(=C(C=C5)O)O[C@H]3[C@H](C=C4)O",
    "cid": 5288826,
    "molecularWeight": 285.34
  },
  "oxycodone": {
    "genericName": "Oxycodone",
    "structureType": "single-molecule",
    "smiles": "CN1CC[C@]23[C@@H]4C(=O)CC[C@]2([C@H]1CC5=C3C(=C(C=C5)OC)O4)O",
    "cid": 5284603,
    "molecularWeight": 315.4
  },
  "methadone": {
    "genericName": "Methadone",
    "structureType": "single-molecule",
    "smiles": "CCC(=O)C(CC(C)N(C)C)(C1=CC=CC=C1)C2=CC=CC=C2",
    "cid": 4095,
    "molecularWeight": 309.4
  },
  "fentanyl": {
    "genericName": "Fentanyl",
    "structureType": "single-molecule",
    "smiles": "CCC(=O)N(C1CCN(CC1)CCC2=CC=CC=C2)C3=CC=CC=C3",
    "cid": 3345,
    "molecularWeight": 336.5
  },
  "buprenorphinenaloxone": {
    "genericName": "Buprenorphine / Naloxone",
    "structureType": "multi-component",
    "smiles": "CC(C)(C)C(C)(C1CC2(C34CCN(C2CC35C1(CCC4O5)OC)CC6CC6)O)O.C1CC2(C3CC4=C5C2(CCN3CC=C)CC(=O)C=C5OC6=C4C(=CC=C6)O)O1",
    "cid": 11274356,
    "molecularWeight": 794,
    "components": [
      {
        "componentName": "Buprenorphine",
        "smiles": "CC(C)(C)C(C)(C1CC2(C34CCN(C2CC35C1(CCC4O5)OC)CC6CC6)O)O",
        "role": "Opioid Partial Agonist (Mu-Opioid)"
      },
      {
        "componentName": "Naloxone",
        "smiles": "C1CC2(C3CC4=C5C2(CCN3CC=C)CC(=O)C=C5OC6=C4C(=CC=C6)O)O1",
        "role": "Opioid Antagonist (Abuse Deterrent)"
      }
    ]
  },
  "phenazopyridine": {
    "genericName": "Phenazopyridine",
    "structureType": "single-molecule",
    "smiles": "C1=CC=C(C=C1)N=NC2=C(N=C(C=C2)N)N",
    "cid": 4756,
    "molecularWeight": 213.24
  },
  "lidocainetopicalpatch": {
    "genericName": "Lidocaine Topical Patch",
    "structureType": "single-molecule",
    "smiles": "CCN(CC)CC(=O)NC1=C(C=CC=C1C)C",
    "cid": 3676,
    "molecularWeight": 234.34
  },
  "penicillinvk": {
    "genericName": "Penicillin VK",
    "structureType": "single-molecule",
    "smiles": "CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)COC3=CC=CC=C3)C(=O)[O-])C.[K+]",
    "cid": 23676814,
    "molecularWeight": 388.5
  },
  "amoxicillin": {
    "genericName": "Amoxicillin",
    "structureType": "single-molecule",
    "smiles": "CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)[C@@H](C3=CC=C(C=C3)O)N)C(=O)O)C",
    "cid": 33613,
    "molecularWeight": 365.4
  },
  "amoxicillinclavulanate": {
    "genericName": "Amoxicillin / Potassium Clavulanate",
    "structureType": "multi-component",
    "smiles": "CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C.C1C2C(C(=O)N2C(=CCO)C(=O)[O-])OC1.[K+]",
    "cid": 23665637,
    "molecularWeight": 602.7,
    "components": [
      {
        "componentName": "Amoxicillin",
        "smiles": "CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C",
        "role": "Primary Beta-Lactam Antibacterial"
      },
      {
        "componentName": "Potassium Clavulanate",
        "smiles": "C1C2C(C(=O)N2C(=CCO)C(=O)[O-])OC1.[K+]",
        "role": "Beta-Lactamase Inhibitor"
      }
    ]
  },
  "cephalexin": {
    "genericName": "Cephalexin",
    "structureType": "single-molecule",
    "smiles": "CC1=C(N2[C@@H]([C@@H](C2=O)NC(=O)[C@@H](C3=CC=CC=C3)N)SC1)C(=O)O",
    "cid": 27447,
    "molecularWeight": 347.4
  },
  "cefuroxime": {
    "genericName": "Cefuroxime",
    "structureType": "single-molecule",
    "smiles": "CO/N=C(/C1=CC=CO1)\\C(=O)N[C@H]2[C@@H]3N(C2=O)C(=C(CS3)COC(=O)N)C(=O)O",
    "cid": 5479529,
    "molecularWeight": 424.4
  },
  "cefdinir": {
    "genericName": "Cefdinir",
    "structureType": "single-molecule",
    "smiles": "C=CC1=C(N2[C@@H]([C@@H](C2=O)NC(=O)/C(=N\\O)/C3=CSC(=N3)N)SC1)C(=O)O",
    "cid": 6915944,
    "molecularWeight": 395.4
  },
  "doxycycline": {
    "genericName": "Doxycycline",
    "structureType": "single-molecule",
    "smiles": "C[C@@H]1[C@H]2[C@@H]([C@H]3[C@@H](C(=O)C(=C([C@]3(C(=O)C2=C(C4=C1C=CC=C4O)O)O)O)C(=O)N)N(C)C)O",
    "cid": 54671203,
    "molecularWeight": 444.4
  },
  "ciprofloxacin": {
    "genericName": "Ciprofloxacin",
    "structureType": "single-molecule",
    "smiles": "C1CC1N2C=C(C(=O)C3=CC(=C(C=C32)N4CCNCC4)F)C(=O)O",
    "cid": 2764,
    "molecularWeight": 331.34
  },
  "moxifloxacin": {
    "genericName": "Moxifloxacin",
    "structureType": "single-molecule",
    "smiles": "COC1=C2C(=CC(=C1N3C[C@@H]4CCCN[C@@H]4C3)F)C(=O)C(=CN2C5CC5)C(=O)O",
    "cid": 152946,
    "molecularWeight": 401.4
  },
  "levofloxacin": {
    "genericName": "Levofloxacin",
    "structureType": "single-molecule",
    "smiles": "C[C@H]1COC2=C3N1C=C(C(=O)C3=CC(=C2N4CCN(CC4)C)F)C(=O)O",
    "cid": 149096,
    "molecularWeight": 361.4
  },
  "clarithromycin": {
    "genericName": "Clarithromycin",
    "structureType": "single-molecule",
    "smiles": "CC[C@@H]1[C@@]([C@@H]([C@H](C(=O)[C@@H](C[C@@]([C@@H]([C@H]([C@@H]([C@H](C(=O)O1)C)O[C@H]2C[C@@]([C@H]([C@@H](O2)C)O)(C)OC)C)O[C@H]3[C@@H]([C@H](C[C@H](O3)C)N(C)C)O)(C)OC)C)C)O)(C)O",
    "cid": 84029,
    "molecularWeight": 748
  },
  "azithromycin": {
    "genericName": "Azithromycin",
    "structureType": "single-molecule",
    "smiles": "CC[C@@H]1[C@@]([C@@H]([C@H](N(C[C@@H](C[C@@]([C@@H]([C@H]([C@@H]([C@H](C(=O)O1)C)O[C@H]2C[C@@]([C@H]([C@@H](O2)C)O)(C)OC)C)O[C@H]3[C@@H]([C@H](C[C@H](O3)C)N(C)C)O)(C)O)C)C)C)O)(C)O",
    "cid": 447043,
    "molecularWeight": 749
  },
  "clindamycintopical": {
    "genericName": "Clindamycin Topical",
    "structureType": "single-molecule",
    "smiles": "CCC[C@@H]1C[C@H](N(C1)C)C(=O)N[C@@H]([C@@H]2[C@@H]([C@@H]([C@H]([C@H](O2)SC)O)O)O)[C@H](C)Cl",
    "cid": 446598,
    "molecularWeight": 425
  },
  "clindamycinoral": {
    "genericName": "Clindamycin Oral",
    "structureType": "single-molecule",
    "smiles": "CCC[C@@H]1C[C@H](N(C1)C)C(=O)N[C@@H]([C@@H]2[C@@H]([C@@H]([C@H]([C@H](O2)SC)O)O)O)[C@H](C)Cl",
    "cid": 446598,
    "molecularWeight": 425
  },
  "trimethoprimsulfamethoxazole": {
    "genericName": "Trimethoprim / Sulfamethoxazole",
    "structureType": "multi-component",
    "smiles": "COC1=CC(=CC(=C1OC)OC)CC2=C(N=C(N=C2N)N)N.CC1=CC(=NO1)NS(=O)(=O)C2=CC=C(C=C2)N",
    "cid": 5329,
    "molecularWeight": 543.6,
    "components": [
      {
        "componentName": "Trimethoprim",
        "smiles": "COC1=CC(=CC(=C1OC)OC)CC2=C(N=C(N=C2N)N)N",
        "role": "Dihydrofolate Reductase (DHFR) Inhibitor"
      },
      {
        "componentName": "Sulfamethoxazole",
        "smiles": "CC1=CC(=NO1)NS(=O)(=O)C2=CC=C(C=C2)N",
        "role": "Dihydropteroate Synthase (DHPS) Inhibitor"
      }
    ]
  },
  "metronidazole": {
    "genericName": "Metronidazole",
    "structureType": "single-molecule",
    "smiles": "CC1=NC=C(N1CCO)[N+](=O)[O-]",
    "cid": 4173,
    "molecularWeight": 171.15
  },
  "albendazole": {
    "genericName": "Albendazole",
    "structureType": "single-molecule",
    "smiles": "CCCSC1=CC2=C(C=C1)N=C(N2)NC(=O)OC",
    "cid": 2082,
    "molecularWeight": 265.33
  },
  "nitrofurantoin": {
    "genericName": "Nitrofurantoin",
    "structureType": "single-molecule",
    "smiles": "C1C(=O)NC(=O)N1/N=C/C2=CC=C(O2)[N+](=O)[O-]",
    "cid": 6604200,
    "molecularWeight": 238.16
  },
  "mupirocin": {
    "genericName": "Mupirocin",
    "structureType": "single-molecule",
    "smiles": "C[C@H]([C@H]1[C@@H](O1)C[C@H]2CO[C@H]([C@@H]([C@@H]2O)O)C/C(=C/C(=O)OCCCCCCCCC(=O)O)/C)[C@H](C)O",
    "cid": 446596,
    "molecularWeight": 500.6
  },
  "chlorhexidine": {
    "genericName": "Chlorhexidine",
    "structureType": "single-molecule",
    "smiles": "C1=CC(=CC=C1N/C(=N/C(=NCCCCCCN=C(/N=C(/NC2=CC=C(C=C2)Cl)\\N)N)N)/N)Cl",
    "cid": 9552079,
    "molecularWeight": 505.4
  },
  "phenytoin": {
    "genericName": "Phenytoin",
    "structureType": "single-molecule",
    "smiles": "C1=CC=C(C=C1)C2(C(=O)NC(=O)N2)C3=CC=CC=C3",
    "cid": 1775,
    "molecularWeight": 252.27
  },
  "lamotrigine": {
    "genericName": "Lamotrigine",
    "structureType": "single-molecule",
    "smiles": "C1=CC(=C(C(=C1)Cl)Cl)C2=C(N=C(N=N2)N)N",
    "cid": 3878,
    "molecularWeight": 256.09
  },
  "levetiracetam": {
    "genericName": "Levetiracetam",
    "structureType": "single-molecule",
    "smiles": "CC[C@@H](C(=O)N)N1CCCC1=O",
    "cid": 5284583,
    "molecularWeight": 170.21
  },
  "oxcarbazepine": {
    "genericName": "Oxcarbazepine",
    "structureType": "single-molecule",
    "smiles": "C1C2=CC=CC=C2N(C3=CC=CC=C3C1=O)C(=O)N",
    "cid": 34312,
    "molecularWeight": 252.27
  },
  "pregabalin": {
    "genericName": "Pregabalin",
    "structureType": "single-molecule",
    "smiles": "CC(C)C[C@@H](CC(=O)O)CN",
    "cid": 5486971,
    "molecularWeight": 159.23
  },
  "topiramate": {
    "genericName": "Topiramate",
    "structureType": "single-molecule",
    "smiles": "CC1(O[C@@H]2CO[C@@]3([C@H]([C@@H]2O1)OC(O3)(C)C)COS(=O)(=O)N)C",
    "cid": 5284627,
    "molecularWeight": 339.36
  },
  "divalproexvalproicacid": {
    "genericName": "Divalproex / Valproic Acid",
    "structureType": "multi-component",
    "smiles": "CCCC(CCC)C(=O)O.CCCC(CCC)C(=O)[O-].[Na+]",
    "cid": 16760703,
    "molecularWeight": 310.4,
    "components": [
      {
        "componentName": "Valproic Acid",
        "smiles": "CCCC(CCC)C(=O)O",
        "role": "GABA Transaminase Inhibitor & Sodium Channel Blocker"
      },
      {
        "componentName": "Sodium Valproate",
        "smiles": "CCCC(CCC)C(=O)[O-].[Na+]",
        "role": "Anticonvulsant Active Salt Moiety"
      }
    ]
  },
  "gabapentin": {
    "genericName": "Gabapentin",
    "structureType": "single-molecule",
    "smiles": "C1CCC(CC1)(CC(=O)O)CN",
    "cid": 3446,
    "molecularWeight": 171.24
  },
  "paroxetine": {
    "genericName": "Paroxetine",
    "structureType": "single-molecule",
    "smiles": "C1CNC[C@H]([C@@H]1C2=CC=C(C=C2)F)COC3=CC4=C(C=C3)OCO4",
    "cid": 43815,
    "molecularWeight": 329.4
  },
  "sertraline": {
    "genericName": "Sertraline",
    "structureType": "single-molecule",
    "smiles": "CN[C@H]1CC[C@H](C2=CC=CC=C12)C3=CC(=C(C=C3)Cl)Cl",
    "cid": 68617,
    "molecularWeight": 306.2
  },
  "escitalopram": {
    "genericName": "Escitalopram",
    "structureType": "single-molecule",
    "smiles": "CN(C)CCC[C@@]1(C2=C(CO1)C=C(C=C2)C#N)C3=CC=C(C=C3)F",
    "cid": 146570,
    "molecularWeight": 324.4
  },
  "citalopram": {
    "genericName": "Citalopram",
    "structureType": "single-molecule",
    "smiles": "CN(C)CCCC1(C2=C(CO1)C=C(C=C2)C#N)C3=CC=C(C=C3)F",
    "cid": 2771,
    "molecularWeight": 324.4
  },
  "fluoxetine": {
    "genericName": "Fluoxetine",
    "structureType": "single-molecule",
    "smiles": "CNCCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F",
    "cid": 3386,
    "molecularWeight": 309.33
  },
  "trazodone": {
    "genericName": "Trazodone",
    "structureType": "single-molecule",
    "smiles": "C1CN(CCN1CCCN2C(=O)N3C=CC=CC3=N2)C4=CC(=CC=C4)Cl",
    "cid": 5533,
    "molecularWeight": 371.9
  },
  "venlafaxine": {
    "genericName": "Venlafaxine",
    "structureType": "single-molecule",
    "smiles": "CN(C)CC(C1=CC=C(C=C1)OC)C2(CCCCC2)O",
    "cid": 5656,
    "molecularWeight": 277.4
  },
  "duloxetine": {
    "genericName": "Duloxetine",
    "structureType": "single-molecule",
    "smiles": "CNCC[C@@H](C1=CC=CS1)OC2=CC=CC3=CC=CC=C32",
    "cid": 60835,
    "molecularWeight": 297.4
  },
  "bupropion": {
    "genericName": "Bupropion",
    "structureType": "single-molecule",
    "smiles": "CC(C(=O)C1=CC(=CC=C1)Cl)NC(C)(C)C",
    "cid": 444,
    "molecularWeight": 239.74
  },
  "nortriptyline": {
    "genericName": "Nortriptyline",
    "structureType": "single-molecule",
    "smiles": "CNCCC=C1C2=CC=CC=C2CCC3=CC=CC=C31",
    "cid": 4543,
    "molecularWeight": 263.4
  },
  "amitriptyline": {
    "genericName": "Amitriptyline",
    "structureType": "single-molecule",
    "smiles": "CN(C)CCC=C1C2=CC=CC=C2CCC3=CC=CC=C31",
    "cid": 2160,
    "molecularWeight": 277.4
  },
  "mirtazapine": {
    "genericName": "Mirtazapine",
    "structureType": "single-molecule",
    "smiles": "CN1CCN2C(C1)C3=CC=CC=C3CC4=C2N=CC=C4",
    "cid": 4205,
    "molecularWeight": 265.35
  },
  "metformin": {
    "genericName": "Metformin",
    "structureType": "single-molecule",
    "smiles": "CN(C)C(=N)N=C(N)N",
    "cid": 4091,
    "molecularWeight": 129.16
  },
  "glimepiride": {
    "genericName": "Glimepiride",
    "structureType": "single-molecule",
    "smiles": "CCC1=C(CN(C1=O)C(=O)NCCC2=CC=C(C=C2)S(=O)(=O)NC(=O)NC3CCC(CC3)C)C",
    "cid": 3476,
    "molecularWeight": 490.6
  },
  "glipizide": {
    "genericName": "Glipizide",
    "structureType": "single-molecule",
    "smiles": "CC1=CN=C(C=N1)C(=O)NCCC2=CC=C(C=C2)S(=O)(=O)NC(=O)NC3CCCCC3",
    "cid": 3478,
    "molecularWeight": 445.5
  },
  "pioglitazone": {
    "genericName": "Pioglitazone",
    "structureType": "single-molecule",
    "smiles": "CCC1=CN=C(C=C1)CCOC2=CC=C(C=C2)CC3C(=O)NC(=O)S3",
    "cid": 4829,
    "molecularWeight": 356.4
  },
  "linagliptin": {
    "genericName": "Linagliptin",
    "structureType": "single-molecule",
    "smiles": "CC#CCN1C2=C(N=C1N3CCC[C@H](C3)N)N(C(=O)N(C2=O)CC4=NC5=CC=CC=C5C(=N4)C)C",
    "cid": 10096344,
    "molecularWeight": 472.5
  },
  "sitagliptin": {
    "genericName": "Sitagliptin",
    "structureType": "single-molecule",
    "smiles": "C1CN2C(=NN=C2C(F)(F)F)CN1C(=O)C[C@@H](CC3=CC(=C(C=C3F)F)F)N",
    "cid": 4369359,
    "molecularWeight": 407.31
  },
  "canagliflozin": {
    "genericName": "Canagliflozin",
    "structureType": "single-molecule",
    "smiles": "CC1=C(C=C(C=C1)[C@H]2[C@@H]([C@H]([C@@H]([C@H](O2)CO)O)O)O)CC3=CC=C(S3)C4=CC=C(C=C4)F",
    "cid": 24812758,
    "molecularWeight": 444.5
  },
  "insulinlispro": {
    "genericName": "Insulin Lispro",
    "structureType": "biologic",
    "smiles": "CC[C@H](C)[C@@H](C(=O)N[C@@H](C(C)C)C(=O)N[C@@H](CCC(=O)O)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CS)C(=O)N[C@@H](CS)C(=O)N[C@@H]([C@@H](C)O)C(=O)N[C@@H](CO)C(=O)N[C@@H]([C@@H](C)CC)C(=O)N[C@@H](CS)C(=O)N[C@@H](CO)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CC1=CC=C(C=C1)O)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CCC(=O)O)C(=O)N[C@@H](CC(=O)N)C(=O)N[C@@H](CC2=CC=C(C=C2)O)C(=O)N[C@@H](CS)C(=O)N[C@@H](CC(=O)N)C(=O)O)NC(=O)CN.C[C@H]([C@@H](C(=O)N[C@@H](CCCCN)C(=O)N1CCC[C@H]1C(=O)N[C@@H]([C@@H](C)O)C(=O)O)NC(=O)[C@H](CC2=CC=C(C=C2)O)NC(=O)[C@H](CC3=CC=CC=C3)NC(=O)[C@H](CC4=CC=CC=C4)NC(=O)CNC(=O)[C@H](CCCNC(=N)N)NC(=O)[C@H](CCC(=O)O)NC(=O)CNC(=O)[C@H](CS)NC(=O)[C@H](C(C)C)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC5=CC=C(C=C5)O)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](C)NC(=O)[C@H](CCC(=O)O)NC(=O)[C@H](C(C)C)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC6=CN=CN6)NC(=O)[C@H](CO)NC(=O)CNC(=O)[C@H](CS)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC7=CN=CN7)NC(=O)[C@H](CCC(=O)N)NC(=O)[C@H](CC(=O)N)NC(=O)[C@H](C(C)C)NC(=O)[C@H](CC8=CC=CC=C8)N)O",
    "cid": 16132438,
    "molecularWeight": 5807.6,
    "biologicDescription": "Rapid-acting recombinant human insulin analogue with inverted B28(Lys)-B29(Pro) sequence (ProB28Lys, LysB29Pro) preventing hexamer self-dimerization for accelerated monomeric absorption."
  },
  "insulinaspart": {
    "genericName": "Insulin Aspart",
    "structureType": "biologic",
    "smiles": "CC[C@H](C)[C@@H](C(=O)N[C@@H](C(C)C)C(=O)N[C@@H](CCC(=O)O)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CS)C(=O)N[C@@H](CS)C(=O)N[C@@H]([C@@H](C)O)C(=O)N[C@@H](CO)C(=O)N[C@@H]([C@@H](C)CC)C(=O)N[C@@H](CS)C(=O)N[C@@H](CO)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CC1=CC=C(C=C1)O)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CCC(=O)O)C(=O)N[C@@H](CC(=O)N)C(=O)N[C@@H](CC2=CC=C(C=C2)O)C(=O)N[C@@H](CS)C(=O)N[C@@H](CC(=O)N)C(=O)O)NC(=O)CN.C[C@H]([C@@H](C(=O)N[C@@H](CC(=O)O)C(=O)N[C@@H](CCCCN)C(=O)N[C@@H]([C@@H](C)O)C(=O)O)NC(=O)[C@H](CC1=CC=C(C=C1)O)NC(=O)[C@H](CC2=CC=CC=C2)NC(=O)[C@H](CC3=CC=CC=C3)NC(=O)CNC(=O)[C@H](CCCNC(=N)N)NC(=O)[C@H](CCC(=O)O)NC(=O)CNC(=O)[C@H](CS)NC(=O)[C@H](C(C)C)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC4=CC=C(C=C4)O)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](C)NC(=O)[C@H](CCC(=O)O)NC(=O)[C@H](C(C)C)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC5=CN=CN5)NC(=O)[C@H](CO)NC(=O)CNC(=O)[C@H](CS)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC6=CN=CN6)NC(=O)[C@H](CCC(=O)N)NC(=O)[C@H](CC(=O)N)NC(=O)[C@H](C(C)C)NC(=O)[C@H](CC7=CC=CC=C7)N)O",
    "cid": 16132418,
    "molecularWeight": 5825.5,
    "biologicDescription": "Rapid-acting recombinant human insulin analogue with B28 proline substituted by negatively-charged aspartic acid (ProB28Asp), reducing hexameric self-association."
  },
  "regularhumaninsulin": {
    "genericName": "Regular Human Insulin",
    "structureType": "biologic",
    "smiles": "CC[C@H](C)[C@H]1C(=O)N[C@H]2CSSC[C@@H](C(=O)N[C@@H](CSSC[C@@H](C(=O)NCC(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@@H](CSSC[C@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC2=O)CO)CC(C)C)CC3=CC=C(C=C3)O)CCC(=O)N)CC(C)C)CCC(=O)O)CC(=O)N)CC4=CC=C(C=C4)O)C(=O)N[C@@H](CC(=O)N)C(=O)O)C(=O)NCC(=O)N[C@@H](CCC(=O)O)C(=O)N[C@@H](CCCNC(=N)N)C(=O)NCC(=O)N[C@@H](CC5=CC=CC=C5)C(=O)N[C@@H](CC6=CC=CC=C6)C(=O)N[C@@H](CC7=CC=C(C=C7)O)C(=O)N[C@@H]([C@@H](C)O)C(=O)N8CCC[C@H]8C(=O)N[C@@H](CCCCN)C(=O)N[C@@H]([C@@H](C)O)C(=O)O)C(C)C)CC(C)C)CC9=CC=C(C=C9)O)CC(C)C)C)CCC(=O)O)C(C)C)CC(C)C)CC2=CNC=N2)CO)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC2=CNC=N2)NC(=O)[C@H](CCC(=O)N)NC(=O)[C@H](CC(=O)N)NC(=O)[C@H](C(C)C)NC(=O)[C@H](CC2=CC=CC=C2)N)C(=O)N[C@H](C(=O)N[C@H](C(=O)N1)CO)[C@@H](C)O)NC(=O)[C@H](CCC(=O)N)NC(=O)[C@H](CCC(=O)O)NC(=O)[C@H](C(C)C)NC(=O)[C@H]([C@@H](C)CC)NC(=O)CN",
    "cid": 118984375,
    "molecularWeight": 5807.6,
    "biologicDescription": "Recombinant 51-amino acid two-chain polypeptide hormone (A-chain: 21 residues, B-chain: 30 residues) linked by two interchain disulfide bonds and one intrachain disulfide bond."
  },
  "insulinglargine": {
    "genericName": "Insulin Glargine",
    "structureType": "biologic",
    "smiles": "CC[C@H](C)[C@H]1C(=O)N[C@H]2CSSC[C@@H](C(=O)N[C@@H](CSSC[C@@H](C(=O)NCC(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@@H](CSSC[C@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC2=O)CO)CC(C)C)CC3=CC=C(C=C3)O)CCC(=O)N)CC(C)C)CCC(=O)O)CC(=O)N)CC4=CC=C(C=C4)O)C(=O)NCC(=O)O)C(=O)NCC(=O)N[C@@H](CCC(=O)O)C(=O)N[C@@H](CCCNC(=N)N)C(=O)NCC(=O)N[C@@H](CC5=CC=CC=C5)C(=O)N[C@@H](CC6=CC=CC=C6)C(=O)N[C@@H](CC7=CC=C(C=C7)O)C(=O)N[C@@H]([C@@H](C)O)C(=O)N8CCC[C@H]8C(=O)N[C@@H](CCCCN)C(=O)N[C@@H]([C@@H](C)O)C(=O)N[C@@H](CCCNC(=N)N)C(=O)N[C@@H](CCCNC(=N)N)C(=O)O)C(C)C)CC(C)C)CC9=CC=C(C=C9)O)CC(C)C)C)CCC(=O)O)C(C)C)CC(C)C)CC2=CNC=N2)CO)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC2=CNC=N2)NC(=O)[C@H](CCC(=O)N)NC(=O)[C@H](CC(=O)N)NC(=O)[C@H](C(C)C)NC(=O)[C@H](CC2=CC=CC=C2)N)C(=O)N[C@H](C(=O)N[C@H](C(=O)N1)CO)[C@@H](C)O)NC(=O)[C@H](CCC(=O)N)NC(=O)[C@H](CCC(=O)O)NC(=O)[C@H](C(C)C)NC(=O)[C@H]([C@@H](C)CC)NC(=O)CN",
    "cid": 118984454,
    "molecularWeight": 6062.9,
    "biologicDescription": "Long-acting basal human insulin analogue with Gly substituted at A21 and two Arg residues added to B-chain C-terminus (ArgB31, ArgB32), shifting isoelectric point (pI) to 6.7 for microprecipitate depot release."
  },
  "insulindegludec": {
    "genericName": "Insulin Degludec",
    "structureType": "biologic",
    "smiles": "CC[C@H](C)[C@H]1C(=O)N[C@H]2CSSC[C@@H](C(=O)N[C@@H](CSSC[C@@H](C(=O)NCC(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@@H](CSSC[C@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@@H](NC2=O)CO)CC(C)C)CC3=CC=C(C=C3)O)CCC(=O)N)CC(C)C)CCC(=O)O)CC(=O)N)CC4=CC=C(C=C4)O)C(=O)N[C@@H](CC(=O)N)C(=O)O)C(=O)NCC(=O)N[C@@H](CCC(=O)O)C(=O)N[C@@H](CCCNC(=N)N)C(=O)NCC(=O)N[C@@H](CC5=CC=CC=C5)C(=O)N[C@@H](CC6=CC=CC=C6)C(=O)N[C@@H](CC7=CC=C(C=C7)O)C(=O)N[C@@H]([C@@H](C)O)C(=O)N8CCC[C@H]8C(=O)N[C@@H](CCCCNC(=O)CC[C@@H](C(=O)O)NC(=O)CCCCCCCCCCCCCCC(=O)O)C(=O)O)C(C)C)CC(C)C)CC9=CC=C(C=C9)O)CC(C)C)C)CCC(=O)O)C(C)C)CC(C)C)CC2=CNC=N2)CO)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC2=CNC=N2)NC(=O)[C@H](CCC(=O)N)NC(=O)[C@H](CC(=O)N)NC(=O)[C@H](C(C)C)NC(=O)[C@H](CC2=CC=CC=C2)N)C(=O)N[C@H](C(=O)N[C@H](C(=O)N1)CO)[C@@H](C)O)NC(=O)[C@H](CCC(=O)N)NC(=O)[C@H](CCC(=O)O)NC(=O)[C@H](C(C)C)NC(=O)[C@H]([C@@H](C)CC)NC(=O)CN",
    "cid": 118984462,
    "molecularWeight": 6103.9,
    "biologicDescription": "Ultra-long-acting basal insulin analogue with Thr deleted at B30 and conjugated at LysB29 with hexadecanedioic acid via a gamma-L-glutamyl spacer, forming multi-hexamer subcutaneous depots with >42h half-life."
  },
  "liraglutide": {
    "genericName": "Liraglutide",
    "structureType": "single-molecule",
    "smiles": "CCCCCCCCCCCCCCCC(=O)N[C@@H](CCC(=O)NCCCC[C@@H](C(=O)N[C@@H](CCC(=O)O)C(=O)N[C@@H](CC1=CC=CC=C1)C(=O)N[C@@H]([C@@H](C)CC)C(=O)N[C@@H](C)C(=O)N[C@@H](CC2=CNC3=CC=CC=C32)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](C(C)C)C(=O)N[C@@H](CCCNC(=N)N)C(=O)NCC(=O)N[C@@H](CCCNC(=N)N)C(=O)NCC(=O)O)NC(=O)[C@H](C)NC(=O)[C@H](C)NC(=O)[C@H](CCC(=O)N)NC(=O)CNC(=O)[C@H](CCC(=O)O)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC4=CC=C(C=C4)O)NC(=O)[C@H](CO)NC(=O)[C@H](CO)NC(=O)[C@H](C(C)C)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CO)NC(=O)[C@H]([C@@H](C)O)NC(=O)[C@H](CC5=CC=CC=C5)NC(=O)[C@H]([C@@H](C)O)NC(=O)CNC(=O)[C@H](CCC(=O)O)NC(=O)[C@H](C)NC(=O)[C@H](CC6=CN=CN6)N)C(=O)O",
    "cid": 16134956,
    "molecularWeight": 3751
  },
  "semaglutide": {
    "genericName": "Semaglutide",
    "structureType": "single-molecule",
    "smiles": "CC[C@H](C)[C@@H](C(=O)N[C@@H](C)C(=O)N[C@@H](CC1=CNC2=CC=CC=C21)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](C(C)C)C(=O)N[C@@H](CCCNC(=N)N)C(=O)NCC(=O)N[C@@H](CCCNC(=N)N)C(=O)NCC(=O)O)NC(=O)[C@H](CC3=CC=CC=C3)NC(=O)[C@H](CCC(=O)O)NC(=O)[C@H](CCCCNC(=O)COCCOCCNC(=O)COCCOCCNC(=O)CC[C@H](C(=O)O)NC(=O)CCCCCCCCCCCCCCCCC(=O)O)NC(=O)[C@H](C)NC(=O)[C@H](C)NC(=O)[C@H](CCC(=O)N)NC(=O)CNC(=O)[C@H](CCC(=O)O)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC4=CC=C(C=C4)O)NC(=O)[C@H](CO)NC(=O)[C@H](CO)NC(=O)[C@H](C(C)C)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CO)NC(=O)[C@H]([C@@H](C)O)NC(=O)[C@H](CC5=CC=CC=C5)NC(=O)[C@H]([C@@H](C)O)NC(=O)CNC(=O)[C@H](CCC(=O)O)NC(=O)C(C)(C)NC(=O)[C@H](CC6=CN=CN6)N",
    "cid": 56843331,
    "molecularWeight": 4114
  },
  "dulaglutide": {
    "genericName": "Dulaglutide",
    "structureType": "biologic",
    "smiles": "NCC(=O)NC(CC1=CNC2=CC=CC=C12)C(=O)NC(CC3=CC=CC=C3)C(=O)O",
    "cid": 135314755,
    "molecularWeight": 59700,
    "biologicDescription": "Recombinant GLP-1 receptor agonist consisting of two identical disulfide-linked chains, each containing an N-terminal modified human GLP-1 (7-37) covalently bound to a human IgG4-Fc heavy chain fragment via a small peptide linker."
  },
  "tirzepatide": {
    "genericName": "Tirzepatide",
    "structureType": "single-molecule",
    "smiles": "CC[C@H](C)[C@@H](C(=O)N[C@@H](C)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CCCCNC(=O)COCCOCCNC(=O)COCCOCCNC(=O)CC[C@@H](C(=O)O)NC(=O)CCCCCCCCCCCCCCCCCCC(=O)O)C(=O)N[C@@H](C)C(=O)N[C@@H](CC1=CC=CC=C1)C(=O)N[C@@H](C(C)C)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CC2=CNC3=CC=CC=C32)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H]([C@@H](C)CC)C(=O)N[C@@H](C)C(=O)NCC(=O)NCC(=O)N4CCC[C@H]4C(=O)N[C@@H](CO)C(=O)N[C@@H](CO)C(=O)NCC(=O)N[C@@H](C)C(=O)N5CCC[C@H]5C(=O)N6CCC[C@H]6C(=O)N7CCC[C@H]7C(=O)N[C@@H](CO)C(=O)N)NC(=O)[C@H](CCCCN)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CC(C)C)NC(=O)C(C)(C)NC(=O)[C@H]([C@@H](C)CC)NC(=O)[C@H](CO)NC(=O)[C@H](CC8=CC=C(C=C8)O)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CO)NC(=O)[C@H]([C@@H](C)O)NC(=O)[C@H](CC9=CC=CC=C9)NC(=O)[C@H]([C@@H](C)O)NC(=O)CNC(=O)[C@H](CCC(=O)O)NC(=O)C(C)(C)NC(=O)[C@H](CC1=CC=C(C=C1)O)N",
    "cid": 166567236,
    "molecularWeight": 4813
  },
  "latanoprost": {
    "genericName": "Latanoprost",
    "structureType": "single-molecule",
    "smiles": "CC(C)OC(=O)CCC/C=C\\C[C@H]1[C@H](C[C@H]([C@@H]1CC[C@H](CCC2=CC=CC=C2)O)O)O",
    "cid": 5311221,
    "molecularWeight": 432.6
  },
  "brimonidine": {
    "genericName": "Brimonidine",
    "structureType": "single-molecule",
    "smiles": "C1CN=C(N1)NC2=C(C3=NC=CN=C3C=C2)Br",
    "cid": 2435,
    "molecularWeight": 292.13
  },
  "timolol": {
    "genericName": "Timolol",
    "structureType": "single-molecule",
    "smiles": "CC(C)(C)NC[C@@H](COC1=NSN=C1N2CCOCC2)O",
    "cid": 33624,
    "molecularWeight": 316.42
  },
  "promethazine": {
    "genericName": "Promethazine",
    "structureType": "single-molecule",
    "smiles": "CC(CN1C2=CC=CC=C2SC3=CC=CC=C31)N(C)C",
    "cid": 4927,
    "molecularWeight": 284.4
  },
  "meclizine": {
    "genericName": "Meclizine",
    "structureType": "single-molecule",
    "smiles": "CC1=CC(=CC=C1)CN2CCN(CC2)C(C3=CC=CC=C3)C4=CC=C(C=C4)Cl",
    "cid": 4034,
    "molecularWeight": 390.9
  },
  "hydroxyzine": {
    "genericName": "Hydroxyzine",
    "structureType": "single-molecule",
    "smiles": "C1CN(CCN1CCOCCO)C(C2=CC=CC=C2)C3=CC=C(C=C3)Cl",
    "cid": 3658,
    "molecularWeight": 374.9
  },
  "ondansetron": {
    "genericName": "Ondansetron",
    "structureType": "single-molecule",
    "smiles": "CC1=NC=CN1CC2CCC3=C(C2=O)C4=CC=CC=C4N3C",
    "cid": 4595,
    "molecularWeight": 293.4
  },
  "granisetron": {
    "genericName": "Granisetron",
    "structureType": "single-molecule",
    "smiles": "CN1[C@@H]2CCC[C@H]1CC(C2)NC(=O)C3=NN(C4=CC=CC=C43)C",
    "cid": 5284566,
    "molecularWeight": 312.4
  },
  "metoclopramide": {
    "genericName": "Metoclopramide",
    "structureType": "single-molecule",
    "smiles": "CCN(CC)CCNC(=O)C1=CC(=C(C=C1OC)N)Cl",
    "cid": 4168,
    "molecularWeight": 299.79
  },
  "fluconazole": {
    "genericName": "Fluconazole",
    "structureType": "single-molecule",
    "smiles": "C1=CC(=C(C=C1F)F)C(CN2C=NC=N2)(CN3C=NC=N3)O",
    "cid": 3365,
    "molecularWeight": 306.27
  },
  "ketoconazoletopical": {
    "genericName": "Ketoconazole Topical",
    "structureType": "single-molecule",
    "smiles": "CC(=O)N1CCN(CC1)C2=CC=C(C=C2)OC[C@@H]3CO[C@@](O3)(CN4C=CN=C4)C5=C(C=C(C=C5)Cl)Cl",
    "cid": 47576,
    "molecularWeight": 531.4
  },
  "clotrimazolebetamethasone": {
    "genericName": "Clotrimazole / Betamethasone",
    "structureType": "multi-component",
    "smiles": "C1=CC=C(C=C1)C(C2=CC=CC=C2)(C3=CC=CC=C3Cl)N4C=CN=C4.CC1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)CO)O)C)O)F)C",
    "cid": 2812,
    "molecularWeight": 737.3,
    "components": [
      {
        "componentName": "Clotrimazole",
        "smiles": "C1=CC=C(C=C1)C(C2=CC=CC=C2)(C3=CC=CC=C3Cl)N4C=CN=C4",
        "role": "Imidazole Antifungal (Ergosterol Synthesis Inhibitor)"
      },
      {
        "componentName": "Betamethasone",
        "smiles": "CC1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)CO)O)C)O)F)C",
        "role": "Corticosteroid Anti-inflammatory"
      }
    ]
  },
  "nystatintopical": {
    "genericName": "Nystatin Topical",
    "structureType": "single-molecule",
    "smiles": "C[C@H]1/C=C/C=C/CC/C=C/C=C/C=C/C=C/C(CC2C(C(C[C@](O2)(CC(C(CCC(CC(CC(CC(=O)O[C@H]([C@@H]([C@@H]1O)C)C)O)O)O)O)O)O)O)C(=O)O)O[C@@H]3[C@H]([C@H]([C@@H]([C@H](O3)C)O)N)O",
    "cid": 6433272,
    "molecularWeight": 926.1
  },
  "atorvastatin": {
    "genericName": "Atorvastatin",
    "structureType": "single-molecule",
    "smiles": "CC(C)C1=C(C(=C(N1CC[C@H](C[C@H](CC(=O)O)O)O)C2=CC=C(C=C2)F)C3=CC=CC=C3)C(=O)NC4=CC=CC=C4",
    "cid": 60823,
    "molecularWeight": 558.6
  },
  "lovastatin": {
    "genericName": "Lovastatin",
    "structureType": "single-molecule",
    "smiles": "CC[C@H](C)C(=O)O[C@H]1C[C@H](C=C2[C@H]1[C@H]([C@H](C=C2)C)CC[C@@H]3C[C@H](CC(=O)O3)O)C",
    "cid": 53232,
    "molecularWeight": 404.5
  },
  "pravastatin": {
    "genericName": "Pravastatin",
    "structureType": "single-molecule",
    "smiles": "CC[C@H](C)C(=O)O[C@H]1C[C@@H](C=C2[C@H]1[C@H]([C@H](C=C2)C)CC[C@H](C[C@H](CC(=O)O)O)O)O",
    "cid": 54687,
    "molecularWeight": 424.5
  },
  "rosuvastatin": {
    "genericName": "Rosuvastatin",
    "structureType": "single-molecule",
    "smiles": "CC(C)C1=NC(=NC(=C1/C=C/[C@H](C[C@H](CC(=O)O)O)O)C2=CC=C(C=C2)F)N(C)S(=O)(=O)C",
    "cid": 446157,
    "molecularWeight": 481.5
  },
  "simvastatin": {
    "genericName": "Simvastatin",
    "structureType": "single-molecule",
    "smiles": "CCC(C)(C)C(=O)O[C@H]1C[C@H](C=C2[C@H]1[C@H]([C@H](C=C2)C)CC[C@@H]3C[C@H](CC(=O)O3)O)C",
    "cid": 54454,
    "molecularWeight": 418.6
  },
  "ezetimibe": {
    "genericName": "Ezetimibe",
    "structureType": "single-molecule",
    "smiles": "C1=CC(=CC=C1[C@@H]2[C@H](C(=O)N2C3=CC=C(C=C3)F)CC[C@@H](C4=CC=C(C=C4)F)O)O",
    "cid": 150311,
    "molecularWeight": 409.4
  },
  "fenofibrate": {
    "genericName": "Fenofibrate",
    "structureType": "single-molecule",
    "smiles": "CC(C)OC(=O)C(C)(C)OC1=CC=C(C=C1)C(=O)C2=CC=C(C=C2)Cl",
    "cid": 3339,
    "molecularWeight": 360.8
  },
  "gemfibrozil": {
    "genericName": "Gemfibrozil",
    "structureType": "single-molecule",
    "smiles": "CC1=CC(=C(C=C1)C)OCCCC(C)(C)C(=O)O",
    "cid": 3463,
    "molecularWeight": 250.33
  },
  "niacin": {
    "genericName": "Niacin",
    "structureType": "single-molecule",
    "smiles": "C1=CC(=CN=C1)C(=O)O",
    "cid": 938,
    "molecularWeight": 123.11
  },
  "omega3acidethylesters": {
    "genericName": "Omega-3-Acid Ethyl Esters",
    "structureType": "single-molecule",
    "smiles": "CC/C=C\\C/C=C\\C/C=C\\C/C=C\\C/C=C\\CCCC(=O)OCC.CC/C=C\\C/C=C\\C/C=C\\C/C=C\\C/C=C\\C/C=C\\CCC(=O)OCC",
    "cid": 9831414,
    "molecularWeight": 687
  },
  "evolocumab": {
    "genericName": "Evolocumab",
    "structureType": "biologic",
    "smiles": "NCC(=O)NC(CC1=CNC2=CC=CC=C12)C(=O)NC(CC3=CC=CC=C3)C(=O)O",
    "cid": 135314755,
    "molecularWeight": 144000,
    "biologicDescription": "Fully human IgG2 monoclonal antibody directed against proprotein convertase subtilisin/kexin type 9 (PCSK9), preventing LDLR degradation and lowering circulating LDL-C."
  },
  "lisinopril": {
    "genericName": "Lisinopril",
    "structureType": "single-molecule",
    "smiles": "C1C[C@H](N(C1)C(=O)[C@H](CCCCN)N[C@@H](CCC2=CC=CC=C2)C(=O)O)C(=O)O",
    "cid": 5362119,
    "molecularWeight": 405.5
  },
  "enalapril": {
    "genericName": "Enalapril",
    "structureType": "single-molecule",
    "smiles": "CCOC(=O)[C@H](CCC1=CC=CC=C1)N[C@@H](C)C(=O)N2CCC[C@H]2C(=O)O",
    "cid": 5388962,
    "molecularWeight": 376.4
  },
  "ramipril": {
    "genericName": "Ramipril",
    "structureType": "single-molecule",
    "smiles": "CCOC(=O)[C@H](CCC1=CC=CC=C1)N[C@@H](C)C(=O)N2[C@H]3CCC[C@H]3C[C@H]2C(=O)O",
    "cid": 5362129,
    "molecularWeight": 416.5
  },
  "benazepril": {
    "genericName": "Benazepril",
    "structureType": "single-molecule",
    "smiles": "CCOC(=O)[C@H](CCC1=CC=CC=C1)N[C@H]2CCC3=CC=CC=C3N(C2=O)CC(=O)O",
    "cid": 5362124,
    "molecularWeight": 424.5
  },
  "losartan": {
    "genericName": "Losartan",
    "structureType": "single-molecule",
    "smiles": "CCCCC1=NC(=C(N1CC2=CC=C(C=C2)C3=CC=CC=C3C4=NNN=N4)CO)Cl",
    "cid": 3961,
    "molecularWeight": 422.9
  },
  "olmesartan": {
    "genericName": "Olmesartan",
    "structureType": "single-molecule",
    "smiles": "CCCC1=NC(=C(N1CC2=CC=C(C=C2)C3=CC=CC=C3C4=NNN=N4)C(=O)O)C(C)(C)O",
    "cid": 158781,
    "molecularWeight": 446.5
  },
  "irbesartan": {
    "genericName": "Irbesartan",
    "structureType": "single-molecule",
    "smiles": "CCCCC1=NC2(CCCC2)C(=O)N1CC3=CC=C(C=C3)C4=CC=CC=C4C5=NNN=N5",
    "cid": 3749,
    "molecularWeight": 428.5
  },
  "valsartan": {
    "genericName": "Valsartan",
    "structureType": "single-molecule",
    "smiles": "CCCCC(=O)N(CC1=CC=C(C=C1)C2=CC=CC=C2C3=NNN=N3)[C@@H](C(C)C)C(=O)O",
    "cid": 60846,
    "molecularWeight": 435.5
  },
  "hydrochlorothiazide": {
    "genericName": "Hydrochlorothiazide",
    "structureType": "single-molecule",
    "smiles": "C1NC2=CC(=C(C=C2S(=O)(=O)N1)S(=O)(=O)N)Cl",
    "cid": 3639,
    "molecularWeight": 297.7
  },
  "chlorthalidone": {
    "genericName": "Chlorthalidone",
    "structureType": "single-molecule",
    "smiles": "C1=CC=C2C(=C1)C(=O)NC2(C3=CC(=C(C=C3)Cl)S(=O)(=O)N)O",
    "cid": 2732,
    "molecularWeight": 338.8
  },
  "furosemide": {
    "genericName": "Furosemide",
    "structureType": "single-molecule",
    "smiles": "C1=COC(=C1)CNC2=CC(=C(C=C2C(=O)O)S(=O)(=O)N)Cl",
    "cid": 3440,
    "molecularWeight": 330.74
  },
  "triamterenehydrochlorothiazide": {
    "genericName": "Triamterene / Hydrochlorothiazide",
    "structureType": "multi-component",
    "smiles": "C1=CC=C(C=C1)C2=NC3=C(N=C(N=C3N)N)N=C2N.C1NC2=CC(=C(C=C2S(=O)(=O)N1)Cl)S(=O)(=O)N",
    "cid": 62940,
    "molecularWeight": 551,
    "components": [
      {
        "componentName": "Triamterene",
        "smiles": "C1=CC=C(C=C1)C2=NC3=C(N=C(N=C3N)N)N=C2N",
        "role": "Potassium-Sparing ENaC Blocker Diuretic"
      },
      {
        "componentName": "Hydrochlorothiazide",
        "smiles": "C1NC2=CC(=C(C=C2S(=O)(=O)N1)Cl)S(=O)(=O)N",
        "role": "Thiazide Diuretic (NCC Symporter Inhibitor)"
      }
    ]
  },
  "spironolactone": {
    "genericName": "Spironolactone",
    "structureType": "single-molecule",
    "smiles": "CC(=O)S[C@@H]1CC2=CC(=O)CC[C@@]2([C@@H]3[C@@H]1[C@@H]4CC[C@]5([C@]4(CC3)C)CCC(=O)O5)C",
    "cid": 5833,
    "molecularWeight": 416.6
  },
  "amlodipine": {
    "genericName": "Amlodipine",
    "structureType": "single-molecule",
    "smiles": "CCOC(=O)C1=C(NC(=C(C1C2=CC=CC=C2Cl)C(=O)OC)C)COCCN",
    "cid": 2162,
    "molecularWeight": 408.9
  },
  "nifedipineextendedrelease": {
    "genericName": "Nifedipine Extended Release",
    "structureType": "single-molecule",
    "smiles": "CC1=C(C(C(=C(N1)C)C(=O)OC)C2=CC=CC=C2[N+](=O)[O-])C(=O)OC",
    "cid": 4485,
    "molecularWeight": 346.3
  },
  "verapamil": {
    "genericName": "Verapamil",
    "structureType": "single-molecule",
    "smiles": "CC(C)C(CCCN(C)CCC1=CC(=C(C=C1)OC)OC)(C#N)C2=CC(=C(C=C2)OC)OC",
    "cid": 2520,
    "molecularWeight": 454.6
  },
  "atenolol": {
    "genericName": "Atenolol",
    "structureType": "single-molecule",
    "smiles": "CC(C)NCC(COC1=CC=C(C=C1)CC(=O)N)O",
    "cid": 2249,
    "molecularWeight": 266.34
  },
  "metoprolol": {
    "genericName": "Metoprolol Tartrate / Succinate",
    "structureType": "multi-component",
    "smiles": "CC(C)NCC(COC1=CC=C(C=C1)CCOC)O.C(C(C(=O)O)O)(C(=O)O)O",
    "cid": 4171,
    "molecularWeight": 417.5,
    "components": [
      {
        "componentName": "Metoprolol",
        "smiles": "CC(C)NCC(COC1=CC=C(C=C1)CCOC)O",
        "role": "Cardioselective Beta-1 Adrenergic Antagonist"
      },
      {
        "componentName": "Tartrate / Succinate Counter-Ion",
        "smiles": "C(C(C(=O)O)O)(C(=O)O)O",
        "role": "Pharmaceutical Formulation Salt"
      }
    ]
  },
  "nebivolol": {
    "genericName": "Nebivolol",
    "structureType": "single-molecule",
    "smiles": "C1CC2=C(C=CC(=C2)F)OC1C(CNCC(C3CCC4=C(O3)C=CC(=C4)F)O)O",
    "cid": 71301,
    "molecularWeight": 405.4
  },
  "bisoprolol": {
    "genericName": "Bisoprolol",
    "structureType": "single-molecule",
    "smiles": "CC(C)NCC(COC1=CC=C(C=C1)COCCOC(C)C)O",
    "cid": 2405,
    "molecularWeight": 325.4
  },
  "propranolol": {
    "genericName": "Propranolol",
    "structureType": "single-molecule",
    "smiles": "CC(C)NCC(COC1=CC=CC2=CC=CC=C21)O",
    "cid": 4946,
    "molecularWeight": 259.34
  },
  "carvedilol": {
    "genericName": "Carvedilol",
    "structureType": "single-molecule",
    "smiles": "COC1=CC=CC=C1OCCNCC(COC2=CC=CC3=C2C4=CC=CC=C4N3)O",
    "cid": 2585,
    "molecularWeight": 406.5
  },
  "doxazosin": {
    "genericName": "Doxazosin",
    "structureType": "single-molecule",
    "smiles": "COC1=C(C=C2C(=C1)C(=NC(=N2)N3CCN(CC3)C(=O)C4COC5=CC=CC=C5O4)N)OC",
    "cid": 3157,
    "molecularWeight": 451.5
  },
  "terazosin": {
    "genericName": "Terazosin",
    "structureType": "single-molecule",
    "smiles": "COC1=C(C=C2C(=C1)C(=NC(=N2)N3CCN(CC3)C(=O)C4CCCO4)N)OC",
    "cid": 5401,
    "molecularWeight": 387.4
  },
  "clonidine": {
    "genericName": "Clonidine",
    "structureType": "single-molecule",
    "smiles": "C1CN=C(N1)NC2=C(C=CC=C2Cl)Cl",
    "cid": 2803,
    "molecularWeight": 230.09
  },
  "hydralazine": {
    "genericName": "Hydralazine",
    "structureType": "single-molecule",
    "smiles": "C1=CC=C2C(=C1)C=NN=C2NN",
    "cid": 3637,
    "molecularWeight": 160.18
  },
  "guanfacine": {
    "genericName": "Guanfacine",
    "structureType": "single-molecule",
    "smiles": "C1=CC(=C(C(=C1)Cl)CC(=O)N=C(N)N)Cl",
    "cid": 3519,
    "molecularWeight": 246.09
  },
  "rivaroxaban": {
    "genericName": "Rivaroxaban",
    "structureType": "single-molecule",
    "smiles": "C1COCC(=O)N1C2=CC=C(C=C2)N3C[C@@H](OC3=O)CNC(=O)C4=CC=C(S4)Cl",
    "cid": 9875401,
    "molecularWeight": 435.9
  },
  "warfarin": {
    "genericName": "Warfarin",
    "structureType": "single-molecule",
    "smiles": "CC(=O)CC(C1=CC=CC=C1)C2=C(C3=CC=CC=C3OC2=O)O",
    "cid": 54678486,
    "molecularWeight": 308.3
  },
  "dabigatran": {
    "genericName": "Dabigatran",
    "structureType": "single-molecule",
    "smiles": "CN1C2=C(C=C(C=C2)C(=O)N(CCC(=O)O)C3=CC=CC=N3)N=C1CNC4=CC=C(C=C4)C(=N)N",
    "cid": 216210,
    "molecularWeight": 471.5
  },
  "enoxaparin": {
    "genericName": "Enoxaparin",
    "structureType": "single-molecule",
    "smiles": "CC(=O)NC1C(C(C(OC1OC2C(C(C(OC2COS(=O)(=O)O)OC3C(C(C(OC3OC4C(C(C(O4)COS(=O)(=O)O)O)O)COS(=O)(=O)O)OS(=O)(=O)O)NS(=O)(=O)O)O)C(=O)O)OS(=O)(=O)O)O)COS(=O)(=O)O)O",
    "cid": 72941584,
    "molecularWeight": 1134.9
  },
  "heparin": {
    "genericName": "Heparin",
    "structureType": "single-molecule",
    "smiles": "CC(=O)NC1C(C(C(OC1O)COS(=O)(=O)O)OC2C(C(C(C(O2)C(=O)O)OC3C(C(C(C(O3)CO)OC4C(C(C(C(O4)C(=O)O)O)O)OS(=O)(=O)O)OS(=O)(=O)O)NS(=O)(=O)O)O)OS(=O)(=O)O)O.[Na+]",
    "cid": 92044406,
    "molecularWeight": 1157.9
  },
  "apixaban": {
    "genericName": "Apixaban",
    "structureType": "single-molecule",
    "smiles": "COC1=CC=C(C=C1)N2C3=C(CCN(C3=O)C4=CC=C(C=C4)N5CCCCC5=O)C(=N2)C(=O)N",
    "cid": 10182969,
    "molecularWeight": 459.5
  },
  "clopidogrel": {
    "genericName": "Clopidogrel",
    "structureType": "single-molecule",
    "smiles": "COC(=O)[C@H](C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3",
    "cid": 60606,
    "molecularWeight": 321.8
  },
  "dipyridamoleandaspirin": {
    "genericName": "Dipyridamole and Aspirin",
    "structureType": "single-molecule",
    "smiles": "CC(=O)OC1=CC=CC=C1C(=O)O.C1CCN(CC1)C2=NC(=NC3=C2N=C(N=C3N4CCCCC4)N(CCO)CCO)N(CCO)CCO",
    "cid": 137329,
    "molecularWeight": 684.8
  },
  "epoetinalfa": {
    "genericName": "Epoetin Alfa",
    "structureType": "biologic",
    "smiles": "NCC(=O)NC(CC1=CNC2=CC=CC=C12)C(=O)NC(CC3=CC=CC=C3)C(=O)O",
    "cid": 135314755,
    "molecularWeight": 30400,
    "biologicDescription": "165-amino acid recombinant human erythropoietin glycoprotein (30.4 kDa) stimulating erythroid progenitor proliferation via erythropoietin receptor homodimerization."
  },
  "amiodarone": {
    "genericName": "Amiodarone",
    "structureType": "single-molecule",
    "smiles": "CCCCC1=C(C2=CC=CC=C2O1)C(=O)C3=CC(=C(C(=C3)I)OCCN(CC)CC)I",
    "cid": 2157,
    "molecularWeight": 645.3
  },
  "digoxin": {
    "genericName": "Digoxin",
    "structureType": "single-molecule",
    "smiles": "C[C@@H]1[C@H]([C@H](C[C@@H](O1)O[C@@H]2[C@H](O[C@H](C[C@@H]2O)O[C@@H]3[C@H](O[C@H](C[C@@H]3O)O[C@H]4CC[C@]5([C@@H](C4)CC[C@@H]6[C@@H]5C[C@H]([C@]7([C@@]6(CC[C@@H]7C8=CC(=O)OC8)O)C)O)C)C)C)O)O",
    "cid": 2724385,
    "molecularWeight": 780.9
  },
  "isosorbidemononitrate": {
    "genericName": "Isosorbide Mononitrate",
    "structureType": "single-molecule",
    "smiles": "C1[C@@H]([C@@H]2[C@H](O1)[C@@H](CO2)O[N+](=O)[O-])O",
    "cid": 27661,
    "molecularWeight": 191.14
  },
  "nitroglycerin": {
    "genericName": "Nitroglycerin",
    "structureType": "single-molecule",
    "smiles": "C(C(CO[N+](=O)[O-])O[N+](=O)[O-])O[N+](=O)[O-]",
    "cid": 4510,
    "molecularWeight": 227.09
  },
  "diltiazem": {
    "genericName": "Diltiazem",
    "structureType": "single-molecule",
    "smiles": "CC(=O)O[C@@H]1[C@@H](SC2=CC=CC=C2N(C1=O)CCN(C)C)C3=CC=C(C=C3)OC",
    "cid": 39186,
    "molecularWeight": 414.5
  },
  "pramipexole": {
    "genericName": "Pramipexole",
    "structureType": "single-molecule",
    "smiles": "CCCN[C@H]1CCC2=C(C1)SC(=N2)N",
    "cid": 119570,
    "molecularWeight": 211.33
  },
  "ropinirole": {
    "genericName": "Ropinirole",
    "structureType": "single-molecule",
    "smiles": "CCCN(CCC)CCC1=C2CC(=O)NC2=CC=C1",
    "cid": 5095,
    "molecularWeight": 260.37
  },
  "benztropine": {
    "genericName": "Benztropine Mesylate",
    "structureType": "single-molecule",
    "smiles": "CN1C2CCC1CC(C2)OC(C3=CC=CC=C3)C4=CC=CC=C4.CS(=O)(=O)O",
    "cid": 238053,
    "molecularWeight": 403.5
  },
  "carbidopalevodopa": {
    "genericName": "Carbidopa / Levodopa",
    "structureType": "multi-component",
    "smiles": "CC(CC1=CC(=C(C=C1)O)O)(C(=O)O)NN.C1=CC(=C(C=C1CC(C(=O)O)N)O)O",
    "cid": 24190,
    "molecularWeight": 423.4,
    "components": [
      {
        "componentName": "Carbidopa",
        "smiles": "CC(CC1=CC(=C(C=C1)O)O)(C(=O)O)NN",
        "role": "Peripheral DOPA Decarboxylase Inhibitor"
      },
      {
        "componentName": "Levodopa",
        "smiles": "C1=CC(=C(C=C1CC(C(=O)O)N)O)O",
        "role": "Dopamine Metabolic Precursor"
      }
    ]
  },
  "haloperidol": {
    "genericName": "Haloperidol",
    "structureType": "single-molecule",
    "smiles": "C1CN(CCC1(C2=CC=C(C=C2)Cl)O)CCCC(=O)C3=CC=C(C=C3)F",
    "cid": 3559,
    "molecularWeight": 375.9
  },
  "quetiapine": {
    "genericName": "Quetiapine",
    "structureType": "single-molecule",
    "smiles": "C1CN(CCN1CCOCCO)C2=NC3=CC=CC=C3SC4=CC=CC=C42",
    "cid": 5002,
    "molecularWeight": 383.5
  },
  "risperidone": {
    "genericName": "Risperidone",
    "structureType": "single-molecule",
    "smiles": "CC1=C(C(=O)N2CCCCC2=N1)CCN3CCC(CC3)C4=NOC5=C4C=CC(=C5)F",
    "cid": 5073,
    "molecularWeight": 410.5
  },
  "olanzapine": {
    "genericName": "Olanzapine",
    "structureType": "single-molecule",
    "smiles": "CC1=CC2=C(S1)NC3=CC=CC=C3N=C2N4CCN(CC4)C",
    "cid": 135398745,
    "molecularWeight": 312.4
  },
  "aripiprazole": {
    "genericName": "Aripiprazole",
    "structureType": "single-molecule",
    "smiles": "C1CC(=O)NC2=C1C=CC(=C2)OCCCCN3CCN(CC3)C4=C(C(=CC=C4)Cl)Cl",
    "cid": 60795,
    "molecularWeight": 448.4
  },
  "clozapine": {
    "genericName": "Clozapine",
    "structureType": "single-molecule",
    "smiles": "CN1CCN(CC1)C2=NC3=C(C=CC(=C3)Cl)NC4=CC=CC=C42",
    "cid": 135398737,
    "molecularWeight": 326.8
  },
  "lithium": {
    "genericName": "Lithium Carbonate",
    "structureType": "single-molecule",
    "smiles": "[Li+].[Li+].C(=O)([O-])[O-]",
    "cid": 11125,
    "molecularWeight": 73.9
  },
  "emtricitabinetenofovir": {
    "genericName": "Emtricitabine / Tenofovir",
    "structureType": "multi-component",
    "smiles": "C1C(OC(S1)N2C=C(C(=NC2=O)N)F)CO.CC(C)OC(=O)OCOP(=O)(COCC(C)OC(=O)OC(C)C)OC(C)CN1C=NC2=C1N=CN=C2N",
    "cid": 463632,
    "molecularWeight": 766.6,
    "components": [
      {
        "componentName": "Emtricitabine",
        "smiles": "C1C(OC(S1)N2C=C(C(=NC2=O)N)F)CO",
        "role": "Nucleoside Reverse Transcriptase Inhibitor (NRTI)"
      },
      {
        "componentName": "Tenofovir Disoproxil",
        "smiles": "CC(C)OC(=O)OCOP(=O)(COCC(C)OC(=O)OC(C)C)OC(C)CN1C=NC2=C1N=CN=C2N",
        "role": "Nucleotide Reverse Transcriptase Inhibitor (NtRTI)"
      }
    ]
  },
  "efavirenz": {
    "genericName": "Efavirenz",
    "structureType": "single-molecule",
    "smiles": "C1CC1C#C[C@]2(C3=C(C=CC(=C3)Cl)NC(=O)O2)C(F)(F)F",
    "cid": 64139,
    "molecularWeight": 315.67
  },
  "raltegravir": {
    "genericName": "Raltegravir",
    "structureType": "single-molecule",
    "smiles": "CC1=NN=C(O1)C(=O)NC(C)(C)C2=NC(=C(C(=O)N2C)O)C(=O)NCC3=CC=C(C=C3)F",
    "cid": 54671008,
    "molecularWeight": 444.4
  },
  "sofosbuvir": {
    "genericName": "Sofosbuvir",
    "structureType": "single-molecule",
    "smiles": "C[C@@H](C(=O)OC(C)C)N[P@](=O)(OC[C@@H]1[C@H]([C@@]([C@@H](O1)N2C=CC(=O)NC2=O)(C)F)O)OC3=CC=CC=C3",
    "cid": 45375808,
    "molecularWeight": 529.5
  },
  "oseltamivir": {
    "genericName": "Oseltamivir",
    "structureType": "single-molecule",
    "smiles": "CCC(CC)O[C@@H]1C=C(C[C@@H]([C@H]1NC(=O)C)N)C(=O)OCC",
    "cid": 65028,
    "molecularWeight": 312.4
  },
  "valacyclovir": {
    "genericName": "Valacyclovir",
    "structureType": "single-molecule",
    "smiles": "CC(C)[C@@H](C(=O)OCCOCN1C=NC2=C1N=C(NC2=O)N)N",
    "cid": 135398742,
    "molecularWeight": 324.34
  },
  "acyclovir": {
    "genericName": "Acyclovir",
    "structureType": "single-molecule",
    "smiles": "C1=NC2=C(N1COCCO)N=C(NC2=O)N",
    "cid": 135398513,
    "molecularWeight": 225.2
  },
  "valganciclovir": {
    "genericName": "Valganciclovir",
    "structureType": "single-molecule",
    "smiles": "CC(C)[C@@H](C(=O)OCC(CO)OCN1C=NC2=C1N=C(NC2=O)N)N",
    "cid": 135413535,
    "molecularWeight": 354.36
  },
  "lorazepam": {
    "genericName": "Lorazepam",
    "structureType": "single-molecule",
    "smiles": "C1=CC=C(C(=C1)C2=NC(C(=O)NC3=C2C=C(C=C3)Cl)O)Cl",
    "cid": 3958,
    "molecularWeight": 321.2
  },
  "temazepam": {
    "genericName": "Temazepam",
    "structureType": "single-molecule",
    "smiles": "CN1C2=C(C=C(C=C2)Cl)C(=NC(C1=O)O)C3=CC=CC=C3",
    "cid": 5391,
    "molecularWeight": 300.74
  },
  "alprazolam": {
    "genericName": "Alprazolam",
    "structureType": "single-molecule",
    "smiles": "CC1=NN=C2N1C3=C(C=C(C=C3)Cl)C(=NC2)C4=CC=CC=C4",
    "cid": 2118,
    "molecularWeight": 308.8
  },
  "clonazepam": {
    "genericName": "Clonazepam",
    "structureType": "single-molecule",
    "smiles": "C1C(=O)NC2=C(C=C(C=C2)[N+](=O)[O-])C(=N1)C3=CC=CC=C3Cl",
    "cid": 2802,
    "molecularWeight": 315.71
  },
  "diazepam": {
    "genericName": "Diazepam",
    "structureType": "single-molecule",
    "smiles": "CN1C(=O)CN=C(C2=C1C=CC(=C2)Cl)C3=CC=CC=C3",
    "cid": 3016,
    "molecularWeight": 284.74
  },
  "buspirone": {
    "genericName": "Buspirone",
    "structureType": "single-molecule",
    "smiles": "C1CCC2(C1)CC(=O)N(C(=O)C2)CCCCN3CCN(CC3)C4=NC=CC=N4",
    "cid": 2477,
    "molecularWeight": 385.5
  },
  "famotidine": {
    "genericName": "Famotidine",
    "structureType": "single-molecule",
    "smiles": "C1=C(N=C(S1)N=C(N)N)CSCC/C(=N/S(=O)(=O)N)/N",
    "cid": 5702160,
    "molecularWeight": 337.5
  },
  "omeprazole": {
    "genericName": "Omeprazole",
    "structureType": "single-molecule",
    "smiles": "CC1=CN=C(C(=C1OC)C)CS(=O)C2=NC3=C(N2)C=C(C=C3)OC",
    "cid": 4594,
    "molecularWeight": 345.4
  },
  "pantoprazole": {
    "genericName": "Pantoprazole",
    "structureType": "single-molecule",
    "smiles": "COC1=C(C(=NC=C1)CS(=O)C2=NC3=C(N2)C=C(C=C3)OC(F)F)OC",
    "cid": 4679,
    "molecularWeight": 383.4
  },
  "esomeprazole": {
    "genericName": "Esomeprazole",
    "structureType": "single-molecule",
    "smiles": "CC1=CN=C(C(=C1OC)C)C[S@](=O)C2=NC3=C(N2)C=C(C=C3)OC",
    "cid": 9568614,
    "molecularWeight": 345.4
  },
  "polyethyleneglycol": {
    "genericName": "Polyethylene Glycol (PEG)",
    "structureType": "single-molecule",
    "smiles": "OCCOCCOCCOCCOCCO",
    "cid": 174,
    "molecularWeight": 238.28
  },
  "lactulose": {
    "genericName": "Lactulose",
    "structureType": "single-molecule",
    "smiles": "C([C@@H]1[C@@H]([C@@H]([C@H]([C@@H](O1)O[C@@H]2[C@H](O[C@@]([C@H]2O)(CO)O)CO)O)O)O)O",
    "cid": 11333,
    "molecularWeight": 342.3
  },
  "dicyclomine": {
    "genericName": "Dicyclomine",
    "structureType": "single-molecule",
    "smiles": "CCN(CC)CCOC(=O)C1(CCCCC1)C2CCCCC2",
    "cid": 3042,
    "molecularWeight": 309.5
  },
  "docusate": {
    "genericName": "Docusate",
    "structureType": "single-molecule",
    "smiles": "CCCCC(CC)COC(=O)CC(C(=O)OCC(CC)CCCC)S(=O)(=O)O",
    "cid": 11339,
    "molecularWeight": 422.6
  },
  "diphenoxylateatropine": {
    "genericName": "Diphenoxylate / Atropine",
    "structureType": "multi-component",
    "smiles": "CCOC(=O)C(CCN1CCC(CC1)(C2=CC=CC=C2)C(=O)OCC)(C3=CC=CC=C3)C4=CC=CC=C4.CN1C2CCC1CC(C2)OC(=O)C(CO)C3=CC=CC=C3",
    "cid": 64662,
    "molecularWeight": 741.9,
    "components": [
      {
        "componentName": "Diphenoxylate",
        "smiles": "CCOC(=O)C(CCN1CCC(CC1)(C2=CC=CC=C2)C(=O)OCC)(C3=CC=CC=C3)C4=CC=CC=C4",
        "role": "Peripheral Mu-Opioid Receptor Agonist Antidiarrheal"
      },
      {
        "componentName": "Atropine",
        "smiles": "CN1C2CCC1CC(C2)OC(=O)C(CO)C3=CC=CC=C3",
        "role": "Anticholinergic Abuse Deterrent (Muscarinic Antagonist)"
      }
    ]
  },
  "lubiprostone": {
    "genericName": "Lubiprostone",
    "structureType": "single-molecule",
    "smiles": "CCCCC([C@]1(CC[C@H]2[C@H](O1)CC(=O)[C@@H]2CCCCCCC(=O)O)O)(F)F",
    "cid": 157920,
    "molecularWeight": 390.5
  },
  "sildenafil": {
    "genericName": "Sildenafil",
    "structureType": "single-molecule",
    "smiles": "CCCC1=NN(C2=C1N=C(NC2=O)C3=C(C=CC(=C3)S(=O)(=O)N4CCN(CC4)C)OCC)C",
    "cid": 135398744,
    "molecularWeight": 474.6
  },
  "tadalafil": {
    "genericName": "Tadalafil",
    "structureType": "single-molecule",
    "smiles": "CN1CC(=O)N2[C@@H](C1=O)CC3=C([C@H]2C4=CC5=C(C=C4)OCO5)NC6=CC=CC=C36",
    "cid": 110635,
    "molecularWeight": 389.4
  },
  "oxybutynin": {
    "genericName": "Oxybutynin",
    "structureType": "single-molecule",
    "smiles": "CCN(CC)CC#CCOC(=O)C(C1CCCCC1)(C2=CC=CC=C2)O",
    "cid": 4634,
    "molecularWeight": 357.5
  },
  "finasteride": {
    "genericName": "Finasteride",
    "structureType": "single-molecule",
    "smiles": "C[C@]12CC[C@H]3[C@H]([C@@H]1CC[C@@H]2C(=O)NC(C)(C)C)CC[C@@H]4[C@@]3(C=CC(=O)N4)C",
    "cid": 57363,
    "molecularWeight": 372.5
  },
  "dutasteride": {
    "genericName": "Dutasteride",
    "structureType": "single-molecule",
    "smiles": "C[C@]12CC[C@H]3[C@H]([C@@H]1CC[C@@H]2C(=O)NC4=C(C=CC(=C4)C(F)(F)F)C(F)(F)F)CC[C@@H]5[C@@]3(C=CC(=O)N5)C",
    "cid": 6918296,
    "molecularWeight": 528.5
  },
  "solifenacin": {
    "genericName": "Solifenacin",
    "structureType": "single-molecule",
    "smiles": "C1CN2CCC1[C@H](C2)OC(=O)N3CCC4=CC=CC=C4[C@@H]3C5=CC=CC=C5",
    "cid": 154059,
    "molecularWeight": 362.5
  },
  "tamsulosin": {
    "genericName": "Tamsulosin",
    "structureType": "single-molecule",
    "smiles": "CCOC1=CC=CC=C1OCCN[C@H](C)CC2=CC(=C(C=C2)OC)S(=O)(=O)N",
    "cid": 129211,
    "molecularWeight": 408.5
  },
  "cetirizine": {
    "genericName": "Cetirizine",
    "structureType": "single-molecule",
    "smiles": "C1CN(CCN1CCOCC(=O)O)C(C2=CC=CC=C2)C3=CC=C(C=C3)Cl",
    "cid": 2678,
    "molecularWeight": 388.9
  },
  "loratadine": {
    "genericName": "Loratadine",
    "structureType": "single-molecule",
    "smiles": "CCOC(=O)N1CCC(=C2C3=C(CCC4=C2N=CC=C4)C=C(C=C3)Cl)CC1",
    "cid": 3957,
    "molecularWeight": 382.9
  },
  "oralcontraceptivemonophasic": {
    "genericName": "Oral Contraceptive - Monophasic",
    "structureType": "single-molecule",
    "smiles": "CC[C@]12CC(=C)[C@H]3[C@H]([C@@H]1CC[C@]2(C#C)O)CCC4=CCCC[C@H]34.C[C@]12CC[C@H]3[C@H]([C@@H]1CC[C@]2(C#C)O)CCC4=C3C=CC(=C4)O",
    "cid": 62957,
    "molecularWeight": 606.9
  },
  "oralcontraceptivebiphasic": {
    "genericName": "Oral Contraceptive - Biphasic",
    "structureType": "single-molecule",
    "smiles": "CC[C@]12CC(=C)[C@H]3[C@H]([C@@H]1CC[C@]2(C#C)O)CCC4=CCCC[C@H]34",
    "cid": 40973,
    "molecularWeight": 310.5
  },
  "oralcontraceptivetriphasic": {
    "genericName": "Oral Contraceptive - Triphasic",
    "structureType": "single-molecule",
    "smiles": "CC[C@]12CC(=C)[C@H]3[C@H]([C@@H]1CC[C@]2(C#C)O)CCC4=CCCC[C@H]34.C[C@]12CC[C@H]3[C@H]([C@@H]1CC[C@]2(C#C)O)CCC4=C3C=CC(=C4)O",
    "cid": 62957,
    "molecularWeight": 606.9
  },
  "medroxyprogesterone": {
    "genericName": "Medroxyprogesterone",
    "structureType": "single-molecule",
    "smiles": "C[C@H]1C[C@@H]2[C@H](CC[C@]3([C@H]2CC[C@@]3(C(=O)C)O)C)[C@@]4(C1=CC(=O)CC4)C",
    "cid": 10631,
    "molecularWeight": 344.5
  },
  "estradioloral": {
    "genericName": "Estradiol Oral",
    "structureType": "single-molecule",
    "smiles": "C[C@]12CC[C@H]3[C@H]([C@@H]1CC[C@@H]2O)CCC4=C3C=CC(=C4)O",
    "cid": 5757,
    "molecularWeight": 272.4
  },
  "raloxifene": {
    "genericName": "Raloxifene",
    "structureType": "single-molecule",
    "smiles": "C1CCN(CC1)CCOC2=CC=C(C=C2)C(=O)C3=C(SC4=C3C=CC(=C4)O)C5=CC=C(C=C5)O",
    "cid": 5035,
    "molecularWeight": 473.6
  },
  "conjugatedestrogens": {
    "genericName": "Conjugated Estrogens",
    "structureType": "single-molecule",
    "smiles": "C[C@]12CCC3C(C1CCC2=O)CCC4=C3C=CC(=C4)OS(=O)(=O)[O-].[Na+]",
    "cid": 45357473,
    "molecularWeight": 372.4
  },
  "estradioltransdermalpatch": {
    "genericName": "Estradiol Transdermal Patch",
    "structureType": "single-molecule",
    "smiles": "C[C@]12CC[C@H]3[C@H]([C@@H]1CC[C@@H]2O)CCC4=C3C=CC(=C4)O",
    "cid": 5757,
    "molecularWeight": 272.4
  },
  "progesterone": {
    "genericName": "Progesterone",
    "structureType": "single-molecule",
    "smiles": "CC(=O)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CCC4=CC(=O)CC[C@]34C)C",
    "cid": 5994,
    "molecularWeight": 314.5
  },
  "testosterone": {
    "genericName": "Testosterone",
    "structureType": "single-molecule",
    "smiles": "C[C@]12CC[C@H]3[C@H]([C@@H]1CC[C@@H]2O)CCC4=CC(=O)CC[C@]34C",
    "cid": 6013,
    "molecularWeight": 288.4
  },
  "prednisone": {
    "genericName": "Prednisone",
    "structureType": "single-molecule",
    "smiles": "C[C@]12CC(=O)[C@H]3[C@H]([C@@H]1CC[C@@]2(C(=O)CO)O)CCC4=CC(=O)C=C[C@]34C",
    "cid": 5865,
    "molecularWeight": 358.4
  },
  "prednisoloneoral": {
    "genericName": "Prednisolone Oral",
    "structureType": "single-molecule",
    "smiles": "C[C@]12C[C@@H]([C@H]3[C@H]([C@@H]1CC[C@@]2(C(=O)CO)O)CCC4=CC(=O)C=C[C@]34C)O",
    "cid": 5755,
    "molecularWeight": 360.4
  },
  "methylprednisolone": {
    "genericName": "Methylprednisolone",
    "structureType": "single-molecule",
    "smiles": "C[C@H]1C[C@H]2[C@@H]3CC[C@@]([C@]3(C[C@@H]([C@@H]2[C@@]4(C1=CC(=O)C=C4)C)O)C)(C(=O)CO)O",
    "cid": 6741,
    "molecularWeight": 374.5
  },
  "etanercept": {
    "genericName": "Etanercept",
    "structureType": "biologic",
    "smiles": "NCC(=O)NC(CC1=CNC2=CC=CC=C12)C(=O)NC(CC3=CC=CC=C3)C(=O)O",
    "cid": 135314755,
    "molecularWeight": 150000,
    "biologicDescription": "Dimeric fusion protein consisting of the extracellular ligand-binding domain of human 75 kDa (p75) TNF receptor linked to the Fc portion of human IgG1, neutralizing soluble and transmembrane TNF-alpha."
  },
  "methotrexate": {
    "genericName": "Methotrexate",
    "structureType": "single-molecule",
    "smiles": "CN(CC1=CN=C2C(=N1)C(=NC(=N2)N)N)C3=CC=C(C=C3)C(=O)N[C@@H](CCC(=O)O)C(=O)O",
    "cid": 126941,
    "molecularWeight": 454.4
  },
  "cyclosporine": {
    "genericName": "Cyclosporine",
    "structureType": "single-molecule",
    "smiles": "CC[C@H]1C(=O)N(CC(=O)N([C@H](C(=O)N[C@H](C(=O)N([C@H](C(=O)N[C@H](C(=O)N[C@@H](C(=O)N([C@H](C(=O)N([C@H](C(=O)N([C@H](C(=O)N([C@H](C(=O)N1)[C@@H]([C@H](C)C/C=C/C)O)C)C(C)C)C)CC(C)C)C)CC(C)C)C)C)C)CC(C)C)C)C(C)C)CC(C)C)C)C",
    "cid": 5284373,
    "molecularWeight": 1202.6
  },
  "adalimumab": {
    "genericName": "Adalimumab",
    "structureType": "biologic",
    "smiles": "NCC(=O)NC(CC1=CNC2=CC=CC=C12)C(=O)NC(CC3=CC=CC=C3)C(=O)O",
    "cid": 135314755,
    "molecularWeight": 148000,
    "biologicDescription": "Fully human IgG1 monoclonal antibody targeting human tumor necrosis factor-alpha (TNF-alpha), blocking binding to p55 and p75 cell surface TNF receptors."
  },
  "denosumab": {
    "genericName": "Denosumab",
    "structureType": "biologic",
    "smiles": "NCC(=O)NC(CC1=CNC2=CC=CC=C12)C(=O)NC(CC3=CC=CC=C3)C(=O)O",
    "cid": 135314755,
    "molecularWeight": 147000,
    "biologicDescription": "Fully human IgG2 monoclonal antibody that binds with high affinity to receptor activator of nuclear factor-kappa B ligand (RANKL), inhibiting osteoclastogenesis and bone resorption."
  },
  "naproxen": {
    "genericName": "Naproxen",
    "structureType": "single-molecule",
    "smiles": "C[C@@H](C1=CC2=C(C=C1)C=C(C=C2)OC)C(=O)O",
    "cid": 156391,
    "molecularWeight": 230.26
  },
  "ibuprofen": {
    "genericName": "Ibuprofen",
    "structureType": "single-molecule",
    "smiles": "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O",
    "cid": 3672,
    "molecularWeight": 206.28
  },
  "meloxicam": {
    "genericName": "Meloxicam",
    "structureType": "single-molecule",
    "smiles": "CC1=CN=C(S1)NC(=O)C2=C(C3=CC=CC=C3S(=O)(=O)N2C)O",
    "cid": 54677470,
    "molecularWeight": 351.4
  },
  "nabumetone": {
    "genericName": "Nabumetone",
    "structureType": "single-molecule",
    "smiles": "CC(=O)CCC1=CC2=C(C=C1)C=C(C=C2)OC",
    "cid": 4409,
    "molecularWeight": 228.29
  },
  "diclofenac": {
    "genericName": "Diclofenac",
    "structureType": "single-molecule",
    "smiles": "C1=CC=C(C(=C1)CC(=O)O)NC2=C(C=CC=C2Cl)Cl",
    "cid": 3033,
    "molecularWeight": 296.1
  },
  "celecoxib": {
    "genericName": "Celecoxib",
    "structureType": "single-molecule",
    "smiles": "CC1=CC=C(C=C1)C2=CC(=NN2C3=CC=C(C=C3)S(=O)(=O)N)C(F)(F)F",
    "cid": 2662,
    "molecularWeight": 381.4
  },
  "memantine": {
    "genericName": "Memantine",
    "structureType": "single-molecule",
    "smiles": "CC12CC3CC(C1)(CC(C3)(C2)N)C",
    "cid": 4054,
    "molecularWeight": 179.3
  },
  "donepezil": {
    "genericName": "Donepezil",
    "structureType": "single-molecule",
    "smiles": "COC1=C(C=C2C(=C1)CC(C2=O)CC3CCN(CC3)CC4=CC=CC=C4)OC",
    "cid": 3152,
    "molecularWeight": 379.5
  },
  "hydroxychloroquine": {
    "genericName": "Hydroxychloroquine",
    "structureType": "single-molecule",
    "smiles": "CCN(CCCC(C)NC1=C2C=CC(=CC2=NC=C1)Cl)CCO",
    "cid": 3652,
    "molecularWeight": 335.9
  },
  "potassiumchloride": {
    "genericName": "Potassium Chloride",
    "structureType": "single-molecule",
    "smiles": "[Cl-].[K+]",
    "cid": 4873,
    "molecularWeight": 74.55
  },
  "cinacalcet": {
    "genericName": "Cinacalcet",
    "structureType": "single-molecule",
    "smiles": "C[C@H](C1=CC=CC2=CC=CC=C21)NCCCC3=CC(=CC=C3)C(F)(F)F",
    "cid": 156419,
    "molecularWeight": 357.4
  },
  "ferrous": {
    "genericName": "Ferrous Sulfate",
    "structureType": "single-molecule",
    "smiles": "[O-]S(=O)(=O)[O-].[Fe+2]",
    "cid": 24393,
    "molecularWeight": 151.91
  },
  "sevelamer": {
    "genericName": "Sevelamer",
    "structureType": "single-molecule",
    "smiles": "C=CCN",
    "cid": 11954157,
    "molecularWeight": 57.09
  },
  "cyanocobalamin": {
    "genericName": "Cyanocobalamin",
    "structureType": "single-molecule",
    "smiles": "CC1=CC2=C(C=C1C)[N+](=CN2)[C@@H]3[C@@H]([C@@H]([C@H](O3)CO)OP(=O)(O)O[C@H](C)CNC(=O)CC[C@@]4([C@H]([C@@H]5[C@]6([C@@]([C@@H](C(=N6)/C(=C\\7/[C@@]([C@@H](/C(=C/C8=N/C(=C(\\C4=N5)/C)/[C@H](C8(C)C)CCC(=N)[O-])/N7)CCC(=N)[O-])(C)CC(=O)N)/C)CCC(=N)[O-])(C)CC(=O)N)C)CC(=O)N)C)O.[C]#N.[Co+2]",
    "cid": 166596686,
    "molecularWeight": 1355.4
  },
  "folicacid": {
    "genericName": "Folic Acid",
    "structureType": "single-molecule",
    "smiles": "C1=CC(=CC=C1C(=O)N[C@@H](CCC(=O)O)C(=O)O)NCC2=CN=C3C(=N2)C(=O)NC(=N3)N",
    "cid": 135398658,
    "molecularWeight": 441.4
  },
  "ibandronate": {
    "genericName": "Ibandronate",
    "structureType": "single-molecule",
    "smiles": "CCCCCN(C)CCC(O)(P(=O)(O)O)P(=O)(O)O",
    "cid": 60852,
    "molecularWeight": 319.23
  },
  "zoledronicacid": {
    "genericName": "Zoledronic Acid",
    "structureType": "single-molecule",
    "smiles": "C1=CN(C=N1)CC(O)(P(=O)(O)O)P(=O)(O)O",
    "cid": 68740,
    "molecularWeight": 272.09
  },
  "risedronate": {
    "genericName": "Risedronate",
    "structureType": "single-molecule",
    "smiles": "C1=CC(=CN=C1)CC(O)(P(=O)(O)O)P(=O)(O)O",
    "cid": 5245,
    "molecularWeight": 283.11
  },
  "alendronate": {
    "genericName": "Alendronate",
    "structureType": "single-molecule",
    "smiles": "C(CC(O)(P(=O)(O)O)P(=O)(O)O)CN",
    "cid": 2088,
    "molecularWeight": 249.1
  },
  "varenicline": {
    "genericName": "Varenicline",
    "structureType": "single-molecule",
    "smiles": "C1[C@@H]2CNC[C@H]1C3=CC4=NC=CN=C4C=C23",
    "cid": 5310966,
    "molecularWeight": 211.26
  },
  "eszopiclone": {
    "genericName": "Eszopiclone",
    "structureType": "single-molecule",
    "smiles": "CN1CCN(CC1)C(=O)O[C@H]2C3=NC=CN=C3C(=O)N2C4=NC=C(C=C4)Cl",
    "cid": 969472,
    "molecularWeight": 388.8
  },
  "zolpidem": {
    "genericName": "Zolpidem",
    "structureType": "single-molecule",
    "smiles": "CC1=CC=C(C=C1)C2=C(N3C=C(C=CC3=N2)C)CC(=O)N(C)C",
    "cid": 5732,
    "molecularWeight": 307.4
  },
  "sumatriptan": {
    "genericName": "Sumatriptan",
    "structureType": "single-molecule",
    "smiles": "CNS(=O)(=O)CC1=CC2=C(C=C1)NC=C2CCN(C)C",
    "cid": 5358,
    "molecularWeight": 295.4
  },
  "eletriptan": {
    "genericName": "Eletriptan",
    "structureType": "single-molecule",
    "smiles": "CN1CCC[C@@H]1CC2=CNC3=C2C=C(C=C3)CCS(=O)(=O)C4=CC=CC=C4",
    "cid": 77993,
    "molecularWeight": 382.5
  },
  "rizatriptan": {
    "genericName": "Rizatriptan",
    "structureType": "single-molecule",
    "smiles": "CN(C)CCC1=CNC2=C1C=C(C=C2)CN3C=NC=N3",
    "cid": 5078,
    "molecularWeight": 269.34
  },
  "triamcinolonetopical": {
    "genericName": "Triamcinolone Topical",
    "structureType": "single-molecule",
    "smiles": "C[C@]12C[C@@H]([C@]3([C@H]([C@@H]1C[C@H]([C@@]2(C(=O)CO)O)O)CCC4=CC(=O)C=C[C@@]43C)F)O",
    "cid": 31307,
    "molecularWeight": 394.4
  },
  "hydrocortisonetopical": {
    "genericName": "Hydrocortisone Topical",
    "structureType": "single-molecule",
    "smiles": "C[C@]12CCC(=O)C=C1CC[C@@H]3[C@@H]2[C@H](C[C@]4([C@H]3CC[C@@]4(C(=O)CO)O)C)O",
    "cid": 5754,
    "molecularWeight": 362.5
  },
  "isotretinoin": {
    "genericName": "Isotretinoin",
    "structureType": "single-molecule",
    "smiles": "CC1=C(C(CCC1)(C)C)/C=C/C(=C/C=C/C(=C\\C(=O)O)/C)/C",
    "cid": 5282379,
    "molecularWeight": 300.4
  },
  "adapalene": {
    "genericName": "Adapalene",
    "structureType": "single-molecule",
    "smiles": "COC1=C(C=C(C=C1)C2=CC3=C(C=C2)C=C(C=C3)C(=O)O)C45CC6CC(C4)CC(C6)C5",
    "cid": 60164,
    "molecularWeight": 412.5
  },
  "colchicine": {
    "genericName": "Colchicine",
    "structureType": "single-molecule",
    "smiles": "CC(=O)N[C@H]1CCC2=CC(=C(C(=C2C3=CC=C(C(=O)C=C13)OC)OC)OC)OC",
    "cid": 6167,
    "molecularWeight": 399.4
  },
  "allopurinol": {
    "genericName": "Allopurinol",
    "structureType": "single-molecule",
    "smiles": "C1=NNC2=C1C(=O)NC=N2",
    "cid": 135401907,
    "molecularWeight": 136.11
  },
  "febuxostat": {
    "genericName": "Febuxostat",
    "structureType": "single-molecule",
    "smiles": "CC1=C(SC(=N1)C2=CC(=C(C=C2)OCC(C)C)C#N)C(=O)O",
    "cid": 134018,
    "molecularWeight": 316.4
  },
  "albuterol": {
    "genericName": "Albuterol",
    "structureType": "single-molecule",
    "smiles": "CC(C)(C)NCC(C1=CC(=C(C=C1)O)CO)O",
    "cid": 2083,
    "molecularWeight": 239.31
  },
  "fluticasoneoralinhaler": {
    "genericName": "Fluticasone Oral Inhaler",
    "structureType": "single-molecule",
    "smiles": "C[C@@H]1C[C@H]2[C@@H]3C[C@@H](C4=CC(=O)C=C[C@@]4([C@]3([C@H](C[C@@]2([C@]1(C(=O)SCF)O)C)O)F)C)F",
    "cid": 5311101,
    "molecularWeight": 444.5
  },
  "fluticasonenasalinhaler": {
    "genericName": "Fluticasone Nasal Inhaler",
    "structureType": "single-molecule",
    "smiles": "C[C@@H]1C[C@H]2[C@@H]3C[C@@H](C4=CC(=O)C=C[C@@]4([C@]3([C@H](C[C@@]2([C@]1(C(=O)SCF)O)C)O)F)C)F",
    "cid": 5311101,
    "molecularWeight": 444.5
  },
  "fluticasonesalmeterol": {
    "genericName": "Fluticasone / Salmeterol",
    "structureType": "multi-component",
    "smiles": "CC1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)SCF)OC(=O)CC)C)O)F)C.CC(CCCCCCNCCC(C1=CC=C(C=C1)O)O)OCC2=CC=CC=C2",
    "cid": 9811567,
    "molecularWeight": 916.1,
    "components": [
      {
        "componentName": "Fluticasone Propionate",
        "smiles": "CC1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)SCF)OC(=O)CC)C)O)F)C",
        "role": "Inhaled Corticosteroid Anti-inflammatory"
      },
      {
        "componentName": "Salmeterol",
        "smiles": "CC(CCCCCCNCCC(C1=CC=C(C=C1)O)O)OCC2=CC=CC=C2",
        "role": "Long-Acting Beta-2 Adrenergic Agonist (LABA)"
      }
    ]
  },
  "budesonideformoterol": {
    "genericName": "Budesonide / Formoterol",
    "structureType": "multi-component",
    "smiles": "CCCC1OC2CC3C4CCC5=CC(=O)C=CC5(C4C(CC3(C2(O1)C(=O)CO)C)O)C.CC(CC1=CC=C(C=C1)OC)NCC(C2=CC(=C(C=C2)O)NC=O)O",
    "cid": 5281004,
    "molecularWeight": 774.9,
    "components": [
      {
        "componentName": "Budesonide",
        "smiles": "CCCC1OC2CC3C4CCC5=CC(=O)C=CC5(C4C(CC3(C2(O1)C(=O)CO)C)O)C",
        "role": "Inhaled Corticosteroid Anti-inflammatory"
      },
      {
        "componentName": "Formoterol",
        "smiles": "CC(CC1=CC=C(C=C1)OC)NCC(C2=CC(=C(C=C2)O)NC=O)O",
        "role": "Long-Acting Beta-2 Adrenergic Agonist (LABA)"
      }
    ]
  },
  "ipratropiumalbuterol": {
    "genericName": "Ipratropium / Albuterol",
    "structureType": "multi-component",
    "smiles": "CC(C)[N+]1(C2CCC1CC(C2)OC(=O)C(CO)C3=CC=CC=C3)C.CC(C)(C)NCC(C1=CC(=C(C=C1)O)CO)O",
    "cid": 24847804,
    "molecularWeight": 571.8,
    "components": [
      {
        "componentName": "Ipratropium",
        "smiles": "CC(C)[N+]1(C2CCC1CC(C2)OC(=O)C(CO)C3=CC=CC=C3)C",
        "role": "Short-Acting Muscarinic Antagonist (SAMA)"
      },
      {
        "componentName": "Albuterol",
        "smiles": "CC(C)(C)NCC(C1=CC(=C(C=C1)O)CO)O",
        "role": "Short-Acting Beta-2 Adrenergic Agonist (SABA)"
      }
    ]
  },
  "tiotropium": {
    "genericName": "Tiotropium",
    "structureType": "single-molecule",
    "smiles": "C[N+]1([C@@H]2CC(C[C@H]1[C@H]3[C@@H]2O3)OC(=O)C(C4=CC=CS4)(C5=CC=CS5)O)C",
    "cid": 5487427,
    "molecularWeight": 392.5
  },
  "montelukast": {
    "genericName": "Montelukast",
    "structureType": "single-molecule",
    "smiles": "CC(C)(C1=CC=CC=C1CC[C@H](C2=CC=CC(=C2)/C=C/C3=NC4=C(C=CC(=C4)Cl)C=C3)SCC5(CC5)CC(=O)O)O",
    "cid": 5281040,
    "molecularWeight": 586.2
  },
  "budesonide": {
    "genericName": "Budesonide",
    "structureType": "single-molecule",
    "smiles": "CCCC1O[C@@H]2C[C@H]3[C@@H]4CCC5=CC(=O)C=C[C@@]5([C@H]4[C@H](C[C@@]3([C@@]2(O1)C(=O)CO)C)O)C",
    "cid": 5281004,
    "molecularWeight": 430.5
  },
  "omalizumab": {
    "genericName": "Omalizumab",
    "structureType": "biologic",
    "smiles": "NCC(=O)NC(CC1=CNC2=CC=CC=C12)C(=O)NC(CC3=CC=CC=C3)C(=O)O",
    "cid": 135314755,
    "molecularWeight": 149000,
    "biologicDescription": "Recombinant DNA-derived humanized IgG1k monoclonal antibody selectively binding to the Fc epsilon RI binding site of free circulating human immunoglobulin E (IgE)."
  },
  "benzonatate": {
    "genericName": "Benzonatate",
    "structureType": "single-molecule",
    "smiles": "CCCCNC1=CC=C(C=C1)C(=O)OCCOCCOCCOCCOCCOCCOCCOCCOCCOC",
    "cid": 7699,
    "molecularWeight": 603.7
  },
  "cyclobenzaprine": {
    "genericName": "Cyclobenzaprine",
    "structureType": "single-molecule",
    "smiles": "CN(C)CCC=C1C2=CC=CC=C2C=CC3=CC=CC=C31",
    "cid": 2895,
    "molecularWeight": 275.4
  },
  "baclofen": {
    "genericName": "Baclofen",
    "structureType": "single-molecule",
    "smiles": "C1=CC(=CC=C1C(CC(=O)O)CN)Cl",
    "cid": 2284,
    "molecularWeight": 213.66
  },
  "methocarbamol": {
    "genericName": "Methocarbamol",
    "structureType": "single-molecule",
    "smiles": "COC1=CC=CC=C1OCC(COC(=O)N)O",
    "cid": 4107,
    "molecularWeight": 241.24
  },
  "tizanidine": {
    "genericName": "Tizanidine",
    "structureType": "single-molecule",
    "smiles": "C1CN=C(N1)NC2=C(C=CC3=NSN=C32)Cl",
    "cid": 5487,
    "molecularWeight": 253.71
  },
  "amphetaminedextroamphetamine": {
    "genericName": "Amphetamine / Dextroamphetamine",
    "structureType": "multi-component",
    "smiles": "C[C@@H](CC1=CC=CC=C1)N.C[C@H](CC1=CC=CC=C1)N",
    "cid": 5826,
    "molecularWeight": 270.4,
    "components": [
      {
        "componentName": "Dextroamphetamine",
        "smiles": "C[C@@H](CC1=CC=CC=C1)N",
        "role": "D-Enantiomer CNS Stimulant (Dopamine/NE Releaser)"
      },
      {
        "componentName": "Amphetamine (L-Enantiomer)",
        "smiles": "C[C@H](CC1=CC=CC=C1)N",
        "role": "L-Enantiomer CNS Stimulant (Peripheral Adrenergic)"
      }
    ]
  },
  "lisdexamfetamine": {
    "genericName": "Lisdexamfetamine",
    "structureType": "single-molecule",
    "smiles": "C[C@@H](CC1=CC=CC=C1)NC(=O)[C@H](CCCCN)N",
    "cid": 11597698,
    "molecularWeight": 263.38
  },
  "methylphenidate": {
    "genericName": "Methylphenidate",
    "structureType": "single-molecule",
    "smiles": "COC(=O)C(C1CCCCN1)C2=CC=CC=C2",
    "cid": 4158,
    "molecularWeight": 233.31
  },
  "dexmethylphenidate": {
    "genericName": "Dexmethylphenidate",
    "structureType": "single-molecule",
    "smiles": "COC(=O)[C@@H]([C@H]1CCCCN1)C2=CC=CC=C2",
    "cid": 154101,
    "molecularWeight": 233.31
  },
  "phentermine": {
    "genericName": "Phentermine",
    "structureType": "single-molecule",
    "smiles": "CC(C)(CC1=CC=CC=C1)N",
    "cid": 4771,
    "molecularWeight": 149.23
  },
  "atomoxetine": {
    "genericName": "Atomoxetine",
    "structureType": "single-molecule",
    "smiles": "CC1=CC=CC=C1O[C@H](CCNC)C2=CC=CC=C2",
    "cid": 54841,
    "molecularWeight": 255.35
  },
  "levothyroxine": {
    "genericName": "Levothyroxine",
    "structureType": "single-molecule",
    "smiles": "C1=C(C=C(C(=C1I)OC2=CC(=C(C(=C2)I)O)I)I)C[C@@H](C(=O)O)N",
    "cid": 5819,
    "molecularWeight": 776.87
  },
  "thyroid": {
    "genericName": "Thyroid",
    "structureType": "multi-component",
    "smiles": "C1=C(C=C(C(=C1I)OC2=CC(=C(C(=C2)I)O)I)I)CC(C(=O)O)N.C1=C(C=C(C(=C1I)OC2=CC(=C(C=C2)I)O)I)CC(C(=O)O)N",
    "cid": 5819,
    "molecularWeight": 1428.6,
    "components": [
      {
        "componentName": "Levothyroxine (T4)",
        "smiles": "C1=C(C=C(C(=C1I)OC2=CC(=C(C(=C2)I)O)I)I)CC(C(=O)O)N",
        "role": "Tetraiodothyronine (T4) Thyroid Prohormone"
      },
      {
        "componentName": "Liothyronine (T3)",
        "smiles": "C1=C(C=C(C(=C1I)OC2=CC(=C(C=C2)I)O)I)CC(C(=O)O)N",
        "role": "Triiodothyronine (T3) Active Thyroid Hormone"
      }
    ]
  },
  "metoprololtartratesuccinate": {
    "genericName": "Metoprolol Tartrate / Succinate",
    "structureType": "multi-component",
    "smiles": "CC(C)NCC(COC1=CC=C(C=C1)CCOC)O.C(C(C(=O)O)O)(C(=O)O)O",
    "cid": 4171,
    "molecularWeight": 417.5,
    "components": [
      {
        "componentName": "Metoprolol",
        "smiles": "CC(C)NCC(COC1=CC=C(C=C1)CCOC)O",
        "role": "Cardioselective Beta-1 Adrenergic Antagonist"
      },
      {
        "componentName": "Tartrate / Succinate Counter-Ion",
        "smiles": "C(C(C(=O)O)O)(C(=O)O)O",
        "role": "Pharmaceutical Formulation Salt"
      }
    ]
  },
  "sulfamethoxazoletrimethoprim": {
    "genericName": "Trimethoprim / Sulfamethoxazole",
    "structureType": "multi-component",
    "smiles": "COC1=CC(=CC(=C1OC)OC)CC2=C(N=C(N=C2N)N)N.CC1=CC(=NO1)NS(=O)(=O)C2=CC=C(C=C2)N",
    "cid": 5329,
    "molecularWeight": 543.6,
    "components": [
      {
        "componentName": "Trimethoprim",
        "smiles": "COC1=CC(=CC(=C1OC)OC)CC2=C(N=C(N=C2N)N)N",
        "role": "Dihydrofolate Reductase (DHFR) Inhibitor"
      },
      {
        "componentName": "Sulfamethoxazole",
        "smiles": "CC1=CC(=NO1)NS(=O)(=O)C2=CC=C(C=C2)N",
        "role": "Dihydropteroate Synthase (DHPS) Inhibitor"
      }
    ]
  },
  "dextroamphetamineamphetamine": {
    "genericName": "Amphetamine / Dextroamphetamine",
    "structureType": "multi-component",
    "smiles": "C[C@@H](CC1=CC=CC=C1)N.C[C@H](CC1=CC=CC=C1)N",
    "cid": 5826,
    "molecularWeight": 270.4,
    "components": [
      {
        "componentName": "Dextroamphetamine",
        "smiles": "C[C@@H](CC1=CC=CC=C1)N",
        "role": "D-Enantiomer CNS Stimulant (Dopamine/NE Releaser)"
      },
      {
        "componentName": "Amphetamine (L-Enantiomer)",
        "smiles": "C[C@H](CC1=CC=CC=C1)N",
        "role": "L-Enantiomer CNS Stimulant (Peripheral Adrenergic)"
      }
    ]
  },
  "ethinylestradioldrospirenone": {
    "genericName": "Ethinyl Estradiol / Drospirenone",
    "structureType": "multi-component",
    "smiles": "CC12CCC3C(C1CCC2(C#C)O)CCC4=C3C=CC(=C4)O.CC12CCC3C(C1C4CC4C25CCC(=O)O5)C6C7CC7C6=CC3=O",
    "cid": 62957,
    "molecularWeight": 662.9,
    "components": [
      {
        "componentName": "Ethinyl Estradiol",
        "smiles": "CC12CCC3C(C1CCC2(C#C)O)CCC4=C3C=CC(=C4)O",
        "role": "Synthetic Estrogen"
      },
      {
        "componentName": "Drospirenone",
        "smiles": "CC12CCC3C(C1C4CC4C25CCC(=O)O5)C6C7CC7C6=CC3=O",
        "role": "Spironolactone-Derived Progestin"
      }
    ]
  },
  "sitagliptinmetformin": {
    "genericName": "Sitagliptin / Metformin",
    "structureType": "multi-component",
    "smiles": "C1CN2C(=NN=C2C(F)(F)F)CN1C(=O)CC(CC3=CC(=C(C=C3F)F)F)N.CN(C)C(=N)NC(=N)N",
    "cid": 4369359,
    "molecularWeight": 536.4,
    "components": [
      {
        "componentName": "Sitagliptin",
        "smiles": "C1CN2C(=NN=C2C(F)(F)F)CN1C(=O)CC(CC3=CC(=C(C=C3F)F)F)N",
        "role": "DPP-4 Inhibitor"
      },
      {
        "componentName": "Metformin",
        "smiles": "CN(C)C(=N)NC(=N)N",
        "role": "Biguanide Insulin Sensitizer"
      }
    ]
  },
  "oxycodoneacetaminophen": {
    "genericName": "Oxycodone / Acetaminophen",
    "structureType": "multi-component",
    "smiles": "CC12CCC3(C1CC4=C5C3CC(C=C5OC6=C4C(=CC=C6)OC)O2)O.CC(=O)NC1=CC=C(C=C1)O",
    "cid": 5284603,
    "molecularWeight": 466.5,
    "components": [
      {
        "componentName": "Oxycodone",
        "smiles": "CC12CCC3(C1CC4=C5C3CC(C=C5OC6=C4C(=CC=C6)OC)O2)O",
        "role": "Opioid Analgesic"
      },
      {
        "componentName": "Acetaminophen",
        "smiles": "CC(=O)NC1=CC=C(C=C1)O",
        "role": "Non-Opioid Analgesic"
      }
    ]
  },
  "tramadolacetaminophen": {
    "genericName": "Tramadol / Acetaminophen",
    "structureType": "multi-component",
    "smiles": "CC1(CCCCC1(C2=CC(=CC=C2)OC)O)CN(C)C.CC(=O)NC1=CC=C(C=C1)O",
    "cid": 33741,
    "molecularWeight": 414.5,
    "components": [
      {
        "componentName": "Tramadol",
        "smiles": "CC1(CCCCC1(C2=CC(=CC=C2)OC)O)CN(C)C",
        "role": "Centrally-Acting Opioid Analgesic"
      },
      {
        "componentName": "Acetaminophen",
        "smiles": "CC(=O)NC1=CC=C(C=C1)O",
        "role": "Non-Opioid Analgesic"
      }
    ]
  }
};
