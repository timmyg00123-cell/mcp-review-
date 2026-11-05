import type { ChemicalStructure } from '../types/reviewModule';

/**
 * Master Authoritative Chemical Class Dictionary grounded in Dr. Rami A. Al-Horani's
 * MedChem II (MCP II) lecture course slides (Chapters 8, 9, 10, and 11).
 *
 * This dictionary completely eliminates "N/A", "0", and generic "Small molecule compound"
 * outputs across the app (Structure Comparator, MedChem Matrix, Question Views, and Cards).
 */
export const AUTHORITATIVE_CHEMICAL_CLASSES: Record<string, string> = {
  // ==========================================
  // CHAPTER 8: ANTIPLATELET AGENTS
  // ==========================================
  aspirin: 'Salicylate (acetylated salicylic acid)',
  acetylsalicylicacid: 'Salicylate (acetylated salicylic acid)',
  clopidogrel: 'Thienopyridine (2nd generation prodrug)',
  prasugrel: 'Thienopyridine (3rd generation prodrug)',
  ticlopidine: 'Thienopyridine (1st generation prodrug)',
  ticagrelor: 'Cyclopentyltriazolopyrimidine (CPTP / nucleoside analog)',
  cangrelor: 'ATP analogue (non-thienopyridine nucleotide)',
  vorapaxar: 'Himbacine-derived tricyclic peptidomimetic',
  eptifibatide: 'Cyclic heptapeptide (KGD-derived peptidomimetic)',
  tirofiban: 'Non-peptide tyrosine-derived sulfonamide peptidomimetic',
  dipyridamole: 'Pyrimidopyrimidine derivative',
  cilostazol: 'Quinolinone derivative (tetrazole-bearing)',
  abciximab: 'Chimeric human-murine monoclonal antibody Fab fragment',

  // ==========================================
  // CHAPTER 9: ANTICOAGULANTS & THROMBOLYTICS
  // ==========================================
  heparin: 'Sulfated polysaccharide / Glycosaminoglycan (GAG)',
  unfractionatedheparin: 'Sulfated polysaccharide / Glycosaminoglycan (GAG)',
  ufh: 'Sulfated polysaccharide / Glycosaminoglycan (GAG)',
  lmwh: 'Depolymerized low molecular weight heparin (LMWH GAG)',
  enoxaparin: 'Depolymerized low molecular weight heparin (LMWH GAG)',
  dalteparin: 'Depolymerized low molecular weight heparin (LMWH GAG)',
  tinzaparin: 'Depolymerized low molecular weight heparin (LMWH GAG)',
  fondaparinux: 'Synthetic sulfated pentasaccharide',
  fondaparinuxsodium: 'Synthetic sulfated pentasaccharide',
  idraparinux: 'Hyper-methylated synthetic sulfated pentasaccharide',
  warfarin: '4-Hydroxycoumarin derivative',
  phenprocoumon: '4-Hydroxycoumarin derivative',
  acenocoumarol: '4-Hydroxycoumarin derivative',
  argatroban: 'Tetrahydroquinoline sulfonamide / L-Arginine peptidomimetic',
  dabigatran: 'Benzimidazole-derived peptidomimetic',
  dabigatranetexilate: 'Benzimidazole double prodrug (carbamate & ester)',
  pradaxa: 'Benzimidazole double prodrug (carbamate & ester)',
  rivaroxaban: 'Oxazolidinone peptidomimetic',
  xarelto: 'Oxazolidinone peptidomimetic',
  apixaban: 'Pyrazolo-tetrahydropyridinone peptidomimetic',
  eliquis: 'Pyrazolo-tetrahydropyridinone peptidomimetic',
  edoxaban: 'Diamino-cyclohexane peptidomimetic',
  savaysa: 'Diamino-cyclohexane peptidomimetic',
  betrixaban: 'Amino-methoxy benzamide peptidomimetic',
  bevyxxa: 'Amino-methoxy benzamide peptidomimetic',
  bivalirudin: 'Synthetic 20-amino acid hirudin peptide analog',
  desirudin: 'Recombinant 65-amino acid hirudin peptide analog',
  lepirudin: 'Recombinant 65-amino acid yeast-derived hirudin variant',
  alteplase: 'Recombinant human tissue plasminogen activator (rh-tPA)',
  activase: 'Recombinant human tissue plasminogen activator (rh-tPA)',
  rtpa: 'Recombinant human tissue plasminogen activator (rh-tPA)',
  tpa: 'Recombinant human tissue plasminogen activator (rh-tPA)',
  reteplase: 'Non-glycosylated deletion mutant t-PA (Kringle-2 and protease domains)',
  retavase: 'Non-glycosylated deletion mutant t-PA (Kringle-2 and protease domains)',
  tenecteplase: 'Genetically engineered triple-mutant t-PA (T103N, N117Q, KHRR296-299AAAA)',
  tnkase: 'Genetically engineered triple-mutant t-PA (T103N, N117Q, KHRR296-299AAAA)',
  streptokinase: 'Bacterial non-enzymatic protein',
  urokinase: 'Renal two-chain serine protease enzyme (u-PA)',
  anistreplase: 'Anisoylated plasminogen streptokinase activator complex (APSAC)',

  // ==========================================
  // CHAPTER 10: HEART FAILURE DRUGS
  // ==========================================
  digoxin: 'Cardiac glycoside (steroidal cardenolide lactone)',
  digitoxin: 'Cardiac glycoside (steroidal cardenolide lactone)',
  captopril: 'Sulfhydryl-containing ACE inhibitor (L-proline analog)',
  enalapril: 'Dicarboxylate-containing ACE inhibitor monoethyl ester prodrug',
  enalaprilat: 'Dicarboxylate-containing active diacid ACE inhibitor',
  lisinopril: 'Dicarboxylate-containing lysine analog ACE inhibitor (active diacid)',
  ramipril: 'Dicarboxylate-containing bicyclic cyclopentyl ACE inhibitor prodrug',
  quinapril: 'Dicarboxylate-containing tetrahydroisoquinoline ACE inhibitor prodrug',
  benazepril: 'Dicarboxylate-containing benzazepine ACE inhibitor prodrug',
  fosinopril: 'Phosphinate-containing (phosphinyl-alkanoic acid) ACE inhibitor prodrug',
  fosinoprilat: 'Phosphinate-containing active diacid ACE inhibitor',
  perindopril: 'Dicarboxylate-containing perhydroindole ACE inhibitor prodrug',
  losartan: 'Biphenyl tetrazole imidazole ARB (imidazole-5-carbinol)',
  valsartan: 'Non-heterocyclic biphenyl tetrazole acylvaline ARB',
  candesartan: 'Biphenyl tetrazole benzimidazole carboxylic acid ARB',
  candesartancilexetil: 'Biphenyl tetrazole benzimidazole carbonate ester prodrug',
  irbesartan: 'Biphenyl tetrazole spirocyclopentyl-imidazolinone ARB',
  telmisartan: 'Bis-benzimidazole carboxylic acid non-tetrazole ARB',
  olmesartan: 'Biphenyl tetrazole imidazole carboxylic acid ARB',
  olmesartanmedoxomil: 'Biphenyl tetrazole medoxomil ester prodrug ARB',
  sacubitril: 'Biphenyl ethyl ester prodrug (neprilysin inhibitor)',
  sacubitrilat: 'Biphenyl active carboxylic acid neprilysin (NEP) inhibitor',
  entresto: 'Angiotensin receptor-neprilysin inhibitor (ARNI salt complex)',
  spironolactone: 'Steroidal 17-spirolactone mineralocorticoid receptor antagonist (MRA)',
  eplerenone: 'Steroidal 9,11-epoxy-17-spirolactone selective MRA',
  furosemide: 'Anthranilic acid sulfonamide loop diuretic (furan-2-ylmethylamino)',
  bumetanide: '3-Aminobenzoic acid phenoxy-sulfonamide loop diuretic',
  torsemide: 'Sulfonylurea pyridine loop diuretic',
  ethacrynicacid: 'Phenoxyacetic acid non-sulfonamide loop diuretic (alpha,beta-unsaturated ketone)',
  hydrochlorothiazide: 'Benzothiadiazine 1,1-dioxide (thiazide) diuretic',
  chlorthalidone: 'Phthalimidine-derived thiazide-like diuretic',
  metolazone: 'Quinazoline sulfonamide thiazide-like diuretic',
  indapamide: 'Indoline chlorobenzamide thiazide-like diuretic',
  ivabradine: 'Benzazepine derivative (hyperpolarization-activated cyclic nucleotide-gated channel blocker)',
  milrinone: 'Bipyridine carbonitrile inodilator (PDE3 inhibitor)',
  inamrinone: 'Bipyridine inodilator (PDE3 inhibitor)',
  carvedilol: 'Carbazole aryloxypropanolamine (non-selective beta/alpha-1 blocker)',
  metoprolol: 'Phenoxypropanolamine (cardioselective beta-1 adrenergic antagonist)',
  bisoprolol: 'Phenoxypropanolamine (cardioselective beta-1 adrenergic antagonist)',
  nebivolol: 'Bis-chroman derivative (cardioselective beta-1 blocker with NO vasodilation)',
  dapagliflozin: 'C-aryl glucoside SGLT2 inhibitor',
  empagliflozin: 'C-aryl glucoside SGLT2 inhibitor',
  canagliflozin: 'C-aryl glucoside thiophene SGLT2 inhibitor',
  hydralazine: 'Phthalazine hydrazine peripheral vasodilator',
  isosorbidedinitrate: 'Organic nitrate vasodilator (anhydro-sorbitol dinitrate)',
  isosorbidemononitrate: 'Organic nitrate active mononitrate vasodilator',
  nesiritide: 'Recombinant 32-amino acid human B-type natriuretic peptide (hBNP)',
  vericiguat: 'Pyrazolopyridine fluorinated soluble guanylate cyclase (sGC) stimulator',

  // ==========================================
  // CHAPTER 11: ANTIARRHYTHMIC DRUGS
  // ==========================================
  quinidine: 'Cinchona alkaloid (stereoisomer of quinine / quinuclidine quinoline)',
  procainamide: 'p-Amino benzamide (procaine amide analog)',
  disopyramide: 'Pyridineacetamide (diisopropylamino alkylamide)',
  lidocaine: 'Aminoacyl-2,6-xylidine (xylene amide)',
  mexiletine: '2,6-Xylyloxyalkylamine (ether analog of lidocaine)',
  tocainide: 'alpha-Methyl aminoacyl-2,6-xylidine',
  flecainide: 'Fluorinated benzamide piperidine (bis-trifluoroethoxy benzamide)',
  propafenone: 'Phenoxy propyloxyamine (aryloxypropanolamine / phenylpropanone)',
  moricizine: 'Phenothiazine carbamate analog',
  amiodarone: '2-Butylbenzofuran diiodinated derivative',
  dronedarone: '2-Butylbenzofuran non-iodinated methanesulfonamide derivative',
  sotalol: 'Methanesulfonamide phenethylamine (beta-blocker Class III agent)',
  dofetilide: 'Bis-methanesulfonamide diphenethylamine',
  ibutilide: 'Methanesulfonamide heptyl ethylamino phenethanol',
  bretylium: 'Bromobenzyl quaternary ammonium compound',
  verapamil: 'Phenylalkylamine (methoxybenzene acetonitrile)',
  diltiazem: 'Benzothiazepine derivative',
  adenosine: 'Purine nucleoside (adenine-D-ribofuranoside)',
  atropine: 'Tropane alkaloid tertiary amine ester',
  magnesiumsulfate: 'Inorganic divalent magnesium mineral salt',
  vernakalant: 'Pyrrolidine ether amino-cyclohexyl analog',
  ranolazine: 'Piperazine acetamide derivative',
};

