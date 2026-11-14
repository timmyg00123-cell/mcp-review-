import type { Drug3DCatalogEntry, TherapeuticClass3DGroup } from '../types/structure3d';
import { THERAPEUTIC_CATEGORIES, TOP_DRUGS_TAXONOMY } from './topDrugsTaxonomyData';
import { resolveTopDrugClinicalMonograph } from './topDrugsClinicalData';
import { normalizeForTaxonomyMatch } from '../utils/topDrugsTaxonomy';
import { RECEPTOR_POCKET_TEMPLATES } from './receptorPocketTemplates';

const EXCLUDED_TOP200_NAMES = new Set([
  'Phenazopyridine',
  'Chlorhexidine',
  'Insulin Lispro',
  'Insulin Aspart',
  'Regular Human Insulin',
  'Insulin Glargine',
  'Insulin Degludec',
  'Evolocumab',
  'Epoetin Alfa',
  'Lithium Carbonate',
  'Polyethylene Glycol (PEG)',
  'Lactulose',
  'Docusate',
  'Oral Contraceptive - Monophasic',
  'Oral Contraceptive - Biphasic',
  'Oral Contraceptive - Triphasic',
  'Etanercept',
  'Adalimumab',
  'Denosumab',
  'Potassium Chloride',
  'Ferrous Sulfate',
  'Sevelamer',
  'Omalizumab',
]);

const ROUTE_AND_SALT_RENAME: Record<string, string> = {
  'Morphine ER': 'Morphine',
  'Lidocaine Topical Patch': 'Lidocaine',
  'Clindamycin Topical': 'Clindamycin',
  'Clindamycin Oral': 'Clindamycin',
  'Divalproex / Valproic Acid': 'Valproic Acid',
  'Ketoconazole Topical': 'Ketoconazole',
  'Nystatin Topical': 'Nystatin',
  'Nifedipine Extended Release': 'Nifedipine',
  'Metoprolol Tartrate / Succinate': 'Metoprolol',
  'Benztropine Mesylate': 'Benztropine',
  'Estradiol Oral': 'Estradiol',
  'Estradiol Transdermal Patch': 'Estradiol',
  'Prednisolone Oral': 'Prednisolone',
  'Triamcinolone Topical': 'Triamcinolone',
  'Hydrocortisone Topical': 'Hydrocortisone',
  'Fluticasone Oral Inhaler': 'Fluticasone',
  'Fluticasone Nasal Inhaler': 'Fluticasone',
  'Amphetamine / Dextroamphetamine': 'Amphetamine',
};

interface SeedDrugSpec {
  genericName: string;
  brandNames: string[];
  classNumber: number;
  pharmacologicClass: string;
  source: 'top-200' | 'review-module' | 'both';
}

const SPLIT_COMBINATION_SEEDS: Record<string, SeedDrugSpec[]> = {
  'Acetaminophen / Butalbital / Caffeine': [
    { genericName: 'Butalbital', brandNames: ['Fioricet (component)'], classNumber: 1, pharmacologicClass: 'Barbiturate GABA-A Positive Allosteric Modulator', source: 'top-200' },
    { genericName: 'Caffeine', brandNames: ['Fioricet / Excedrin (component)'], classNumber: 1, pharmacologicClass: 'Adenosine Receptor / Phosphodiesterase Methylxanthine Adjuvant', source: 'top-200' },
  ],
  'Hydrocodone / Acetaminophen': [
    { genericName: 'Hydrocodone', brandNames: ['Norco', 'Vicodin'], classNumber: 1, pharmacologicClass: 'Mu-Opioid Receptor Agonist', source: 'top-200' },
  ],
  'Buprenorphine / Naloxone': [
    { genericName: 'Buprenorphine', brandNames: ['Suboxone', 'Sublocade'], classNumber: 1, pharmacologicClass: 'Partial Mu-Opioid Agonist / Kappa Antagonist', source: 'top-200' },
    { genericName: 'Naloxone', brandNames: ['Narcan', 'Suboxone (component)'], classNumber: 1, pharmacologicClass: 'Competitive Mu-Opioid Receptor Antagonist', source: 'top-200' },
  ],
  'Amoxicillin / Potassium Clavulanate': [
    { genericName: 'Clavulanate', brandNames: ['Augmentin (component)'], classNumber: 2, pharmacologicClass: 'Suicide Serine Beta-Lactamase Inhibitor', source: 'top-200' },
  ],
  'Trimethoprim / Sulfamethoxazole': [
    { genericName: 'Trimethoprim', brandNames: ['Bactrim (component)', 'Primsol'], classNumber: 2, pharmacologicClass: 'Bacterial Dihydrofolate Reductase (DHFR) Inhibitor', source: 'top-200' },
    { genericName: 'Sulfamethoxazole', brandNames: ['Bactrim (component)', 'Septra'], classNumber: 2, pharmacologicClass: 'Sulfonamide Dihydropteroate Synthase Inhibitor', source: 'top-200' },
  ],
  'Clotrimazole / Betamethasone': [
    { genericName: 'Clotrimazole', brandNames: ['Lotrimin', 'Lotrisone (component)'], classNumber: 9, pharmacologicClass: 'Imidazole CYP51 Antifungal', source: 'top-200' },
    { genericName: 'Betamethasone', brandNames: ['Celestone', 'Diprolene'], classNumber: 9, pharmacologicClass: 'High-Potency Fluorinated Corticosteroid', source: 'top-200' },
  ],
  'Triamterene / Hydrochlorothiazide': [
    { genericName: 'Triamterene', brandNames: ['Dyrenium', 'Maxzide (component)'], classNumber: 11, pharmacologicClass: 'Collecting-Duct ENaC Potassium-Sparing Diuretic', source: 'top-200' },
  ],
  'Dipyridamole and Aspirin': [
    { genericName: 'Dipyridamole', brandNames: ['Persantine', 'Aggrenox (component)'], classNumber: 13, pharmacologicClass: 'Platelet PDE3/PDE5 & Adenosine Reuptake Inhibitor', source: 'top-200' },
  ],
  'Carbidopa / Levodopa': [
    { genericName: 'Levodopa', brandNames: ['Sinemet (component)'], classNumber: 16, pharmacologicClass: 'CNS Dopamine Metabolic Precursor', source: 'top-200' },
    { genericName: 'Carbidopa', brandNames: ['Lodosyn', 'Sinemet (component)'], classNumber: 16, pharmacologicClass: 'Peripheral Aromatic L-Amino Acid Decarboxylase Inhibitor', source: 'top-200' },
  ],
  'Emtricitabine / Tenofovir': [
    { genericName: 'Emtricitabine', brandNames: ['Emtriva', 'Truvada (component)'], classNumber: 18, pharmacologicClass: 'Cytidine Analog HIV Reverse Transcriptase Inhibitor (NRTI)', source: 'top-200' },
    { genericName: 'Tenofovir', brandNames: ['Viread', 'Descovy'], classNumber: 18, pharmacologicClass: 'Adenosine Nucleotide HIV/HBV Reverse Transcriptase Inhibitor (NtRTI)', source: 'top-200' },
  ],
  'Diphenoxylate / Atropine': [
    { genericName: 'Diphenoxylate', brandNames: ['Lomotil (component)'], classNumber: 21, pharmacologicClass: 'Enteric Mu-Opioid Antidiarrheal Agonist', source: 'top-200' },
    { genericName: 'Atropine', brandNames: ['Atropen', 'Lomotil (component)'], classNumber: 21, pharmacologicClass: 'Competitive Muscarinic Acetylcholine Antagonist', source: 'top-200' },
  ],
  'Fluticasone / Salmeterol': [
    { genericName: 'Salmeterol', brandNames: ['Serevent', 'Advair (component)'], classNumber: 36, pharmacologicClass: 'Long-Acting Beta-2 Adrenergic Agonist (LABA)', source: 'top-200' },
  ],
  'Budesonide / Formoterol': [
    { genericName: 'Formoterol', brandNames: ['Perforomist', 'Symbicort (component)'], classNumber: 36, pharmacologicClass: 'Rapid-Onset Long-Acting Beta-2 Adrenergic Agonist (LABA)', source: 'top-200' },
  ],
  'Ipratropium / Albuterol': [
    { genericName: 'Ipratropium', brandNames: ['Atrovent', 'Combivent (component)'], classNumber: 36, pharmacologicClass: 'Short-Acting Quaternary Muscarinic Antagonist (SAMA)', source: 'top-200' },
  ],
};

