import type {
  CumulativeQuestion,
  FlashcardItem,
  QuestionScoreResult,
  StruggleDiagnosticReport,
  StruggleItem,
  ClassRecallBreakdown,
} from '../types/cumulativeStudy';
import type { ChemicalStructure } from '../types/reviewModule';

/**
 * Parameters for generating a post-session diagnostic struggle report.
 */
export interface GenerateStruggleReportParams {
  sessionType?: 'practice-test' | 'flashcards';
  questionResults?: Array<{ question: CumulativeQuestion; selectedIds: string[] }>;
  flashcardHistory?: FlashcardItem[];
}

/**
 * Resolves the ground-truth correct IDs for a cumulative question.
 * - For Type B (structure-to-effects): Identifies statements where `isCorrect === true`.
 * - For Types A, C, D: Returns `correctStructureIds`.
 */
function getCorrectIdsForQuestion(question: CumulativeQuestion): string[] {
  if (
    question.type === 'structure-to-effects' &&
    Array.isArray(question.effectStatements) &&
    question.effectStatements.length > 0
  ) {
    return question.effectStatements
      .filter((stmt) => stmt.isCorrect)
      .map((stmt) => stmt.id);
  }

  if (Array.isArray(question.correctStructureIds) && question.correctStructureIds.length > 0) {
    return question.correctStructureIds;
  }

  if (Array.isArray(question.effectStatements) && question.effectStatements.length > 0) {
    return question.effectStatements
      .filter((stmt) => stmt.isCorrect)
      .map((stmt) => stmt.id);
  }

  return [];
}

/**
 * Calculates partial credit scoring for a multi-select cumulative question.
 *
 * Scoring Formula:
 * - True Positives (TP): correct candidate structures or correct effect statements selected
 * - False Positives (FP): incorrect candidate structures or false effect statements selected
 * - False Negatives (FN): correct items omitted
 * - Total True: Math.max(1, correctItems.length) (guards against division by zero)
 * - scorePercentage: Math.max(0, Math.round(((TP.length - FP.length) / totalTrue) * 100))
 */
export function calculateQuestionScore(
  question: CumulativeQuestion,
  selectedIds: string[]
): QuestionScoreResult {
  const sanitizedSelected = Array.from(new Set(selectedIds || []));
  const correctIds = getCorrectIdsForQuestion(question);
  const correctSet = new Set(correctIds);

  const truePositives = sanitizedSelected.filter((id) => correctSet.has(id));
  const falsePositives = sanitizedSelected.filter((id) => !correctSet.has(id));
  const falseNegatives = correctIds.filter((id) => !sanitizedSelected.includes(id));

  const totalTrue = Math.max(1, correctIds.length);
  const rawScore = ((truePositives.length - falsePositives.length) / totalTrue) * 100;
  const scorePercentage = Math.max(0, Math.round(rawScore));

  return {
    scorePercentage,
    truePositives,
    falsePositives,
    falseNegatives,
  };
}

/**
 * Alias for calculateQuestionScore for partial credit evaluation.
 */
export const calculateQuestionPartialCredit = calculateQuestionScore;

/**
 * Evaluates student performance across practice questions and/or flashcards to produce
 * a comprehensive diagnostic struggle report.
 *
 * Features:
 * - Practice Test: Attributes struggle to false negatives and false positives.
 * - Flashcards: Attributes struggle to cards with `struggleCount > 0` or 'again'/'hard' ratings.
 * - Computes weakest pharmacological and chemical classes (`weakestClasses`).
 * - Gathers unique structure IDs (`remediationCandidateIds`) for targeted remediation drills.
 */
