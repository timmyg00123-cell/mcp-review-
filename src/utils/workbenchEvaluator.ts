import {
  StructuralWorkbenchAnswer,
  StructuralWorkbenchData,
} from '../types/reviewModule';

export interface WorkbenchStepScores {
  score2a: number; // 0 or 1
  score2b: number; // 0 or 1
  score2c: number; // 0 or 1
  score2d: number; // 0 or 1
  totalScore: number; // 0 to 4
  is2aComplete: boolean;
  is2bComplete: boolean;
  is2cComplete: boolean;
  is2dComplete: boolean;
  isAllComplete: boolean;
}

/**
 * Pure evaluator for StructuralWorkbench question scoring.
 * 4 points total:
 * - 2a: 1 pt if all correct amides selected and 0 distractors selected.
 * - 2b: 1 pt if all correct prodrugs selected and 0 distractors selected.
 * - 2c: 1 pt if all drop zones have correct badge.
 * - 2d: 1 pt if active form candidate selected.
 */
export function evaluateWorkbenchAnswer(
  data: StructuralWorkbenchData,
  answer: StructuralWorkbenchAnswer
): WorkbenchStepScores {
  // Step 2a: Amides
  const correctAmideIds = new Set(
    data.step2a_amides.targets.filter((t) => t.isCorrect).map((t) => t.id)
  );
  const distractorAmideIds = new Set(
    data.step2a_amides.targets.filter((t) => !t.isCorrect).map((t) => t.id)
  );
  const selectedAmides = new Set(answer.selectedAmideIds);

  const hasAllCorrectAmides =
    correctAmideIds.size > 0 &&
    Array.from(correctAmideIds).every((id) => selectedAmides.has(id));
  const hasNoAmideDistractors = !Array.from(distractorAmideIds).some((id) =>
    selectedAmides.has(id)
  );
  const score2a = hasAllCorrectAmides && hasNoAmideDistractors ? 1 : 0;
  const is2aComplete = selectedAmides.size >= correctAmideIds.size;

  // Step 2b: Prodrug Moieties
  const correctMoietyIds = new Set(
    data.step2b_moieties.targets.filter((t) => t.isCorrect).map((t) => t.id)
  );
  const distractorMoietyIds = new Set(
    data.step2b_moieties.targets.filter((t) => !t.isCorrect).map((t) => t.id)
  );
  const selectedMoieties = new Set(answer.selectedMoietyIds);

  const hasAllCorrectMoieties =
    correctMoietyIds.size > 0 &&
    Array.from(correctMoietyIds).every((id) => selectedMoieties.has(id));
  const hasNoMoietyDistractors = !Array.from(distractorMoietyIds).some((id) =>
    selectedMoieties.has(id)
  );
  const score2b = hasAllCorrectMoieties && hasNoMoietyDistractors ? 1 : 0;
  const is2bComplete = selectedMoieties.size >= correctMoietyIds.size;

  // Step 2c: Drag & Drop Nature
  const dropZones = data.step2c_nature.dropZones;
  const hasAllZonesAssigned = dropZones.every(
    (dz) => !!answer.dropZoneAssignments[dz.id]
  );
  const isAllZonesCorrect =
    dropZones.length > 0 &&
    dropZones.every(
      (dz) => answer.dropZoneAssignments[dz.id] === dz.correctBadge
    );
  const score2c = isAllZonesCorrect ? 1 : 0;
  const is2cComplete = hasAllZonesAssigned;

  // Step 2d: Active Form Candidate
  const correctCandidate = data.step2d_activeForm.candidates.find(
    (c) => c.isCorrect
  );
  const score2d =
    correctCandidate && answer.selectedCandidateId === correctCandidate.id
      ? 1
      : 0;
  const is2dComplete = answer.selectedCandidateId !== null;

  const totalScore = score2a + score2b + score2c + score2d;
  const isAllComplete = is2aComplete && is2bComplete && is2cComplete && is2dComplete;

  return {
    score2a,
    score2b,
    score2c,
    score2d,
    totalScore,
    is2aComplete,
    is2bComplete,
    is2cComplete,
    is2dComplete,
    isAllComplete,
  };
}
