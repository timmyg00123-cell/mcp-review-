/**
 * Dynamic Clinical Pre-Flip Question Generator
 *
 * Slices clinical monographs and subclass profiles into targeted MCQ and SATA
 * micro-drills presented directly on the flashcard front face prior to flipping.
 * Sibling distractors are harvested dynamically from broadPharmacologicClass with
 * automated fallback to adjacent categories/catalog for isolated classes.
 */

import {
  TOP_DRUGS_TAXONOMY,
  type TopDrugEntry,
} from '../data/topDrugsTaxonomyData.js';
import {
  TOP_DRUGS_CLINICAL_CATALOG,
  resolveTopDrugClinicalMonograph,
  getTopDrugClinicalMonograph,
  type TopDrugClinicalMonograph,
} from '../data/topDrugsClinicalData.js';
import {
  resolveClassProfileForDrug,
  getDrugExceptions,
  type TopDrugClassProfile,
} from '../data/clinical/classProfiles.js';

export type ClinicalQuestionDomain =
  | 'brand-names'
  | 'contraindications'
  | 'adverse-effects'
  | 'subclass-exceptions'
  | 'dosing-pearls';

export interface ClinicalPreflipOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface ClinicalPreflipQuestion {
  id: string;
  domain: ClinicalQuestionDomain;
  type: 'mcq' | 'sata';
  prompt: string;
  options: ClinicalPreflipOption[];
  explanation?: string;
}

export const TOP_DRUGS_TAXONOMY_DATABASE = TOP_DRUGS_TAXONOMY;
export const TOP_DRUGS_CLINICAL_DATABASE = TOP_DRUGS_CLINICAL_CATALOG;

/**
 * Normalizes a drug name for robust matching (strips salts, dosage suffixes, and special chars).
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/\b(calcium|potassium|sodium|succinate|tartrate|hcl|hydrochloride|maleate|mesylate|besylate|phosphate|nitrate|sulfate|acetate|valerate|dipropionate|propionate|trihydrate|dihydrate|monohydrate|fumarate|gluconate|axetil|potassium clavulanate|clavulanate)\b/gi, '')
    .replace(/\b(extended release|oral inhaler|nasal inhaler|topical|oral|er|xr|xl|sr|cr|dr|ec)\b/gi, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Resolves a TopDrugEntry from the taxonomy database by generic or brand name.
 */
export function getTopDrugTaxonomyEntry(drugName: string): TopDrugEntry | null {
  if (!drugName || typeof drugName !== 'string') {
    return null;
  }
  const trimmed = drugName.trim();
  if (!trimmed) {
    return null;
  }

  const rawLower = trimmed.toLowerCase();
  const normalizedInput = normalizeString(trimmed);

  // 1. Exact generic match
  const exactGeneric = TOP_DRUGS_TAXONOMY.find(
    (e) => e.genericName.toLowerCase().trim() === rawLower
  );
  if (exactGeneric) return exactGeneric;

  // 2. Exact brand match
  const exactBrand = TOP_DRUGS_TAXONOMY.find((e) =>
    e.brandNames.some((b) => b.toLowerCase().trim() === rawLower)
  );
  if (exactBrand) return exactBrand;

  // 3. Normalized generic match
  const normGeneric = TOP_DRUGS_TAXONOMY.find((e) => {
    const norm = normalizeString(e.genericName);
    return norm === normalizedInput && norm.length >= 3;
  });
  if (normGeneric) return normGeneric;

  // 4. Substring match
  const subMatch = TOP_DRUGS_TAXONOMY.find((e) => {
    const entryLower = e.genericName.toLowerCase().trim();
    return (
      entryLower.length >= 4 &&
      (rawLower.includes(entryLower) || entryLower.includes(rawLower))
    );
  });
  if (subMatch) return subMatch;

  // 5. Clinical catalog cross-reference fallback
  const catalogMatch = getTopDrugClinicalMonograph(trimmed);
  if (catalogMatch) {
    const matchedTaxonomy = TOP_DRUGS_TAXONOMY.find(
      (e) => e.genericName.toLowerCase().trim() === catalogMatch.genericName.toLowerCase().trim()
    );
    if (matchedTaxonomy) return matchedTaxonomy;
  }

  return null;
}