const SUPPLEMENTAL_REVIEW_DRUGS: SeedDrugSpec[] = [
  // Class 1: Analgesic (Codeine from curriculum analgesics)
  { genericName: 'Codeine', brandNames: ['Tylenol #3 (component)'], classNumber: 1, pharmacologicClass: '3-Methoxy Morphinan Opioid Prodrug', source: 'review-module' },
  // Class 10: Anti-Lipemic
  { genericName: 'Lomitapide', brandNames: ['Juxtapid'], classNumber: 10, pharmacologicClass: 'Microsomal Triglyceride Transfer Protein (MTP) Inhibitor', source: 'review-module' },
  // Class 11: Cardiovascular — Antihypertensive / Heart Failure / Diuretics
  { genericName: 'Captopril', brandNames: ['Capoten'], classNumber: 11, pharmacologicClass: 'Sulfhydryl (-SH) ACE Inhibitor', source: 'review-module' },
  { genericName: 'Fosinopril', brandNames: ['Monopril'], classNumber: 11, pharmacologicClass: 'Phosphinate Ester Prodrug ACE Inhibitor', source: 'review-module' },
  { genericName: 'Candesartan', brandNames: ['Atacand'], classNumber: 11, pharmacologicClass: 'Angiotensin II Type 1 Receptor Blocker (ARB)', source: 'review-module' },
  { genericName: 'Telmisartan', brandNames: ['Micardis'], classNumber: 11, pharmacologicClass: 'Benzimidazole Angiotensin II Receptor Blocker (ARB)', source: 'review-module' },
  { genericName: 'Aliskiren', brandNames: ['Tekturna'], classNumber: 11, pharmacologicClass: 'Direct Non-Peptide Renin Inhibitor', source: 'review-module' },
  { genericName: 'Sacubitril', brandNames: ['Entresto (component)'], classNumber: 11, pharmacologicClass: 'Neprilysin (NEP) Inhibitor Prodrug', source: 'review-module' },
  { genericName: 'Dobutamine', brandNames: ['Dobutrex'], classNumber: 11, pharmacologicClass: 'Beta-1 Predominant Catecholamine Inotrope', source: 'review-module' },
  { genericName: 'Milrinone', brandNames: ['Primacor'], classNumber: 11, pharmacologicClass: 'Bipyridine Cardiac PDE3 Inhibitor ("Inodilator")', source: 'review-module' },
  { genericName: 'Ivabradine', brandNames: ['Corlanor'], classNumber: 11, pharmacologicClass: 'SA-Nodal HCN4 Funny-Current (If) Blocker', source: 'review-module' },
  { genericName: 'Bumetanide', brandNames: ['Bumex'], classNumber: 11, pharmacologicClass: '5-Phenoxy Sulfonamide Loop Diuretic (NKCC2)', source: 'review-module' },
  { genericName: 'Torsemide', brandNames: ['Demadex'], classNumber: 11, pharmacologicClass: 'Pyridinesulfonylurea Loop Diuretic (NKCC2)', source: 'review-module' },
  { genericName: 'Ethacrynic Acid', brandNames: ['Edecrin'], classNumber: 11, pharmacologicClass: 'Non-Sulfonamide Phenoxyacetic Acid Loop Diuretic', source: 'review-module' },
  { genericName: 'Chlorothiazide', brandNames: ['Diuril'], classNumber: 11, pharmacologicClass: 'Benzothiadiazine Thiazide Diuretic (NCC)', source: 'review-module' },
  { genericName: 'Trichlormethiazide', brandNames: ['Naqua'], classNumber: 11, pharmacologicClass: 'Lipophilic C3-Dichloromethyl Thiazide Diuretic', source: 'review-module' },
  { genericName: 'Polythiazide', brandNames: ['Renese'], classNumber: 11, pharmacologicClass: 'Long-Acting Thiazide Diuretic (NCC)', source: 'review-module' },
  { genericName: 'Metolazone', brandNames: ['Zaroxolyn'], classNumber: 11, pharmacologicClass: 'Quinazolinone Thiazide-Like Diuretic (NCC)', source: 'review-module' },
  { genericName: 'Amiloride', brandNames: ['Midamor'], classNumber: 11, pharmacologicClass: 'Pyrazinoylguanidine ENaC Potassium-Sparing Diuretic', source: 'review-module' },
  { genericName: 'Eplerenone', brandNames: ['Inspra'], classNumber: 11, pharmacologicClass: 'Selective 9,11-Epoxide Mineralocorticoid Receptor Antagonist', source: 'review-module' },
  { genericName: 'Pindolol', brandNames: ['Visken'], classNumber: 11, pharmacologicClass: 'Nonselective Beta-Blocker with Intrinsic Sympathomimetic Activity', source: 'review-module' },
  { genericName: 'Nadolol', brandNames: ['Corgard'], classNumber: 11, pharmacologicClass: 'Hydrophilic Nonselective Beta-Adrenergic Blocker', source: 'review-module' },
  { genericName: 'Esmolol', brandNames: ['Brevibloc'], classNumber: 11, pharmacologicClass: 'Ultra-Short-Acting Esterase-Cleaved Beta-1 Blocker', source: 'review-module' },
  { genericName: 'Methyldopa', brandNames: ['Aldomet'], classNumber: 11, pharmacologicClass: 'Central Alpha-2 Agonist Prodrug', source: 'review-module' },
  { genericName: 'Reserpine', brandNames: ['Serpasil'], classNumber: 11, pharmacologicClass: 'Vesicular Monoamine Transporter-2 (VMAT2) Inhibitor', source: 'review-module' },
  { genericName: 'Prazosin', brandNames: ['Minipress'], classNumber: 11, pharmacologicClass: 'Quinazoline Selective Alpha-1 Adrenergic Blocker', source: 'review-module' },
  { genericName: 'Diazoxide', brandNames: ['Proglycem', 'Hyperstat'], classNumber: 11, pharmacologicClass: 'ATP-Sensitive K+ (KATP) Channel Opener Vasodilator', source: 'review-module' },
  { genericName: 'Minoxidil', brandNames: ['Loniten'], classNumber: 11, pharmacologicClass: 'Sulfotransferase-Activated KATP Channel Opener Vasodilator', source: 'review-module' },
  { genericName: 'Clevidipine', brandNames: ['Cleviprex'], classNumber: 11, pharmacologicClass: 'Ultra-Short-Acting Ester Dihydropyridine Ca2+ Blocker', source: 'review-module' },
  { genericName: 'Isradipine', brandNames: ['DynaCirc'], classNumber: 11, pharmacologicClass: 'Oxadiazole Dihydropyridine L-Type Ca2+ Blocker', source: 'review-module' },
  { genericName: 'Acetazolamide', brandNames: ['Diamox'], classNumber: 11, pharmacologicClass: 'Proximal-Tubule Carbonic Anhydrase Inhibitor', source: 'review-module' },
  { genericName: 'Tolvaptan', brandNames: ['Samsca', 'Jynarque'], classNumber: 11, pharmacologicClass: 'Selective Renal Vasopressin V2 Receptor Antagonist ("Aquaretic")', source: 'review-module' },
  // Class 12: Anticoagulant
  { genericName: 'Argatroban', brandNames: ['Acova'], classNumber: 12, pharmacologicClass: 'Parenteral Univalent Direct Thrombin (IIa) Inhibitor', source: 'review-module' },
  { genericName: 'Fondaparinux', brandNames: ['Arixtra'], classNumber: 12, pharmacologicClass: 'Synthetic Sulfated Pentasaccharide Factor Xa Inhibitor (via AT-III)', source: 'review-module' },
  // Class 13: Antiplatelet
  { genericName: 'Prasugrel', brandNames: ['Effient'], classNumber: 13, pharmacologicClass: 'Irreversible Thienopyridine P2Y12 Platelet Inhibitor', source: 'review-module' },
  { genericName: 'Ticagrelor', brandNames: ['Brilinta'], classNumber: 13, pharmacologicClass: 'Reversible Cyclopentyltriazolopyrimidine P2Y12 Antagonist', source: 'review-module' },
  { genericName: 'Cangrelor', brandNames: ['Kengreal'], classNumber: 13, pharmacologicClass: 'Intravenous Direct Reversible Nucleotide P2Y12 Antagonist', source: 'review-module' },
  { genericName: 'Ticlopidine', brandNames: ['Ticlid'], classNumber: 13, pharmacologicClass: 'First-Generation Thienopyridine P2Y12 Prodrug', source: 'review-module' },
  { genericName: 'Vorapaxar', brandNames: ['Zontivity'], classNumber: 13, pharmacologicClass: 'Platelet Thrombin Receptor (PAR-1) Antagonist', source: 'review-module' },
  { genericName: 'Tirofiban', brandNames: ['Aggrastat'], classNumber: 13, pharmacologicClass: 'Non-Peptide RGD-Mimetic GPIIb/IIIa Integrin Antagonist', source: 'review-module' },
  { genericName: 'Eptifibatide', brandNames: ['Integrilin'], classNumber: 13, pharmacologicClass: 'Cyclic Heptapeptide KGD GPIIb/IIIa Integrin Antagonist', source: 'review-module' },
  { genericName: 'Cilostazol', brandNames: ['Pletal'], classNumber: 13, pharmacologicClass: 'Quinolinone Platelet/Vascular PDE3 Inhibitor', source: 'review-module' },
  // Class 14: Antiarrhythmic
  { genericName: 'Quinidine', brandNames: ['Quinaglute'], classNumber: 14, pharmacologicClass: 'Class Ia Sodium & Potassium Channel Antiarrhythmic', source: 'review-module' },
  { genericName: 'Procainamide', brandNames: ['Pronestyl'], classNumber: 14, pharmacologicClass: 'Class Ia Benzamide Sodium Channel Antiarrhythmic', source: 'review-module' },
  { genericName: 'Disopyramide', brandNames: ['Norpace'], classNumber: 14, pharmacologicClass: 'Class Ia Anticholinergic Sodium Channel Antiarrhythmic', source: 'review-module' },
  { genericName: 'Mexiletine', brandNames: ['Mexitil'], classNumber: 14, pharmacologicClass: 'Class Ib Oral Lidocaine-Analog Sodium Channel Blocker', source: 'review-module' },
  { genericName: 'Flecainide', brandNames: ['Tambocor'], classNumber: 14, pharmacologicClass: 'Class Ic Slow-Dissociating Nav1.5 Blocker', source: 'review-module' },
  { genericName: 'Propafenone', brandNames: ['Rythmol'], classNumber: 14, pharmacologicClass: 'Class Ic Sodium Channel Blocker with Beta-Blocking Activity', source: 'review-module' },
  { genericName: 'Sotalol', brandNames: ['Betapace'], classNumber: 14, pharmacologicClass: 'Class III hERG K+ Blocker & Nonselective Beta-Blocker', source: 'review-module' },
  { genericName: 'Dronedarone', brandNames: ['Multaq'], classNumber: 14, pharmacologicClass: 'Non-Iodinated Benzofuran Class III Multichannel Antiarrhythmic', source: 'review-module' },
  // Class 15: Antianginal
  { genericName: 'Ranolazine', brandNames: ['Ranexa'], classNumber: 15, pharmacologicClass: 'Late Inward Cardiac Sodium Current (INa,L) Inhibitor', source: 'review-module' },
  { genericName: 'Isosorbide Dinitrate', brandNames: ['Isordil', 'BiDil (component)'], classNumber: 15, pharmacologicClass: 'Organic Nitrate Nitric-Oxide / sGC Vasodilator', source: 'review-module' },
  // Class 16: Anti-Parkinson's
  { genericName: 'Trihexyphenidyl', brandNames: ['Artane'], classNumber: 16, pharmacologicClass: 'Central Tertiary-Amine Antimuscarinic Agent', source: 'review-module' },
  // Class 22: Genitourinary
  { genericName: 'Darifenacin', brandNames: ['Enablex'], classNumber: 22, pharmacologicClass: 'Selective Detrusor M3 Muscarinic Antagonist', source: 'review-module' },
  // Class 24: Hormonal (including decomposed Oral Contraceptive steroids + review peptides/steroids)
  { genericName: 'Ethinyl Estradiol', brandNames: ['Sprintec / Yaz (component)'], classNumber: 24, pharmacologicClass: '17-Alpha-Ethinyl Synthetic Oral Estrogen Agonist', source: 'top-200' },
  { genericName: 'Levonorgestrel', brandNames: ['Plan B', 'Mirena'], classNumber: 24, pharmacologicClass: 'Second-Generation 19-Nortestosterone Progestin', source: 'top-200' },
  { genericName: 'Norethindrone', brandNames: ['Camila', 'Lo Loestrin (component)'], classNumber: 24, pharmacologicClass: 'First-Generation 19-Nortestosterone Progestin', source: 'top-200' },
  { genericName: 'Cortisone', brandNames: ['Cortone'], classNumber: 24, pharmacologicClass: '11-Keto Short-Acting Glucocorticoid Prodrug', source: 'review-module' },
  { genericName: 'Dexamethasone', brandNames: ['Decadron'], classNumber: 24, pharmacologicClass: 'Long-Acting 9-Fluoro-16-Alpha-Methyl Glucocorticoid', source: 'review-module' },
  { genericName: 'Desmopressin', brandNames: ['DDAVP', 'Stimate'], classNumber: 24, pharmacologicClass: 'Selective Vasopressin V2 Receptor Peptide Agonist', source: 'review-module' },
  { genericName: 'Oxytocin', brandNames: ['Pitocin'], classNumber: 24, pharmacologicClass: 'Myometrial Oxytocin Receptor Cyclic Nonapeptide Agonist', source: 'review-module' },
  { genericName: 'Terlipressin', brandNames: ['Terlivaz'], classNumber: 24, pharmacologicClass: 'Triglycyl-Vasopressin V1a Splanchnic Vasoconstrictor Prodrug', source: 'review-module' },
  // Class 34: Dermatological
  { genericName: 'Clobetasol', brandNames: ['Temovate'], classNumber: 34, pharmacologicClass: 'Super-High-Potency Halogenated Topical Corticosteroid', source: 'review-module' },
  // Class 36: Respiratory
  { genericName: 'Vilanterol', brandNames: ['Breo / Anoro (component)'], classNumber: 36, pharmacologicClass: 'Ultra-Long-Acting 24-Hour Beta-2 Agonist (ULABA)', source: 'review-module' },
  { genericName: 'Olodaterol', brandNames: ['Striverdi', 'Stiolto (component)'], classNumber: 36, pharmacologicClass: 'Ultra-Long-Acting 24-Hour Beta-2 Agonist (ULABA)', source: 'review-module' },
  { genericName: 'Indacaterol', brandNames: ['Arcapta'], classNumber: 36, pharmacologicClass: 'Ultra-Long-Acting Hydroxyquinolinone Beta-2 Agonist (ULABA)', source: 'review-module' },
  { genericName: 'Pirbuterol', brandNames: ['Maxair'], classNumber: 36, pharmacologicClass: 'Pyridine-Ring Short-Acting Beta-2 Agonist (SABA)', source: 'review-module' },
  { genericName: 'Isoproterenol', brandNames: ['Isuprel'], classNumber: 36, pharmacologicClass: 'Nonselective Beta-1 / Beta-2 Catecholamine Agonist', source: 'review-module' },
  { genericName: 'Umeclidinium', brandNames: ['Incruse', 'Trelegy (component)'], classNumber: 36, pharmacologicClass: 'Once-Daily Quaternary Muscarinic Antagonist (LAMA)', source: 'review-module' },
  { genericName: 'Aclidinium', brandNames: ['Tudorza'], classNumber: 36, pharmacologicClass: 'Ester-Hydrolyzed Quaternary Muscarinic Antagonist (LAMA)', source: 'review-module' },
  { genericName: 'Glycopyrrolate', brandNames: ['Robinul', 'Seebri'], classNumber: 36, pharmacologicClass: 'Quaternary Ammonium Antimuscarinic Bronchodilator (LAMA)', source: 'review-module' },
  { genericName: 'Mometasone', brandNames: ['Asmanex', 'Nasonex'], classNumber: 36, pharmacologicClass: 'Chlorinated Furoate Inhaled/Intranasal Corticosteroid', source: 'review-module' },
  { genericName: 'Beclomethasone', brandNames: ['Qvar'], classNumber: 36, pharmacologicClass: '9-Alpha-Chloro Dipropionate Inhaled Corticosteroid', source: 'review-module' },
  { genericName: 'Ciclesonide', brandNames: ['Alvesco', 'Omnaris'], classNumber: 36, pharmacologicClass: 'Lung-Esterase-Activated Soft Inhaled Corticosteroid Prodrug', source: 'review-module' },
  { genericName: 'Theophylline', brandNames: ['Theo-24'], classNumber: 36, pharmacologicClass: 'Methylxanthine PDE3/4 Inhibitor & Adenosine Antagonist', source: 'review-module' },
  { genericName: 'Roflumilast', brandNames: ['Daliresp'], classNumber: 36, pharmacologicClass: 'Selective Anti-Inflammatory PDE4 Inhibitor', source: 'review-module' },
  { genericName: 'Ensifentrine', brandNames: ['Ohtuvayre'], classNumber: 36, pharmacologicClass: 'Inhaled Dual PDE3 / PDE4 Bronchodilator-Anti-Inflammatory', source: 'review-module' },
  { genericName: 'Zileuton', brandNames: ['Zyflo'], classNumber: 36, pharmacologicClass: 'N-Hydroxyurea 5-Lipoxygenase (5-LOX) Iron-Chelating Inhibitor', source: 'review-module' },
];

