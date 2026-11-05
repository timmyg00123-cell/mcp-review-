/**
 * OpenFDA Clinical Data Service
 *
 * Implements a federated data architecture integrating the OpenFDA Drug Label API
 * (https://api.fda.gov/drug/label.json) to automatically hydrate structured clinical
 * fields: Mechanism of Action, Pharmacokinetics (Half-life & Metabolism),
 * Adverse Reactions, Contraindications, and Drug Interactions.
 */

import { medChemGraphDb, GraphEntity } from '../db/medChemGraphDb';

export interface EliminationHalfLifeObj {
  value: string;
  unit: string;
}

export interface OpenFdaClinicalData {
  /** Raw arrays extracted from openFDA results[0] */
  mechanism_of_action?: string[];
  pharmacokinetics?: string[];
  adverse_reactions?: string[];
  contraindications?: string[];
  drug_interactions?: string[];

  /** Distilled board-prep fields from Gemini LLM Transformation Layer */
  route_of_administration?: string;
  reversibility?: string;
  elimination_half_life?: EliminationHalfLifeObj | string;
  location_of_metabolism?: string;
  metabolism_pathway?: string[];
  unique_differentiator?: string;
  structural_differences?: string;
  pk_pd_profile?: string;
  clinical_use_cases?: string;

  /** Cleaned / summarized single fields for quick matrix & UI display */
  mechanism?: string;
  halfLife?: string;
  metabolism?: string;
  adverseReactions?: string;
  contraindicationsText?: string;
  drugInteractionsText?: string;

  /** Metadata */
  genericName?: string;
  brandName?: string;
  source?: 'openfda.generic_name' | 'openfda.brand_name' | 'openfda.substance_name' | 'synonym' | 'cached';
  fetchedAt?: string;
  [key: string]: any;
}

export interface OpenFdaApiResponse {
  meta?: {
    disclaimer?: string;
    terms?: string;
    license?: string;
    last_updated?: string;
    results?: {
      skip?: number;
      limit?: number;
      total?: number;
    };
  };
  results?: Array<{
    mechanism_of_action?: string[];
    pharmacokinetics?: string[];
    adverse_reactions?: string[];
    contraindications?: string[];
    drug_interactions?: string[];
    openfda?: {
      generic_name?: string[];
      brand_name?: string[];
      substance_name?: string[];
      manufacturer_name?: string[];
      route?: string[];
      product_type?: string[];
      pharm_class_epc?: string[];
      pharm_class_moa?: string[];
    };
    [key: string]: any;
  }>;
  error?: {
    code?: string;
    message?: string;
  };
}

/**
 * Common pharmaceutical salt, counter-ion, and solvate suffixes to strip
 * when querying FDA generic labels.
 */
const COMMON_SALT_SUFFIXES = [
  'succinate',
  'bisulfate',
  'bisulphate',
  'sulfate',
  'sulphate',
  'hydrochloride',
  'dihydrochloride',
  'monohydrochloride',
  'hcl',
  'mesylate',
  'methanesulfonate',
  'maleate',
  'fumarate',
  'tartrate',
  'bitartrate',
  'citrate',
  'acetate',
  'phosphate',
  'diphosphate',
  'tosylate',
  'besylate',
  'propionate',
  'benzoate',
  'gluconate',
  'lactate',
  'valerate',
  'monohydrate',
  'dihydrate',
  'trihydrate',
  'hydrate',
  'sodium',
  'disodium',
  'potassium',
  'calcium',
  'magnesium',
  'tromethamine',
];

/**
 * Curated synonym mapping for common pharmaceutical names
 * to FDA generic label entries (e.g., ASA -> Aspirin).
 */
const GENERIC_SYNONYM_MAP: Record<string, string> = {
  'acetylsalicylic acid': 'aspirin',
  'asa': 'aspirin',
  'acetaminophen': 'acetaminophen',
  'paracetamol': 'acetaminophen',
  'apap': 'acetaminophen',
};

export interface FallbackPkResult {
  text: string;
  halfLife: string;
  elimination_half_life: EliminationHalfLifeObj;
  metabolism: string;
  location_of_metabolism?: string;
  metabolism_pathway: string[];
  route_of_administration?: string;
  reversibility?: string;
  mechanism_of_action?: string;
  source: 'pubchem_pug_view' | 'curated_pharmacology';
}

/**
 * Curated secondary pharmacology reference for when OpenFDA has no pharmacokinetics section.
 */