/**
 * Simple deterministic 32-bit PRNG (Mulberry32) for reproducible question generation.
 */
function createDeterministicRng(seedStr: string): () => number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (Math.imul(31, hash) + seedStr.charCodeAt(i)) | 0;
  }
  let s = hash >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministically shuffles an array using the provided PRNG.
 */
function shuffle<T>(array: T[], rng: () => number): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

/**
 * Harvests class siblings and multi-tiered fallback pools for distractor selection.
 */
function getSiblingsAndFallbackPool(target: TopDrugEntry): {
  siblings: TopDrugEntry[];
  fallbackPool: TopDrugEntry[];
} {
  const targetLower = target.genericName.toLowerCase().trim();

  // Tier 1: Siblings sharing canonical broadPharmacologicClass
  const siblings = TOP_DRUGS_TAXONOMY.filter(
    (e) =>
      e.genericName.toLowerCase().trim() !== targetLower &&
      e.broadPharmacologicClass === target.broadPharmacologicClass
  );

  // Tier 2: Fallback drugs in the same therapeuticCategory or therapeuticClassNumber
  const categoryFallback = TOP_DRUGS_TAXONOMY.filter(
    (e) =>
      e.genericName.toLowerCase().trim() !== targetLower &&
      e.broadPharmacologicClass !== target.broadPharmacologicClass &&
      (e.therapeuticClassNumber === target.therapeuticClassNumber ||
        e.therapeuticCategory === target.therapeuticCategory)
  );

  // Tier 3: Wider catalog fallback
  const catalogFallback = TOP_DRUGS_TAXONOMY.filter(
    (e) =>
      e.genericName.toLowerCase().trim() !== targetLower &&
      e.broadPharmacologicClass !== target.broadPharmacologicClass &&
      e.therapeuticClassNumber !== target.therapeuticClassNumber &&
      e.therapeuticCategory !== target.therapeuticCategory
  );

  const fallbackPool = [...categoryFallback, ...catalogFallback];
  return { siblings, fallbackPool };
}

/**
 * Clean and truncate long strings for concise, readable option choices.
 */
function cleanOptionText(text: string, maxLength = 160): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  // Truncate at sentence or word boundary
  const dotIndex = cleaned.indexOf('.', 80);
  if (dotIndex > 0 && dotIndex <= maxLength) {
    return cleaned.slice(0, dotIndex + 1);
  }
  return cleaned.slice(0, maxLength - 1).trim() + '…';
}

/**
 * Generates a Brand Names question (MCQ or SATA).
 */