const PRODRUG_NOTES: Record<string, string> = {
  clopidogrel: 'Prodrug: ~85% is inactivated by CES1 esterases; the remaining ~15% requires 2-step hepatic CYP2C19 oxidation to open the thiophene ring into the active reactive thiol (-SH).',
  prasugrel: 'Prodrug: Rapidly hydrolyzed by intestinal esterases and converted in a single CYP3A4/CYP2B6 step to its active thiol metabolite—avoiding CYP2C19 loss-of-function variability.',
  ticlopidine: 'Prodrug: Requires hepatic cytochrome P450 oxidation of its thienopyridine ring to generate the active Cys-reactive thiol.',
  enalapril: 'Ethyl-ester prodrug: Oral enalapril maleate is hydrolyzed by hepatic carboxylesterases into active diacid enalaprilat to chelate ACE Zn2+.',
  ramipril: 'Ethyl-ester prodrug: Bioactivated by hepatic esterases into active diacid ramiprilat.',
  benazepril: 'Ethyl-ester prodrug: Bioactivated by hepatic esterases into active diacid benazeprilat.',
  fosinopril: 'Phosphinate acyloxyalkyl prodrug: Cleaved by GI mucosal and hepatic esterases into active fosinoprilat (balanced dual renal + hepatobiliary elimination).',
  losartan: 'Metabolic activation: ~14% of oral losartan is oxidized at C5-hydroxymethyl by CYP2C9/CYP3A4 into active carboxylate EXP3174, which is 10–40x more potent at AT1R.',
  olmesartan: 'Medoxomil ester prodrug: Rapidly cleaved during GI absorption to release active olmesartan carboxylate.',
  candesartan: 'Cilexetil ester prodrug: Completely bioactivated by intestinal-wall esterolysis during absorption into active candesartan.',
  sacubitril: 'Ethyl-ester prodrug: Rapidly cleaved by carboxylesterases into active carboxylate sacubitrilat (LBQ657), which coordinates neprilysin Zn2+.',
  simvastatin: 'Inactive 6-membered lactone prodrug: Hydrolyzed in vivo to open the active beta,delta-dihydroxy acid HMG-CoA mimic.',
  lovastatin: 'Inactive closed lactone prodrug: Hydrolyzed in vivo into the active open beta-hydroxy acid.',
  dabigatran: 'Double prodrug (dabigatran etexilate): Hexyl carbamate and ethyl ester mask the charged benzamidine and carboxylate for oral absorption before plasma esterase cleavage.',
  omeprazole: 'Acid-activated prodrug: Enters parietal canaliculi as a neutral weak base, protonates at pH ~1, and rearranges into a reactive cyclic sulfenamide.',
  esomeprazole: 'Acid-activated S-enantiomer prodrug: Undergoes canalicular acid-catalyzed conversion to the Cys813-reactive sulfenamide with lower first-pass CYP2C19 clearance.',
  pantoprazole: 'Acid-activated difluoromethoxy prodrug: Converts selectively at canalicular pH ~1 into the active Cys813-reactive sulfenamide.',
  prednisone: '11-keto prodrug: Biologically inactive until hepatic 11-beta-HSD1 reduces the C11 ketone into the essential 11-beta-hydroxyl of prednisolone.',
  cortisone: '11-keto prodrug: Requires hepatic 11-beta-HSD1 reduction at C11 to form active hydrocortisone (cortisol).',
  ciclesonide: 'Lung-activated soft prodrug: Cleaved by bronchial epithelial esterases into active desisobutyryl-ciclesonide locally in the airways.',
  nabumetone: 'Non-acidic ketone prodrug: Spares direct topical gastric irritation and undergoes hepatic CYP1A2 oxidation to active 6-methoxy-2-naphthylacetic acid (6-MNA).',
  oseltamivir: 'Ethyl-ester phosphate prodrug: Hydrolyzed by hepatic carboxylesterase-1 into active oseltamivir carboxylate.',
  valacyclovir: 'L-valyl ester prodrug: Transported via intestinal PEPT1 and cleaved to acyclovir, which herpesviral thymidine kinase phosphorylates to active acyclovir triphosphate.',
  valganciclovir: 'L-valyl ester prodrug: Absorbed via PEPT1 and cleaved to ganciclovir before CMV UL97 kinase phosphorylation.',
  tenofovir: 'Diester/phosphonamidate prodrug (TDF / TAF) + kinase activation: Intracellularly cleaved to tenofovir and phosphorylated twice to active tenofovir diphosphate.',
  sofosbuvir: 'ProTide nucleotide prodrug: Hepatocyte cathepsin A / CES1 / HINT1 unmask the monophosphate, bypassing the rate-limiting kinase step to form active GS-461203 triphosphate.',
  lisdexamfetamine: 'Rate-limited L-lysine prodrug: Enzymatically cleaved inside red blood cells to gradually release active dextroamphetamine.',
  codeine: '3-methoxy opioid prodrug: Requires hepatic CYP2D6 O-demethylation (~10%) into morphine to engage mu-opioid His297 with high affinity.',
  oxcarbazepine: '10-keto prodrug: Rapidly reduced by cytosolic ketoreductases to its active 10-monohydroxy derivative (MHD / eslicarbazepine) without forming epoxide metabolites.',
  levothyroxine: 'Prohormone (T4): Deiodinated in peripheral tissues by 5\'-deiodinases to remove the outer-ring 5\'-iodine and generate 10x higher-affinity T3.',
  terlipressin: 'Triglycyl peptide prodrug: Endothelial peptidases slowly cleave its three N-terminal glycines to release lysine-vasopressin over 4–6 hours.',
  minoxidil: 'Sulfate-conjugate prodrug: Hepatic sulfotransferase converts minoxidil into active minoxidil N-O-sulfate to open vascular KATP channels.',
  methyldopa: 'Amino-acid prodrug: Taken up into central adrenergic neurons and decarboxylated/hydroxylated into alpha-methylnorepinephrine ("false neurotransmitter" at alpha-2A).',
};