const CURATED_PK_FALLBACK: Record<string, FallbackPkResult> = {
  aspirin: {
    text: 'Aspirin is rapidly hydrolyzed by esterases in the gastrointestinal tract, plasma, and liver to salicylic acid with a half-life of 15-20 minutes. Salicylic acid has an elimination half-life of 2-3 hours at low doses (up to 15-30 hours at anti-inflammatory doses) and undergoes hepatic glycine and glucuronide conjugation before renal excretion.',
    halfLife: '15-20 minutes (parent), 2-3 hours (salicylate)',
    elimination_half_life: { value: '15-20', unit: 'minutes' },
    metabolism: 'Rapid ester hydrolysis in plasma and liver to salicylic acid; conjugated by liver (glycine/glucuronide)',
    location_of_metabolism: 'Plasma and Hepatic esterases; secondary hepatic conjugation',
    metabolism_pathway: ['Oral', 'Stomach / Upper GI absorption', 'Plasma / Hepatic Esterases (hydrolysis to salicylic acid)', 'Hepatic Glycine / Glucuronide Conjugation', 'Renal excretion'],
    route_of_administration: 'Oral, Rectal, IV',
    reversibility: 'Irreversible covalent acetylation of Ser-529',
    mechanism_of_action: 'Irreversible COX-1 and COX-2 inhibitor by acetylating serine residues, blocking thromboxane A2 synthesis.',
    source: 'curated_pharmacology',
  },
  clopidogrel: {
    text: 'Clopidogrel is an oral prodrug requiring 2-step hepatic CYP450 bioactivation. Approximately 85% is rapidly hydrolyzed by carboxylesterase 1 (CES1) to an inactive carboxylic acid metabolite. The remaining 15% is converted via CYP2C19, CYP1A2, and CYP2B6 to 2-oxo-clopidogrel, followed by CYP2C19, CYP2C9, CYP2B6, and CYP3A4 conversion to the active thiol metabolite. Parent drug half-life is ~6 hours; active metabolite half-life is ~30 minutes.',
    halfLife: '6 hours (parent), 30 minutes (active thiol metabolite)',
    elimination_half_life: { value: '6', unit: 'hours' },
    metabolism: 'Hepatic 2-step bioactivation: CYP2C19, CYP1A2, CYP2B6 oxidize to 2-oxo-clopidogrel; CYP2C19, CYP2C9, CYP3A4 hydrolyze to active thiol metabolite; 85% inactivated by carboxylesterase 1 (CES1)',
    location_of_metabolism: 'Hepatic via CYP2C19 (predominant) and CES1',
    metabolism_pathway: ['Oral', 'Intestinal absorption', '85% Inactivated by CES1', '15% Hepatic CYP2C19 oxidation to 2-oxo-clopidogrel', 'CYP2C19 / CYP3A4 cleavage to Active Thiol Metabolite', 'Binds P2Y12 platelet receptor'],
    route_of_administration: 'Oral',
    reversibility: 'Irreversible covalent disulfide bond with P2Y12 Cys residues',
    mechanism_of_action: 'Irreversible P2Y12 adenosine diphosphate receptor antagonist blocking platelet activation and aggregation.',
    source: 'curated_pharmacology',
  },
  prasugrel: {
    text: 'Prasugrel is an oral thienopyridine prodrug rapidly deacetylated by intestinal and plasma carboxylesterases (hCE2) to a thiolactone intermediate (R-95913), which is then oxidized in a single hepatic CYP step primarily by CYP3A4 and CYP2B6 to the active metabolite (R-138727). Active metabolite half-life is approximately 7 hours (range 2-15 hours).',
    halfLife: '7 hours (active metabolite: ~3.7-7 hours)',
    elimination_half_life: { value: '7', unit: 'hours' },
    metabolism: 'Rapid de-acetylation by intestinal/plasma hCE2 to thiolactone intermediate (R-95913), followed by single-step hepatic CYP3A4 and CYP2B6 oxidation to active thiol metabolite (R-138727)',
    location_of_metabolism: 'Intestinal hCE2 then Hepatic CYP3A4/CYP2B6',
    metabolism_pathway: ['Oral', 'Intestinal / Plasma hCE2 rapid de-acetylation to thiolactone intermediate (R-95913)', 'Hepatic CYP3A4 / CYP2B6 single oxidation step to active metabolite (R-138727)', 'Irreversible covalent disulfide binding to P2Y12'],
    route_of_administration: 'Oral',
    reversibility: 'Irreversible covalent disulfide bond',
    mechanism_of_action: 'Thienopyridine prodrug; active metabolite irreversibly binds P2Y12 receptor on platelets.',
    source: 'curated_pharmacology',
  },
  ticagrelor: {
    text: 'Ticagrelor is a direct-acting cyclopentyltriazolopyrimidine (CPTP) that does not require metabolic bioactivation. It is metabolized primarily by hepatic CYP3A4/5 to an active metabolite (AR-C124910XX) which is equipotent to parent drug. Mean elimination half-life is ~7 hours for ticagrelor and ~8.5-9 hours for the active metabolite. Excretion is 58% feces, 26% urine.',
    halfLife: '7 hours (parent), 8.5 hours (active metabolite)',
    elimination_half_life: { value: '7', unit: 'hours' },
    metabolism: 'Directly active CPTP (non-prodrug); metabolized by hepatic CYP3A4/5 to active metabolite AR-C124910XX (equipotent)',
    location_of_metabolism: 'Hepatic via CYP3A4/5 (direct-acting parent + active metabolite)',
    metabolism_pathway: ['Oral', 'Direct systemic absorption (direct-acting, no bioactivation needed)', 'Hepatic CYP3A4/5 oxidation to active metabolite AR-C124910XX', 'Biliary and fecal excretion (58%), renal excretion (26%)'],
    route_of_administration: 'Oral',
    reversibility: 'Reversible allosteric antagonist',
    mechanism_of_action: 'Reversible allosteric P2Y12 receptor antagonist preventing ADP-mediated conformational changes.',
    source: 'curated_pharmacology',
  },
  ticlopidine: {
    text: 'Ticlopidine is a first-generation thienopyridine prodrug extensively metabolized by the liver into at least one active thiol metabolite and several inactive metabolites. Elimination half-life is 12.6 hours after a single dose and extends to 4-5 days with repeated steady-state dosing.',
    halfLife: '12.6 hours (single dose), 4-5 days (steady-state)',
    elimination_half_life: { value: '12.6', unit: 'hours' },
    metabolism: 'Extensive hepatic bioactivation via multiple CYPs (CYP2C19, CYP3A4) to active thiol metabolite',
    location_of_metabolism: 'Hepatic CYP450 bioactivation',
    metabolism_pathway: ['Oral', 'Extensive hepatic bioactivation by CYP450 enzymes to active thiol', 'Irreversible disulfide binding to P2Y12'],
    route_of_administration: 'Oral',
    reversibility: 'Irreversible covalent antagonist',
    mechanism_of_action: 'First-generation thienopyridine prodrug; irreversibly inhibits platelet P2Y12 ADP receptor.',
    source: 'curated_pharmacology',
  },
  cangrelor: {
    text: 'Cangrelor is an intravenous direct-acting P2Y12 inhibitor that does not require metabolic bioactivation. It is rapidly inactivated in plasma via dephosphorylation by ecto-nucleotidases to its primary metabolite (a nucleoside analogue). Elimination half-life is 3-6 minutes, with platelet function recovering within 60 minutes of discontinuation.',
    halfLife: '3-6 minutes',
    elimination_half_life: { value: '3-6', unit: 'minutes' },
    metabolism: 'Dephosphorylated rapidly in plasma via ecto-nucleotidases to inactive metabolite; does not rely on hepatic CYPs or renal clearance',
    location_of_metabolism: 'Plasma dephosphorylation via ecto-nucleotidases',
    metabolism_pathway: ['Intravenous infusion', 'Rapid direct P2Y12 receptor binding', 'Plasma ecto-nucleotidase dephosphorylation to inactive metabolite', 'Excretion via urine and feces'],
    route_of_administration: 'Intravenous',
    reversibility: 'Reversible competitive antagonist',
    mechanism_of_action: 'Direct-acting, reversible intravenous P2Y12 receptor antagonist with ultra-rapid onset and offset.',
    source: 'curated_pharmacology',
  },
  tirofiban: {
    text: 'Tirofiban is a non-peptide GP IIb/IIIa antagonist administered intravenously. It undergoes minimal hepatic metabolism and is cleared predominantly unchanged via the kidneys (65%) and feces/biliary route (25%). Elimination half-life is approximately 2 hours.',
    halfLife: '2 hours',
    elimination_half_life: { value: '2', unit: 'hours' },
    metabolism: 'Minimal hepatic metabolism; primarily cleared unchanged via renal excretion (65%) and biliary/fecal route (25%)',
    location_of_metabolism: 'Renal, mostly unchanged (65%)',
    metabolism_pathway: ['Intravenous', 'Non-peptide GP IIb/IIIa binding', 'Renal excretion (65% unchanged)', 'Fecal / Biliary elimination (25%)'],
    route_of_administration: 'Intravenous',
    reversibility: 'Reversible competitive antagonist',
    mechanism_of_action: 'Non-peptide reversible antagonist of platelet glycoprotein IIb/IIIa (integrin αIIbβ3) receptor.',
    source: 'curated_pharmacology',
  },
  eptifibatide: {
    text: 'Eptifibatide is a cyclic heptapeptide GP IIb/IIIa inhibitor. It is cleared primarily through renal elimination (~50% unchanged) and non-renal mechanisms including deamination and peptide hydrolysis. Elimination half-life is approximately 2.5 hours.',
    halfLife: '2.5 hours',
    elimination_half_life: { value: '2.5', unit: 'hours' },
    metabolism: 'Cyclic heptapeptide cleared predominantly unchanged by renal glomerular filtration (~50%) and peptide cleavage/deamination',
    location_of_metabolism: 'Renal filtration (~50% unchanged) and peptide hydrolysis',
    metabolism_pathway: ['Intravenous', 'Reversible cyclic peptide binding to GP IIb/IIIa', 'Renal glomerular filtration (~50% unchanged)', 'Enzymatic deamination'],
    route_of_administration: 'Intravenous',
    reversibility: 'Reversible competitive antagonist',
    mechanism_of_action: 'Cyclic heptapeptide containing KGD sequence that reversibly blocks fibrinogen binding to GP IIb/IIIa.',
    source: 'curated_pharmacology',
  },
  vorapaxar: {
    text: 'Vorapaxar is an orally active PAR-1 receptor antagonist. It is extensively metabolized in the liver by CYP3A4 and CYP2J2 to an active metabolite (M20). Vorapaxar has an effective elimination half-life of ~8 days and an apparent terminal elimination half-life of ~20 days, reflecting very slow dissociation from PAR-1.',
    halfLife: '8 days (terminal elimination: ~20 days)',
    elimination_half_life: { value: '8', unit: 'days' },
    metabolism: 'Extensive hepatic metabolism via CYP3A4 and CYP2J2 to active metabolite M20; predominantly eliminated in feces (58%) and urine (25%)',
    location_of_metabolism: 'Hepatic via CYP3A4 and CYP2J2',
    metabolism_pathway: ['Oral', 'High oral bioavailability', 'Hepatic CYP3A4 and CYP2J2 oxidation to active metabolite M20', 'Fecal excretion (58%), renal excretion (25%)'],
    route_of_administration: 'Oral',
    reversibility: 'High-affinity functionally irreversible (pseudo-irreversible slow dissociation)',
    mechanism_of_action: 'Selective, high-affinity antagonist of protease-activated receptor-1 (PAR-1), blocking thrombin-induced platelet activation.',
    source: 'curated_pharmacology',
  },
  cilostazol: {
    text: 'Cilostazol is an oral PDE3 inhibitor extensively metabolized by hepatic CYP450 enzymes, primarily CYP3A4 and secondarily CYP2C19, into active metabolites (3,4-dehydro-cilostazol is 4-7 times more potent as a platelet aggregation inhibitor). Elimination half-life of cilostazol and its active metabolites is approximately 11-13 hours.',
    halfLife: '11-13 hours',
    elimination_half_life: { value: '11-13', unit: 'hours' },
    metabolism: 'Extensively metabolized by hepatic CYP3A4 (primary) and CYP2C19 to active metabolites (3,4-dehydro-cilostazol and 4\'-trans-hydroxy-cilostazol)',
    location_of_metabolism: 'Hepatic via CYP3A4 and CYP2C19',
    metabolism_pathway: ['Oral', 'Hepatic CYP3A4 oxidation to 3,4-dehydro-cilostazol (active)', 'Hepatic CYP2C19 oxidation to 4\'-trans-hydroxy-cilostazol', 'Renal excretion of metabolites (74%)'],
    route_of_administration: 'Oral',
    reversibility: 'Reversible competitive inhibitor',
    mechanism_of_action: 'Phosphodiesterase-3 (PDE3) inhibitor increasing intracellular cAMP, causing vasodilation and reversible inhibition of platelet aggregation.',
    source: 'curated_pharmacology',
  },
  dipyridamole: {
    text: 'Dipyridamole is absorbed from the GI tract and undergoes hepatic glucuronidation to a monoglucuronide and diglucuronide. Elimination is primarily biliary into feces via enterohepatic circulation (>95%). Elimination half-life has a terminal phase of 10-12 hours.',
    halfLife: '10-12 hours',
    elimination_half_life: { value: '10-12', unit: 'hours' },
    metabolism: 'Hepatic conjugation to monoglucuronide and diglucuronide; eliminated predominantly in bile and feces via enterohepatic recirculation',
    location_of_metabolism: 'Hepatic glucuronidation via UGT',
    metabolism_pathway: ['Oral or IV', 'Hepatic glucuronidation by UGT to mono- and diglucuronides', 'Biliary excretion into GI tract with enterohepatic recirculation', 'Fecal elimination (>95%)'],
    route_of_administration: 'Oral, Intravenous',
    reversibility: 'Reversible competitive inhibitor',
    mechanism_of_action: 'Inhibits cellular adenosine reuptake via ENT1/ENT2 and weakly inhibits PDE3 and PDE5, elevating cAMP and inhibiting platelet aggregation.',
    source: 'curated_pharmacology',
  },
};