export function generateBrandQuestion(
  drug: TopDrugEntry,
  monograph: TopDrugClinicalMonograph,
  siblings: TopDrugEntry[],
  fallbackPool: TopDrugEntry[],
  rng: () => number,
  attemptIndex: number
): ClinicalPreflipQuestion {
  const qId = `brand-${normalizeString(drug.genericName)}-${attemptIndex}`;

  // Gather valid brand names for target
  const rawTargetBrands = Array.from(
    new Set([...drug.brandNames, ...monograph.brandNames])
  ).filter((b) => b.toLowerCase().trim() !== drug.genericName.toLowerCase().trim());

  const targetBrands = rawTargetBrands.length > 0 ? rawTargetBrands : drug.brandNames;

  // Decide MCQ vs SATA: If drug has >= 2 distinct brands and rng > 0.45, generate SATA
  const isSata = targetBrands.length >= 2 && rng() > 0.45;
  const targetKnownBrandsLower = new Set(
    [...drug.brandNames, ...monograph.brandNames, drug.genericName].map((b) =>
      b.toLowerCase().trim()
    )
  );

  const options: ClinicalPreflipOption[] = [];
  const usedTextsLower = new Set<string>();

  if (isSata) {
    // Select 2 correct brands (or up to 3 if available)
    const shuffledTargetBrands = shuffle(targetBrands, rng);
    const correctCount = Math.min(2, shuffledTargetBrands.length);

    for (let i = 0; i < correctCount; i++) {
      const brand = shuffledTargetBrands[i];
      usedTextsLower.add(brand.toLowerCase());
      options.push({
        id: `${qId}-opt-${options.length}`,
        text: brand,
        isCorrect: true,
        explanation: `${brand} is an FDA-approved brand name for ${drug.genericName}.`,
      });
    }

    // Harvest distractors from siblings and fallback
    const distractorCandidates = [...siblings, ...fallbackPool];
    for (const candidate of distractorCandidates) {
      if (options.length >= 4) break;
      for (const brand of candidate.brandNames) {
        const lower = brand.toLowerCase().trim();
        if (!targetKnownBrandsLower.has(lower) && !usedTextsLower.has(lower)) {
          usedTextsLower.add(lower);
          options.push({
            id: `${qId}-opt-${options.length}`,
            text: brand,
            isCorrect: false,
            explanation: `${brand} is a brand name for ${candidate.genericName}, not ${drug.genericName}.`,
          });
          break;
        }
      }
    }

    const shuffledOptions = shuffle(options, rng).map((opt, idx) => ({
      ...opt,
      id: `${qId}-opt-${idx}`,
    }));

    return {
      id: qId,
      domain: 'brand-names',
      type: 'sata',
      prompt: `Which of the following are recognized FDA-approved brand names for ${drug.genericName}? (Select all that apply)`,
      options: shuffledOptions,
      explanation: `${drug.genericName} is marketed as ${targetBrands.join(', ')}.`,
    };
  }

  // MCQ Mode: Exactly 1 correct brand + 3 distractors
  const chosenCorrectBrand = shuffle(targetBrands, rng)[0];
  usedTextsLower.add(chosenCorrectBrand.toLowerCase());
  options.push({
    id: `${qId}-opt-${options.length}`,
    text: chosenCorrectBrand,
    isCorrect: true,
    explanation: `${chosenCorrectBrand} is an FDA-approved brand name for ${drug.genericName}.`,
  });

  const distractorCandidates = [...siblings, ...fallbackPool];
  for (const candidate of distractorCandidates) {
    if (options.length >= 4) break;
    for (const brand of candidate.brandNames) {
      const lower = brand.toLowerCase().trim();
      if (!targetKnownBrandsLower.has(lower) && !usedTextsLower.has(lower)) {
        usedTextsLower.add(lower);
        options.push({
          id: `${qId}-opt-${options.length}`,
          text: brand,
          isCorrect: false,
          explanation: `${brand} is a brand name for ${candidate.genericName}, not ${drug.genericName}.`,
        });
        break;
      }
    }
  }

  const shuffledOptions = shuffle(options, rng).map((opt, idx) => ({
    ...opt,
    id: `${qId}-opt-${idx}`,
  }));

  return {
    id: qId,
    domain: 'brand-names',
    type: 'mcq',
    prompt: `Which of the following is an FDA-approved brand name for ${drug.genericName}?`,
    options: shuffledOptions,
    explanation: `${drug.genericName} is marketed as ${targetBrands.join(', ')}.`,
  };
}

/**
 * Generates a Contraindications question (SATA mode).
 */