function selectPocketTemplateId(id: string, classNumber: number, pharmClass: string): string {
  const byId: Record<string, string> = {
    aspirin: 'cox1_aspirin',
    acetaminophen: 'cox1_aspirin',
    ibuprofen: 'cox2_propionic',
    naproxen: 'cox2_propionic',
    diclofenac: 'cox2_propionic',
    nabumetone: 'cox2_propionic',
    celecoxib: 'cox2_coxib',
    meloxicam: 'cox2_coxib',
    butalbital: 'gabaa_pam',
    caffeine: 'pde3_cyclic_nucleotide',
    lidocaine: 'nav15_pore',
    benzonatate: 'nav15_pore',
    ciprofloxacin: 'gyrase_fq',
    levofloxacin: 'gyrase_fq',
    moxifloxacin: 'gyrase_fq',
    doxycycline: 'ribosome_antibiotic',
    azithromycin: 'ribosome_antibiotic',
    clarithromycin: 'ribosome_antibiotic',
    clindamycin: 'ribosome_antibiotic',
    nitrofurantoin: 'ribosome_antibiotic',
    mupirocin: 'ribosome_antibiotic',
    metronidazole: 'gyrase_fq',
    trimethoprim: 'dhfr_folate',
    sulfamethoxazole: 'dhfr_folate',
    methotrexate: 'dhfr_folate',
    folicacid: 'dhfr_folate',
    albendazole: 'tubulin_colchicine',
    colchicine: 'tubulin_colchicine',
    phenytoin: 'nav15_pore',
    lamotrigine: 'nav15_pore',
    oxcarbazepine: 'nav15_pore',
    topiramate: 'ca2_sulfonamide',
    acetazolamide: 'ca2_sulfonamide',
    valproicacid: 'gabaa_pam',
    gabapentin: 'cav1_ccb',
    pregabalin: 'cav1_ccb',
    levetiracetam: 'gabaa_pam',
    trazodone: 'ht2_serotonin',
    mirtazapine: 'ht2_serotonin',
    buspirone: 'ht2_serotonin',
    cyclobenzaprine: 'ht2_serotonin',
    pioglitazone: 'ppar_nuclear',
    fenofibrate: 'ppar_nuclear',
    gemfibrozil: 'ppar_nuclear',
    omega3acidethylesters: 'ppar_nuclear',
    niacin: 'ppar_nuclear',
    ezetimibe: 'hmgcr_statin',
    lomitapide: 'hmgcr_statin',
    sitagliptin: 'dpp4_gliptin',
    linagliptin: 'dpp4_gliptin',
    canagliflozin: 'sglt2_gliflozin',
    metformin: 'sglt2_gliflozin',
    glipizide: 'slc12_diuretic',
    glimepiride: 'slc12_diuretic',
    diazoxide: 'slc12_diuretic',
    minoxidil: 'slc12_diuretic',
    hydralazine: 'pde5_inhibitor',
    isosorbidemononitrate: 'pde5_inhibitor',
    isosorbidedinitrate: 'pde5_inhibitor',
    nitroglycerin: 'pde5_inhibitor',
    latanoprost: 'cox2_propionic',
    brimonidine: 'alpha2_adrenergic',
    clonidine: 'alpha2_adrenergic',
    guanfacine: 'alpha2_adrenergic',
    methyldopa: 'alpha2_adrenergic',
    tizanidine: 'alpha2_adrenergic',
    doxazosin: 'alpha2_adrenergic',
    terazosin: 'alpha2_adrenergic',
    prazosin: 'alpha2_adrenergic',
    tamsulosin: 'alpha2_adrenergic',
    timolol: 'beta1_adrenergic',
    ondansetron: 'ht3_channel',
    granisetron: 'ht3_channel',
    metoclopramide: 'd2_receptor',
    promethazine: 'h1_histamine',
    meclizine: 'h1_histamine',
    hydroxyzine: 'h1_histamine',
    cetirizine: 'h1_histamine',
    loratadine: 'h1_histamine',
    famotidine: 'h1_histamine',
    betamethasone: 'gr_corticosteroid',
    lisinopril: 'ace_dicarboxylate',
    enalapril: 'ace_dicarboxylate',
    ramipril: 'ace_dicarboxylate',
    benazepril: 'ace_dicarboxylate',
    fosinopril: 'ace_dicarboxylate',
    captopril: 'ace_thiol',
    losartan: 'at1r_sartan',
    olmesartan: 'at1r_sartan',
    irbesartan: 'at1r_sartan',
    valsartan: 'at1r_sartan',
    candesartan: 'at1r_sartan',
    telmisartan: 'at1r_sartan',
    aliskiren: 'renin_aliskiren',
    sacubitril: 'neprilysin_arni',
    milrinone: 'pde3_cyclic_nucleotide',
    cilostazol: 'pde3_cyclic_nucleotide',
    dipyridamole: 'pde3_cyclic_nucleotide',
    theophylline: 'pde3_cyclic_nucleotide',
    roflumilast: 'pde3_cyclic_nucleotide',
    ensifentrine: 'pde3_cyclic_nucleotide',
    spironolactone: 'mr_steroid',
    eplerenone: 'mr_steroid',
    amlodipine: 'cav1_ccb',
    nifedipine: 'cav1_ccb',
    verapamil: 'cav1_ccb',
    diltiazem: 'cav1_ccb',
    clevidipine: 'cav1_ccb',
    isradipine: 'cav1_ccb',
    reserpine: 'sert_monoamine',
    ivabradine: 'herg_kv11',
    tolvaptan: 'v2r_vasopressin',
    apixaban: 'fxa_doac',
    rivaroxaban: 'fxa_rivaroxaban',
    warfarin: 'vkorc1_warfarin',
    dabigatran: 'thrombin_dti',
    argatroban: 'thrombin_dti',
    fondaparinux: 'at3_pentasaccharide',
    enoxaparin: 'at3_pentasaccharide',
    heparin: 'at3_pentasaccharide',
    clopidogrel: 'p2y12_thienopyridine',
    prasugrel: 'p2y12_thienopyridine',
    ticagrelor: 'p2y12_thienopyridine',
    ticlopidine: 'p2y12_thienopyridine',
    cangrelor: 'p2y12_nucleotide',
    tirofiban: 'gpiibiiia_tirofiban',
    eptifibatide: 'gpiibiiia_eptifibatide',
    vorapaxar: 'par1_vorapaxar',
    amiodarone: 'herg_kv11',
    dronedarone: 'herg_kv11',
    sotalol: 'herg_kv11',
    digoxin: 'nak_atpase_digoxin',
    ranolazine: 'nav15_pore',
    benztropine: 'muscarinic_antagonist',
    trihexyphenidyl: 'muscarinic_antagonist',
    pramipexole: 'd2_receptor',
    ropinirole: 'd2_receptor',
    levodopa: 'd2_receptor',
    carbidopa: 'd2_receptor',
    raltegravir: 'hiv_integrase',
    oseltamivir: 'neuraminidase_flu',
    omeprazole: 'hk_atpase_ppi',
    esomeprazole: 'hk_atpase_ppi',
    pantoprazole: 'hk_atpase_ppi',
    lubiprostone: 'hk_atpase_ppi',
    dicyclomine: 'muscarinic_antagonist',
    atropine: 'muscarinic_antagonist',
    diphenoxylate: 'mu_opioid',
    sildenafil: 'pde5_inhibitor',
    tadalafil: 'pde5_inhibitor',
    oxybutynin: 'muscarinic_antagonist',
    solifenacin: 'muscarinic_antagonist',
    darifenacin: 'muscarinic_antagonist',
    finasteride: 'ar_androgen',
    dutasteride: 'ar_androgen',
    estradiol: 'er_estrogen',
    ethinylestradiol: 'er_estrogen',
    conjugatedestrogens: 'er_estrogen',
    raloxifene: 'er_estrogen',
    progesterone: 'pr_progestin',
    medroxyprogesterone: 'pr_progestin',
    levonorgestrel: 'pr_progestin',
    norethindrone: 'pr_progestin',
    testosterone: 'ar_androgen',
    cortisone: 'gr_corticosteroid',
    dexamethasone: 'gr_corticosteroid',
    oxytocin: 'otr_oxytocin',
    desmopressin: 'v2r_vasopressin',
    terlipressin: 'v2r_vasopressin',
    cyclosporine: 'cyclophilin_cyclosporine',
    donepezil: 'ache_donepezil',
    memantine: 'ache_donepezil',
    hydroxychloroquine: 'cyp51_azole',
    cinacalcet: 'vdr_casr',
    cyanocobalamin: 'vdr_casr',
    varenicline: 'nachr_varenicline',
    isotretinoin: 'rar_retinoid',
    adapalene: 'rar_retinoid',
    allopurinol: 'xo_urate',
    febuxostat: 'xo_urate',
    montelukast: 'cox2_coxib',
    zileuton: 'cox2_coxib',
    baclofen: 'gabaa_pam',
    methocarbamol: 'gabaa_pam',
  };
  if (byId[id]) return byId[id];

  const lowerClass = pharmClass.toLowerCase();
  if (classNumber === 1) return 'mu_opioid';
  if (classNumber === 2) return 'pbp3_betalactam';
  if (classNumber === 4 || classNumber === 38) return 'sert_monoamine';
  if (classNumber === 6) return 'glp1r_peptide';
  if (classNumber === 9) return 'cyp51_azole';
  if (classNumber === 10) return 'hmgcr_statin';
  if (classNumber === 11) {
    if (lowerClass.includes('beta') || id === 'dobutamine') return 'beta1_adrenergic';
    return 'slc12_diuretic';
  }
  if (classNumber === 14) return 'nav15_pore';
  if (classNumber === 17) return 'd2_receptor';
  if (classNumber === 18 || classNumber === 19) return 'hiv_rt_polymerase';
  if (classNumber === 20 || classNumber === 32) return 'gabaa_pam';
  if (classNumber === 25 || classNumber === 34) return 'gr_corticosteroid';
  if (classNumber === 30) return 'fpps_bisphosphonate';
  if (classNumber === 33) return 'ht1b_triptan';
  if (classNumber === 36) {
    if (lowerClass.includes('muscarinic') || lowerClass.includes('anticholinergic') || lowerClass.includes('lama') || lowerClass.includes('sama')) {
      return 'muscarinic_antagonist';
    }
    if (lowerClass.includes('corticosteroid') || lowerClass.includes('ics')) {
      return 'gr_corticosteroid';
    }
    return 'beta2_adrenergic';
  }
  if (classNumber === 39) return 'trb_thyroid';
  return 'cox1_aspirin';
}