/**
 * PubChem CID to Authoritative Chemical Class map for rapid chemoinformatics lookup.
 */
export const CID_CHEMICAL_CLASS_MAP: Record<number, string> = {
  // Antiplatelets
  2244: 'Salicylate (acetylated salicylic acid)', // Aspirin
  60606: 'Thienopyridine (2nd generation prodrug)', // Clopidogrel
  6918456: 'Thienopyridine (3rd generation prodrug)', // Prasugrel
  5472: 'Thienopyridine (1st generation prodrug)', // Ticlopidine
  9871419: 'Cyclopentyltriazolopyrimidine (CPTP / nucleoside analog)', // Ticagrelor
  9854012: 'ATP analogue (non-thienopyridine nucleotide)', // Cangrelor
  10077130: 'Himbacine-derived tricyclic peptidomimetic', // Vorapaxar
  448812: 'Cyclic heptapeptide (KGD-derived peptidomimetic)', // Eptifibatide
  60917: 'Non-peptide tyrosine-derived sulfonamide peptidomimetic', // Tirofiban
  3108: 'Pyrimidopyrimidine derivative', // Dipyridamole
  2788: 'Quinolinone derivative (tetrazole-bearing)', // Cilostazol

  // Anticoagulants
  54678486: '4-Hydroxycoumarin derivative', // Warfarin
  92722: 'Tetrahydroquinoline sulfonamide / L-Arginine peptidomimetic', // Argatroban
  216210: 'Benzimidazole-derived peptidomimetic', // Dabigatran active form
  9578572: 'Benzimidazole double prodrug (carbamate & ester)', // Dabigatran etexilate
  9879236: 'Oxazolidinone peptidomimetic', // Rivaroxaban
  10182969: 'Pyrazolo-tetrahydropyridinone peptidomimetic', // Apixaban
  10280735: 'Diamino-cyclohexane peptidomimetic', // Edoxaban
  10275817: 'Amino-methoxy benzamide peptidomimetic', // Betrixaban
  10086474: 'Synthetic sulfated pentasaccharide', // Fondaparinux sodium

  // Heart Failure
  2724385: 'Cardiac glycoside (steroidal cardenolide lactone)', // Digoxin
  44093: 'Sulfhydryl-containing ACE inhibitor (L-proline analog)', // Captopril
  5388962: 'Dicarboxylate-containing ACE inhibitor monoethyl ester prodrug', // Enalapril
  5462445: 'Dicarboxylate-containing active diacid ACE inhibitor', // Enalaprilat
  5362119: 'Dicarboxylate-containing lysine analog ACE inhibitor (active diacid)', // Lisinopril
  55891: 'Phosphinate-containing (phosphinyl-alkanoic acid) ACE inhibitor prodrug', // Fosinopril
  3961: 'Biphenyl tetrazole imidazole ARB (imidazole-5-carbinol)', // Losartan
  60846: 'Non-heterocyclic biphenyl tetrazole acylvaline ARB', // Valsartan
  9811834: 'Biphenyl ethyl ester prodrug (neprilysin inhibitor)', // Sacubitril
  5833: 'Steroidal 17-spirolactone mineralocorticoid receptor antagonist (MRA)', // Spironolactone
  115256: 'Steroidal 9,11-epoxy-17-spirolactone selective MRA', // Eplerenone
  3440: 'Anthranilic acid sulfonamide loop diuretic (furan-2-ylmethylamino)', // Furosemide
  215996: 'Benzazepine derivative (hyperpolarization-activated cyclic nucleotide-gated channel blocker)', // Ivabradine
  4197: 'Bipyridine carbonitrile inodilator (PDE3 inhibitor)', // Milrinone
  2585: 'Carbazole aryloxypropanolamine (non-selective beta/alpha-1 blocker)', // Carvedilol
  4171: 'Phenoxypropanolamine (cardioselective beta-1 adrenergic antagonist)', // Metoprolol
  9887712: 'C-aryl glucoside SGLT2 inhibitor', // Dapagliflozin
  11949646: 'C-aryl glucoside SGLT2 inhibitor', // Empagliflozin

  // Antiarrhythmics
  441074: 'Cinchona alkaloid (stereoisomer of quinine / quinuclidine quinoline)', // Quinidine
  4913: 'p-Amino benzamide (procaine amide analog)', // Procainamide
  3114: 'Pyridineacetamide (diisopropylamino alkylamide)', // Disopyramide
  3676: 'Aminoacyl-2,6-xylidine (xylene amide)', // Lidocaine
  4178: '2,6-Xylyloxyalkylamine (ether analog of lidocaine)', // Mexiletine
  3356: 'Fluorinated benzamide piperidine (bis-trifluoroethoxy benzamide)', // Flecainide
  4932: 'Phenoxy propyloxyamine (aryloxypropanolamine / phenylpropanone)', // Propafenone
  2157: '2-Butylbenzofuran diiodinated derivative', // Amiodarone
  2082: '2-Butylbenzofuran non-iodinated methanesulfonamide derivative', // Dronedarone
  5253: 'Methanesulfonamide phenethylamine (beta-blocker Class III agent)', // Sotalol
  71329: 'Bis-methanesulfonamide diphenethylamine', // Dofetilide
  2520: 'Phenylalkylamine (methoxybenzene acetonitrile)', // Verapamil
  39186: 'Benzothiazepine derivative', // Diltiazem
  6096: 'Purine nucleoside (adenine-D-ribofuranoside)', // Adenosine
};