export function generateContraindicationQuestion(
  drug: TopDrugEntry,
  monograph: TopDrugClinicalMonograph,
  siblings: TopDrugEntry[],
  fallbackPool: TopDrugEntry[],
  rng: () => number,
  attemptIndex: number
): ClinicalPreflipQuestion {
  const qId = `contra-${normalizeString(drug.genericName)}-${attemptIndex}`;

  const targetContraindications = (
    monograph.contraindications.length > 0
      ? monograph.contraindications
      : [
          `Severe active hepatic impairment or severe acute liver failure`,
          `Known severe hypersensitivity to ${drug.genericName} or any formulation excipients`,
        ]
  ).map((c) => cleanOptionText(c));

  const targetCleanSet = new Set(targetContraindications.map((c) => c.toLowerCase()));

  // Select 1 or 2 correct contraindications
  const shuffledTarget = shuffle(targetContraindications, rng);
  const correctCount = Math.min(2, Math.max(1, shuffledTarget.length > 1 ? 2 : 1));

  const options: ClinicalPreflipOption[] = [];
  const usedTexts = new Set<string>();

  for (let i = 0; i < correctCount; i++) {
    const text = shuffledTarget[i];
    usedTexts.add(text.toLowerCase());
    options.push({
      id: `${qId}-opt-${options.length}`,
      text,
      isCorrect: true,
      explanation: `Documented clinical contraindication for ${drug.genericName}.`,
    });
  }

  // Harvest distractors from siblings and fallback pool
  const distractorCandidates = [...siblings, ...fallbackPool];
  for (const candidate of distractorCandidates) {
    if (options.length >= 4) break;
    const candMono = resolveTopDrugClinicalMonograph(candidate);
    for (const contra of candMono.contraindications) {
      const cleaned = cleanOptionText(contra);
      const lower = cleaned.toLowerCase();
      if (!targetCleanSet.has(lower) && !usedTexts.has(lower)) {
        usedTexts.add(lower);
        options.push({
          id: `${qId}-opt-${options.length}`,
          text: cleaned,
          isCorrect: false,
          explanation: `Characteristic contraindication for ${candidate.genericName}, not ${drug.genericName}.`,
        });
        break;
      }
    }
  }

  // Emergency fallback if unique candidates are exhausted
  const emergencyDistractors = [
    `Concomitant administration with strong MAO inhibitors within 14 days`,
    `Severe bilateral renal artery stenosis`,
    `History of life-threatening angioedema with previous therapy`,
    `Severe aortic stenosis or acute decompensated heart failure`,
  ];
  for (const fallback of emergencyDistractors) {
    if (options.length >= 4) break;
    const lower = fallback.toLowerCase();
    if (!targetCleanSet.has(lower) && !usedTexts.has(lower)) {
      usedTexts.add(lower);
      options.push({
        id: `${qId}-opt-${options.length}`,
        text: fallback,
        isCorrect: false,
        explanation: `General pharmacology distractor; not an established primary contraindication for ${drug.genericName}.`,
      });
    }
  }

  const shuffledOptions = shuffle(options, rng).map((opt, idx) => ({
    ...opt,
    id: `${qId}-opt-${idx}`,
  }));

  return {
    id: qId,
    domain: 'contraindications',
    type: 'sata',
    prompt: `Which of the following are clinically significant contraindications or boxed precautions for ${drug.genericName}? (Select all that apply)`,
    options: shuffledOptions,
    explanation: `Key contraindications for ${drug.genericName}: ${targetContraindications.slice(0, 2).join('; ')}.`,
  };
}

/**
 * Generates an Adverse Effects / Boxed Warnings question (MCQ or SATA).
 */