function buildCatalog(): Drug3DCatalogEntry[] {
  const categoryNameByNum = new Map<number, string>(
    THERAPEUTIC_CATEGORIES.map((c) => [c.classNumber, c.categoryName])
  );
  const seedsByClassAndSlug = new Map<string, SeedDrugSpec>();

  const upsertSeed = (seed: SeedDrugSpec) => {
    const slug = normalizeForTaxonomyMatch(seed.genericName);
    if (!slug) return;
    const key = `${seed.classNumber}:${slug}`;
    const existing = seedsByClassAndSlug.get(key);
    if (existing) {
      const mergedBrands = Array.from(new Set([...existing.brandNames, ...seed.brandNames]));
      seedsByClassAndSlug.set(key, {
        ...existing,
        brandNames: mergedBrands,
        source: existing.source !== seed.source ? 'both' : existing.source,
      });
    } else {
      seedsByClassAndSlug.set(key, { ...seed, brandNames: [...seed.brandNames] });
    }
  };

  for (const row of TOP_DRUGS_TAXONOMY) {
    if (EXCLUDED_TOP200_NAMES.has(row.genericName)) continue;

    if (SPLIT_COMBINATION_SEEDS[row.genericName]) {
      for (const componentSeed of SPLIT_COMBINATION_SEEDS[row.genericName]) {
        upsertSeed(componentSeed);
      }
      continue;
    }

    const cleanName = ROUTE_AND_SALT_RENAME[row.genericName] ?? row.genericName;
    upsertSeed({
      genericName: cleanName,
      brandNames: row.brandNames,
      classNumber: row.therapeuticClassNumber,
      pharmacologicClass: row.specificPharmacologicClass,
      source: 'top-200',
    });
  }

  for (const revSeed of SUPPLEMENTAL_REVIEW_DRUGS) {
    upsertSeed(revSeed);
  }

  const usedIds = new Set<string>();
  const entries: Drug3DCatalogEntry[] = [];

  for (const seed of seedsByClassAndSlug.values()) {
    const baseSlug = normalizeForTaxonomyMatch(seed.genericName);
    const id = usedIds.has(baseSlug) ? `${baseSlug}-c${seed.classNumber}` : baseSlug;
    usedIds.add(id);

    const templateId = selectPocketTemplateId(baseSlug, seed.classNumber, seed.pharmacologicClass);
    const template = RECEPTOR_POCKET_TEMPLATES[templateId];
    const monograph = resolveTopDrugClinicalMonograph(seed.genericName);
    const isExactDrugCrystal = template.exactDrugIds.includes(baseSlug);

    const clinicalLead = monograph.mechanismOfAction?.trim() || '';
    const overallMechanism = clinicalLead.length > 30
      ? `${clinicalLead} In the 3D receptor pocket, ${seed.genericName.toLowerCase()} ${template.pocketMechanismSummary.charAt(0).toLowerCase()}${template.pocketMechanismSummary.slice(1)}`
      : `${seed.genericName} (${seed.pharmacologicClass}): ${template.pocketMechanismSummary}`;

    entries.push({
      id,
      genericName: seed.genericName,
      brandNames: seed.brandNames,
      therapeuticClassNumber: seed.classNumber,
      therapeuticCategory: categoryNameByNum.get(seed.classNumber) ?? `${seed.classNumber}. Therapeutic Agent`,
      pharmacologicClass: seed.pharmacologicClass,
      source: seed.source,
      pdbId: template.pdbId,
      ligandCode: template.ligandCode,
      ligandChain: template.ligandChain,
      ligandMode: template.ligandMode ?? 'het',
      isExactDrugCrystal,
      crystallizedLigandName: template.crystallizedLigandName,
      targetName: template.targetName,
      geneSymbol: template.geneSymbol,
      overallMechanism,
      prodrugNote: PRODRUG_NOTES[baseSlug],
      bindingSites: template.bindingSites,
    });
  }

  return entries.sort((a, b) =>
    a.therapeuticClassNumber !== b.therapeuticClassNumber
      ? a.therapeuticClassNumber - b.therapeuticClassNumber
      : a.genericName.localeCompare(b.genericName)
  );
}