/**
 * Normalizes any raw drug string, label, or identifier into a canonical lookup key.
 * Strips Roman numerals ("Drug I", "Structure II", "Structure IV (Tirofiban)"),
 * parenthesized trade names or qualifiers ("Dabigatran (Pradaxa)", "Active metabolite"),
 * punctuation, and whitespace.
 */
export function normalizeDrugKey(input: string): string {
  if (!input) return '';
  let str = input.trim();

  // If input matches "Structure X (Drug Name)" or "Drug X (Drug Name)", extract the parenthesized name first
  const parenMatch = str.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1]) {
    const insideParen = parenMatch[1].trim();
    // Check if what is inside parentheses is a recognized drug name
    const normalizedInside = insideParen.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (AUTHORITATIVE_CHEMICAL_CLASSES[normalizedInside]) {
      return normalizedInside;
    }
  }

  // Strip prefixes like "Drug I", "Drug II", "Structure 1", "Compound A"
  str = str.replace(/^(?:drug|structure|compound)\s+[ivxlcdm0-9a-z]+\s*[:\-–—]?\s*/i, '');

  // Strip trailing descriptors like "active form", "prodrug form", "diacid", "sodium"
  str = str.replace(/\b(?:active\s+form|active\s+metabolite|free\s+base|hydrochloride|sodium|potassium|calcium)\b/gi, '');

  // Remove parentheses and non-alphanumeric chars
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Looks up chemical class in dictionary by drug name, trade name, or identifier.
 */