export function generateAdverseEffectsQuestion(
  drug: TopDrugEntry,
  monograph: TopDrugClinicalMonograph,
  siblings: TopDrugEntry[],
  fallbackPool: TopDrugEntry[],
  rng: () => number,
  attemptIndex: number
): ClinicalPreflipQuestion {
  const qId = `adverse-${normalizeString(drug.genericName)}-${attemptIndex}`;

  const profile = resolveClassProfileForDrug(drug.genericName);

  // Compile target true adverse effects
  const targetAdverse: string[] = [];
  if (monograph.blackBoxWarning) {
    targetAdverse.push(cleanOptionText(monograph.blackBoxWarning));
  }
  if (monograph.sideEffects?.severe) {
    targetAdverse.push(...monograph.sideEffects.severe.map((e) => cleanOptionText(e)));
  }
  if (profile?.classWideToxicities) {
    targetAdverse.push(...profile.classWideToxicities.map((e) => cleanOptionText(e)));
  }
  if (monograph.sideEffects?.common) {
    targetAdverse.push(...monograph.sideEffects.common.map((e) => cleanOptionText(e)));
  }

  const targetCleanSet = new Set(targetAdverse.map((e) => e.toLowerCase()));
  const isSata = rng() > 0.5 && targetAdverse.length >= 2;

  const options: ClinicalPreflipOption[] = [];
  const usedTexts = new Set<string>();

  if (isSata) {
    const shuffledTarget = shuffle(targetAdverse, rng);
    const correctCount = Math.min(2, shuffledTarget.length);

    for (let i = 0; i < correctCount; i++) {
      const text = shuffledTarget[i];
      usedTexts.add(text.toLowerCase());
      options.push({
        id: `${qId}-opt-${options.length}`,
        text,
        isCorrect: true,
        explanation: `Recognized adverse effect or boxed warning for ${drug.genericName}.`,
      });
    }

    // Harvest distractors from siblings and fallback pool
    const distractorCandidates = [...siblings, ...fallbackPool];
    for (const candidate of distractorCandidates) {
      if (options.length >= 4) break;
      const candMono = resolveTopDrugClinicalMonograph(candidate);
      const candAdverse = [
        ...(candMono.blackBoxWarning ? [candMono.blackBoxWarning] : []),
        ...(candMono.sideEffects?.severe || []),
      ];

      for (const item of candAdverse) {
        const cleaned = cleanOptionText(item);
        const lower = cleaned.toLowerCase();
        if (!targetCleanSet.has(lower) && !usedTexts.has(lower)) {
          usedTexts.add(lower);
          options.push({
            id: `${qId}-opt-${options.length}`,
            text: cleaned,
            isCorrect: false,
            explanation: `Characteristic adverse effect of ${candidate.genericName}, not ${drug.genericName}.`,
          });
          break;
        }
      }
    }

    const shuffledOptions = shuffle(options, rng).map((opt, idx) => ({
      ...opt,
      id: `${qId}-opt-${idx}`,
    }));

    return {
      id: qId,
      domain: 'adverse-effects',
      type: 'sata',
      prompt: `Which of the following are recognized adverse effects or boxed toxicities for ${drug.genericName}? (Select all that apply)`,
      options: shuffledOptions,
      explanation: `Established adverse events for ${drug.genericName}: ${targetAdverse.slice(0, 2).join('; ')}.`,
    };
  }

  // MCQ Mode: 1 correct adverse effect + 3 distractors
  const chosenCorrect = shuffle(targetAdverse, rng)[0] || 'Severe hypersensitivity reaction and angioedema';
  usedTexts.add(chosenCorrect.toLowerCase());
  options.push({
    id: `${qId}-opt-${options.length}`,
    text: chosenCorrect,
    isCorrect: true,
    explanation: `Key adverse event / boxed warning associated with ${drug.genericName}.`,
  });

  const distractorCandidates = [...siblings, ...fallbackPool];
  for (const candidate of distractorCandidates) {
    if (options.length >= 4) break;
    const candMono = resolveTopDrugClinicalMonograph(candidate);
    const candAdverse = [
      ...(candMono.blackBoxWarning ? [candMono.blackBoxWarning] : []),
      ...(candMono.sideEffects?.severe || []),
    ];

    for (const item of candAdverse) {
      const cleaned = cleanOptionText(item);
      const lower = cleaned.toLowerCase();
      if (!targetCleanSet.has(lower) && !usedTexts.has(lower)) {
        usedTexts.add(lower);
        options.push({
          id: `${qId}-opt-${options.length}`,
          text: cleaned,
          isCorrect: false,
          explanation: `Characteristic adverse effect of ${candidate.genericName}, not ${drug.genericName}.`,
        });
        break;
      }
    }
  }

  // Emergency distractor fallback
  const emergencyAdverse = [
    `Rhabdomyolysis with acute kidney injury and myoglobinuria`,
    `Tendonitis and bilateral Achilles tendon rupture`,
    `Agranulocytosis and severe life-threatening neutropenia`,
    `Gingival hyperplasia and peripheral neuropathy`,
  ];
  for (const fallback of emergencyAdverse) {
    if (options.length >= 4) break;
    const lower = fallback.toLowerCase();
    if (!targetCleanSet.has(lower) && !usedTexts.has(lower)) {
      usedTexts.add(lower);
      options.push({
        id: `${qId}-opt-${options.length}`,
        text: fallback,
        isCorrect: false,
        explanation: `General pharmacology distractor; not primarily characteristic of ${drug.genericName}.`,
      });
    }
  }

  const shuffledOptions = shuffle(options, rng).map((opt, idx) => ({
    ...opt,
    id: `${qId}-opt-${idx}`,
  }));

  return {
    id: qId,
    domain: 'adverse-effects',
    type: 'mcq',
    prompt: `Which of the following is a primary adverse effect or boxed warning associated with ${drug.genericName}?`,
    options: shuffledOptions,
    explanation: `Established adverse events for ${drug.genericName}: ${targetAdverse.slice(0, 2).join('; ')}.`,
  };
}