export const DRUG_3D_CATALOG: Drug3DCatalogEntry[] = buildCatalog();

export const THERAPEUTIC_CLASS_3D_GROUPS: TherapeuticClass3DGroup[] = THERAPEUTIC_CATEGORIES.map(
  (cat) => ({
    classNumber: cat.classNumber,
    categoryName: cat.categoryName,
    drugs: DRUG_3D_CATALOG.filter((d) => d.therapeuticClassNumber === cat.classNumber),
  })
);

const BY_ID = new Map<string, Drug3DCatalogEntry>();
const BY_NORMALIZED_GENERIC = new Map<string, Drug3DCatalogEntry>();
const BY_NORMALIZED_BRAND = new Map<string, Drug3DCatalogEntry>();

for (const entry of DRUG_3D_CATALOG) {
  BY_ID.set(entry.id.toLowerCase(), entry);
  const normGen = normalizeForTaxonomyMatch(entry.genericName);
  if (normGen && !BY_NORMALIZED_GENERIC.has(normGen)) {
    BY_NORMALIZED_GENERIC.set(normGen, entry);
  }
  for (const brand of entry.brandNames) {
    const cleanBrand = normalizeForTaxonomyMatch(brand);
    if (cleanBrand && !BY_NORMALIZED_BRAND.has(cleanBrand)) {
      BY_NORMALIZED_BRAND.set(cleanBrand, entry);
    }
  }
}