/**
 * Queries PubChem PUG-View API for Pharmacokinetics section when OpenFDA lacks PK data.
 */
export async function fetchPubChemPharmacokinetics(
  drugName: string,
  cid?: number,
  signal?: AbortSignal
): Promise<FallbackPkResult | null> {
  try {
    let targetCid = cid;
    if (!targetCid) {
      const clean = encodeURIComponent(drugName.trim().toLowerCase());
      const pugRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${clean}/cids/JSON`, { signal });
      if (pugRes.ok) {
        const json = await pugRes.json();
        targetCid = json?.IdentifierList?.CID?.[0];
      }
    }
    if (!targetCid) return null;

    const viewUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${targetCid}/JSON?heading=Pharmacokinetics`;
    const viewRes = await fetch(viewUrl, { signal });
    if (!viewRes.ok) return null;

    const viewJson = await viewRes.json();
    const sections = viewJson?.Record?.Section || [];
    const pkTexts: string[] = [];

    const extractStrings = (obj: any) => {
      if (!obj) return;
      if (typeof obj.StringValue === 'string') pkTexts.push(obj.StringValue);
      if (Array.isArray(obj.Section)) obj.Section.forEach(extractStrings);
      if (Array.isArray(obj.Information)) {
        obj.Information.forEach((info: any) => {
          if (info?.Value?.StringWithMarkup) {
            info.Value.StringWithMarkup.forEach((swm: any) => {
              if (swm.String) pkTexts.push(swm.String);
            });
          }
        });
      }
    };
    sections.forEach(extractStrings);

    if (pkTexts.length > 0) {
      const text = pkTexts.join(' ');
      const halfLife = extractHalfLifeFromPk(pkTexts) || 'Variable';
      const metabolism = extractMetabolismFromPk(pkTexts) || 'Hepatic / Renal';
      const hlMatch = halfLife.match(/(\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?)\s*(hours?|mins?|minutes?|days?)/i);
      const elimination_half_life: EliminationHalfLifeObj = hlMatch
        ? { value: hlMatch[1], unit: hlMatch[2].toLowerCase() }
        : { value: halfLife, unit: 'hours' };

      return {
        text,
        halfLife,
        elimination_half_life,
        metabolism,
        location_of_metabolism: metabolism,
        metabolism_pathway: [metabolism],
        source: 'pubchem_pug_view',
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Resolves fallback Pharmacokinetics from curated reference dictionary or PubChem PUG-View
 * when OpenFDA drug label has an empty or missing pharmacokinetics section.
 */
export async function fetchFallbackPharmacokinetics(
  drugName: string,
  cid?: number,
  signal?: AbortSignal
): Promise<FallbackPkResult | null> {
  const normName = drugName.trim().toLowerCase();

  // 1. Check curated high-yield clinical PK reference
  if (CURATED_PK_FALLBACK[normName]) {
    return CURATED_PK_FALLBACK[normName];
  }

  // Check synonym
  const syn = GENERIC_SYNONYM_MAP[normName];
  if (syn && CURATED_PK_FALLBACK[syn]) {
    return CURATED_PK_FALLBACK[syn];
  }

  // Strip salt
  const stripped = stripSaltSuffix(normName);
  if (stripped && CURATED_PK_FALLBACK[stripped]) {
    return CURATED_PK_FALLBACK[stripped];
  }

  // 2. Query PubChem PUG-View REST API for Pharmacokinetics
  const pubchemPk = await fetchPubChemPharmacokinetics(normName, cid, signal);
  if (pubchemPk) {
    return pubchemPk;
  }

  return null;
}

/**
 * In-flight and persistent memory cache to avoid duplicate API calls
 * during batch ingestion across slides and matrix rendering.
 */
const fdaMemoryCache = new Map<string, Promise<OpenFdaClinicalData | null>>();

/**
 * Sanitizes a compound name for OpenFDA lookup:
 * Removes slide numbers, Roman numerals ([I], [II]), parentheticals, and extra punctuation.
 */
export function sanitizeDrugNameForFda(rawName: string): string {
  if (!rawName) return '';
  return rawName
    .replace(/^\[[A-Za-z0-9IVXLCDM_\-\s]+\]\s*/i, '') // Remove bracketed identifiers like [I] or [Drug A]
    .replace(/\(.*?\)/g, '')                         // Remove parenthetical details like (Plavix)
    .replace(/[^\w\s\-]/g, ' ')                      // Replace strange punctuation with spaces
    .replace(/\s+/g, ' ')                            // Normalize multiple spaces
    .trim()
    .toLowerCase();
}

/**
 * Strips common salt suffixes from a drug name (e.g. "clopidogrel bisulfate" -> "clopidogrel").
 */
export function stripSaltSuffix(cleanName: string): string {
  let name = cleanName;
  for (const salt of COMMON_SALT_SUFFIXES) {
    const regex = new RegExp(`\\b${salt}\\b`, 'gi');
    if (regex.test(name)) {
      name = name.replace(regex, '').trim();
    }
  }
  return name.replace(/\s+/g, ' ').trim();
}

/**
 * Cleans section headers often prepended in FDA label text
 * (e.g. "12.1 Mechanism of Action Clopidogrel is an inhibitor..." -> "Clopidogrel is an inhibitor...")
 */
export function cleanSectionHeader(text: string): string {
  if (!text) return '';
  return text
    .replace(/^\s*\d+(?:\.\d+)*\s*(?:Mechanism of Action|Clinical Pharmacology|Pharmacokinetics|Description|Adverse Reactions|Contraindications|Drug Interactions)?\s*[:.-]?\s*/i, '')
    .trim();
}

/**
 * Extracts elimination half-life from FDA Pharmacokinetics section text.
 * Finds specific sentences or statements detailing drug and metabolite half-lives.
 */
export function extractHalfLifeFromPk(pkTexts: string[]): string {
  if (!pkTexts || pkTexts.length === 0) return '';
  const fullText = pkTexts.join(' ');
  const sentences = fullText.split(/(?<=[.!?])\s+/);
  const hlSentences = sentences.filter((s) =>
    /(?:half[- ]life|t\s*1\/2|t\s*½)\b/i.test(s)
  );

  if (hlSentences.length > 0) {
    return cleanSectionHeader(hlSentences.slice(0, 2).join(' ').trim());
  }
  return '';
}

/**
 * Extracts metabolism and bioactivation highlights from FDA Pharmacokinetics section text.
 */
export function extractMetabolismFromPk(pkTexts: string[]): string {
  if (!pkTexts || pkTexts.length === 0) return '';
  const fullText = pkTexts.join(' ');
  const sentences = fullText.split(/(?<=[.!?])\s+/);
  const metSentences = sentences.filter((s) =>
    /(?:metabol|cyp\d|esterase|prodrug|bioactivation|oxidation|hydrolysis|active metabolite)\b/i.test(s)
  );

  if (metSentences.length > 0) {
    return cleanSectionHeader(metSentences.slice(0, 3).join(' ').trim());
  }
  return '';
}

/**
 * Transforms an OpenFDA result item into a clean OpenFdaClinicalData object.
 */
export function transformOpenFdaResult(
  result: any,
  sourceType: OpenFdaClinicalData['source'] = 'openfda.generic_name'
): OpenFdaClinicalData {
  const mechanism_of_action: string[] = Array.isArray(result?.mechanism_of_action)
    ? result.mechanism_of_action
    : [];
  const pharmacokinetics: string[] = Array.isArray(result?.pharmacokinetics)
    ? result.pharmacokinetics
    : [];
  const adverse_reactions: string[] = Array.isArray(result?.adverse_reactions)
    ? result.adverse_reactions
    : [];
  const contraindications: string[] = Array.isArray(result?.contraindications)
    ? result.contraindications
    : [];
  const drug_interactions: string[] = Array.isArray(result?.drug_interactions)
    ? result.drug_interactions
    : [];

  const rawMoa = mechanism_of_action[0] || '';
  const mechanism = cleanSectionHeader(rawMoa);
  const halfLife = extractHalfLifeFromPk(pharmacokinetics);
  const metabolism = extractMetabolismFromPk(pharmacokinetics);
  const adverseReactions = cleanSectionHeader(adverse_reactions[0] || '');
  const contraindicationsText = cleanSectionHeader(contraindications[0] || '');
  const drugInteractionsText = cleanSectionHeader(drug_interactions[0] || '');

  const genericName = result?.openfda?.generic_name?.[0];
  const brandName = result?.openfda?.brand_name?.[0];

  return {
    mechanism_of_action,
    pharmacokinetics,
    adverse_reactions,
    contraindications,
    drug_interactions,
    mechanism: mechanism || undefined,
    halfLife: halfLife || undefined,
    metabolism: metabolism || undefined,
    adverseReactions: adverseReactions || undefined,
    contraindicationsText: contraindicationsText || undefined,
    drugInteractionsText: drugInteractionsText || undefined,
    genericName,
    brandName,
    source: sourceType,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Internal single fetch attempt for a given query term on OpenFDA
 */
async function queryOpenFdaEndpoint(
  fieldName: 'openfda.generic_name' | 'openfda.brand_name' | 'openfda.substance_name',
  searchTerm: string,
  signal?: AbortSignal
): Promise<any | null> {
  const cleanTerm = searchTerm.toLowerCase().trim();
  if (!cleanTerm) return null;

  // The endpoint format strictly adheres to:
  // https://api.fda.gov/drug/label.json?search=openfda.generic_name:"{drugName}"&limit=1
  const encodedQuery = encodeURIComponent(cleanTerm);
  const url = `https://api.fda.gov/drug/label.json?search=${fieldName}:%22${encodedQuery}%22&limit=1`;

  try {
    const fetchSignal = signal || (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? AbortSignal.timeout(9000) : undefined);
    const res = await fetch(url, { signal: fetchSignal });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      console.warn(`[OpenFDA] Query ${url} returned HTTP ${res.status}`);
      return null;
    }

    const json: OpenFdaApiResponse = await res.json();
    if (json?.results && json.results.length > 0) {
      return json.results[0];
    }
    return null;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return null;
    }
    console.warn(`[OpenFDA] Network or parsing exception for term "${searchTerm}":`, err?.message || err);
    return null;
  }
}

/**
 * Builds a concatenated text context string from OpenFDA raw arrays for LLM transformation.
 */
export function buildRawFdaTextContext(result: any): string {
  if (!result) return '';
  const sections: string[] = [];

  if (Array.isArray(result.mechanism_of_action) && result.mechanism_of_action.length > 0) {
    sections.push(`Mechanism of Action:\n${result.mechanism_of_action.join('\n')}`);
  }
  if (Array.isArray(result.pharmacokinetics) && result.pharmacokinetics.length > 0) {
    sections.push(`Pharmacokinetics:\n${result.pharmacokinetics.join('\n')}`);
  }
  if (Array.isArray(result.adverse_reactions) && result.adverse_reactions.length > 0) {
    sections.push(`Adverse Reactions:\n${result.adverse_reactions.join('\n')}`);
  }
  if (Array.isArray(result.contraindications) && result.contraindications.length > 0) {
    sections.push(`Contraindications:\n${result.contraindications.join('\n')}`);
  }
  if (Array.isArray(result.drug_interactions) && result.drug_interactions.length > 0) {
    sections.push(`Drug Interactions:\n${result.drug_interactions.join('\n')}`);
  }
  if (Array.isArray(result?.openfda?.route) && result.openfda.route.length > 0) {
    sections.push(`Route of Administration:\n${result.openfda.route.join(', ')}`);
  }

  return sections.join('\n\n').trim();
}

export interface DistilledFdaClinicalData {
  route_of_administration?: string;
  reversibility?: string;
  elimination_half_life?: EliminationHalfLifeObj | string;
  location_of_metabolism?: string;
  metabolism_pathway?: string[];
  unique_differentiator?: string;
  structural_differences?: string;
  pk_pd_profile?: string;
  clinical_use_cases?: string;
  mechanism_of_action?: string;
  adverse_reactions?: string[];
}

export type ClinicalData = OpenFdaClinicalData;

/**
 * Invokes Gemini LLM Transformation Layer to distill verbose OpenFDA package inserts
 * into board-prep format: route of administration, binding reversibility, concise MOA,
 * and high-yield adverse reactions.
 */
export async function transformFdaDataWithGemini(
  drugName: string,
  rawFdaText: string,
  signal?: AbortSignal
): Promise<DistilledFdaClinicalData | null> {
  try {
    const res = await fetch('/api/gemini/transform-fda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drugName, rawFdaText }),
      signal,
    });

    if (!res.ok) {
      console.warn(`[OpenFDA Transform] API returned HTTP ${res.status} for "${drugName}"`);
      return null;
    }

    const data: DistilledFdaClinicalData = await res.json();
    return data;
  } catch (err: any) {
    if (err?.name === 'AbortError') return null;
    console.warn(`[OpenFDA Transform] Transformation request failed for "${drugName}":`, err?.message || err);
    return null;
  }
}

/**
 * Primary OpenFDA Fetch Utility
 *
 * Resolves structured clinical data for a given drug name.
 * Executes:
 * 1. Direct query on openfda.generic_name:"{drugName}"
 * 2. Synonym mapping (e.g. ASA -> aspirin)
 * 3. Salt-stripped query on openfda.generic_name
 * 4. Fallback on openfda.brand_name:"{drugName}"
 * 5. Fallback on openfda.substance_name:"{drugName}"
 * 6. Gemini LLM Transformation Layer distillation into concise board-prep fields
 *
 * Uses in-flight deduplication to avoid redundant HTTP requests.
 */
export async function fetchOpenFdaClinicalData(
  rawDrugName: string,
  signal?: AbortSignal
): Promise<OpenFdaClinicalData | null> {
  const cleanName = sanitizeDrugNameForFda(rawDrugName);
  if (!cleanName) return null;

  // Check in-flight / cached promise
  const cacheKey = cleanName.toLowerCase();
  if (fdaMemoryCache.has(cacheKey)) {
    return fdaMemoryCache.get(cacheKey)!;
  }

  const fetchPromise = (async (): Promise<OpenFdaClinicalData | null> => {
    let result: any = null;
    let sourceType: OpenFdaClinicalData['source'] = 'openfda.generic_name';

    // 1. Direct generic_name query
    result = await queryOpenFdaEndpoint('openfda.generic_name', cleanName, signal);
    if (result) {
      sourceType = 'openfda.generic_name';
    } else {
      // 2. Check synonym map
      const mappedSynonym = GENERIC_SYNONYM_MAP[cleanName];
      if (mappedSynonym) {
        result = await queryOpenFdaEndpoint('openfda.generic_name', mappedSynonym, signal);
        if (result) sourceType = 'synonym';
      }
    }

    if (!result) {
      // 3. Check salt-stripped generic name
      const saltStripped = stripSaltSuffix(cleanName);
      if (saltStripped && saltStripped !== cleanName) {
        result = await queryOpenFdaEndpoint('openfda.generic_name', saltStripped, signal);
        if (result) sourceType = 'openfda.generic_name';
      }
    }

    if (!result) {
      // 4. Fallback to brand_name
      result = await queryOpenFdaEndpoint('openfda.brand_name', cleanName, signal);
      if (result) sourceType = 'openfda.brand_name';
    }

    if (!result) {
      // 5. Fallback to substance_name
      result = await queryOpenFdaEndpoint('openfda.substance_name', cleanName, signal);
      if (result) sourceType = 'openfda.substance_name';
    }

    let clinicalData: OpenFdaClinicalData;
    let rawContext = '';

    if (result) {
      clinicalData = transformOpenFdaResult(result, sourceType);
      rawContext = buildRawFdaTextContext(result);
    } else {
      // Fallback: If no FDA package insert was found on OpenFDA REST API, rely on base pharmacological training
      clinicalData = {
        mechanism_of_action: [],
        pharmacokinetics: [],
        adverse_reactions: [],
        contraindications: [],
        drug_interactions: [],
        genericName: cleanName,
        source: 'cached',
        fetchedAt: new Date().toISOString(),
      };
      rawContext = '';
    }

    // Secondary source fallback for Pharmacokinetics if not found in OpenFDA
    if (!clinicalData.pharmacokinetics || clinicalData.pharmacokinetics.length === 0) {
      const fallbackPk = await fetchFallbackPharmacokinetics(cleanName, undefined, signal);
      if (fallbackPk) {
        clinicalData.pharmacokinetics = [fallbackPk.text];
        if (!clinicalData.halfLife) clinicalData.halfLife = fallbackPk.halfLife;
        if (!clinicalData.metabolism) clinicalData.metabolism = fallbackPk.metabolism;
        if (!clinicalData.location_of_metabolism) {
          clinicalData.location_of_metabolism = fallbackPk.location_of_metabolism || fallbackPk.metabolism;
        }
        if (!clinicalData.elimination_half_life) clinicalData.elimination_half_life = fallbackPk.elimination_half_life;
        if (!clinicalData.metabolism_pathway) clinicalData.metabolism_pathway = fallbackPk.metabolism_pathway;
        if (!clinicalData.route_of_administration && fallbackPk.route_of_administration) {
          clinicalData.route_of_administration = fallbackPk.route_of_administration;
        }
        if (!clinicalData.reversibility && fallbackPk.reversibility) {
          clinicalData.reversibility = fallbackPk.reversibility;
        }
        if (!clinicalData.mechanism && fallbackPk.mechanism_of_action) {
          clinicalData.mechanism = fallbackPk.mechanism_of_action;
        }
        rawContext += (rawContext ? '\n\n' : '') + `Pharmacokinetics:\n${fallbackPk.text}`;
      }
    }

    // Distill via Gemini LLM Transformation Layer
    const distilled = await transformFdaDataWithGemini(cleanName, rawContext, signal);
    if (distilled) {
      if (distilled.route_of_administration) {
        clinicalData.route_of_administration = distilled.route_of_administration;
      }
      if (distilled.reversibility) {
        clinicalData.reversibility = distilled.reversibility;
      }
      if (distilled.elimination_half_life) {
        clinicalData.elimination_half_life = distilled.elimination_half_life;
        clinicalData.halfLife = typeof distilled.elimination_half_life === 'object'
          ? `${distilled.elimination_half_life.value} ${distilled.elimination_half_life.unit}`.trim()
          : String(distilled.elimination_half_life);
      }
      if (distilled.metabolism_pathway) {
        clinicalData.metabolism_pathway = distilled.metabolism_pathway;
        clinicalData.location_of_metabolism = Array.isArray(distilled.metabolism_pathway)
          ? distilled.metabolism_pathway.join(' ➔ ')
          : String(distilled.metabolism_pathway);
        clinicalData.metabolism = clinicalData.location_of_metabolism;
      } else if (distilled.location_of_metabolism) {
        clinicalData.location_of_metabolism = distilled.location_of_metabolism;
        clinicalData.metabolism = distilled.location_of_metabolism;
      }
      if (distilled.unique_differentiator) {
        clinicalData.unique_differentiator = distilled.unique_differentiator;
      }
      if (distilled.mechanism_of_action) {
        clinicalData.mechanism = distilled.mechanism_of_action;
        if (!clinicalData.mechanism_of_action || !clinicalData.mechanism_of_action.length) {
          clinicalData.mechanism_of_action = [distilled.mechanism_of_action];
        }
      }
      if (Array.isArray(distilled.adverse_reactions) && distilled.adverse_reactions.length > 0) {
        clinicalData.adverse_reactions = distilled.adverse_reactions;
        clinicalData.adverseReactions = distilled.adverse_reactions.join(', ');
      }
    }

    return clinicalData;
  })();

  fdaMemoryCache.set(cacheKey, fetchPromise);
  return fetchPromise;
}

/**
 * Enriches a specific entity in the Dexie database with OpenFDA clinical data.
 * Updates the entity with `clinicalData = { mechanism, halfLife, ... }`.
 */
export async function enrichEntityWithOpenFda(
  entityId: string,
  drugName?: string,
  signal?: AbortSignal
): Promise<OpenFdaClinicalData | null> {
  const normId = entityId.trim().toLowerCase();
  const entity = await medChemGraphDb.entities.get(normId);

  // If already enriched with complete OpenFDA data, return cached
  if (entity?.clinicalData?.mechanism_of_action?.length) {
    return entity.clinicalData;
  }

  const lookupName = drugName || entity?.name || entityId;
  const clinicalData = await fetchOpenFdaClinicalData(lookupName, signal);

  if (clinicalData && entity) {
    await medChemGraphDb.entities.update(normId, {
      clinicalData,
      updatedAt: new Date().toISOString(),
    });
  }

  return clinicalData;
}
