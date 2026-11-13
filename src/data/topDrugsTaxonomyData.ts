/**
 * Master Top Drugs Taxonomy Data Catalog
 * Source: Xavier University College of Pharmacy Top Drugs Reference & Curriculum Standards
 * 39 Standardized Therapeutic Classes, Broad Classes, Specific Pharmacologic Subclasses,
 * Generic Names, and Common Brand Names.
 */

export interface TopDrugEntry {
  genericName: string;
  brandNames: string[];
  therapeuticClassNumber: number; // 1 to 39
  therapeuticCategory: string; // e.g. "2. Antibiotic"
  broadPharmacologicClass: string; // e.g. "Cephalosporin"
  specificPharmacologicClass: string; // e.g. "1st Generation Cephalosporin"
  curriculumModuleId?: string; // Optional link to review module
  notes?: string;
}

export interface TherapeuticClassCategory {
  classNumber: number;
  categoryName: string; // e.g. "2. Antibiotic"
  broadClasses: string[];
  specificSubclasses: string[];
  totalDrugs: number;
}

export const THERAPEUTIC_CATEGORIES: TherapeuticClassCategory[] = [
  {
    "classNumber": 1,
    "categoryName": "1. Analgesic",
    "broadClasses": [
      "Non-Opioid Analgesic",
      "Analgesic Combination",
      "Opioid",
      "Urinary Tract Agent",
      "Local Anesthetic"
    ],
    "specificSubclasses": [
      "Non-Opioid Analgesic / Antipyretic",
      "Salicylate / Antipyretic",
      "Barbiturate / Non-Opioid Combination",
      "Opioid Combination",
      "Centrally Acting Opioid Agonist",
      "Opioid Agonist",
      "Opioid Agonist / NMDA Antagonist",
      "Anilidopiperidine Opioid Agonist",
      "Opioid Partial Agonist / Antagonist Combination",
      "Urinary Tract Analgesic",
      "Topical Anesthetic"
    ],
    "totalDrugs": 12
  },
  {
    "classNumber": 2,
    "categoryName": "2. Antibiotic",
    "broadClasses": [
      "Penicillin",
      "Cephalosporin",
      "Tetracycline",
      "Fluoroquinolone",
      "Macrolide",
      "Lincosamide",
      "Sulfonamide",
      "Nitroimidazole",
      "Anthelmintic",
      "Nitrofuran",
      "Topical Antibacterial",
      "Antiseptic"
    ],
    "specificSubclasses": [
      "Natural Penicillin",
      "Aminopenicillin",
      "Aminopenicillin / Beta-Lactamase Inhibitor",
      "1st Generation Cephalosporin",
      "2nd Generation Cephalosporin",
      "3rd Generation Cephalosporin",
      "Tetracycline Derivative",
      "Fluoroquinolone",
      "Macrolide",
      "Lincosamide (Topical)",
      "Lincosamide (Oral)",
      "Sulfonamide / Folate Antagonist Combination",
      "Nitroimidazole Antimicrobial",
      "Benzimidazole Anthelmintic",
      "Nitrofuran Derivative",
      "Topical Antibacterial",
      "Oral Rinse / Topical Antiseptic"
    ],
    "totalDrugs": 20
  },
  {
    "classNumber": 3,
    "categoryName": "3. Anticonvulsant",
    "broadClasses": [
      "Hydantoin",
      "Phenyltriazine",
      "Pyrrolidine",
      "Dibenzazepine",
      "GABA Analog",
      "Sulfamate-Substituted Monosaccharide",
      "Fatty Acid Derivative"
    ],
    "specificSubclasses": [
      "Hydantoin Anticonvulsant",
      "Phenyltriazine Anticonvulsant",
      "Pyrrolidine Anticonvulsant",
      "Dibenzazepine Carboxamide",
      "GABA Analog / Anticonvulsant / Analgesic",
      "Miscellaneous Anticonvulsant",
      "Histone Deacetylase Inhibitor / Anticonvulsant",
      "GABA Analog / Anticonvulsant"
    ],
    "totalDrugs": 8
  },
  {
    "classNumber": 4,
    "categoryName": "4. Antidepressant",
    "broadClasses": [
      "SSRI",
      "SARI",
      "SNRI",
      "NDRI",
      "Tricyclic Antidepressant",
      "Tetracyclic / Alpha-2 Antagonist"
    ],
    "specificSubclasses": [
      "Selective Serotonin Reuptake Inhibitor",
      "Serotonin Reuptake Inhibitor / Antagonist",
      "Serotonin/Norepinephrine Reuptake Inhibitor",
      "Dopamine/Norepinephrine Reuptake Inhibitor",
      "Tricyclic Antidepressant (Secondary Amine)",
      "Tricyclic Antidepressant (Tertiary Amine)",
      "Noradrenergic and Specific Serotonergic Antidepressant"
    ],
    "totalDrugs": 12
  },
  {
    "classNumber": 5,
    "categoryName": "5. Antidiabetic Agent --- Oral",
    "broadClasses": [
      "Biguanide",
      "Sulfonylurea",
      "Thiazolidinedione",
      "DPP-4 Inhibitor",
      "SGLT2 Inhibitor"
    ],
    "specificSubclasses": [
      "Biguanide",
      "Second-Generation Sulfonylurea",
      "Thiazolidinedione (PPAR-gamma Agonist)",
      "Dipeptidyl Peptidase 4 (DPP-4) Inhibitor",
      "Sodium-Glucose Co-Transporter 2 (SGLT2) Inhibitor"
    ],
    "totalDrugs": 7
  },
  {
    "classNumber": 6,
    "categoryName": "6. Antidiabetic Agent --- Injectable/Insulin Product",
    "broadClasses": [
      "Insulin",
      "GLP-1 Receptor Agonist",
      "GIP/GLP-1 Dual Agonist"
    ],
    "specificSubclasses": [
      "Rapid-Acting Insulin",
      "Short-Acting Insulin",
      "Long-Acting Insulin",
      "Ultra Long-Acting Insulin",
      "Glucagon-Like Peptide-1 (GLP-1) Receptor Agonist",
      "Dual GIP and GLP-1 Receptor Agonist"
    ],
    "totalDrugs": 9
  },
  {
    "classNumber": 7,
    "categoryName": "7. Ophthalmic Agent",
    "broadClasses": [
      "Prostaglandin Analog",
      "Alpha-2 Agonist",
      "Beta-Blocker"
    ],
    "specificSubclasses": [
      "Ophthalmic Prostaglandin Analog",
      "Ophthalmic Alpha-2 Adrenergic Agonist",
      "Ophthalmic Nonselective Beta-Blocker"
    ],
    "totalDrugs": 3
  },
  {
    "classNumber": 8,
    "categoryName": "8. Antiemetic",
    "broadClasses": [
      "Phenothiazine",
      "Piperazine",
      "5-HT3 Receptor Antagonist",
      "Dopamine Antagonist / Prokinetic"
    ],
    "specificSubclasses": [
      "First-Generation Histamine H1 Antagonist / Phenothiazine",
      "First-Generation Histamine H1 Antagonist / Piperazine",
      "Selective 5-HT3 Receptor Antagonist",
      "Prokinetic Gastrointestinal Agent"
    ],
    "totalDrugs": 6
  },
  {
    "classNumber": 9,
    "categoryName": "9. Antifungal Agent",
    "broadClasses": [
      "Azole Antifungal",
      "Antifungal / Corticosteroid Combination",
      "Polyene Antifungal"
    ],
    "specificSubclasses": [
      "Triazole Antifungal",
      "Imidazole Antifungal (Topical)",
      "Topical Antifungal and Corticosteroid",
      "Polyene Antifungal (Topical)"
    ],
    "totalDrugs": 4
  },
  {
    "classNumber": 10,
    "categoryName": "10. Cardiovascular --- Anti-Lipemic Agent",
    "broadClasses": [
      "HMG-CoA Reductase Inhibitor",
      "Cholesterol Absorption Inhibitor",
      "Fibric Acid Derivative",
      "Vitamin / Antilipemic",
      "Omega-3 Fatty Acid",
      "PCSK9 Inhibitor"
    ],
    "specificSubclasses": [
      "Statin (HMG-CoA Reductase Inhibitor)",
      "2-Azetidinone Cholesterol Absorption Inhibitor",
      "Fibric Acid Derivative (Fibrate)",
      "Water-Soluble Vitamin / Antilipemic Agent",
      "Omega-3 Fatty Acid Derivative",
      "PCSK9 Inhibitor Monoclonal Antibody"
    ],
    "totalDrugs": 11
  },
  {
    "classNumber": 11,
    "categoryName": "11. Cardiovascular --- Antihypertensive",
    "broadClasses": [
      "ACE Inhibitor",
      "ARB",
      "Diuretic",
      "Calcium Channel Blocker",
      "Beta-Blocker",
      "Alpha-1 Blocker",
      "Alpha-2 Agonist",
      "Vasodilator"
    ],
    "specificSubclasses": [
      "Angiotensin-Converting Enzyme (ACE) Inhibitor",
      "Angiotensin II Receptor Blocker",
      "Thiazide Diuretic",
      "Thiazide-Like Diuretic",
      "Loop Diuretic",
      "Potassium-Sparing and Thiazide Diuretic",
      "Aldosterone Receptor Antagonist / Potassium-Sparing Diuretic",
      "Dihydropyridine Calcium Channel Blocker",
      "Non-Dihydropyridine Calcium Channel Blocker",
      "Beta-1 Selective Adrenergic Blocker",
      "Nonselective Beta-Adrenergic Blocker",
      "Nonselective Beta-Blocker with Alpha-1 Blocking Activity",
      "Alpha-1 Adrenergic Blocker",
      "Central Alpha-2 Adrenergic Agonist",
      "Direct Vasodilator"
    ],
    "totalDrugs": 27
  },
  {
    "classNumber": 12,
    "categoryName": "12. Cardiovascular --- Anticoagulant",
    "broadClasses": [
      "Direct Oral Anticoagulant",
      "Vitamin K Antagonist",
      "Heparin"
    ],
    "specificSubclasses": [
      "Direct Factor Xa Inhibitor",
      "Vitamin K Antagonist",
      "Direct Thrombin Inhibitor",
      "Low Molecular Weight Heparin (LMWH)",
      "Unfractionated Heparin"
    ],
    "totalDrugs": 6
  },
  {
    "classNumber": 13,
    "categoryName": "13. Cardiovascular --- Antiplatelet Agent/Hematopoietic Agent",
    "broadClasses": [
      "Antiplatelet",
      "Hematopoietic Agent"
    ],
    "specificSubclasses": [
      "P2Y12 Platelet Inhibitor (Thienopyridine)",
      "Antiplatelet / Salicylate Combination",
      "Erythropoiesis-Stimulating Agent (ESA)"
    ],
    "totalDrugs": 3
  },
  {
    "classNumber": 14,
    "categoryName": "14. Cardiovascular --- Antiarrhythmic",
    "broadClasses": [
      "Antiarrhythmic",
      "Cardiac Glycoside"
    ],
    "specificSubclasses": [
      "Class III Antiarrhythmic Agent",
      "Cardiac Glycoside"
    ],
    "totalDrugs": 2
  },
  {
    "classNumber": 15,
    "categoryName": "15. Cardiovascular --- Antianginal",
    "broadClasses": [
      "Vasodilator",
      "Calcium Channel Blocker"
    ],
    "specificSubclasses": [
      "Nitrate Vasodilator",
      "Non-Dihydropyridine Calcium Channel Blocker"
    ],
    "totalDrugs": 3
  },
  {
    "classNumber": 16,
    "categoryName": "16. Anti-Parkinson's Agent",
    "broadClasses": [
      "Dopamine Agonist",
      "Anticholinergic",
      "Dopamine Precursor"
    ],
    "specificSubclasses": [
      "Non-Ergot Dopamine Agonist",
      "Centrally Acting Anticholinergic",
      "Decarboxylase Inhibitor and Dopamine Precursor"
    ],
    "totalDrugs": 4
  },
  {
    "classNumber": 17,
    "categoryName": "17. Antipsychotic",
    "broadClasses": [
      "Typical Antipsychotic",
      "Atypical Antipsychotic",
      "Antimanic"
    ],
    "specificSubclasses": [
      "First-Generation (Typical) Antipsychotic",
      "Second-Generation (Atypical) Antipsychotic",
      "Second-Generation (Atypical) Antipsychotic / Dopamine Partial Agonist",
      "Mood Stabilizer / Antimanic Agent"
    ],
    "totalDrugs": 7
  },
  {
    "classNumber": 18,
    "categoryName": "18. Antiretroviral",
    "broadClasses": [
      "NRTI",
      "NNRTI",
      "INSTI",
      "HCV Polymerase Inhibitor"
    ],
    "specificSubclasses": [
      "Nucleoside / Nucleotide Reverse Transcriptase Inhibitor",
      "Non-Nucleoside Reverse Transcriptase Inhibitor",
      "Integrase Strand Transfer Inhibitor",
      "NS5B Polymerase Inhibitor"
    ],
    "totalDrugs": 4
  },
  {
    "classNumber": 19,
    "categoryName": "19. Antiviral",
    "broadClasses": [
      "Neuraminidase Inhibitor",
      "DNA Polymerase Inhibitor"
    ],
    "specificSubclasses": [
      "Neuraminidase Inhibitor",
      "Guanosine Nucleoside Analog",
      "Cytomegalovirus (CMV) Nucleoside Analog"
    ],
    "totalDrugs": 4
  },
  {
    "classNumber": 20,
    "categoryName": "20. Anxiolytics",
    "broadClasses": [
      "Benzodiazepine",
      "Azaspirodecanedione"
    ],
    "specificSubclasses": [
      "Intermediate-Acting Benzodiazepine",
      "Short-Acting Benzodiazepine",
      "Long-Acting Benzodiazepine",
      "Non-Benzodiazepine Anxiolytic (5-HT1A Agonist)"
    ],
    "totalDrugs": 6
  },
  {
    "classNumber": 21,
    "categoryName": "21. Gastrointestinal Agent",
    "broadClasses": [
      "H2 Blocker",
      "Proton Pump Inhibitor",
      "Laxative",
      "Antispasmodic",
      "Stool Softener",
      "Antidiarrheal",
      "Chloride Channel Activator"
    ],
    "specificSubclasses": [
      "Histamine H2 Antagonist",
      "Proton Pump Inhibitor (Substituted Benzimidazole)",
      "Osmotic Laxative",
      "Osmotic Laxative / Ammonium Detoxicant",
      "Gastrointestinal Anticholinergic",
      "Surfactant Laxative / Stool Softener",
      "Opioid Antidiarrheal / Anticholinergic Combination",
      "Chloride Channel Activator"
    ],
    "totalDrugs": 10
  },
  {
    "classNumber": 22,
    "categoryName": "22. Genitourinary Agent",
    "broadClasses": [
      "PDE-5 Inhibitor",
      "Urinary Antispasmodic",
      "5-Alpha-Reductase Inhibitor",
      "Alpha-1 Blocker"
    ],
    "specificSubclasses": [
      "Phosphodiesterase-5 (PDE-5) Inhibitor",
      "Anticholinergic / Muscarinic Antagonist",
      "5-Alpha-Reductase Inhibitor (Type II)",
      "5-Alpha-Reductase Inhibitor (Type I & II)",
      "Anticholinergic / Muscarinic M3 Antagonist",
      "Uroselective Alpha-1A Blocker"
    ],
    "totalDrugs": 7
  },
  {
    "classNumber": 23,
    "categoryName": "23. Antihistamine",
    "broadClasses": [
      "Second-Generation Antihistamine"
    ],
    "specificSubclasses": [
      "Second-Generation H1 Antagonist (Piperazine Derivative)",
      "Second-Generation H1 Antagonist (Piperidine Derivative)"
    ],
    "totalDrugs": 2
  },
  {
    "classNumber": 24,
    "categoryName": "24. Hormonal Agent",
    "broadClasses": [
      "Contraceptive",
      "Progestin",
      "Estrogen",
      "SERM",
      "Androgen"
    ],
    "specificSubclasses": [
      "Monophasic Estrogen and Progestin Combination",
      "Biphasic Estrogen and Progestin Combination",
      "Triphasic Estrogen and Progestin Combination",
      "Synthetic Progestin",
      "Estrogen Hormone Replacement (Oral)",
      "Selective Estrogen Receptor Modulator",
      "Estrogen Hormone Replacement",
      "Estrogen Hormone Replacement (Transdermal)",
      "Micronized Progestin",
      "Anabolic / Androgenic Steroid"
    ],
    "totalDrugs": 10
  },
  {
    "classNumber": 25,
    "categoryName": "25. Immunosuppressant Agent",
    "broadClasses": [
      "Corticosteroid",
      "Biologic DMARD",
      "Antimetabolite / DMARD",
      "Calcineurin Inhibitor",
      "RANKL Inhibitor"
    ],
    "specificSubclasses": [
      "Systemic Corticosteroid",
      "TNF-Alpha Inhibitor Fusion Protein",
      "Antifolate Antimetabolite",
      "Calcineurin Inhibitor",
      "Anti-TNF-Alpha Monoclonal Antibody",
      "RANK Ligand Inhibitor Monoclonal Antibody"
    ],
    "totalDrugs": 8
  },
  {
    "classNumber": 26,
    "categoryName": "26. Nonsteroidal Anti-inflammatory Agent",
    "broadClasses": [
      "NSAID"
    ],
    "specificSubclasses": [
      "Nonselective NSAID (Propionic Acid Derivative)",
      "Preferential COX-2 Inhibitor (Oxicam Derivative)",
      "Nonacidic NSAID Prodrug",
      "Nonselective NSAID (Acetic Acid Derivative)",
      "Selective COX-2 Inhibitor (Diarylsulfonamide)"
    ],
    "totalDrugs": 6
  },
  {
    "classNumber": 27,
    "categoryName": "27. Antidementia Agent",
    "broadClasses": [
      "NMDA Receptor Antagonist",
      "Cholinesterase Inhibitor"
    ],
    "specificSubclasses": [
      "N-Methyl-D-Aspartate (NMDA) Receptor Antagonist",
      "Reversible Acetylcholinesterase Inhibitor"
    ],
    "totalDrugs": 2
  },
  {
    "classNumber": 28,
    "categoryName": "28. Antiparasitic",
    "broadClasses": [
      "Aminoquinoline"
    ],
    "specificSubclasses": [
      "4-Aminoquinoline (Antimalarial / DMARD)"
    ],
    "totalDrugs": 1
  },
  {
    "classNumber": 29,
    "categoryName": "29. Therapeutic Vitamins / Electrolytes / Miscellaneous",
    "broadClasses": [
      "Electrolyte",
      "Calcimimetic",
      "Iron Preparation",
      "Phosphate Binder",
      "Vitamin"
    ],
    "specificSubclasses": [
      "Electrolyte Supplement",
      "Calcium-Sensing Receptor Agonist (Calcimimetic)",
      "Oral Iron Supplement",
      "Non-Absorbed Phosphate Binder",
      "Water-Soluble Vitamin (Vitamin B12)",
      "Water-Soluble Vitamin (Vitamin B9)"
    ],
    "totalDrugs": 6
  },
  {
    "classNumber": 30,
    "categoryName": "30. Metabolic Bone Disease Agents",
    "broadClasses": [
      "Bisphosphonate"
    ],
    "specificSubclasses": [
      "Nitrogen-Containing Bisphosphonate"
    ],
    "totalDrugs": 4
  },
  {
    "classNumber": 31,
    "categoryName": "31. Smoking Cessation Aid",
    "broadClasses": [
      "Nicotinic Receptor Partial Agonist"
    ],
    "specificSubclasses": [
      "Alpha-4 Beta-2 Nicotinic Receptor Partial Agonist"
    ],
    "totalDrugs": 1
  },
  {
    "classNumber": 32,
    "categoryName": "32. Sedatives/Hypnotics",
    "broadClasses": [
      "Non-Benzodiazepine Hypnotic"
    ],
    "specificSubclasses": [
      "GABA-A Receptor Positive Allosteric Modulator (Cyclopyrrolone)",
      "GABA-A Receptor Positive Allosteric Modulator (Imidazopyridine)"
    ],
    "totalDrugs": 2
  },
  {
    "classNumber": 33,
    "categoryName": "33. Anti-Migraine Agents",
    "broadClasses": [
      "Triptan"
    ],
    "specificSubclasses": [
      "Serotonin 5-HT1B/1D Receptor Agonist"
    ],
    "totalDrugs": 3
  },
  {
    "classNumber": 34,
    "categoryName": "34. Dermatological Agents",
    "broadClasses": [
      "Topical Corticosteroid",
      "Retinoid"
    ],
    "specificSubclasses": [
      "Medium-to-High Potency Topical Corticosteroid",
      "Low Potency Topical Corticosteroid",
      "Systemic Retinoic Acid Derivative",
      "Third-Generation Topical Retinoid"
    ],
    "totalDrugs": 4
  },
  {
    "classNumber": 35,
    "categoryName": "35. Anti-Gout Agents",
    "broadClasses": [
      "Anti-Gout Agent",
      "Xanthine Oxidase Inhibitor"
    ],
    "specificSubclasses": [
      "Microtubule Assembly Inhibitor",
      "Purine Analog Xanthine Oxidase Inhibitor",
      "Non-Purine Selective Xanthine Oxidase Inhibitor"
    ],
    "totalDrugs": 3
  },
  {
    "classNumber": 36,
    "categoryName": "36. Respiratory Agent",
    "broadClasses": [
      "Beta-2 Agonist",
      "Inhaled Corticosteroid",
      "Nasal Corticosteroid",
      "ICS / LABA Combination",
      "SAMA / SABA Combination",
      "Anticholinergic",
      "Leukotriene Receptor Antagonist",
      "Corticosteroid",
      "Anti-IgE Antibody",
      "Antitussive"
    ],
    "specificSubclasses": [
      "Short-Acting Beta-2 Adrenergic Agonist (SABA)",
      "Inhaled Corticosteroid (ICS)",
      "Intranasal Corticosteroid",
      "Inhaled Corticosteroid and Long-Acting Beta-2 Agonist",
      "Short-Acting Muscarinic Antagonist and Beta-2 Agonist",
      "Long-Acting Muscarinic Antagonist (LAMA)",
      "CysLT1 Leukotriene Receptor Antagonist",
      "Inhaled / Nasal Corticosteroid",
      "Anti-IgE Monoclonal Antibody",
      "Voltage-Gated Sodium Channel Blocker Antitussive"
    ],
    "totalDrugs": 11
  },
  {
    "classNumber": 37,
    "categoryName": "37. Skeletal Muscle Relaxant",
    "broadClasses": [
      "Centrally Acting Muscle Relaxant",
      "GABA-B Agonist",
      "Alpha-2 Agonist"
    ],
    "specificSubclasses": [
      "Centrally Acting Skeletal Muscle Relaxant (Tricyclic-Related)",
      "GABA-B Receptor Agonist Muscle Relaxant",
      "Central Nervous System Depressant Muscle Relaxant",
      "Centrally Acting Alpha-2 Adrenergic Agonist Muscle Relaxant"
    ],
    "totalDrugs": 4
  },
  {
    "classNumber": 38,
    "categoryName": "38. Central Nervous System Agent",
    "broadClasses": [
      "CNS Stimulant",
      "Anorexiant",
      "NRI"
    ],
    "specificSubclasses": [
      "Mixed Amphetamine Salts",
      "Amphetamine Prodrug",
      "Dopamine / Norepinephrine Reuptake Inhibitor Stimulant",
      "d-threo-Methylphenidate Enantiomer",
      "Sympathomimetic Amine Anorexiant",
      "Selective Norepinephrine Reuptake Inhibitor"
    ],
    "totalDrugs": 6
  },
  {
    "classNumber": 39,
    "categoryName": "39. Thyroid Product",
    "broadClasses": [
      "Thyroid Hormone"
    ],
    "specificSubclasses": [
      "Synthetic T4 Hormone",
      "Desiccated Thyroid Extract (T3/T4)"
    ],
    "totalDrugs": 2
  }
];