const METABOLITE_AND_ESTER_ALIASES: Record<string, string> = {
  exp3174: 'losartan',
  losartanactiveexp3174: 'losartan',
  enalaprilat: 'enalapril',
  ramiprilat: 'ramipril',
  benazeprilat: 'benazepril',
  fosinoprilat: 'fosinopril',
  sacubitrilat: 'sacubitril',
  lbq657: 'sacubitril',
  dabigatranetexilate: 'dabigatran',
  candesartancilexetil: 'candesartan',
  olmesartanmedoxomil: 'olmesartan',
  oseltamivircarboxylate: 'oseltamivir',
  divalproex: 'valproicacid',
  dextroamphetamine: 'amphetamine',
  fluticasonefuroate: 'fluticasone',
  mometasonefuroate: 'mometasone',
  beclomethasonedipropionate: 'beclomethasone',
  clobetasolpropionate: 'clobetasol',
  umeclidiniumbromide: 'umeclidinium',
  aclidiniumbromide: 'aclidinium',
  ipratropiumbromide: 'ipratropium',
  tiotropiumbromide: 'tiotropium',
  ddavp: 'desmopressin',
};

const ESTER_PRODRUG_SUFFIX_REGEX =
  /\b(etexilate|cilexetil|medoxomil|furoate|alafenamide|disoproxil|axetil|proxetil|pivoxil)\b/gi;