/**
 * Generates a Subclass Exception or differentiating MOA question (MCQ mode).
 */
export function generateSubclassExceptionQuestion(
  drug: TopDrugEntry,
  monograph: TopDrugClinicalMonograph,
  profile: TopDrugClassProfile | null,
  siblings: TopDrugEntry[],
  fallbackPool: TopDrugEntry[],
  rng: () => number,
  attemptIndex: number
): ClinicalPreflipQuestion {
  const qId = `except-${normalizeString(drug.genericName)}-${attemptIndex}`;

  const drugExceptions = getDrugExceptions(drug.genericName);
  const options: ClinicalPreflipOption[] = [];
  const usedTexts = new Set<string>();

  // Case A: Drug has curated exceptions in classProfiles.ts
  if (profile && drugExceptions.length > 0) {
    const chosenException = cleanOptionText(shuffle(drugExceptions, rng)[0]);
    usedTexts.add(chosenException.toLowerCase());

    options.push({
      id: `${qId}-opt-${options.length}`,
      text: chosenException,
      isCorrect: true,
      explanation: `High-yield differentiator for ${drug.genericName}: ${chosenException}`,
    });

    // Harvest sibling drug exceptions from same profile
    for (const [siblingName, exceptions] of Object.entries(profile.exceptionsByDrug)) {
      if (options.length >= 4) break;
      if (siblingName.toLowerCase().trim() === drug.genericName.toLowerCase().trim()) continue;
      for (const exc of exceptions) {
        const cleaned = cleanOptionText(exc);
        const lower = cleaned.toLowerCase();
        if (!usedTexts.has(lower)) {
          usedTexts.add(lower);
          options.push({
            id: `${qId}-opt-${options.length}`,
            text: cleaned,
            isCorrect: false,
            explanation: `Distinctive feature of ${siblingName}, not ${drug.genericName}.`,
          });
          break;
        }
      }
    }

    // If still need options, harvest from other class profiles or siblings
    const distractorCandidates = [...siblings, ...fallbackPool];
    for (const candidate of distractorCandidates) {
      if (options.length >= 4) break;
      const candExceptions = getDrugExceptions(candidate.genericName);
      if (candExceptions.length > 0) {
        const cleaned = cleanOptionText(candExceptions[0]);
        const lower = cleaned.toLowerCase();
        if (!usedTexts.has(lower)) {
          usedTexts.add(lower);
          options.push({
            id: `${qId}-opt-${options.length}`,
            text: cleaned,
            isCorrect: false,
            explanation: `Distinctive clinical feature of ${candidate.genericName}, not ${drug.genericName}.`,
          });
        }
      }
    }

    // Emergency fallback differentiators
    const emergencyDifferentiators = [
      `Hydrophilic agent eliminated via sulfation; lowest cytochrome P450 interaction risk in class`,
      `Extensively metabolized by CYP3A4 with strict 80 mg daily dose ceiling due to rhabdomyolysis`,
      `Lipophilic prodrug requiring administration with evening meal to optimize oral absorption`,
      `Non-renally eliminated; primary hepatic clearance requiring no dose adjustment in CKD`,
    ];
    for (const fallback of emergencyDifferentiators) {
      if (options.length >= 4) break;
      const lower = fallback.toLowerCase();
      if (!usedTexts.has(lower)) {
        usedTexts.add(lower);
        options.push({
          id: `${qId}-opt-${options.length}`,
          text: fallback,
          isCorrect: false,
          explanation: `Clinical differentiator for another member drug, not ${drug.genericName}.`,
        });
      }
    }

    const shuffledOptions = shuffle(options, rng).map((opt, idx) => ({
      ...opt,
      id: `${qId}-opt-${idx}`,
    }));

    return {
      id: qId,
      domain: 'subclass-exceptions',
      type: 'mcq',
      prompt: `Which of the following is a key differentiating clinical exception or distinctive characteristic of ${drug.genericName} within the ${profile.className} class?`,
      options: shuffledOptions,
      explanation: `Key exception for ${drug.genericName}: ${chosenException}.`,
    };
  }

  // Case B: Drug without curated exceptions or unprofiled drug -> Test specific subclass / MOA
  const correctMoa = cleanOptionText(
    `${drug.specificPharmacologicClass || drug.broadPharmacologicClass}: ${monograph.mechanismOfAction.split('.')[0]}.`
  );
  usedTexts.add(correctMoa.toLowerCase());

  options.push({
    id: `${qId}-opt-${options.length}`,
    text: correctMoa,
    isCorrect: true,
    explanation: `Defining pharmacologic classification and mechanism for ${drug.genericName}.`,
  });

  const distractorCandidates = [...siblings, ...fallbackPool];
  for (const candidate of distractorCandidates) {
    if (options.length >= 4) break;
    const candMono = resolveTopDrugClinicalMonograph(candidate);
    const distractorMoa = cleanOptionText(
      `${candidate.specificPharmacologicClass || candidate.broadPharmacologicClass}: ${candMono.mechanismOfAction.split('.')[0]}.`
    );
    const lower = distractorMoa.toLowerCase();
    if (!usedTexts.has(lower)) {
      usedTexts.add(lower);
      options.push({
        id: `${qId}-opt-${options.length}`,
        text: distractorMoa,
        isCorrect: false,
        explanation: `Mechanism of action of ${candidate.genericName} (${candidate.broadPharmacologicClass}).`,
      });
    }
  }

  const shuffledOptions = shuffle(options, rng).map((opt, idx) => ({
    ...opt,
    id: `${qId}-opt-${idx}`,
  }));

  return {
    id: qId,
    domain: 'subclass-exceptions',
    type: 'mcq',
    prompt: `Which of the following best describes the specific pharmacologic subclass and mechanism of action for ${drug.genericName}?`,
    options: shuffledOptions,
    explanation: `Correct pharmacologic mechanism: ${correctMoa}.`,
  };
}