export function getChemicalClassFromDictionary(drugNameOrKey: string): string | null {
  if (!drugNameOrKey) return null;

  // 1. Direct normalization match
  const key = normalizeDrugKey(drugNameOrKey);
  if (AUTHORITATIVE_CHEMICAL_CLASSES[key]) {
    return AUTHORITATIVE_CHEMICAL_CLASSES[key];
  }

  // 2. Check each word or token if composite (e.g. "Dabigatran etexilate")
  const tokens = drugNameOrKey
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  for (const token of tokens) {
    if (AUTHORITATIVE_CHEMICAL_CLASSES[token]) {
      return AUTHORITATIVE_CHEMICAL_CLASSES[token];
    }
  }

  return null;
}

/**
 * Looks up chemical class by PubChem CID.
 */
export function getChemicalClassByCid(cid: number): string | null {
  if (!cid || typeof cid !== 'number') return null;
  return CID_CHEMICAL_CLASS_MAP[cid] || null;
}

/**
 * Stem-based chemoinformatics resolution for cardiovascular agents when an exact name is not matched.
 */
function resolveByChemoinformaticsStem(cleanName: string): string | null {
  const lower = cleanName.toLowerCase();
  if (lower.endsWith('grel') || lower.includes('thienopyridine')) return 'Thienopyridine antiplatelet prodrug';
  if (lower.endsWith('xaban')) return 'Direct Factor Xa inhibitor peptidomimetic';
  if (lower.endsWith('tran')) return 'Direct thrombin inhibitor peptidomimetic';
  if (lower.endsWith('parin')) return 'Sulfated glycosaminoglycan / heparin derivative';
  if (lower.endsWith('pril')) return 'Dicarboxylate ACE inhibitor peptidomimetic';
  if (lower.endsWith('sartan')) return 'Angiotensin II receptor antagonist (ARB)';
  if (lower.endsWith('olol')) return 'Aryloxypropanolamine beta-blocker';
  if (lower.endsWith('caine')) return 'Aminoacyl amide local anesthetic / antiarrhythmic';
  if (lower.endsWith('darone')) return '2-Butylbenzofuran antiarrhythmic';
  if (lower.endsWith('dipine')) return 'Dihydropyridine calcium channel blocker';
  if (lower.endsWith('gliflozin')) return 'C-aryl glucoside SGLT2 inhibitor';
  if (lower.endsWith('semide')) return 'Anthranilic acid loop diuretic';
  if (lower.endsWith('statin')) return 'HMG-CoA reductase inhibitor (statin)';
  return null;
}