export const TOP_DRUGS_TAXONOMY: TopDrugEntry[] = [
  {
    "genericName": "Acetaminophen",
    "brandNames": [
      "Tylenol"
    ],
    "therapeuticClassNumber": 1,
    "therapeuticCategory": "1. Analgesic",
    "broadPharmacologicClass": "Non-Opioid Analgesic",
    "specificPharmacologicClass": "Non-Opioid Analgesic / Antipyretic",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Aspirin",
    "brandNames": [
      "Bayer",
      "Ecotrin",
      "Bufferin"
    ],
    "therapeuticClassNumber": 1,
    "therapeuticCategory": "1. Analgesic",
    "broadPharmacologicClass": "Non-Opioid Analgesic",
    "specificPharmacologicClass": "Salicylate / Antipyretic",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Acetaminophen / Butalbital / Caffeine",
    "brandNames": [
      "Esgic",
      "Fioricet"
    ],
    "therapeuticClassNumber": 1,
    "therapeuticCategory": "1. Analgesic",
    "broadPharmacologicClass": "Analgesic Combination",
    "specificPharmacologicClass": "Barbiturate / Non-Opioid Combination",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Hydrocodone / Acetaminophen",
    "brandNames": [
      "Vicodin",
      "Norco",
      "Lortab",
      "Hycet"
    ],
    "therapeuticClassNumber": 1,
    "therapeuticCategory": "1. Analgesic",
    "broadPharmacologicClass": "Opioid",
    "specificPharmacologicClass": "Opioid Combination",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Tramadol",
    "brandNames": [
      "ConZip",
      "Ultram",
      "Ultram ER"
    ],
    "therapeuticClassNumber": 1,
    "therapeuticCategory": "1. Analgesic",
    "broadPharmacologicClass": "Opioid",
    "specificPharmacologicClass": "Centrally Acting Opioid Agonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Morphine ER",
    "brandNames": [
      "Avinza",
      "Kadian",
      "MS Contin"
    ],
    "therapeuticClassNumber": 1,
    "therapeuticCategory": "1. Analgesic",
    "broadPharmacologicClass": "Opioid",
    "specificPharmacologicClass": "Opioid Agonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Oxycodone",
    "brandNames": [
      "Oxycontin",
      "Roxicodone"
    ],
    "therapeuticClassNumber": 1,
    "therapeuticCategory": "1. Analgesic",
    "broadPharmacologicClass": "Opioid",
    "specificPharmacologicClass": "Opioid Agonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Methadone",
    "brandNames": [
      "Dolophine",
      "Methadose"
    ],
    "therapeuticClassNumber": 1,
    "therapeuticCategory": "1. Analgesic",
    "broadPharmacologicClass": "Opioid",
    "specificPharmacologicClass": "Opioid Agonist / NMDA Antagonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Fentanyl",
    "brandNames": [
      "Abstral",
      "Actiq",
      "Duragesic",
      "Fentora",
      "Ionsys",
      "Lazanda",
      "Subsys"
    ],
    "therapeuticClassNumber": 1,
    "therapeuticCategory": "1. Analgesic",
    "broadPharmacologicClass": "Opioid",
    "specificPharmacologicClass": "Anilidopiperidine Opioid Agonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Buprenorphine / Naloxone",
    "brandNames": [
      "Suboxone",
      "Zubsolv",
      "Bunavail"
    ],
    "therapeuticClassNumber": 1,
    "therapeuticCategory": "1. Analgesic",
    "broadPharmacologicClass": "Opioid",
    "specificPharmacologicClass": "Opioid Partial Agonist / Antagonist Combination",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Phenazopyridine",
    "brandNames": [
      "Pyridium",
      "AZO"
    ],
    "therapeuticClassNumber": 1,
    "therapeuticCategory": "1. Analgesic",
    "broadPharmacologicClass": "Urinary Tract Agent",
    "specificPharmacologicClass": "Urinary Tract Analgesic",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Lidocaine Topical Patch",
    "brandNames": [
      "Lidoderm",
      "LidoPatch"
    ],
    "therapeuticClassNumber": 1,
    "therapeuticCategory": "1. Analgesic",
    "broadPharmacologicClass": "Local Anesthetic",
    "specificPharmacologicClass": "Topical Anesthetic",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Penicillin VK",
    "brandNames": [
      "Pen-V-K",
      "V-Cillin K"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Penicillin",
    "specificPharmacologicClass": "Natural Penicillin",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Amoxicillin",
    "brandNames": [
      "Moxatag",
      "Trimox",
      "Amoxil"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Penicillin",
    "specificPharmacologicClass": "Aminopenicillin",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Amoxicillin / Potassium Clavulanate",
    "brandNames": [
      "Augmentin",
      "Augmentin ES",
      "Augmentin XR",
      "Amoclan"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Penicillin",
    "specificPharmacologicClass": "Aminopenicillin / Beta-Lactamase Inhibitor",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Cephalexin",
    "brandNames": [
      "Keflex"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Cephalosporin",
    "specificPharmacologicClass": "1st Generation Cephalosporin",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Cefuroxime",
    "brandNames": [
      "Ceftin",
      "Zinacef"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Cephalosporin",
    "specificPharmacologicClass": "2nd Generation Cephalosporin",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Cefdinir",
    "brandNames": [
      "Omnicef"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Cephalosporin",
    "specificPharmacologicClass": "3rd Generation Cephalosporin",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Doxycycline",
    "brandNames": [
      "Acticlate",
      "Adoxa",
      "Avidoxy",
      "Doryx",
      "Monodox",
      "Morgidox",
      "Oracea",
      "TargaDOX",
      "Vibramycin"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Tetracycline",
    "specificPharmacologicClass": "Tetracycline Derivative",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Ciprofloxacin",
    "brandNames": [
      "Cipro",
      "Cipro XR",
      "Cetraxal"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Fluoroquinolone",
    "specificPharmacologicClass": "Fluoroquinolone",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Moxifloxacin",
    "brandNames": [
      "Avelox",
      "Vigamox"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Fluoroquinolone",
    "specificPharmacologicClass": "Fluoroquinolone",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Levofloxacin",
    "brandNames": [
      "Levaquin"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Fluoroquinolone",
    "specificPharmacologicClass": "Fluoroquinolone",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Clarithromycin",
    "brandNames": [
      "Biaxin",
      "Biaxin XL"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Macrolide",
    "specificPharmacologicClass": "Macrolide",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Azithromycin",
    "brandNames": [
      "Zithromax",
      "Zithromax Tri-Pak",
      "Z-Pak",
      "Zmax"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Macrolide",
    "specificPharmacologicClass": "Macrolide",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Clindamycin Topical",
    "brandNames": [
      "Clindesse",
      "ClindaMax",
      "Evoclin",
      "Clindagel",
      "Clindacin-P",
      "Cleocin T",
      "Clindacin ETZ",
      "Clindacin Pac"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Lincosamide",
    "specificPharmacologicClass": "Lincosamide (Topical)",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Clindamycin Oral",
    "brandNames": [
      "Cleocin"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Lincosamide",
    "specificPharmacologicClass": "Lincosamide (Oral)",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Trimethoprim / Sulfamethoxazole",
    "brandNames": [
      "Bactrim",
      "Septra"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Sulfonamide",
    "specificPharmacologicClass": "Sulfonamide / Folate Antagonist Combination",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Metronidazole",
    "brandNames": [
      "Flagyl"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Nitroimidazole",
    "specificPharmacologicClass": "Nitroimidazole Antimicrobial",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Albendazole",
    "brandNames": [
      "Albenza"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Anthelmintic",
    "specificPharmacologicClass": "Benzimidazole Anthelmintic",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Nitrofurantoin",
    "brandNames": [
      "Macrodantin",
      "Macrobid"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Nitrofuran",
    "specificPharmacologicClass": "Nitrofuran Derivative",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Mupirocin",
    "brandNames": [
      "Bactroban"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Topical Antibacterial",
    "specificPharmacologicClass": "Topical Antibacterial",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Chlorhexidine",
    "brandNames": [
      "Peridex",
      "Periogard",
      "Hibiclens",
      "Hibistat"
    ],
    "therapeuticClassNumber": 2,
    "therapeuticCategory": "2. Antibiotic",
    "broadPharmacologicClass": "Antiseptic",
    "specificPharmacologicClass": "Oral Rinse / Topical Antiseptic",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Phenytoin",
    "brandNames": [
      "Dilantin",
      "Phenytek"
    ],
    "therapeuticClassNumber": 3,
    "therapeuticCategory": "3. Anticonvulsant",
    "broadPharmacologicClass": "Hydantoin",
    "specificPharmacologicClass": "Hydantoin Anticonvulsant",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Lamotrigine",
    "brandNames": [
      "Lamictal",
      "Lamictal ODT",
      "Lamictal XR"
    ],
    "therapeuticClassNumber": 3,
    "therapeuticCategory": "3. Anticonvulsant",
    "broadPharmacologicClass": "Phenyltriazine",
    "specificPharmacologicClass": "Phenyltriazine Anticonvulsant",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Levetiracetam",
    "brandNames": [
      "Keppra",
      "Keppra XR"
    ],
    "therapeuticClassNumber": 3,
    "therapeuticCategory": "3. Anticonvulsant",
    "broadPharmacologicClass": "Pyrrolidine",
    "specificPharmacologicClass": "Pyrrolidine Anticonvulsant",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Oxcarbazepine",
    "brandNames": [
      "Trileptal",
      "Oxtellar XR"
    ],
    "therapeuticClassNumber": 3,
    "therapeuticCategory": "3. Anticonvulsant",
    "broadPharmacologicClass": "Dibenzazepine",
    "specificPharmacologicClass": "Dibenzazepine Carboxamide",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Pregabalin",
    "brandNames": [
      "Lyrica"
    ],
    "therapeuticClassNumber": 3,
    "therapeuticCategory": "3. Anticonvulsant",
    "broadPharmacologicClass": "GABA Analog",
    "specificPharmacologicClass": "GABA Analog / Anticonvulsant / Analgesic",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Topiramate",
    "brandNames": [
      "Qudexy XR",
      "Topamax",
      "Topamax Sprinkle",
      "Topiragen",
      "Trokendi XR"
    ],
    "therapeuticClassNumber": 3,
    "therapeuticCategory": "3. Anticonvulsant",
    "broadPharmacologicClass": "Sulfamate-Substituted Monosaccharide",
    "specificPharmacologicClass": "Miscellaneous Anticonvulsant",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Divalproex / Valproic Acid",
    "brandNames": [
      "Depacon",
      "Depakene",
      "Depakote",
      "Depakote ER",
      "Depakote Sprinkles",
      "Stavzor"
    ],
    "therapeuticClassNumber": 3,
    "therapeuticCategory": "3. Anticonvulsant",
    "broadPharmacologicClass": "Fatty Acid Derivative",
    "specificPharmacologicClass": "Histone Deacetylase Inhibitor / Anticonvulsant",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Gabapentin",
    "brandNames": [
      "Neurontin",
      "Gralise"
    ],
    "therapeuticClassNumber": 3,
    "therapeuticCategory": "3. Anticonvulsant",
    "broadPharmacologicClass": "GABA Analog",
    "specificPharmacologicClass": "GABA Analog / Anticonvulsant",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Paroxetine",
    "brandNames": [
      "Paxil",
      "Paxil CR",
      "Brisdelle",
      "Pexeva"
    ],
    "therapeuticClassNumber": 4,
    "therapeuticCategory": "4. Antidepressant",
    "broadPharmacologicClass": "SSRI",
    "specificPharmacologicClass": "Selective Serotonin Reuptake Inhibitor",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Sertraline",
    "brandNames": [
      "Zoloft"
    ],
    "therapeuticClassNumber": 4,
    "therapeuticCategory": "4. Antidepressant",
    "broadPharmacologicClass": "SSRI",
    "specificPharmacologicClass": "Selective Serotonin Reuptake Inhibitor",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Escitalopram",
    "brandNames": [
      "Lexapro"
    ],
    "therapeuticClassNumber": 4,
    "therapeuticCategory": "4. Antidepressant",
    "broadPharmacologicClass": "SSRI",
    "specificPharmacologicClass": "Selective Serotonin Reuptake Inhibitor",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Citalopram",
    "brandNames": [
      "Celexa"
    ],
    "therapeuticClassNumber": 4,
    "therapeuticCategory": "4. Antidepressant",
    "broadPharmacologicClass": "SSRI",
    "specificPharmacologicClass": "Selective Serotonin Reuptake Inhibitor",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Fluoxetine",
    "brandNames": [
      "Prozac",
      "Sarafem"
    ],
    "therapeuticClassNumber": 4,
    "therapeuticCategory": "4. Antidepressant",
    "broadPharmacologicClass": "SSRI",
    "specificPharmacologicClass": "Selective Serotonin Reuptake Inhibitor",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Trazodone",
    "brandNames": [
      "Desyrel",
      "Oleptro"
    ],
    "therapeuticClassNumber": 4,
    "therapeuticCategory": "4. Antidepressant",
    "broadPharmacologicClass": "SARI",
    "specificPharmacologicClass": "Serotonin Reuptake Inhibitor / Antagonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Venlafaxine",
    "brandNames": [
      "Effexor",
      "Effexor XR"
    ],
    "therapeuticClassNumber": 4,
    "therapeuticCategory": "4. Antidepressant",
    "broadPharmacologicClass": "SNRI",
    "specificPharmacologicClass": "Serotonin/Norepinephrine Reuptake Inhibitor",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Duloxetine",
    "brandNames": [
      "Cymbalta"
    ],
    "therapeuticClassNumber": 4,
    "therapeuticCategory": "4. Antidepressant",
    "broadPharmacologicClass": "SNRI",
    "specificPharmacologicClass": "Serotonin/Norepinephrine Reuptake Inhibitor",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Bupropion",
    "brandNames": [
      "Wellbutrin",
      "Wellbutrin SR",
      "Wellbutrin XL",
      "Forfivo XL",
      "Aplenzin",
      "Zyban"
    ],
    "therapeuticClassNumber": 4,
    "therapeuticCategory": "4. Antidepressant",
    "broadPharmacologicClass": "NDRI",
    "specificPharmacologicClass": "Dopamine/Norepinephrine Reuptake Inhibitor",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Nortriptyline",
    "brandNames": [
      "Pamelor"
    ],
    "therapeuticClassNumber": 4,
    "therapeuticCategory": "4. Antidepressant",
    "broadPharmacologicClass": "Tricyclic Antidepressant",
    "specificPharmacologicClass": "Tricyclic Antidepressant (Secondary Amine)",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Amitriptyline",
    "brandNames": [
      "Elavil"
    ],
    "therapeuticClassNumber": 4,
    "therapeuticCategory": "4. Antidepressant",
    "broadPharmacologicClass": "Tricyclic Antidepressant",
    "specificPharmacologicClass": "Tricyclic Antidepressant (Tertiary Amine)",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Mirtazapine",
    "brandNames": [
      "Remeron"
    ],
    "therapeuticClassNumber": 4,
    "therapeuticCategory": "4. Antidepressant",
    "broadPharmacologicClass": "Tetracyclic / Alpha-2 Antagonist",
    "specificPharmacologicClass": "Noradrenergic and Specific Serotonergic Antidepressant",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Metformin",
    "brandNames": [
      "Glucophage",
      "Glumetza",
      "Fortamet",
      "Riomet"
    ],
    "therapeuticClassNumber": 5,
    "therapeuticCategory": "5. Antidiabetic Agent --- Oral",
    "broadPharmacologicClass": "Biguanide",
    "specificPharmacologicClass": "Biguanide",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Glimepiride",
    "brandNames": [
      "Amaryl"
    ],
    "therapeuticClassNumber": 5,
    "therapeuticCategory": "5. Antidiabetic Agent --- Oral",
    "broadPharmacologicClass": "Sulfonylurea",
    "specificPharmacologicClass": "Second-Generation Sulfonylurea",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Glipizide",
    "brandNames": [
      "Glucotrol"
    ],
    "therapeuticClassNumber": 5,
    "therapeuticCategory": "5. Antidiabetic Agent --- Oral",
    "broadPharmacologicClass": "Sulfonylurea",
    "specificPharmacologicClass": "Second-Generation Sulfonylurea",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Pioglitazone",
    "brandNames": [
      "Actos"
    ],
    "therapeuticClassNumber": 5,
    "therapeuticCategory": "5. Antidiabetic Agent --- Oral",
    "broadPharmacologicClass": "Thiazolidinedione",
    "specificPharmacologicClass": "Thiazolidinedione (PPAR-gamma Agonist)",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Linagliptin",
    "brandNames": [
      "Tradjenta"
    ],
    "therapeuticClassNumber": 5,
    "therapeuticCategory": "5. Antidiabetic Agent --- Oral",
    "broadPharmacologicClass": "DPP-4 Inhibitor",
    "specificPharmacologicClass": "Dipeptidyl Peptidase 4 (DPP-4) Inhibitor",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Sitagliptin",
    "brandNames": [
      "Januvia"
    ],
    "therapeuticClassNumber": 5,
    "therapeuticCategory": "5. Antidiabetic Agent --- Oral",
    "broadPharmacologicClass": "DPP-4 Inhibitor",
    "specificPharmacologicClass": "Dipeptidyl Peptidase 4 (DPP-4) Inhibitor",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Canagliflozin",
    "brandNames": [
      "Invokana"
    ],
    "therapeuticClassNumber": 5,
    "therapeuticCategory": "5. Antidiabetic Agent --- Oral",
    "broadPharmacologicClass": "SGLT2 Inhibitor",
    "specificPharmacologicClass": "Sodium-Glucose Co-Transporter 2 (SGLT2) Inhibitor",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Insulin Lispro",
    "brandNames": [
      "Humalog"
    ],
    "therapeuticClassNumber": 6,
    "therapeuticCategory": "6. Antidiabetic Agent --- Injectable/Insulin Product",
    "broadPharmacologicClass": "Insulin",
    "specificPharmacologicClass": "Rapid-Acting Insulin",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Insulin Aspart",
    "brandNames": [
      "Novolog",
      "Fiasp"
    ],
    "therapeuticClassNumber": 6,
    "therapeuticCategory": "6. Antidiabetic Agent --- Injectable/Insulin Product",
    "broadPharmacologicClass": "Insulin",
    "specificPharmacologicClass": "Rapid-Acting Insulin",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Regular Human Insulin",
    "brandNames": [
      "Humulin R",
      "Novolin R",
      "ReliOn R",
      "Humulin U-500"
    ],
    "therapeuticClassNumber": 6,
    "therapeuticCategory": "6. Antidiabetic Agent --- Injectable/Insulin Product",
    "broadPharmacologicClass": "Insulin",
    "specificPharmacologicClass": "Short-Acting Insulin",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Insulin Glargine",
    "brandNames": [
      "Lantus",
      "Basaglar",
      "Toujeo",
      "Semglee"
    ],
    "therapeuticClassNumber": 6,
    "therapeuticCategory": "6. Antidiabetic Agent --- Injectable/Insulin Product",
    "broadPharmacologicClass": "Insulin",
    "specificPharmacologicClass": "Long-Acting Insulin",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Insulin Degludec",
    "brandNames": [
      "Tresiba"
    ],
    "therapeuticClassNumber": 6,
    "therapeuticCategory": "6. Antidiabetic Agent --- Injectable/Insulin Product",
    "broadPharmacologicClass": "Insulin",
    "specificPharmacologicClass": "Ultra Long-Acting Insulin",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Liraglutide",
    "brandNames": [
      "Victoza",
      "Saxenda"
    ],
    "therapeuticClassNumber": 6,
    "therapeuticCategory": "6. Antidiabetic Agent --- Injectable/Insulin Product",
    "broadPharmacologicClass": "GLP-1 Receptor Agonist",
    "specificPharmacologicClass": "Glucagon-Like Peptide-1 (GLP-1) Receptor Agonist",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Semaglutide",
    "brandNames": [
      "Ozempic",
      "Wegovy"
    ],
    "therapeuticClassNumber": 6,
    "therapeuticCategory": "6. Antidiabetic Agent --- Injectable/Insulin Product",
    "broadPharmacologicClass": "GLP-1 Receptor Agonist",
    "specificPharmacologicClass": "Glucagon-Like Peptide-1 (GLP-1) Receptor Agonist",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Dulaglutide",
    "brandNames": [
      "Trulicity"
    ],
    "therapeuticClassNumber": 6,
    "therapeuticCategory": "6. Antidiabetic Agent --- Injectable/Insulin Product",
    "broadPharmacologicClass": "GLP-1 Receptor Agonist",
    "specificPharmacologicClass": "Glucagon-Like Peptide-1 (GLP-1) Receptor Agonist",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Tirzepatide",
    "brandNames": [
      "Mounjaro",
      "Zepbound"
    ],
    "therapeuticClassNumber": 6,
    "therapeuticCategory": "6. Antidiabetic Agent --- Injectable/Insulin Product",
    "broadPharmacologicClass": "GIP/GLP-1 Dual Agonist",
    "specificPharmacologicClass": "Dual GIP and GLP-1 Receptor Agonist",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Latanoprost",
    "brandNames": [
      "Xalatan"
    ],
    "therapeuticClassNumber": 7,
    "therapeuticCategory": "7. Ophthalmic Agent",
    "broadPharmacologicClass": "Prostaglandin Analog",
    "specificPharmacologicClass": "Ophthalmic Prostaglandin Analog",
    "curriculumModuleId": "sensory-organs"
  },
  {
    "genericName": "Brimonidine",
    "brandNames": [
      "Alphagan P"
    ],
    "therapeuticClassNumber": 7,
    "therapeuticCategory": "7. Ophthalmic Agent",
    "broadPharmacologicClass": "Alpha-2 Agonist",
    "specificPharmacologicClass": "Ophthalmic Alpha-2 Adrenergic Agonist",
    "curriculumModuleId": "sensory-organs"
  },
  {
    "genericName": "Timolol",
    "brandNames": [
      "Timoptic"
    ],
    "therapeuticClassNumber": 7,
    "therapeuticCategory": "7. Ophthalmic Agent",
    "broadPharmacologicClass": "Beta-Blocker",
    "specificPharmacologicClass": "Ophthalmic Nonselective Beta-Blocker",
    "curriculumModuleId": "sensory-organs"
  },
  {
    "genericName": "Promethazine",
    "brandNames": [
      "Phenergan"
    ],
    "therapeuticClassNumber": 8,
    "therapeuticCategory": "8. Antiemetic",
    "broadPharmacologicClass": "Phenothiazine",
    "specificPharmacologicClass": "First-Generation Histamine H1 Antagonist / Phenothiazine",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Meclizine",
    "brandNames": [
      "Antivert",
      "Dramamine"
    ],
    "therapeuticClassNumber": 8,
    "therapeuticCategory": "8. Antiemetic",
    "broadPharmacologicClass": "Piperazine",
    "specificPharmacologicClass": "First-Generation Histamine H1 Antagonist / Piperazine",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Hydroxyzine",
    "brandNames": [
      "Atarax",
      "Vistaril"
    ],
    "therapeuticClassNumber": 8,
    "therapeuticCategory": "8. Antiemetic",
    "broadPharmacologicClass": "Piperazine",
    "specificPharmacologicClass": "First-Generation Histamine H1 Antagonist / Piperazine",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Ondansetron",
    "brandNames": [
      "Zofran",
      "Zofran ODT",
      "Zuplenz"
    ],
    "therapeuticClassNumber": 8,
    "therapeuticCategory": "8. Antiemetic",
    "broadPharmacologicClass": "5-HT3 Receptor Antagonist",
    "specificPharmacologicClass": "Selective 5-HT3 Receptor Antagonist",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Granisetron",
    "brandNames": [
      "Sancuso",
      "Sustol"
    ],
    "therapeuticClassNumber": 8,
    "therapeuticCategory": "8. Antiemetic",
    "broadPharmacologicClass": "5-HT3 Receptor Antagonist",
    "specificPharmacologicClass": "Selective 5-HT3 Receptor Antagonist",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Metoclopramide",
    "brandNames": [
      "Reglan"
    ],
    "therapeuticClassNumber": 8,
    "therapeuticCategory": "8. Antiemetic",
    "broadPharmacologicClass": "Dopamine Antagonist / Prokinetic",
    "specificPharmacologicClass": "Prokinetic Gastrointestinal Agent",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Fluconazole",
    "brandNames": [
      "Diflucan"
    ],
    "therapeuticClassNumber": 9,
    "therapeuticCategory": "9. Antifungal Agent",
    "broadPharmacologicClass": "Azole Antifungal",
    "specificPharmacologicClass": "Triazole Antifungal",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Ketoconazole Topical",
    "brandNames": [
      "Nizoral",
      "Extina",
      "Xolegel"
    ],
    "therapeuticClassNumber": 9,
    "therapeuticCategory": "9. Antifungal Agent",
    "broadPharmacologicClass": "Azole Antifungal",
    "specificPharmacologicClass": "Imidazole Antifungal (Topical)",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Clotrimazole / Betamethasone",
    "brandNames": [
      "Lotrisone"
    ],
    "therapeuticClassNumber": 9,
    "therapeuticCategory": "9. Antifungal Agent",
    "broadPharmacologicClass": "Antifungal / Corticosteroid Combination",
    "specificPharmacologicClass": "Topical Antifungal and Corticosteroid",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Nystatin Topical",
    "brandNames": [
      "Mycostatin"
    ],
    "therapeuticClassNumber": 9,
    "therapeuticCategory": "9. Antifungal Agent",
    "broadPharmacologicClass": "Polyene Antifungal",
    "specificPharmacologicClass": "Polyene Antifungal (Topical)",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Atorvastatin",
    "brandNames": [
      "Lipitor"
    ],
    "therapeuticClassNumber": 10,
    "therapeuticCategory": "10. Cardiovascular --- Anti-Lipemic Agent",
    "broadPharmacologicClass": "HMG-CoA Reductase Inhibitor",
    "specificPharmacologicClass": "Statin (HMG-CoA Reductase Inhibitor)",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Lovastatin",
    "brandNames": [
      "Altoprev",
      "Mevacor"
    ],
    "therapeuticClassNumber": 10,
    "therapeuticCategory": "10. Cardiovascular --- Anti-Lipemic Agent",
    "broadPharmacologicClass": "HMG-CoA Reductase Inhibitor",
    "specificPharmacologicClass": "Statin (HMG-CoA Reductase Inhibitor)",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Pravastatin",
    "brandNames": [
      "Pravachol"
    ],
    "therapeuticClassNumber": 10,
    "therapeuticCategory": "10. Cardiovascular --- Anti-Lipemic Agent",
    "broadPharmacologicClass": "HMG-CoA Reductase Inhibitor",
    "specificPharmacologicClass": "Statin (HMG-CoA Reductase Inhibitor)",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Rosuvastatin",
    "brandNames": [
      "Crestor"
    ],
    "therapeuticClassNumber": 10,
    "therapeuticCategory": "10. Cardiovascular --- Anti-Lipemic Agent",
    "broadPharmacologicClass": "HMG-CoA Reductase Inhibitor",
    "specificPharmacologicClass": "Statin (HMG-CoA Reductase Inhibitor)",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Simvastatin",
    "brandNames": [
      "Zocor"
    ],
    "therapeuticClassNumber": 10,
    "therapeuticCategory": "10. Cardiovascular --- Anti-Lipemic Agent",
    "broadPharmacologicClass": "HMG-CoA Reductase Inhibitor",
    "specificPharmacologicClass": "Statin (HMG-CoA Reductase Inhibitor)",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Ezetimibe",
    "brandNames": [
      "Zetia"
    ],
    "therapeuticClassNumber": 10,
    "therapeuticCategory": "10. Cardiovascular --- Anti-Lipemic Agent",
    "broadPharmacologicClass": "Cholesterol Absorption Inhibitor",
    "specificPharmacologicClass": "2-Azetidinone Cholesterol Absorption Inhibitor",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Fenofibrate",
    "brandNames": [
      "Trilipix",
      "Triglide",
      "Tricor",
      "Lofibra",
      "Lipofen",
      "Fibricor",
      "Fenoglide",
      "Antara"
    ],
    "therapeuticClassNumber": 10,
    "therapeuticCategory": "10. Cardiovascular --- Anti-Lipemic Agent",
    "broadPharmacologicClass": "Fibric Acid Derivative",
    "specificPharmacologicClass": "Fibric Acid Derivative (Fibrate)",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Gemfibrozil",
    "brandNames": [
      "Lopid"
    ],
    "therapeuticClassNumber": 10,
    "therapeuticCategory": "10. Cardiovascular --- Anti-Lipemic Agent",
    "broadPharmacologicClass": "Fibric Acid Derivative",
    "specificPharmacologicClass": "Fibric Acid Derivative (Fibrate)",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Niacin",
    "brandNames": [
      "Niaspan",
      "Slo-Niacin"
    ],
    "therapeuticClassNumber": 10,
    "therapeuticCategory": "10. Cardiovascular --- Anti-Lipemic Agent",
    "broadPharmacologicClass": "Vitamin / Antilipemic",
    "specificPharmacologicClass": "Water-Soluble Vitamin / Antilipemic Agent",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Omega-3-Acid Ethyl Esters",
    "brandNames": [
      "Lovaza",
      "Vascepa"
    ],
    "therapeuticClassNumber": 10,
    "therapeuticCategory": "10. Cardiovascular --- Anti-Lipemic Agent",
    "broadPharmacologicClass": "Omega-3 Fatty Acid",
    "specificPharmacologicClass": "Omega-3 Fatty Acid Derivative",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Evolocumab",
    "brandNames": [
      "Repatha"
    ],
    "therapeuticClassNumber": 10,
    "therapeuticCategory": "10. Cardiovascular --- Anti-Lipemic Agent",
    "broadPharmacologicClass": "PCSK9 Inhibitor",
    "specificPharmacologicClass": "PCSK9 Inhibitor Monoclonal Antibody",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Lisinopril",
    "brandNames": [
      "Prinvil",
      "Zestril",
      "Qbrelis"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "ACE Inhibitor",
    "specificPharmacologicClass": "Angiotensin-Converting Enzyme (ACE) Inhibitor",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Enalapril",
    "brandNames": [
      "Vasotec",
      "Epaned"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "ACE Inhibitor",
    "specificPharmacologicClass": "Angiotensin-Converting Enzyme (ACE) Inhibitor",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Ramipril",
    "brandNames": [
      "Altace"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "ACE Inhibitor",
    "specificPharmacologicClass": "Angiotensin-Converting Enzyme (ACE) Inhibitor",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Benazepril",
    "brandNames": [
      "Lotensin"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "ACE Inhibitor",
    "specificPharmacologicClass": "Angiotensin-Converting Enzyme (ACE) Inhibitor",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Losartan",
    "brandNames": [
      "Cozaar"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "ARB",
    "specificPharmacologicClass": "Angiotensin II Receptor Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Olmesartan",
    "brandNames": [
      "Benicar"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "ARB",
    "specificPharmacologicClass": "Angiotensin II Receptor Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Irbesartan",
    "brandNames": [
      "Avapro"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "ARB",
    "specificPharmacologicClass": "Angiotensin II Receptor Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Valsartan",
    "brandNames": [
      "Diovan"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "ARB",
    "specificPharmacologicClass": "Angiotensin II Receptor Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Hydrochlorothiazide",
    "brandNames": [
      "Microzide"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Diuretic",
    "specificPharmacologicClass": "Thiazide Diuretic",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Chlorthalidone",
    "brandNames": [
      "Hygroton"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Diuretic",
    "specificPharmacologicClass": "Thiazide-Like Diuretic",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Furosemide",
    "brandNames": [
      "Lasix"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Diuretic",
    "specificPharmacologicClass": "Loop Diuretic",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Triamterene / Hydrochlorothiazide",
    "brandNames": [
      "Dyazide",
      "Maxzide"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Diuretic",
    "specificPharmacologicClass": "Potassium-Sparing and Thiazide Diuretic",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Spironolactone",
    "brandNames": [
      "Aldactone"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Diuretic",
    "specificPharmacologicClass": "Aldosterone Receptor Antagonist / Potassium-Sparing Diuretic",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Amlodipine",
    "brandNames": [
      "Norvasc"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Calcium Channel Blocker",
    "specificPharmacologicClass": "Dihydropyridine Calcium Channel Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Nifedipine Extended Release",
    "brandNames": [
      "Adalat CC",
      "Procardia XL"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Calcium Channel Blocker",
    "specificPharmacologicClass": "Dihydropyridine Calcium Channel Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Verapamil",
    "brandNames": [
      "Calan",
      "Calan SR",
      "Isoptin SR",
      "Verelan PM"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Calcium Channel Blocker",
    "specificPharmacologicClass": "Non-Dihydropyridine Calcium Channel Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Atenolol",
    "brandNames": [
      "Tenormin"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Beta-Blocker",
    "specificPharmacologicClass": "Beta-1 Selective Adrenergic Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Metoprolol Tartrate / Succinate",
    "brandNames": [
      "Lopressor",
      "Toprol XL"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Beta-Blocker",
    "specificPharmacologicClass": "Beta-1 Selective Adrenergic Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Nebivolol",
    "brandNames": [
      "Bystolic"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Beta-Blocker",
    "specificPharmacologicClass": "Beta-1 Selective Adrenergic Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Bisoprolol",
    "brandNames": [
      "Zebeta"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Beta-Blocker",
    "specificPharmacologicClass": "Beta-1 Selective Adrenergic Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Propranolol",
    "brandNames": [
      "Inderal",
      "Inderal LA",
      "Inderal XL",
      "InnoPran XL"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Beta-Blocker",
    "specificPharmacologicClass": "Nonselective Beta-Adrenergic Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Carvedilol",
    "brandNames": [
      "Coreg",
      "Coreg CR"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Beta-Blocker",
    "specificPharmacologicClass": "Nonselective Beta-Blocker with Alpha-1 Blocking Activity",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Doxazosin",
    "brandNames": [
      "Cardura",
      "Cardura XL"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Alpha-1 Blocker",
    "specificPharmacologicClass": "Alpha-1 Adrenergic Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Terazosin",
    "brandNames": [
      "Hytrin"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Alpha-1 Blocker",
    "specificPharmacologicClass": "Alpha-1 Adrenergic Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Clonidine",
    "brandNames": [
      "Catapres",
      "Catapres TTS",
      "Kapvay",
      "Duraclon"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Alpha-2 Agonist",
    "specificPharmacologicClass": "Central Alpha-2 Adrenergic Agonist",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Hydralazine",
    "brandNames": [
      "Apresoline"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Vasodilator",
    "specificPharmacologicClass": "Direct Vasodilator",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Guanfacine",
    "brandNames": [
      "Intuniv"
    ],
    "therapeuticClassNumber": 11,
    "therapeuticCategory": "11. Cardiovascular --- Antihypertensive",
    "broadPharmacologicClass": "Alpha-2 Agonist",
    "specificPharmacologicClass": "Central Alpha-2 Adrenergic Agonist",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Rivaroxaban",
    "brandNames": [
      "Xarelto"
    ],
    "therapeuticClassNumber": 12,
    "therapeuticCategory": "12. Cardiovascular --- Anticoagulant",
    "broadPharmacologicClass": "Direct Oral Anticoagulant",
    "specificPharmacologicClass": "Direct Factor Xa Inhibitor",
    "curriculumModuleId": "hematology"
  },
  {
    "genericName": "Warfarin",
    "brandNames": [
      "Coumadin",
      "Jantoven"
    ],
    "therapeuticClassNumber": 12,
    "therapeuticCategory": "12. Cardiovascular --- Anticoagulant",
    "broadPharmacologicClass": "Vitamin K Antagonist",
    "specificPharmacologicClass": "Vitamin K Antagonist",
    "curriculumModuleId": "hematology"
  },
  {
    "genericName": "Dabigatran",
    "brandNames": [
      "Pradaxa"
    ],
    "therapeuticClassNumber": 12,
    "therapeuticCategory": "12. Cardiovascular --- Anticoagulant",
    "broadPharmacologicClass": "Direct Oral Anticoagulant",
    "specificPharmacologicClass": "Direct Thrombin Inhibitor",
    "curriculumModuleId": "hematology"
  },
  {
    "genericName": "Enoxaparin",
    "brandNames": [
      "Lovenox"
    ],
    "therapeuticClassNumber": 12,
    "therapeuticCategory": "12. Cardiovascular --- Anticoagulant",
    "broadPharmacologicClass": "Heparin",
    "specificPharmacologicClass": "Low Molecular Weight Heparin (LMWH)",
    "curriculumModuleId": "hematology"
  },
  {
    "genericName": "Heparin",
    "brandNames": [
      "Heparin Sodium"
    ],
    "therapeuticClassNumber": 12,
    "therapeuticCategory": "12. Cardiovascular --- Anticoagulant",
    "broadPharmacologicClass": "Heparin",
    "specificPharmacologicClass": "Unfractionated Heparin",
    "curriculumModuleId": "hematology"
  },
  {
    "genericName": "Apixaban",
    "brandNames": [
      "Eliquis"
    ],
    "therapeuticClassNumber": 12,
    "therapeuticCategory": "12. Cardiovascular --- Anticoagulant",
    "broadPharmacologicClass": "Direct Oral Anticoagulant",
    "specificPharmacologicClass": "Direct Factor Xa Inhibitor",
    "curriculumModuleId": "hematology"
  },
  {
    "genericName": "Clopidogrel",
    "brandNames": [
      "Plavix"
    ],
    "therapeuticClassNumber": 13,
    "therapeuticCategory": "13. Cardiovascular --- Antiplatelet Agent/Hematopoietic Agent",
    "broadPharmacologicClass": "Antiplatelet",
    "specificPharmacologicClass": "P2Y12 Platelet Inhibitor (Thienopyridine)",
    "curriculumModuleId": "hematology"
  },
  {
    "genericName": "Dipyridamole and Aspirin",
    "brandNames": [
      "Aggrenox"
    ],
    "therapeuticClassNumber": 13,
    "therapeuticCategory": "13. Cardiovascular --- Antiplatelet Agent/Hematopoietic Agent",
    "broadPharmacologicClass": "Antiplatelet",
    "specificPharmacologicClass": "Antiplatelet / Salicylate Combination",
    "curriculumModuleId": "hematology"
  },
  {
    "genericName": "Epoetin Alfa",
    "brandNames": [
      "Epogen",
      "Procrit"
    ],
    "therapeuticClassNumber": 13,
    "therapeuticCategory": "13. Cardiovascular --- Antiplatelet Agent/Hematopoietic Agent",
    "broadPharmacologicClass": "Hematopoietic Agent",
    "specificPharmacologicClass": "Erythropoiesis-Stimulating Agent (ESA)",
    "curriculumModuleId": "hematology"
  },
  {
    "genericName": "Amiodarone",
    "brandNames": [
      "Cordarone",
      "Pacerone",
      "Nexterone"
    ],
    "therapeuticClassNumber": 14,
    "therapeuticCategory": "14. Cardiovascular --- Antiarrhythmic",
    "broadPharmacologicClass": "Antiarrhythmic",
    "specificPharmacologicClass": "Class III Antiarrhythmic Agent",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Digoxin",
    "brandNames": [
      "Lanoxin",
      "Digitek",
      "Digox"
    ],
    "therapeuticClassNumber": 14,
    "therapeuticCategory": "14. Cardiovascular --- Antiarrhythmic",
    "broadPharmacologicClass": "Cardiac Glycoside",
    "specificPharmacologicClass": "Cardiac Glycoside",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Isosorbide Mononitrate",
    "brandNames": [
      "Imdur"
    ],
    "therapeuticClassNumber": 15,
    "therapeuticCategory": "15. Cardiovascular --- Antianginal",
    "broadPharmacologicClass": "Vasodilator",
    "specificPharmacologicClass": "Nitrate Vasodilator",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Nitroglycerin",
    "brandNames": [
      "Minitran",
      "Nitro-Bid",
      "Nitro-Dur",
      "Nitro-Time",
      "Nitrolingual",
      "NitroMist",
      "Nitronal",
      "Nitrostat",
      "Rectiv"
    ],
    "therapeuticClassNumber": 15,
    "therapeuticCategory": "15. Cardiovascular --- Antianginal",
    "broadPharmacologicClass": "Vasodilator",
    "specificPharmacologicClass": "Nitrate Vasodilator",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Diltiazem",
    "brandNames": [
      "Cardizem",
      "Cardizem CD",
      "Cardizem LA",
      "Cartia XT",
      "Dilt-XR",
      "Diltiazem CD",
      "Maztim LA",
      "Taztia XT",
      "Tiazac"
    ],
    "therapeuticClassNumber": 15,
    "therapeuticCategory": "15. Cardiovascular --- Antianginal",
    "broadPharmacologicClass": "Calcium Channel Blocker",
    "specificPharmacologicClass": "Non-Dihydropyridine Calcium Channel Blocker",
    "curriculumModuleId": "cardiovascular"
  },
  {
    "genericName": "Pramipexole",
    "brandNames": [
      "Mirapex",
      "Mirapex ER"
    ],
    "therapeuticClassNumber": 16,
    "therapeuticCategory": "16. Anti-Parkinson's Agent",
    "broadPharmacologicClass": "Dopamine Agonist",
    "specificPharmacologicClass": "Non-Ergot Dopamine Agonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Ropinirole",
    "brandNames": [
      "Requip",
      "Requip XL"
    ],
    "therapeuticClassNumber": 16,
    "therapeuticCategory": "16. Anti-Parkinson's Agent",
    "broadPharmacologicClass": "Dopamine Agonist",
    "specificPharmacologicClass": "Non-Ergot Dopamine Agonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Benztropine Mesylate",
    "brandNames": [
      "Cogentin"
    ],
    "therapeuticClassNumber": 16,
    "therapeuticCategory": "16. Anti-Parkinson's Agent",
    "broadPharmacologicClass": "Anticholinergic",
    "specificPharmacologicClass": "Centrally Acting Anticholinergic",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Carbidopa / Levodopa",
    "brandNames": [
      "Duopa",
      "Rytary",
      "Sinemet",
      "Sinemet CR"
    ],
    "therapeuticClassNumber": 16,
    "therapeuticCategory": "16. Anti-Parkinson's Agent",
    "broadPharmacologicClass": "Dopamine Precursor",
    "specificPharmacologicClass": "Decarboxylase Inhibitor and Dopamine Precursor",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Haloperidol",
    "brandNames": [
      "Haldol"
    ],
    "therapeuticClassNumber": 17,
    "therapeuticCategory": "17. Antipsychotic",
    "broadPharmacologicClass": "Typical Antipsychotic",
    "specificPharmacologicClass": "First-Generation (Typical) Antipsychotic",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Quetiapine",
    "brandNames": [
      "Seroquel",
      "Seroquel XR"
    ],
    "therapeuticClassNumber": 17,
    "therapeuticCategory": "17. Antipsychotic",
    "broadPharmacologicClass": "Atypical Antipsychotic",
    "specificPharmacologicClass": "Second-Generation (Atypical) Antipsychotic",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Risperidone",
    "brandNames": [
      "Risperdal",
      "Risperdal Consta",
      "Risperdal M-TAB"
    ],
    "therapeuticClassNumber": 17,
    "therapeuticCategory": "17. Antipsychotic",
    "broadPharmacologicClass": "Atypical Antipsychotic",
    "specificPharmacologicClass": "Second-Generation (Atypical) Antipsychotic",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Olanzapine",
    "brandNames": [
      "Zyprexa"
    ],
    "therapeuticClassNumber": 17,
    "therapeuticCategory": "17. Antipsychotic",
    "broadPharmacologicClass": "Atypical Antipsychotic",
    "specificPharmacologicClass": "Second-Generation (Atypical) Antipsychotic",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Aripiprazole",
    "brandNames": [
      "Abilify",
      "Abilify Discmelt",
      "Abilify Maintena"
    ],
    "therapeuticClassNumber": 17,
    "therapeuticCategory": "17. Antipsychotic",
    "broadPharmacologicClass": "Atypical Antipsychotic",
    "specificPharmacologicClass": "Second-Generation (Atypical) Antipsychotic / Dopamine Partial Agonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Clozapine",
    "brandNames": [
      "Clozaril"
    ],
    "therapeuticClassNumber": 17,
    "therapeuticCategory": "17. Antipsychotic",
    "broadPharmacologicClass": "Atypical Antipsychotic",
    "specificPharmacologicClass": "Second-Generation (Atypical) Antipsychotic",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Lithium Carbonate",
    "brandNames": [
      "Lithobid",
      "Eskalith",
      "Eskalith CR"
    ],
    "therapeuticClassNumber": 17,
    "therapeuticCategory": "17. Antipsychotic",
    "broadPharmacologicClass": "Antimanic",
    "specificPharmacologicClass": "Mood Stabilizer / Antimanic Agent",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Emtricitabine / Tenofovir",
    "brandNames": [
      "Truvada"
    ],
    "therapeuticClassNumber": 18,
    "therapeuticCategory": "18. Antiretroviral",
    "broadPharmacologicClass": "NRTI",
    "specificPharmacologicClass": "Nucleoside / Nucleotide Reverse Transcriptase Inhibitor",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Efavirenz",
    "brandNames": [
      "Sustiva"
    ],
    "therapeuticClassNumber": 18,
    "therapeuticCategory": "18. Antiretroviral",
    "broadPharmacologicClass": "NNRTI",
    "specificPharmacologicClass": "Non-Nucleoside Reverse Transcriptase Inhibitor",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Raltegravir",
    "brandNames": [
      "Isentress"
    ],
    "therapeuticClassNumber": 18,
    "therapeuticCategory": "18. Antiretroviral",
    "broadPharmacologicClass": "INSTI",
    "specificPharmacologicClass": "Integrase Strand Transfer Inhibitor",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Sofosbuvir",
    "brandNames": [
      "Sovaldi"
    ],
    "therapeuticClassNumber": 18,
    "therapeuticCategory": "18. Antiretroviral",
    "broadPharmacologicClass": "HCV Polymerase Inhibitor",
    "specificPharmacologicClass": "NS5B Polymerase Inhibitor",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Oseltamivir",
    "brandNames": [
      "Tamiflu"
    ],
    "therapeuticClassNumber": 19,
    "therapeuticCategory": "19. Antiviral",
    "broadPharmacologicClass": "Neuraminidase Inhibitor",
    "specificPharmacologicClass": "Neuraminidase Inhibitor",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Valacyclovir",
    "brandNames": [
      "Valtrex",
      "Zovirax"
    ],
    "therapeuticClassNumber": 19,
    "therapeuticCategory": "19. Antiviral",
    "broadPharmacologicClass": "DNA Polymerase Inhibitor",
    "specificPharmacologicClass": "Guanosine Nucleoside Analog",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Acyclovir",
    "brandNames": [
      "Zovirax"
    ],
    "therapeuticClassNumber": 19,
    "therapeuticCategory": "19. Antiviral",
    "broadPharmacologicClass": "DNA Polymerase Inhibitor",
    "specificPharmacologicClass": "Guanosine Nucleoside Analog",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Valganciclovir",
    "brandNames": [
      "Valcyte"
    ],
    "therapeuticClassNumber": 19,
    "therapeuticCategory": "19. Antiviral",
    "broadPharmacologicClass": "DNA Polymerase Inhibitor",
    "specificPharmacologicClass": "Cytomegalovirus (CMV) Nucleoside Analog",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Lorazepam",
    "brandNames": [
      "Ativan"
    ],
    "therapeuticClassNumber": 20,
    "therapeuticCategory": "20. Anxiolytics",
    "broadPharmacologicClass": "Benzodiazepine",
    "specificPharmacologicClass": "Intermediate-Acting Benzodiazepine",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Temazepam",
    "brandNames": [
      "Restoril"
    ],
    "therapeuticClassNumber": 20,
    "therapeuticCategory": "20. Anxiolytics",
    "broadPharmacologicClass": "Benzodiazepine",
    "specificPharmacologicClass": "Intermediate-Acting Benzodiazepine",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Alprazolam",
    "brandNames": [
      "Xanax",
      "Xanax XR",
      "Niravam",
      "Alprazolam Intensol"
    ],
    "therapeuticClassNumber": 20,
    "therapeuticCategory": "20. Anxiolytics",
    "broadPharmacologicClass": "Benzodiazepine",
    "specificPharmacologicClass": "Short-Acting Benzodiazepine",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Clonazepam",
    "brandNames": [
      "Klonopin"
    ],
    "therapeuticClassNumber": 20,
    "therapeuticCategory": "20. Anxiolytics",
    "broadPharmacologicClass": "Benzodiazepine",
    "specificPharmacologicClass": "Long-Acting Benzodiazepine",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Diazepam",
    "brandNames": [
      "Valium"
    ],
    "therapeuticClassNumber": 20,
    "therapeuticCategory": "20. Anxiolytics",
    "broadPharmacologicClass": "Benzodiazepine",
    "specificPharmacologicClass": "Long-Acting Benzodiazepine",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Buspirone",
    "brandNames": [
      "BuSpar"
    ],
    "therapeuticClassNumber": 20,
    "therapeuticCategory": "20. Anxiolytics",
    "broadPharmacologicClass": "Azaspirodecanedione",
    "specificPharmacologicClass": "Non-Benzodiazepine Anxiolytic (5-HT1A Agonist)",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Famotidine",
    "brandNames": [
      "Pepcid"
    ],
    "therapeuticClassNumber": 21,
    "therapeuticCategory": "21. Gastrointestinal Agent",
    "broadPharmacologicClass": "H2 Blocker",
    "specificPharmacologicClass": "Histamine H2 Antagonist",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Omeprazole",
    "brandNames": [
      "Prilosec"
    ],
    "therapeuticClassNumber": 21,
    "therapeuticCategory": "21. Gastrointestinal Agent",
    "broadPharmacologicClass": "Proton Pump Inhibitor",
    "specificPharmacologicClass": "Proton Pump Inhibitor (Substituted Benzimidazole)",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Pantoprazole",
    "brandNames": [
      "Protonix"
    ],
    "therapeuticClassNumber": 21,
    "therapeuticCategory": "21. Gastrointestinal Agent",
    "broadPharmacologicClass": "Proton Pump Inhibitor",
    "specificPharmacologicClass": "Proton Pump Inhibitor (Substituted Benzimidazole)",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Esomeprazole",
    "brandNames": [
      "Nexium"
    ],
    "therapeuticClassNumber": 21,
    "therapeuticCategory": "21. Gastrointestinal Agent",
    "broadPharmacologicClass": "Proton Pump Inhibitor",
    "specificPharmacologicClass": "Proton Pump Inhibitor (Substituted Benzimidazole)",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Polyethylene Glycol (PEG)",
    "brandNames": [
      "Golytely",
      "MiraLAX"
    ],
    "therapeuticClassNumber": 21,
    "therapeuticCategory": "21. Gastrointestinal Agent",
    "broadPharmacologicClass": "Laxative",
    "specificPharmacologicClass": "Osmotic Laxative",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Lactulose",
    "brandNames": [
      "Constulose",
      "Generlac"
    ],
    "therapeuticClassNumber": 21,
    "therapeuticCategory": "21. Gastrointestinal Agent",
    "broadPharmacologicClass": "Laxative",
    "specificPharmacologicClass": "Osmotic Laxative / Ammonium Detoxicant",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Dicyclomine",
    "brandNames": [
      "Bentyl"
    ],
    "therapeuticClassNumber": 21,
    "therapeuticCategory": "21. Gastrointestinal Agent",
    "broadPharmacologicClass": "Antispasmodic",
    "specificPharmacologicClass": "Gastrointestinal Anticholinergic",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Docusate",
    "brandNames": [
      "Colace"
    ],
    "therapeuticClassNumber": 21,
    "therapeuticCategory": "21. Gastrointestinal Agent",
    "broadPharmacologicClass": "Stool Softener",
    "specificPharmacologicClass": "Surfactant Laxative / Stool Softener",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Diphenoxylate / Atropine",
    "brandNames": [
      "Lomotil"
    ],
    "therapeuticClassNumber": 21,
    "therapeuticCategory": "21. Gastrointestinal Agent",
    "broadPharmacologicClass": "Antidiarrheal",
    "specificPharmacologicClass": "Opioid Antidiarrheal / Anticholinergic Combination",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Lubiprostone",
    "brandNames": [
      "Amitiza"
    ],
    "therapeuticClassNumber": 21,
    "therapeuticCategory": "21. Gastrointestinal Agent",
    "broadPharmacologicClass": "Chloride Channel Activator",
    "specificPharmacologicClass": "Chloride Channel Activator",
    "curriculumModuleId": "gastrointestinal"
  },
  {
    "genericName": "Sildenafil",
    "brandNames": [
      "Viagra",
      "Revatio"
    ],
    "therapeuticClassNumber": 22,
    "therapeuticCategory": "22. Genitourinary Agent",
    "broadPharmacologicClass": "PDE-5 Inhibitor",
    "specificPharmacologicClass": "Phosphodiesterase-5 (PDE-5) Inhibitor",
    "curriculumModuleId": "renal"
  },
  {
    "genericName": "Tadalafil",
    "brandNames": [
      "Cialis",
      "Adcirca"
    ],
    "therapeuticClassNumber": 22,
    "therapeuticCategory": "22. Genitourinary Agent",
    "broadPharmacologicClass": "PDE-5 Inhibitor",
    "specificPharmacologicClass": "Phosphodiesterase-5 (PDE-5) Inhibitor",
    "curriculumModuleId": "renal"
  },
  {
    "genericName": "Oxybutynin",
    "brandNames": [
      "Ditropan XL",
      "Gelnique",
      "Oxytrol"
    ],
    "therapeuticClassNumber": 22,
    "therapeuticCategory": "22. Genitourinary Agent",
    "broadPharmacologicClass": "Urinary Antispasmodic",
    "specificPharmacologicClass": "Anticholinergic / Muscarinic Antagonist",
    "curriculumModuleId": "renal"
  },
  {
    "genericName": "Finasteride",
    "brandNames": [
      "Proscar",
      "Propecia"
    ],
    "therapeuticClassNumber": 22,
    "therapeuticCategory": "22. Genitourinary Agent",
    "broadPharmacologicClass": "5-Alpha-Reductase Inhibitor",
    "specificPharmacologicClass": "5-Alpha-Reductase Inhibitor (Type II)",
    "curriculumModuleId": "renal"
  },
  {
    "genericName": "Dutasteride",
    "brandNames": [
      "Avodart"
    ],
    "therapeuticClassNumber": 22,
    "therapeuticCategory": "22. Genitourinary Agent",
    "broadPharmacologicClass": "5-Alpha-Reductase Inhibitor",
    "specificPharmacologicClass": "5-Alpha-Reductase Inhibitor (Type I & II)",
    "curriculumModuleId": "renal"
  },
  {
    "genericName": "Solifenacin",
    "brandNames": [
      "Vesicare"
    ],
    "therapeuticClassNumber": 22,
    "therapeuticCategory": "22. Genitourinary Agent",
    "broadPharmacologicClass": "Urinary Antispasmodic",
    "specificPharmacologicClass": "Anticholinergic / Muscarinic M3 Antagonist",
    "curriculumModuleId": "renal"
  },
  {
    "genericName": "Tamsulosin",
    "brandNames": [
      "Flomax"
    ],
    "therapeuticClassNumber": 22,
    "therapeuticCategory": "22. Genitourinary Agent",
    "broadPharmacologicClass": "Alpha-1 Blocker",
    "specificPharmacologicClass": "Uroselective Alpha-1A Blocker",
    "curriculumModuleId": "renal"
  },
  {
    "genericName": "Cetirizine",
    "brandNames": [
      "Zyrtec"
    ],
    "therapeuticClassNumber": 23,
    "therapeuticCategory": "23. Antihistamine",
    "broadPharmacologicClass": "Second-Generation Antihistamine",
    "specificPharmacologicClass": "Second-Generation H1 Antagonist (Piperazine Derivative)",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Loratadine",
    "brandNames": [
      "Claritin"
    ],
    "therapeuticClassNumber": 23,
    "therapeuticCategory": "23. Antihistamine",
    "broadPharmacologicClass": "Second-Generation Antihistamine",
    "specificPharmacologicClass": "Second-Generation H1 Antagonist (Piperidine Derivative)",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Oral Contraceptive - Monophasic",
    "brandNames": [
      "Ortho-Cept",
      "Desogen",
      "Lo/Ovral",
      "Loestrin",
      "Loestrin Fe",
      "Ortho-Cyclen",
      "Ovcon-35",
      "Femcon Fe",
      "Brevcon",
      "Modicon",
      "Ortho-Novum 1/35",
      "Norinyl 1+35",
      "Ogestrel",
      "Ovcon-50",
      "Zovia 1/50E",
      "Necon 1/50",
      "Yasmin"
    ],
    "therapeuticClassNumber": 24,
    "therapeuticCategory": "24. Hormonal Agent",
    "broadPharmacologicClass": "Contraceptive",
    "specificPharmacologicClass": "Monophasic Estrogen and Progestin Combination",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Oral Contraceptive - Biphasic",
    "brandNames": [
      "Mircette",
      "Necon 10/11"
    ],
    "therapeuticClassNumber": 24,
    "therapeuticCategory": "24. Hormonal Agent",
    "broadPharmacologicClass": "Contraceptive",
    "specificPharmacologicClass": "Biphasic Estrogen and Progestin Combination",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Oral Contraceptive - Triphasic",
    "brandNames": [
      "Estrostep Fe",
      "Ortho-Tri-Cyclen",
      "Ortho-Tri-Cyclen Lo",
      "Cyclessa",
      "Ortho-Novum 7/7/7"
    ],
    "therapeuticClassNumber": 24,
    "therapeuticCategory": "24. Hormonal Agent",
    "broadPharmacologicClass": "Contraceptive",
    "specificPharmacologicClass": "Triphasic Estrogen and Progestin Combination",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Medroxyprogesterone",
    "brandNames": [
      "Provera",
      "Depo-Provera"
    ],
    "therapeuticClassNumber": 24,
    "therapeuticCategory": "24. Hormonal Agent",
    "broadPharmacologicClass": "Progestin",
    "specificPharmacologicClass": "Synthetic Progestin",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Estradiol Oral",
    "brandNames": [
      "Estrace"
    ],
    "therapeuticClassNumber": 24,
    "therapeuticCategory": "24. Hormonal Agent",
    "broadPharmacologicClass": "Estrogen",
    "specificPharmacologicClass": "Estrogen Hormone Replacement (Oral)",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Raloxifene",
    "brandNames": [
      "Evista"
    ],
    "therapeuticClassNumber": 24,
    "therapeuticCategory": "24. Hormonal Agent",
    "broadPharmacologicClass": "SERM",
    "specificPharmacologicClass": "Selective Estrogen Receptor Modulator",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Conjugated Estrogens",
    "brandNames": [
      "Premarin"
    ],
    "therapeuticClassNumber": 24,
    "therapeuticCategory": "24. Hormonal Agent",
    "broadPharmacologicClass": "Estrogen",
    "specificPharmacologicClass": "Estrogen Hormone Replacement",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Estradiol Transdermal Patch",
    "brandNames": [
      "Alora",
      "Climara",
      "Minivelle",
      "Vivelle-Dot",
      "Menostar"
    ],
    "therapeuticClassNumber": 24,
    "therapeuticCategory": "24. Hormonal Agent",
    "broadPharmacologicClass": "Estrogen",
    "specificPharmacologicClass": "Estrogen Hormone Replacement (Transdermal)",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Progesterone",
    "brandNames": [
      "Prometrium"
    ],
    "therapeuticClassNumber": 24,
    "therapeuticCategory": "24. Hormonal Agent",
    "broadPharmacologicClass": "Progestin",
    "specificPharmacologicClass": "Micronized Progestin",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Testosterone",
    "brandNames": [
      "Androderm",
      "Androgel",
      "Aveed",
      "Axiron",
      "Fortesta",
      "Striant",
      "Testim",
      "Testopel",
      "Vogelxo"
    ],
    "therapeuticClassNumber": 24,
    "therapeuticCategory": "24. Hormonal Agent",
    "broadPharmacologicClass": "Androgen",
    "specificPharmacologicClass": "Anabolic / Androgenic Steroid",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Prednisone",
    "brandNames": [
      "Deltasone"
    ],
    "therapeuticClassNumber": 25,
    "therapeuticCategory": "25. Immunosuppressant Agent",
    "broadPharmacologicClass": "Corticosteroid",
    "specificPharmacologicClass": "Systemic Corticosteroid",
    "curriculumModuleId": "immunology"
  },
  {
    "genericName": "Prednisolone Oral",
    "brandNames": [
      "Millipred",
      "Prelone"
    ],
    "therapeuticClassNumber": 25,
    "therapeuticCategory": "25. Immunosuppressant Agent",
    "broadPharmacologicClass": "Corticosteroid",
    "specificPharmacologicClass": "Systemic Corticosteroid",
    "curriculumModuleId": "immunology"
  },
  {
    "genericName": "Methylprednisolone",
    "brandNames": [
      "Medrol"
    ],
    "therapeuticClassNumber": 25,
    "therapeuticCategory": "25. Immunosuppressant Agent",
    "broadPharmacologicClass": "Corticosteroid",
    "specificPharmacologicClass": "Systemic Corticosteroid",
    "curriculumModuleId": "immunology"
  },
  {
    "genericName": "Etanercept",
    "brandNames": [
      "Enbrel"
    ],
    "therapeuticClassNumber": 25,
    "therapeuticCategory": "25. Immunosuppressant Agent",
    "broadPharmacologicClass": "Biologic DMARD",
    "specificPharmacologicClass": "TNF-Alpha Inhibitor Fusion Protein",
    "curriculumModuleId": "immunology"
  },
  {
    "genericName": "Methotrexate",
    "brandNames": [
      "Trexall",
      "Rheumatrex",
      "Otrexup"
    ],
    "therapeuticClassNumber": 25,
    "therapeuticCategory": "25. Immunosuppressant Agent",
    "broadPharmacologicClass": "Antimetabolite / DMARD",
    "specificPharmacologicClass": "Antifolate Antimetabolite",
    "curriculumModuleId": "immunology"
  },
  {
    "genericName": "Cyclosporine",
    "brandNames": [
      "Sandimmune",
      "Restasis",
      "Neoral",
      "Gengraf"
    ],
    "therapeuticClassNumber": 25,
    "therapeuticCategory": "25. Immunosuppressant Agent",
    "broadPharmacologicClass": "Calcineurin Inhibitor",
    "specificPharmacologicClass": "Calcineurin Inhibitor",
    "curriculumModuleId": "immunology"
  },
  {
    "genericName": "Adalimumab",
    "brandNames": [
      "Humira"
    ],
    "therapeuticClassNumber": 25,
    "therapeuticCategory": "25. Immunosuppressant Agent",
    "broadPharmacologicClass": "Biologic DMARD",
    "specificPharmacologicClass": "Anti-TNF-Alpha Monoclonal Antibody",
    "curriculumModuleId": "immunology"
  },
  {
    "genericName": "Denosumab",
    "brandNames": [
      "Prolia",
      "Xgeva"
    ],
    "therapeuticClassNumber": 25,
    "therapeuticCategory": "25. Immunosuppressant Agent",
    "broadPharmacologicClass": "RANKL Inhibitor",
    "specificPharmacologicClass": "RANK Ligand Inhibitor Monoclonal Antibody",
    "curriculumModuleId": "immunology"
  },
  {
    "genericName": "Naproxen",
    "brandNames": [
      "Naprosyn",
      "Anaprox",
      "Naprelan",
      "Aleve"
    ],
    "therapeuticClassNumber": 26,
    "therapeuticCategory": "26. Nonsteroidal Anti-inflammatory Agent",
    "broadPharmacologicClass": "NSAID",
    "specificPharmacologicClass": "Nonselective NSAID (Propionic Acid Derivative)",
    "curriculumModuleId": "inflammatory-pain"
  },
  {
    "genericName": "Ibuprofen",
    "brandNames": [
      "Motrin",
      "Advil"
    ],
    "therapeuticClassNumber": 26,
    "therapeuticCategory": "26. Nonsteroidal Anti-inflammatory Agent",
    "broadPharmacologicClass": "NSAID",
    "specificPharmacologicClass": "Nonselective NSAID (Propionic Acid Derivative)",
    "curriculumModuleId": "inflammatory-pain"
  },
  {
    "genericName": "Meloxicam",
    "brandNames": [
      "Mobic"
    ],
    "therapeuticClassNumber": 26,
    "therapeuticCategory": "26. Nonsteroidal Anti-inflammatory Agent",
    "broadPharmacologicClass": "NSAID",
    "specificPharmacologicClass": "Preferential COX-2 Inhibitor (Oxicam Derivative)",
    "curriculumModuleId": "inflammatory-pain"
  },
  {
    "genericName": "Nabumetone",
    "brandNames": [
      "Relafen"
    ],
    "therapeuticClassNumber": 26,
    "therapeuticCategory": "26. Nonsteroidal Anti-inflammatory Agent",
    "broadPharmacologicClass": "NSAID",
    "specificPharmacologicClass": "Nonacidic NSAID Prodrug",
    "curriculumModuleId": "inflammatory-pain"
  },
  {
    "genericName": "Diclofenac",
    "brandNames": [
      "Voltaren-XR",
      "Zipsor",
      "Zorvolex",
      "Cambia",
      "Cataflam"
    ],
    "therapeuticClassNumber": 26,
    "therapeuticCategory": "26. Nonsteroidal Anti-inflammatory Agent",
    "broadPharmacologicClass": "NSAID",
    "specificPharmacologicClass": "Nonselective NSAID (Acetic Acid Derivative)",
    "curriculumModuleId": "inflammatory-pain"
  },
  {
    "genericName": "Celecoxib",
    "brandNames": [
      "Celebrex"
    ],
    "therapeuticClassNumber": 26,
    "therapeuticCategory": "26. Nonsteroidal Anti-inflammatory Agent",
    "broadPharmacologicClass": "NSAID",
    "specificPharmacologicClass": "Selective COX-2 Inhibitor (Diarylsulfonamide)",
    "curriculumModuleId": "inflammatory-pain"
  },
  {
    "genericName": "Memantine",
    "brandNames": [
      "Namenda",
      "Namenda XR"
    ],
    "therapeuticClassNumber": 27,
    "therapeuticCategory": "27. Antidementia Agent",
    "broadPharmacologicClass": "NMDA Receptor Antagonist",
    "specificPharmacologicClass": "N-Methyl-D-Aspartate (NMDA) Receptor Antagonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Donepezil",
    "brandNames": [
      "Aricept"
    ],
    "therapeuticClassNumber": 27,
    "therapeuticCategory": "27. Antidementia Agent",
    "broadPharmacologicClass": "Cholinesterase Inhibitor",
    "specificPharmacologicClass": "Reversible Acetylcholinesterase Inhibitor",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Hydroxychloroquine",
    "brandNames": [
      "Plaquenil"
    ],
    "therapeuticClassNumber": 28,
    "therapeuticCategory": "28. Antiparasitic",
    "broadPharmacologicClass": "Aminoquinoline",
    "specificPharmacologicClass": "4-Aminoquinoline (Antimalarial / DMARD)",
    "curriculumModuleId": "infectious-disease"
  },
  {
    "genericName": "Potassium Chloride",
    "brandNames": [
      "Klor-Con",
      "K-Sol",
      "K-Tab",
      "Micro-K"
    ],
    "therapeuticClassNumber": 29,
    "therapeuticCategory": "29. Therapeutic Vitamins / Electrolytes / Miscellaneous",
    "broadPharmacologicClass": "Electrolyte",
    "specificPharmacologicClass": "Electrolyte Supplement",
    "curriculumModuleId": "nutrition-electrolytes"
  },
  {
    "genericName": "Cinacalcet",
    "brandNames": [
      "Sensipar"
    ],
    "therapeuticClassNumber": 29,
    "therapeuticCategory": "29. Therapeutic Vitamins / Electrolytes / Miscellaneous",
    "broadPharmacologicClass": "Calcimimetic",
    "specificPharmacologicClass": "Calcium-Sensing Receptor Agonist (Calcimimetic)",
    "curriculumModuleId": "nutrition-electrolytes"
  },
  {
    "genericName": "Ferrous Sulfate",
    "brandNames": [
      "Feosol"
    ],
    "therapeuticClassNumber": 29,
    "therapeuticCategory": "29. Therapeutic Vitamins / Electrolytes / Miscellaneous",
    "broadPharmacologicClass": "Iron Preparation",
    "specificPharmacologicClass": "Oral Iron Supplement",
    "curriculumModuleId": "nutrition-electrolytes"
  },
  {
    "genericName": "Sevelamer",
    "brandNames": [
      "Renvela",
      "Renagel"
    ],
    "therapeuticClassNumber": 29,
    "therapeuticCategory": "29. Therapeutic Vitamins / Electrolytes / Miscellaneous",
    "broadPharmacologicClass": "Phosphate Binder",
    "specificPharmacologicClass": "Non-Absorbed Phosphate Binder",
    "curriculumModuleId": "nutrition-electrolytes"
  },
  {
    "genericName": "Cyanocobalamin",
    "brandNames": [
      "Nascobal",
      "B-12"
    ],
    "therapeuticClassNumber": 29,
    "therapeuticCategory": "29. Therapeutic Vitamins / Electrolytes / Miscellaneous",
    "broadPharmacologicClass": "Vitamin",
    "specificPharmacologicClass": "Water-Soluble Vitamin (Vitamin B12)",
    "curriculumModuleId": "nutrition-electrolytes"
  },
  {
    "genericName": "Folic Acid",
    "brandNames": [
      "FA-8"
    ],
    "therapeuticClassNumber": 29,
    "therapeuticCategory": "29. Therapeutic Vitamins / Electrolytes / Miscellaneous",
    "broadPharmacologicClass": "Vitamin",
    "specificPharmacologicClass": "Water-Soluble Vitamin (Vitamin B9)",
    "curriculumModuleId": "nutrition-electrolytes"
  },
  {
    "genericName": "Ibandronate",
    "brandNames": [
      "Boniva"
    ],
    "therapeuticClassNumber": 30,
    "therapeuticCategory": "30. Metabolic Bone Disease Agents",
    "broadPharmacologicClass": "Bisphosphonate",
    "specificPharmacologicClass": "Nitrogen-Containing Bisphosphonate",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Zoledronic Acid",
    "brandNames": [
      "Reclast",
      "Zometa"
    ],
    "therapeuticClassNumber": 30,
    "therapeuticCategory": "30. Metabolic Bone Disease Agents",
    "broadPharmacologicClass": "Bisphosphonate",
    "specificPharmacologicClass": "Nitrogen-Containing Bisphosphonate",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Risedronate",
    "brandNames": [
      "Actonel"
    ],
    "therapeuticClassNumber": 30,
    "therapeuticCategory": "30. Metabolic Bone Disease Agents",
    "broadPharmacologicClass": "Bisphosphonate",
    "specificPharmacologicClass": "Nitrogen-Containing Bisphosphonate",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Alendronate",
    "brandNames": [
      "Fosamax",
      "Binosto"
    ],
    "therapeuticClassNumber": 30,
    "therapeuticCategory": "30. Metabolic Bone Disease Agents",
    "broadPharmacologicClass": "Bisphosphonate",
    "specificPharmacologicClass": "Nitrogen-Containing Bisphosphonate",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Varenicline",
    "brandNames": [
      "Chantix"
    ],
    "therapeuticClassNumber": 31,
    "therapeuticCategory": "31. Smoking Cessation Aid",
    "broadPharmacologicClass": "Nicotinic Receptor Partial Agonist",
    "specificPharmacologicClass": "Alpha-4 Beta-2 Nicotinic Receptor Partial Agonist",
    "curriculumModuleId": "toxicology-addiction"
  },
  {
    "genericName": "Eszopiclone",
    "brandNames": [
      "Lunesta"
    ],
    "therapeuticClassNumber": 32,
    "therapeuticCategory": "32. Sedatives/Hypnotics",
    "broadPharmacologicClass": "Non-Benzodiazepine Hypnotic",
    "specificPharmacologicClass": "GABA-A Receptor Positive Allosteric Modulator (Cyclopyrrolone)",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Zolpidem",
    "brandNames": [
      "Ambien",
      "Ambien CR",
      "Edluar",
      "Intermezzo",
      "Zolpimist"
    ],
    "therapeuticClassNumber": 32,
    "therapeuticCategory": "32. Sedatives/Hypnotics",
    "broadPharmacologicClass": "Non-Benzodiazepine Hypnotic",
    "specificPharmacologicClass": "GABA-A Receptor Positive Allosteric Modulator (Imidazopyridine)",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Sumatriptan",
    "brandNames": [
      "Imitrex",
      "Imitrex Statdose",
      "Alsuma"
    ],
    "therapeuticClassNumber": 33,
    "therapeuticCategory": "33. Anti-Migraine Agents",
    "broadPharmacologicClass": "Triptan",
    "specificPharmacologicClass": "Serotonin 5-HT1B/1D Receptor Agonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Eletriptan",
    "brandNames": [
      "Relpax"
    ],
    "therapeuticClassNumber": 33,
    "therapeuticCategory": "33. Anti-Migraine Agents",
    "broadPharmacologicClass": "Triptan",
    "specificPharmacologicClass": "Serotonin 5-HT1B/1D Receptor Agonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Rizatriptan",
    "brandNames": [
      "Maxalt"
    ],
    "therapeuticClassNumber": 33,
    "therapeuticCategory": "33. Anti-Migraine Agents",
    "broadPharmacologicClass": "Triptan",
    "specificPharmacologicClass": "Serotonin 5-HT1B/1D Receptor Agonist",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Triamcinolone Topical",
    "brandNames": [
      "Kenalog",
      "Aristocort"
    ],
    "therapeuticClassNumber": 34,
    "therapeuticCategory": "34. Dermatological Agents",
    "broadPharmacologicClass": "Topical Corticosteroid",
    "specificPharmacologicClass": "Medium-to-High Potency Topical Corticosteroid",
    "curriculumModuleId": "dermatology"
  },
  {
    "genericName": "Hydrocortisone Topical",
    "brandNames": [
      "Westcort",
      "Locoid",
      "Ala-Cort"
    ],
    "therapeuticClassNumber": 34,
    "therapeuticCategory": "34. Dermatological Agents",
    "broadPharmacologicClass": "Topical Corticosteroid",
    "specificPharmacologicClass": "Low Potency Topical Corticosteroid",
    "curriculumModuleId": "dermatology"
  },
  {
    "genericName": "Isotretinoin",
    "brandNames": [
      "Absorica",
      "Accutane",
      "Amnesteem",
      "Claravis",
      "Myorisan"
    ],
    "therapeuticClassNumber": 34,
    "therapeuticCategory": "34. Dermatological Agents",
    "broadPharmacologicClass": "Retinoid",
    "specificPharmacologicClass": "Systemic Retinoic Acid Derivative",
    "curriculumModuleId": "dermatology"
  },
  {
    "genericName": "Adapalene",
    "brandNames": [
      "Differin"
    ],
    "therapeuticClassNumber": 34,
    "therapeuticCategory": "34. Dermatological Agents",
    "broadPharmacologicClass": "Retinoid",
    "specificPharmacologicClass": "Third-Generation Topical Retinoid",
    "curriculumModuleId": "dermatology"
  },
  {
    "genericName": "Colchicine",
    "brandNames": [
      "Colcrys",
      "Mitigare"
    ],
    "therapeuticClassNumber": 35,
    "therapeuticCategory": "35. Anti-Gout Agents",
    "broadPharmacologicClass": "Anti-Gout Agent",
    "specificPharmacologicClass": "Microtubule Assembly Inhibitor",
    "curriculumModuleId": "inflammatory-pain"
  },
  {
    "genericName": "Allopurinol",
    "brandNames": [
      "Aloprim",
      "Zyloprim"
    ],
    "therapeuticClassNumber": 35,
    "therapeuticCategory": "35. Anti-Gout Agents",
    "broadPharmacologicClass": "Xanthine Oxidase Inhibitor",
    "specificPharmacologicClass": "Purine Analog Xanthine Oxidase Inhibitor",
    "curriculumModuleId": "inflammatory-pain"
  },
  {
    "genericName": "Febuxostat",
    "brandNames": [
      "Uloric"
    ],
    "therapeuticClassNumber": 35,
    "therapeuticCategory": "35. Anti-Gout Agents",
    "broadPharmacologicClass": "Xanthine Oxidase Inhibitor",
    "specificPharmacologicClass": "Non-Purine Selective Xanthine Oxidase Inhibitor",
    "curriculumModuleId": "inflammatory-pain"
  },
  {
    "genericName": "Albuterol",
    "brandNames": [
      "ProAir HFA",
      "ProAir RespiClick",
      "Ventolin HFA",
      "Proventil HFA",
      "VoSpire ER"
    ],
    "therapeuticClassNumber": 36,
    "therapeuticCategory": "36. Respiratory Agent",
    "broadPharmacologicClass": "Beta-2 Agonist",
    "specificPharmacologicClass": "Short-Acting Beta-2 Adrenergic Agonist (SABA)",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Fluticasone Oral Inhaler",
    "brandNames": [
      "Flovent",
      "Arnuity Ellipta"
    ],
    "therapeuticClassNumber": 36,
    "therapeuticCategory": "36. Respiratory Agent",
    "broadPharmacologicClass": "Inhaled Corticosteroid",
    "specificPharmacologicClass": "Inhaled Corticosteroid (ICS)",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Fluticasone Nasal Inhaler",
    "brandNames": [
      "Flonase"
    ],
    "therapeuticClassNumber": 36,
    "therapeuticCategory": "36. Respiratory Agent",
    "broadPharmacologicClass": "Nasal Corticosteroid",
    "specificPharmacologicClass": "Intranasal Corticosteroid",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Fluticasone / Salmeterol",
    "brandNames": [
      "Advair"
    ],
    "therapeuticClassNumber": 36,
    "therapeuticCategory": "36. Respiratory Agent",
    "broadPharmacologicClass": "ICS / LABA Combination",
    "specificPharmacologicClass": "Inhaled Corticosteroid and Long-Acting Beta-2 Agonist",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Budesonide / Formoterol",
    "brandNames": [
      "Symbicort"
    ],
    "therapeuticClassNumber": 36,
    "therapeuticCategory": "36. Respiratory Agent",
    "broadPharmacologicClass": "ICS / LABA Combination",
    "specificPharmacologicClass": "Inhaled Corticosteroid and Long-Acting Beta-2 Agonist",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Ipratropium / Albuterol",
    "brandNames": [
      "Combivent Respimat",
      "Duoneb"
    ],
    "therapeuticClassNumber": 36,
    "therapeuticCategory": "36. Respiratory Agent",
    "broadPharmacologicClass": "SAMA / SABA Combination",
    "specificPharmacologicClass": "Short-Acting Muscarinic Antagonist and Beta-2 Agonist",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Tiotropium",
    "brandNames": [
      "Spiriva"
    ],
    "therapeuticClassNumber": 36,
    "therapeuticCategory": "36. Respiratory Agent",
    "broadPharmacologicClass": "Anticholinergic",
    "specificPharmacologicClass": "Long-Acting Muscarinic Antagonist (LAMA)",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Montelukast",
    "brandNames": [
      "Singulair"
    ],
    "therapeuticClassNumber": 36,
    "therapeuticCategory": "36. Respiratory Agent",
    "broadPharmacologicClass": "Leukotriene Receptor Antagonist",
    "specificPharmacologicClass": "CysLT1 Leukotriene Receptor Antagonist",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Budesonide",
    "brandNames": [
      "Rhinocort Aqua",
      "Pulmicort"
    ],
    "therapeuticClassNumber": 36,
    "therapeuticCategory": "36. Respiratory Agent",
    "broadPharmacologicClass": "Corticosteroid",
    "specificPharmacologicClass": "Inhaled / Nasal Corticosteroid",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Omalizumab",
    "brandNames": [
      "Xolair"
    ],
    "therapeuticClassNumber": 36,
    "therapeuticCategory": "36. Respiratory Agent",
    "broadPharmacologicClass": "Anti-IgE Antibody",
    "specificPharmacologicClass": "Anti-IgE Monoclonal Antibody",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Benzonatate",
    "brandNames": [
      "Tessalon Perles",
      "Zonatuss"
    ],
    "therapeuticClassNumber": 36,
    "therapeuticCategory": "36. Respiratory Agent",
    "broadPharmacologicClass": "Antitussive",
    "specificPharmacologicClass": "Voltage-Gated Sodium Channel Blocker Antitussive",
    "curriculumModuleId": "respiratory"
  },
  {
    "genericName": "Cyclobenzaprine",
    "brandNames": [
      "Flexeril",
      "Amrix",
      "Fexmid"
    ],
    "therapeuticClassNumber": 37,
    "therapeuticCategory": "37. Skeletal Muscle Relaxant",
    "broadPharmacologicClass": "Centrally Acting Muscle Relaxant",
    "specificPharmacologicClass": "Centrally Acting Skeletal Muscle Relaxant (Tricyclic-Related)",
    "curriculumModuleId": "musculoskeletal"
  },
  {
    "genericName": "Baclofen",
    "brandNames": [
      "Lioresal",
      "Gablofen"
    ],
    "therapeuticClassNumber": 37,
    "therapeuticCategory": "37. Skeletal Muscle Relaxant",
    "broadPharmacologicClass": "GABA-B Agonist",
    "specificPharmacologicClass": "GABA-B Receptor Agonist Muscle Relaxant",
    "curriculumModuleId": "musculoskeletal"
  },
  {
    "genericName": "Methocarbamol",
    "brandNames": [
      "Robaxin"
    ],
    "therapeuticClassNumber": 37,
    "therapeuticCategory": "37. Skeletal Muscle Relaxant",
    "broadPharmacologicClass": "Centrally Acting Muscle Relaxant",
    "specificPharmacologicClass": "Central Nervous System Depressant Muscle Relaxant",
    "curriculumModuleId": "musculoskeletal"
  },
  {
    "genericName": "Tizanidine",
    "brandNames": [
      "Zanaflex"
    ],
    "therapeuticClassNumber": 37,
    "therapeuticCategory": "37. Skeletal Muscle Relaxant",
    "broadPharmacologicClass": "Alpha-2 Agonist",
    "specificPharmacologicClass": "Centrally Acting Alpha-2 Adrenergic Agonist Muscle Relaxant",
    "curriculumModuleId": "musculoskeletal"
  },
  {
    "genericName": "Amphetamine / Dextroamphetamine",
    "brandNames": [
      "Adderall"
    ],
    "therapeuticClassNumber": 38,
    "therapeuticCategory": "38. Central Nervous System Agent",
    "broadPharmacologicClass": "CNS Stimulant",
    "specificPharmacologicClass": "Mixed Amphetamine Salts",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Lisdexamfetamine",
    "brandNames": [
      "Vyvanse"
    ],
    "therapeuticClassNumber": 38,
    "therapeuticCategory": "38. Central Nervous System Agent",
    "broadPharmacologicClass": "CNS Stimulant",
    "specificPharmacologicClass": "Amphetamine Prodrug",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Methylphenidate",
    "brandNames": [
      "Aptensio XR",
      "Concerta",
      "Daytrana",
      "Metadate CD",
      "Metadate ER",
      "Methylin",
      "Quillivant XR",
      "Ritalin",
      "Ritalin LA"
    ],
    "therapeuticClassNumber": 38,
    "therapeuticCategory": "38. Central Nervous System Agent",
    "broadPharmacologicClass": "CNS Stimulant",
    "specificPharmacologicClass": "Dopamine / Norepinephrine Reuptake Inhibitor Stimulant",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Dexmethylphenidate",
    "brandNames": [
      "Focalin"
    ],
    "therapeuticClassNumber": 38,
    "therapeuticCategory": "38. Central Nervous System Agent",
    "broadPharmacologicClass": "CNS Stimulant",
    "specificPharmacologicClass": "d-threo-Methylphenidate Enantiomer",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Phentermine",
    "brandNames": [
      "Adipex-P",
      "Suprenza"
    ],
    "therapeuticClassNumber": 38,
    "therapeuticCategory": "38. Central Nervous System Agent",
    "broadPharmacologicClass": "Anorexiant",
    "specificPharmacologicClass": "Sympathomimetic Amine Anorexiant",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Atomoxetine",
    "brandNames": [
      "Strattera"
    ],
    "therapeuticClassNumber": 38,
    "therapeuticCategory": "38. Central Nervous System Agent",
    "broadPharmacologicClass": "NRI",
    "specificPharmacologicClass": "Selective Norepinephrine Reuptake Inhibitor",
    "curriculumModuleId": "central-nervous-system"
  },
  {
    "genericName": "Levothyroxine",
    "brandNames": [
      "Synthroid",
      "Levoxyl",
      "Tirosint",
      "Unithroid"
    ],
    "therapeuticClassNumber": 39,
    "therapeuticCategory": "39. Thyroid Product",
    "broadPharmacologicClass": "Thyroid Hormone",
    "specificPharmacologicClass": "Synthetic T4 Hormone",
    "curriculumModuleId": "endocrine"
  },
  {
    "genericName": "Thyroid",
    "brandNames": [
      "Armour Thyroid"
    ],
    "therapeuticClassNumber": 39,
    "therapeuticCategory": "39. Thyroid Product",
    "broadPharmacologicClass": "Thyroid Hormone",
    "specificPharmacologicClass": "Desiccated Thyroid Extract (T3/T4)",
    "curriculumModuleId": "endocrine"
  }
];