/**
 * Generates a Dosing Pearls / Clinical Counseling question (MCQ mode).
 */
export function generateDosingPearlsQuestion(
  drug: TopDrugEntry,
  monograph: TopDrugClinicalMonograph,
  siblings: TopDrugEntry[],
  fallbackPool: TopDrugEntry[],
  rng: () => number,
  attemptIndex: number
): ClinicalPreflipQuestion {
  const qId = `pearls-${normalizeString(drug.genericName)}-${attemptIndex}`;

  const targetPearls = (
    monograph.administrationAndCounseling.length > 0
      ? monograph.administrationAndCounseling
      : monograph.dosingRegimens.length > 0
        ? monograph.dosingRegimens
        : [
            `Take consistently with water; do not abruptly discontinue without provider consultation`,
            `Monitor baseline and periodic therapeutic response and clinical lab parameters`,
          ]
  ).map((p) => cleanOptionText(p));

  const targetCleanSet = new Set(targetPearls.map((p) => p.toLowerCase()));
  const chosenCorrect = shuffle(targetPearls, rng)[0];

  const options: ClinicalPreflipOption[] = [];
  const usedTexts = new Set<string>();

  usedTexts.add(chosenCorrect.toLowerCase());
  options.push({
    id: `${qId}-opt-${options.length}`,
    text: chosenCorrect,
    isCorrect: true,
    explanation: `Essential counseling/administration pearl for ${drug.genericName}.`,
  });

  // Harvest distractors from siblings and fallback pool
  const distractorCandidates = [...siblings, ...fallbackPool];
  for (const candidate of distractorCandidates) {
    if (options.length >= 4) break;
    const candMono = resolveTopDrugClinicalMonograph(candidate);
    const candPearls = candMono.administrationAndCounseling || [];

    for (const pearl of candPearls) {
      const cleaned = cleanOptionText(pearl);
      const lower = cleaned.toLowerCase();
      if (!targetCleanSet.has(lower) && !usedTexts.has(lower)) {
        usedTexts.add(lower);
        options.push({
          id: `${qId}-opt-${options.length}`,
          text: cleaned,
          isCorrect: false,
          explanation: `Counseling pearl specific to ${candidate.genericName}, not ${drug.genericName}.`,
        });
        break;
      }
    }
  }

  // Emergency distractor fallback
  const emergencyPearls = [
    `Take with the first bite of each main meal to delay carbohydrate absorption`,
    `Rinse mouth thoroughly with water and spit after each inhalation to prevent oral candidiasis`,
    `Remain upright for at least 30 minutes following administration with 8 oz of plain water`,
    `Administer in the evening before bedtime; take consistently with or without food`,
  ];
  for (const fallback of emergencyPearls) {
    if (options.length >= 4) break;
    const lower = fallback.toLowerCase();
    if (!targetCleanSet.has(lower) && !usedTexts.has(lower)) {
      usedTexts.add(lower);
      options.push({
        id: `${qId}-opt-${options.length}`,
        text: fallback,
        isCorrect: false,
        explanation: `General counseling distractor; not primarily applicable to ${drug.genericName}.`,
      });
    }
  }

  const shuffledOptions = shuffle(options, rng).map((opt, idx) => ({
    ...opt,
    id: `${qId}-opt-${idx}`,
  }));

  return {
    id: qId,
    domain: 'dosing-pearls',
    type: 'mcq',
    prompt: `Which of the following is an essential administration or clinical counseling pearl for ${drug.genericName}?`,
    options: shuffledOptions,
    explanation: `Key administration pearl: ${chosenCorrect}.`,
  };
}