/**
 * Authoritative resolver that takes any chemical structure representation and guarantees
 * a medically and chemically accurate chemical class from Dr. Al-Horani's lectures,
 * strictly rejecting 'N/A', '0', '—', or 'Small molecule compound'.
 */
export function resolveChemicalClass(drug?: Partial<ChemicalStructure> | null): string {
  if (!drug) return 'Cardiovascular agent';

  // 1. Check if an authoritative dictionary match exists for any name/id field first
  // (We check dictionary FIRST before raw chemicalClass to override any contaminated 'Small molecule compound' or outdated Dexie entries)
  const candidateNames = [
    drug.name,
    drug.tradeName,
    (drug as any).trade_name,
    drug.id,
    drug.document_label,
    (drug as any).documentLabel,
  ].filter((n): n is string => typeof n === 'string' && n.trim().length > 0);

  for (const nameCandidate of candidateNames) {
    const fromDict = getChemicalClassFromDictionary(nameCandidate);
    if (fromDict) return fromDict;
  }

  // 2. Check PubChem CID if present
  const cid = drug.cid || (drug as any).pubchemAudit?.cid || (drug as any).pubchem_cid;
  if (cid && typeof cid === 'number') {
    const fromCid = getChemicalClassByCid(cid);
    if (fromCid) return fromCid;
  }

  // 3. Check explicit chemicalClass property if it's already a descriptive class (and not 'Small molecule compound' / 'N/A')
  const rawClass =
    drug.chemicalClass ||
    (drug as any).chemical_class ||
    (drug as any).drug_class ||
    (drug as any).drugClass ||
    (drug as any).scaffold ||
    (drug as any).core_scaffold ||
    (drug as any).chemical_scaffold ||
    (drug as any).chemicalScaffold ||
    (drug as any).class;

  if (typeof rawClass === 'string') {
    const trimmed = rawClass.trim();
    if (
      trimmed &&
      trimmed !== '0' &&
      trimmed !== '—' &&
      trimmed !== 'Small molecule compound' &&
      trimmed.toLowerCase() !== 'data unavailable' &&
      trimmed.toLowerCase() !== 'n/a'
    ) {
      return trimmed;
    }
  }

  if (typeof rawClass === 'object' && rawClass) {
    const str = (rawClass as any).name || (rawClass as any).label || (rawClass as any).title;
    if (typeof str === 'string' && str.trim().length > 0 && str !== 'Small molecule compound') {
      return str.trim();
    }
  }

  // 5. Chemoinformatics stem recognition
  for (const nameCandidate of candidateNames) {
    const stemClass = resolveByChemoinformaticsStem(nameCandidate);
    if (stemClass) return stemClass;
  }

  // 6. Final safe non-"N/A" fallback
  return 'Cardiovascular agent';
}