export function generateStruggleReport(
  paramsOrResults?: GenerateStruggleReportParams | Array<{ question: CumulativeQuestion; selectedIds: string[] }>,
  maybeFlashcards?: FlashcardItem[]
): StruggleDiagnosticReport {
  let sessionType: 'practice-test' | 'flashcards' = 'practice-test';
  let questionResults: Array<{ question: CumulativeQuestion; selectedIds: string[] }> = [];
  let flashcardHistory: FlashcardItem[] = [];

  if (Array.isArray(paramsOrResults)) {
    questionResults = paramsOrResults;
    flashcardHistory = maybeFlashcards || [];
    sessionType = questionResults.length > 0 ? 'practice-test' : 'flashcards';
  } else if (paramsOrResults && typeof paramsOrResults === 'object') {
    questionResults = paramsOrResults.questionResults || [];
    flashcardHistory = paramsOrResults.flashcardHistory || [];
    sessionType =
      paramsOrResults.sessionType ||
      (questionResults.length > 0 ? 'practice-test' : 'flashcards');
  }

  const struggledMap = new Map<string, StruggleItem>();
  const classStats = new Map<string, { total: number; correct: number }>();

  let totalPracticeScore = 0;
  let falsePositivesCount = 0;
  let falseNegativesCount = 0;

  const attributeStruggle = (
    structureId: string,
    drugName: string,
    moduleIds: string[],
    pharmacologicalClass?: string,
    chemicalClass?: string,
    structure?: ChemicalStructure,
    reason?: string,
    struggleIncrement: number = 1
  ) => {
    if (!structureId) return;

    const existing = struggledMap.get(structureId);
    if (existing) {
      existing.struggleCount += struggleIncrement;
      if (!existing.structure && structure) existing.structure = structure;
      if (!existing.pharmacologicalClass && pharmacologicalClass) {
        existing.pharmacologicalClass = pharmacologicalClass;
      }
      if (!existing.chemicalClass && chemicalClass) {
        existing.chemicalClass = chemicalClass;
      }
      if (moduleIds.length > 0) {
        existing.moduleIds = Array.from(new Set([...existing.moduleIds, ...moduleIds]));
      }
    } else {
      struggledMap.set(structureId, {
        structureId,
        drugName,
        moduleIds: [...moduleIds],
        pharmacologicalClass,
        chemicalClass,
        structure,
        struggleCount: struggleIncrement,
        reason,
        lastEncountered: Date.now(),
      });
    }
  };

  const recordClassEvaluation = (className: string | undefined, isCorrect: boolean) => {
    const key = className && className.trim().length > 0 ? className.trim() : 'Unclassified';
    const current = classStats.get(key) || { total: 0, correct: 0 };
    current.total += 1;
    if (isCorrect) {
      current.correct += 1;
    }
    classStats.set(key, current);
  };

  // 1. Process Practice Test Questions
  for (const { question, selectedIds } of questionResults) {
    const scoreResult = calculateQuestionScore(question, selectedIds);
    totalPracticeScore += scoreResult.scorePercentage;
    falsePositivesCount += scoreResult.falsePositives.length;
    falseNegativesCount += scoreResult.falseNegatives.length;

    // Track class breakdown for candidate structures (Types A, C, D)
    if (Array.isArray(question.candidateStructures) && question.candidateStructures.length > 0) {
      const correctSet = new Set(question.correctStructureIds || []);
      const selectedSet = new Set(selectedIds || []);

      for (const candidate of question.candidateStructures) {
        const isTarget = correctSet.has(candidate.id);
        const wasSelected = selectedSet.has(candidate.id);
        const candidateCorrect = isTarget ? wasSelected : !wasSelected;
        const className = candidate.pharmacologicalClass || candidate.chemicalClass;
        recordClassEvaluation(className, candidateCorrect);
      }
    } else if (question.singleStructure) {
      // Type B Question
      const isPerfect =
        scoreResult.falsePositives.length === 0 && scoreResult.falseNegatives.length === 0;
      const className =
        question.singleStructure.pharmacologicalClass || question.singleStructure.chemicalClass;
      recordClassEvaluation(className, isPerfect);
    }

    // Attribute struggle for False Negatives (omissions)
    for (const fnId of scoreResult.falseNegatives) {
      if (question.type === 'structure-to-effects' && question.singleStructure) {
        attributeStruggle(
          question.singleStructure.id,
          question.singleStructure.name || question.singleStructure.id,
          question.moduleIds || [],
          question.singleStructure.pharmacologicalClass,
          question.singleStructure.chemicalClass,
          question.singleStructure,
          `Missed physiological effect statement(s) for ${question.singleStructure.name}`
        );
      } else {
        const candidate = question.candidateStructures?.find(
          (c) => c.id === fnId || c.name === fnId || c.document_label === fnId
        );
        attributeStruggle(
          fnId,
          candidate?.name || candidate?.document_label || fnId,
          question.moduleIds || [],
          candidate?.pharmacologicalClass,
          candidate?.chemicalClass,
          candidate,
          `Missed target SAR candidate: ${candidate?.name || fnId}`
        );
      }
    }

    // Attribute struggle for False Positives (distractor selections)
    for (const fpId of scoreResult.falsePositives) {
      if (question.type === 'structure-to-effects' && question.singleStructure) {
        attributeStruggle(
          question.singleStructure.id,
          question.singleStructure.name || question.singleStructure.id,
          question.moduleIds || [],
          question.singleStructure.pharmacologicalClass,
          question.singleStructure.chemicalClass,
          question.singleStructure,
          `Selected false physiological effect statement(s) for ${question.singleStructure.name}`
        );
      } else {
        const candidate = question.candidateStructures?.find(
          (c) => c.id === fpId || c.name === fpId || c.document_label === fpId
        );
        attributeStruggle(
          fpId,
          candidate?.name || candidate?.document_label || fpId,
          question.moduleIds || [],
          candidate?.pharmacologicalClass,
          candidate?.chemicalClass,
          candidate,
          `Incorrectly selected distractor candidate: ${candidate?.name || fpId}`
        );
      }
    }
  }

  // 2. Process Flashcard History
  let flashcardStrugglesCount = 0;
  let flashcardCleanCount = 0;

  for (const card of flashcardHistory) {
    const isClean = card.struggleCount === 0;
    if (isClean) {
      flashcardCleanCount += 1;
    } else {
      flashcardStrugglesCount += 1;
    }

    const className = card.structure?.pharmacologicalClass || card.structure?.chemicalClass;
    recordClassEvaluation(className, isClean);

    if (card.struggleCount > 0) {
      attributeStruggle(
        card.structureId || card.structure?.id || card.drugName,
        card.drugName || card.structure?.name || card.structureId,
        card.moduleIds || [],
        card.structure?.pharmacologicalClass,
        card.structure?.chemicalClass,
        card.structure,
        `Struggled with structural recall (${card.struggleCount} review attempt${
          card.struggleCount > 1 ? 's' : ''
        })`,
        card.struggleCount
      );
    }
  }

  // 3. Compute Scores & Metrics
  let totalItemsReviewed = 0;
  let scorePercentage = 0;

  if (sessionType === 'flashcards') {
    totalItemsReviewed = flashcardHistory.length;
    scorePercentage =
      totalItemsReviewed > 0 ? Math.round((flashcardCleanCount / totalItemsReviewed) * 100) : 0;
  } else if (sessionType === 'practice-test') {
    totalItemsReviewed = questionResults.length;
    scorePercentage =
      totalItemsReviewed > 0 ? Math.round(totalPracticeScore / totalItemsReviewed) : 0;
  } else {
    totalItemsReviewed = questionResults.length + flashcardHistory.length;
    const totalScorePoints = totalPracticeScore + flashcardCleanCount * 100;
    scorePercentage =
      totalItemsReviewed > 0 ? Math.round(totalScorePoints / totalItemsReviewed) : 0;
  }

  // 4. Class Recall Breakdown & Weakest Classes
  const classBreakdown: ClassRecallBreakdown[] = Array.from(classStats.entries())
    .map(([className, stats]) => ({
      className,
      total: stats.total,
      correct: stats.correct,
      recallRate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }))
    .sort((a, b) => a.recallRate - b.recallRate || b.total - a.total);

  const weakestClasses = classBreakdown
    .filter((c) => c.recallRate < 100)
    .map((c) => c.className);

  const struggledStructures = Array.from(struggledMap.values());
  const remediationCandidateIds = Array.from(
    new Set(struggledStructures.map((item) => item.structureId).filter(Boolean))
  );

  // 5. Generate Primary Struggle Patterns
  const primaryStrugglePatterns: string[] = [];

  if (weakestClasses.length > 0) {
    primaryStrugglePatterns.push(
      `Lowest recall observed in: ${weakestClasses.slice(0, 3).join(', ')}`
    );
  }

  if (falsePositivesCount > 0) {
    primaryStrugglePatterns.push(
      `Distractor confusion identified: ${falsePositivesCount} distractor structure(s) or false statement(s) erroneously selected`
    );
  }

  if (falseNegativesCount > 0) {
    primaryStrugglePatterns.push(
      `Omission of target SAR structures: ${falseNegativesCount} required structure(s) omitted`
    );
  }

  if (flashcardStrugglesCount > 0) {
    primaryStrugglePatterns.push(
      `Flashcard recall friction: ${flashcardStrugglesCount} structure(s) required repeated review`
    );
  }

  if (primaryStrugglePatterns.length === 0 && totalItemsReviewed > 0) {
    primaryStrugglePatterns.push(
      'Mastery demonstrated: 100% recall with no significant struggle patterns detected'
    );
  }

  return {
    scorePercentage,
    totalItemsReviewed,
    struggledStructures,
    classBreakdown,
    weakestClasses,
    remediationCandidateIds,
    primaryStrugglePatterns,
    generatedAt: Date.now(),
  };
}