export function getDrug3DById(id: string): Drug3DCatalogEntry | undefined {
  if (!id) return undefined;
  return BY_ID.get(id.trim().toLowerCase());
}

export function resolveDrug3DEntry(
  drugNameOrQuery?: string,
  pdbIdHint?: string
): Drug3DCatalogEntry | undefined {
  if (drugNameOrQuery && drugNameOrQuery.trim()) {
    const raw = drugNameOrQuery.trim();
    const byId = getDrug3DById(raw);
    if (byId) return byId;

    const norm = normalizeForTaxonomyMatch(raw);
    if (norm) {
      if (BY_NORMALIZED_GENERIC.has(norm)) return BY_NORMALIZED_GENERIC.get(norm);
      if (METABOLITE_AND_ESTER_ALIASES[norm]) {
        const target = BY_NORMALIZED_GENERIC.get(METABOLITE_AND_ESTER_ALIASES[norm]);
        if (target) return target;
      }
      if (BY_NORMALIZED_BRAND.has(norm)) return BY_NORMALIZED_BRAND.get(norm);
    }

    const esterStripped = normalizeForTaxonomyMatch(raw.replace(ESTER_PRODRUG_SUFFIX_REGEX, ' '));
    if (esterStripped && BY_NORMALIZED_GENERIC.has(esterStripped)) {
      return BY_NORMALIZED_GENERIC.get(esterStripped);
    }

    // Multi-ingredient combination string (e.g., "Trimethoprim / Sulfamethoxazole" or "Dipyridamole and Aspirin")
    const parts = raw.split(/\s*(?:\/|\band\b|,|\+)\s*/i).filter(Boolean);
    if (parts.length > 1) {
      for (const part of parts) {
        const resolvedPart = resolveDrug3DEntry(part);
        if (resolvedPart) return resolvedPart;
      }
    }

    // Token prefix/substring match on known generic names (>= 5 chars to avoid noise)
    if (norm.length >= 5) {
      for (const [genNorm, entry] of BY_NORMALIZED_GENERIC.entries()) {
        if (genNorm.length >= 5 && (norm.includes(genNorm) || genNorm.includes(norm))) {
          return entry;
        }
      }
    }
  }

  if (pdbIdHint && pdbIdHint.trim()) {
    const upperPdb = pdbIdHint.trim().toUpperCase();
    const actualPdb = upperPdb === '4Z9O' ? '4ZUD' : upperPdb;
    const exactMatch = DRUG_3D_CATALOG.find(
      (d) => d.pdbId.toUpperCase() === actualPdb && d.isExactDrugCrystal
    );
    if (exactMatch) return exactMatch;
    return DRUG_3D_CATALOG.find((d) => d.pdbId.toUpperCase() === actualPdb);
  }

  return undefined;
}
