import type { ChemicalStructure } from './reviewModule';

/**
 * Question types supported by the Cumulative Practice drills:
 * - case-to-structures (Type A): Patient Case / Desired Effect -> 3-5 candidates
 * - structure-to-effects (Type B): Single Blinded Structure -> multiple physiological statements
 * - comparative-sar (Type C): 3-5 candidates compared on biochemical/physiological SAR property
 * - contraindication-risk (Type D): Organ impairment / clearance risk -> 3-5 candidates
 */
export type CumulativeQuestionType =
  | 'case-to-structures'
  | 'structure-to-effects'
  | 'comparative-sar'
  | 'contraindication-risk';

/**
 * Individual statement evaluated in Type B (structure-to-effects) questions.
 */
export interface PhysiologicalEffectStatement {
  id: string;
  statement: string;
  isCorrect: boolean;
  rationale: string;
}

/**
 * Core model for a cumulative cross-curriculum practice question.
 */
export interface CumulativeQuestion {
  id: string;
  type: CumulativeQuestionType;
  moduleIds: string[]; // Originating modules represented in the question
  stem: string;
  // For Types A, C, D: 3 to 5 candidate structures
  candidateStructures?: ChemicalStructure[];
  correctStructureIds?: string[];
  // For Type B: Single prominent structure + multiple effect statements
  singleStructure?: ChemicalStructure;
  effectStatements?: PhysiologicalEffectStatement[];
  // Rationales & Pearls
  rationales: Record<string, string>;
  highYieldPearl?: string;
}

/**
 * Flashcard learning state according to the spaced-repetition engine.
 */
export type FlashcardState = 'new' | 'learning' | 'review' | 'mastered';

/**
 * User rating choices for spaced-repetition grading.
 */
export type SpacedRepetitionRating = 'again' | 'hard' | 'good' | 'easy';

/**
 * Configured interval durations in minutes.
 * - Again: 1 min (< 1 min)
 * - Hard: 4 min
 * - Good: 10 min
 * - Easy: 1440 min (1 day)
 */
export interface SpacedRepetitionIntervals {
  again: number;
  hard: number;
  good: number;
  easy: number;
}

export const SPACED_REPETITION_INTERVALS: SpacedRepetitionIntervals = {
  again: 1,
  hard: 4,
  good: 10,
  easy: 1440,
};

/**
 * Model representing an active or suspended structure flashcard.
 */
export interface FlashcardItem {
  structureId: string;
  drugName: string;
  moduleIds: string[];
  structure: ChemicalStructure;
  intervalMinutes: number;
  dueTimestamp: number;
  repetitionCount: number;
  state: FlashcardState;
  isSuspended: boolean;
  struggleCount: number;
}

/**
 * Interactive selection and grading state for candidate structures or statements.
 */
export interface CandidateSelectionState {
  id: string;
  isSelected: boolean;
  status?: 'unanswered' | 'correct' | 'incorrect' | 'missed';
  isCorrect?: boolean;
}

/**
 * Diagnostic record for a structure that the student struggled with.
 */
export interface StruggleItem {
  structureId: string;
  drugName: string;
  moduleIds: string[];
  pharmacologicalClass?: string;
  chemicalClass?: string;
  structure?: ChemicalStructure;
  struggleCount: number;
  reason?: string;
  lastEncountered?: number;
}

/**
 * Class-by-class performance summary for post-session diagnostics.
 */
export interface ClassRecallBreakdown {
  className: string;
  recallRate: number; // 0 - 100 percentage
  total: number;
  correct: number;
}

/**
 * Result breakdown for a single question evaluation.
 */
export interface QuestionScoreResult {
  scorePercentage: number;
  truePositives: string[];
  falsePositives: string[];
  falseNegatives: string[];
}

/**
 * Comprehensive diagnostic struggle report generated after drills or flashcards.
 */
export interface StruggleDiagnosticReport {
  scorePercentage: number;
  totalItemsReviewed: number;
  struggledStructures: StruggleItem[];
  classBreakdown: ClassRecallBreakdown[];
  primaryStrugglePatterns?: string[];
  generatedAt?: number;
}