/**
 * Main Question Generator Entry Point
 *
 * Deterministically generates a pre-flip clinical micro-drill for a drug
 * rotating round-robin across the active domains.
 */
export function generateClinicalPreflipQuestion(
  drugName: string,
  activeDomains: ClinicalQuestionDomain[],
  attemptIndex = 0
): ClinicalPreflipQuestion | null {
  if (!drugName || typeof drugName !== 'string') {
    return null;
  }
  if (!activeDomains || activeDomains.length === 0) {
    return null;
  }

  const entry = getTopDrugTaxonomyEntry(drugName);
  if (!entry) {
    return null;
  }

  const monograph = resolveTopDrugClinicalMonograph(entry);
  const profile = resolveClassProfileForDrug(entry.genericName);
  const { siblings, fallbackPool } = getSiblingsAndFallbackPool(entry);

  // Deterministic round-robin domain selection
  const safeAttempt = Math.abs(attemptIndex);
  const selectedDomain = activeDomains[safeAttempt % activeDomains.length];

  // Seed deterministic PRNG with drug, domain, and attemptIndex
  const rng = createDeterministicRng(
    `${entry.genericName}:${selectedDomain}:${attemptIndex}`
  );

  switch (selectedDomain) {
    case 'brand-names':
      return generateBrandQuestion(
        entry,
        monograph,
        siblings,
        fallbackPool,
        rng,
        attemptIndex
      );
    case 'contraindications':
      return generateContraindicationQuestion(
        entry,
        monograph,
        siblings,
        fallbackPool,
        rng,
        attemptIndex
      );
    case 'adverse-effects':
      return generateAdverseEffectsQuestion(
        entry,
        monograph,
        siblings,
        fallbackPool,
        rng,
        attemptIndex
      );
    case 'subclass-exceptions':
      return generateSubclassExceptionQuestion(
        entry,
        monograph,
        profile,
        siblings,
        fallbackPool,
        rng,
        attemptIndex
      );
    case 'dosing-pearls':
      return generateDosingPearlsQuestion(
        entry,
        monograph,
        siblings,
        fallbackPool,
        rng,
        attemptIndex
      );
    default:
      return null;
  }
}
