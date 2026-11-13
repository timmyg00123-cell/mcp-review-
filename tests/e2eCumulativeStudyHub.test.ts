// tests/e2eCumulativeStudyHub.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import { harvestCumulativeFlashcards } from '../src/utils/cumulativeStructureHarvester';
import {
  processReviewRating,
  applySpacedRepetitionGrade,
} from '../src/utils/spacedRepetitionService';
import {
  calculateQuestionPartialCredit,
  calculateQuestionScore,
  generateStruggleReport,
} from '../src/utils/struggleDiagnosticService';
import {
  getCumulativeQuestionBank,
  CUMULATIVE_QUESTIONS,
} from '../src/data/cumulativeQuizData';
import {
  getTop200Flashcards,
  getTherapeuticCategoriesForCards,
} from '../src/utils/topDrugsTaxonomy';
import { getPharmacophoresForStructure } from '../src/utils/pharmacophoreData';
import type {
  CumulativeQuestion,
  FlashcardItem,
  SpacedRepetitionRating,
} from '../src/types/cumulativeStudy';

console.log('Running End-to-End Cumulative Study Hub Integration Workflow Test...\n');

// ============================================================================
// Step 1: Harvest Cumulative Flashcards across Curriculum Modules
// ============================================================================
console.log('Step 1: Harvesting cumulative flashcards...');
const harvestedCards: FlashcardItem[] = harvestCumulativeFlashcards();

assert.ok(Array.isArray(harvestedCards), 'harvestCumulativeFlashcards must return an array');
assert.ok(
  harvestedCards.length >= 25,
  `Harvested cards count (${harvestedCards.length}) should be at least 25 cross-curriculum structures`
);

// Verify deduplication and identifier integrity
const uniqueIds = new Set(harvestedCards.map((c) => c.structureId));
assert.strictEqual(
  uniqueIds.size,
  harvestedCards.length,
  'All harvested flashcards must have strictly unique structureIds'
);

// Verify module lineage includes landmark curriculum modules
const representedModules = new Set<string>();
harvestedCards.forEach((c) => {
  assert.ok(c.drugName && c.drugName.trim().length > 0, `Card ${c.structureId} must have drugName`);
  assert.ok(c.structure && c.structure.id, `Card ${c.structureId} must have chemical structure`);
  assert.ok(Array.isArray(c.moduleIds) && c.moduleIds.length > 0, `Card ${c.structureId} must have moduleIds`);
  assert.strictEqual(c.state, 'new', `Harvested card ${c.structureId} must start in "new" state`);
  assert.strictEqual(c.struggleCount, 0, `Harvested card ${c.structureId} must start with struggleCount 0`);
  c.moduleIds.forEach((m) => representedModules.add(m));
});

assert.ok(
  representedModules.has('antiplatelets_mcp2') || representedModules.has('antiplatelet'),
  'Must represent antiplatelet module'
);
assert.ok(
  representedModules.has('anticoagulants_mcp2') || representedModules.has('anticoagulants'),
  'Must represent anticoagulants module'
);
assert.ok(
  representedModules.has('heart_failure_mcp2') || representedModules.has('heartFailure'),
  'Must represent heart failure module'
);
assert.ok(
  representedModules.has('antiarrhythmics_mcp2') || representedModules.has('antiarrhythmic'),
  'Must represent antiarrhythmic module'
);
console.log(`✓ Harvested ${harvestedCards.length} unique cards across ${representedModules.size} modules.\n`);

// ============================================================================
// Step 2: Spaced Repetition Rating Progression (Again, Hard, Good, Easy)
// ============================================================================
console.log('Step 2: Simulating Anki-style spaced repetition rating progression...');
assert.strictEqual(
  processReviewRating,
  applySpacedRepetitionGrade,
  'processReviewRating should be exported as alias to applySpacedRepetitionGrade'
);

const now = 1700000000000;
const [cardAgain, cardHard, cardGood, cardEasy] = harvestedCards.slice(0, 4);

// 2a. Rating: 'again' -> <1m interval, increments struggle, learning state, re-queues at end
const againResult = processReviewRating(cardAgain, 'again', now);
assert.strictEqual(againResult.nextCardState.intervalMinutes, 1, 'Again rating interval must be 1 min');
assert.strictEqual(againResult.nextCardState.struggleCount, 1, 'Again rating must increment struggleCount');
assert.strictEqual(againResult.nextCardState.repetitionCount, 1, 'Again rating must increment repetitionCount');
assert.strictEqual(againResult.nextCardState.state, 'learning', 'Again rating state must be learning');
assert.strictEqual(againResult.reQueueOffset, -1, 'Again rating reQueueOffset must be -1 (end of queue)');
assert.strictEqual(againResult.nextCardState.dueTimestamp, now + 1 * 60 * 1000);

// 2b. Rating: 'hard' -> 4m interval, increments struggle, learning state, re-queues 3 cards back
const hardResult = processReviewRating(cardHard, 'hard', now);
assert.strictEqual(hardResult.nextCardState.intervalMinutes, 4, 'Hard rating interval must be 4 min');
assert.strictEqual(hardResult.nextCardState.struggleCount, 1, 'Hard rating must increment struggleCount');
assert.strictEqual(hardResult.nextCardState.repetitionCount, 1, 'Hard rating must increment repetitionCount');
assert.strictEqual(hardResult.nextCardState.state, 'learning', 'Hard rating state must be learning');
assert.strictEqual(hardResult.reQueueOffset, 3, 'Hard rating reQueueOffset must be 3');
assert.strictEqual(hardResult.nextCardState.dueTimestamp, now + 4 * 60 * 1000);

// 2c. Rating: 'good' -> 10m interval, struggle unchanged, review state, graduates (null offset)
const goodResult = processReviewRating(cardGood, 'good', now);
assert.strictEqual(goodResult.nextCardState.intervalMinutes, 10, 'Good rating interval must be 10 min');
assert.strictEqual(goodResult.nextCardState.struggleCount, 0, 'Good rating struggleCount must not increment');
assert.strictEqual(goodResult.nextCardState.repetitionCount, 1, 'Good rating must increment repetitionCount');
assert.strictEqual(goodResult.nextCardState.state, 'review', 'Good rating state must be review');
assert.strictEqual(goodResult.reQueueOffset, null, 'Good rating reQueueOffset must be null (graduates)');
assert.strictEqual(goodResult.nextCardState.dueTimestamp, now + 10 * 60 * 1000);

// 2d. Rating: 'easy' -> 1440m interval (1d), struggle unchanged, mastered state, graduates
const easyResult = processReviewRating(cardEasy, 'easy', now);
assert.strictEqual(easyResult.nextCardState.intervalMinutes, 1440, 'Easy rating interval must be 1440 min (1d)');
assert.strictEqual(easyResult.nextCardState.struggleCount, 0, 'Easy rating struggleCount must not increment');
assert.strictEqual(easyResult.nextCardState.repetitionCount, 1, 'Easy rating must increment repetitionCount');
assert.strictEqual(easyResult.nextCardState.state, 'mastered', 'Easy rating state must be mastered');
assert.strictEqual(easyResult.reQueueOffset, null, 'Easy rating reQueueOffset must be null (graduates)');
assert.strictEqual(easyResult.nextCardState.dueTimestamp, now + 1440 * 60 * 1000);

console.log('✓ All 4 spaced repetition rating progressions (Again, Hard, Good, Easy) verified.\n');

// ============================================================================
// Step 3: Flashcard Struggle Diagnostic Report Generation
// ============================================================================
console.log('Step 3: Compiling flashcard struggle history into struggle diagnostic report...');
const sessionCards: FlashcardItem[] = [
  againResult.nextCardState,
  hardResult.nextCardState,
  goodResult.nextCardState,
  easyResult.nextCardState,
];

const flashcardReport = generateStruggleReport({
  sessionType: 'flashcards',
  flashcardHistory: sessionCards,
});

assert.strictEqual(flashcardReport.totalItemsReviewed, 4, 'Total questions/cards evaluated must be 4');
assert.strictEqual(flashcardReport.scorePercentage, 50, '2/4 mastered or review should yield 50% score');
assert.strictEqual(flashcardReport.struggledStructures.length, 2, 'Must isolate exactly 2 struggled items');

const struggledDrugNames = flashcardReport.struggledStructures.map((item) => item.drugName);
assert.ok(struggledDrugNames.includes(cardAgain.drugName), 'Report must flag cardAgain as struggled');
assert.ok(struggledDrugNames.includes(cardHard.drugName), 'Report must flag cardHard as struggled');

assert.ok(
  Array.isArray(flashcardReport.remediationCandidateIds) && flashcardReport.remediationCandidateIds.length >= 2,
  'remediationCandidateIds must isolate candidates for remediation drills'
);
assert.ok(
  Array.isArray(flashcardReport.classBreakdown) && flashcardReport.classBreakdown.length > 0,
  'Report must contain class recall breakdown'
);
console.log(`✓ Flashcard report generated with ${flashcardReport.struggledStructures.length} struggled items and ${flashcardReport.remediationCandidateIds.length} drill candidates.\n`);

// ============================================================================
// Step 4: Cumulative Practice Test Question Evaluations (Types A, B, C, D)
// ============================================================================
console.log('Step 4: Evaluating Cumulative Practice Test question types with partial credit scoring...');
assert.strictEqual(
  calculateQuestionPartialCredit,
  calculateQuestionScore,
  'calculateQuestionPartialCredit should be exported as alias to calculateQuestionScore'
);

const bank = getCumulativeQuestionBank();
assert.ok(bank.length >= 8, 'Bank should have at least 8 questions');

const typeA = bank.find((q) => q.type === 'case-to-structures');
const typeB = bank.find((q) => q.type === 'structure-to-effects');
const typeC = bank.find((q) => q.type === 'comparative-sar');
const typeD = bank.find((q) => q.type === 'contraindication-risk');

assert.ok(typeA, 'Must have at least one Type A (case-to-structures) question');
assert.ok(typeB, 'Must have at least one Type B (structure-to-effects) question');
assert.ok(typeC, 'Must have at least one Type C (comparative-sar) question');
assert.ok(typeD, 'Must have at least one Type D (contraindication-risk) question');

// 4a. Type A (case-to-structures) evaluation
assert.ok(Array.isArray(typeA.candidateStructures) && typeA.candidateStructures.length >= 2);
assert.ok(Array.isArray(typeA.correctStructureIds) && typeA.correctStructureIds.length >= 1);
const typeACorrectIds = typeA.correctStructureIds;

// Perfect selection
const scoreAPerfect = calculateQuestionPartialCredit(typeA, typeACorrectIds);
assert.strictEqual(scoreAPerfect.scorePercentage, 100, 'Perfect Type A selection must be 100%');
assert.strictEqual(scoreAPerfect.falseNegatives.length, 0);
assert.strictEqual(scoreAPerfect.falsePositives.length, 0);

// Partial selection (omitting one correct structure if multiple, or selecting distractor)
const distractorsA = typeA.candidateStructures
  .map((s) => s.id)
  .filter((id) => !typeACorrectIds.includes(id));
assert.ok(distractorsA.length > 0, 'Type A question must have at least one distractor');

const scoreAWithDistractor = calculateQuestionPartialCredit(typeA, [
  ...typeACorrectIds,
  distractorsA[0],
]);
assert.ok(
  scoreAWithDistractor.scorePercentage < 100,
  'Selecting a distractor in Type A must deduct partial credit penalty'
);
assert.strictEqual(scoreAWithDistractor.falsePositives.length, 1);

// 4b. Type B (structure-to-effects) evaluation
assert.ok(typeB.singleStructure, 'Type B question must have singleStructure');
assert.ok(Array.isArray(typeB.effectStatements) && typeB.effectStatements.length >= 2);

const correctEffectIds = typeB.effectStatements.filter((e) => e.isCorrect).map((e) => e.id);
const incorrectEffectIds = typeB.effectStatements.filter((e) => !e.isCorrect).map((e) => e.id);
assert.ok(correctEffectIds.length >= 1, 'Type B question must have at least 1 correct statement');
assert.ok(incorrectEffectIds.length >= 1, 'Type B question must have at least 1 incorrect statement');

// Perfect selection
const scoreBPerfect = calculateQuestionPartialCredit(typeB, correctEffectIds);
assert.strictEqual(scoreBPerfect.scorePercentage, 100, 'Perfect Type B selection must be 100%');
assert.strictEqual(scoreBPerfect.truePositives.length, correctEffectIds.length);
assert.strictEqual(scoreBPerfect.falsePositives.length, 0);

// Incorrect selection with distractor
const scoreBWithDistractor = calculateQuestionPartialCredit(typeB, [
  correctEffectIds[0],
  incorrectEffectIds[0],
]);
assert.ok(
  scoreBWithDistractor.scorePercentage < 100,
  'Selecting false statement in Type B must reduce score'
);
assert.strictEqual(scoreBWithDistractor.falsePositives.length, 1);

// 4c. Type C (comparative-sar) evaluation
assert.ok(Array.isArray(typeC.correctStructureIds) && typeC.correctStructureIds.length >= 1);
const scoreC = calculateQuestionPartialCredit(typeC, typeC.correctStructureIds);
assert.strictEqual(scoreC.scorePercentage, 100, 'Perfect Type C selection must be 100%');

// 4d. Type D (contraindication-risk) evaluation
assert.ok(Array.isArray(typeD.correctStructureIds) && typeD.correctStructureIds.length >= 1);
const scoreD = calculateQuestionPartialCredit(typeD, typeD.correctStructureIds);
assert.strictEqual(scoreD.scorePercentage, 100, 'Perfect Type D selection must be 100%');

console.log('✓ All 4 question types (Types A, B, C, D) partial credit evaluations verified.\n');

// ============================================================================
// Step 5: Struggle Diagnostic Report Generation from Practice Test Results
// ============================================================================
console.log('Step 5: Generating diagnostic struggle report from practice test results...');

// Simulate test session: 2 perfect answers, 1 partial with false negative, 1 with distractor penalty
const testResults = [
  { question: typeA, selectedIds: [typeACorrectIds[0]] }, // partial / omitted
  { question: typeB, selectedIds: [correctEffectIds[0], incorrectEffectIds[0]] }, // distractor penalty
  { question: typeC, selectedIds: typeC.correctStructureIds }, // 100%
  { question: typeD, selectedIds: typeD.correctStructureIds }, // 100%
];

const testReport = generateStruggleReport({
  sessionType: 'practice-test',
  questionResults: testResults,
});

assert.strictEqual(testReport.totalItemsReviewed, 4);
assert.ok(testReport.scorePercentage > 0 && testReport.scorePercentage < 100, 'Score should reflect partial credit');
assert.ok(testReport.struggledStructures.length >= 1, 'Should isolate struggle items for questions with errors');
assert.ok(
  Array.isArray(testReport.remediationCandidateIds) && testReport.remediationCandidateIds.length >= 1,
  'remediationCandidateIds must be populated from test struggles'
);
assert.ok(
  Array.isArray(testReport.weakestClasses) && testReport.weakestClasses.length > 0,
  'Weakest classes must be identified'
);

console.log(`✓ Practice test diagnostic report: ${testReport.scorePercentage}% score, ${testReport.struggledStructures.length} struggles, ${testReport.remediationCandidateIds.length} candidate IDs.\n`);

// ============================================================================
// Step 6: 1-Click Remediation Candidate Isolation & Question Filtering
// ============================================================================
console.log('Step 6: Verifying 1-click remediation candidate isolation by filtering question bank...');

const remediationIds = testReport.remediationCandidateIds;
assert.ok(remediationIds.length > 0, 'Must have at least one remediation candidate ID');

const drillSet = new Set(remediationIds.map((id) => id.toLowerCase().trim()));

const isolatedDrillQuestions = bank.filter((q) => {
  // Check candidate structures (Types A, C, D)
  if (
    Array.isArray(q.candidateStructures) &&
    q.candidateStructures.some(
      (s) =>
        drillSet.has(s.id.toLowerCase().trim()) ||
        (s.name && drillSet.has(s.name.toLowerCase().trim())) ||
        (s.document_label && drillSet.has(s.document_label.toLowerCase().trim()))
    )
  ) {
    return true;
  }

  // Check single structure (Type B)
  if (
    q.singleStructure &&
    (drillSet.has(q.singleStructure.id.toLowerCase().trim()) ||
      (q.singleStructure.name && drillSet.has(q.singleStructure.name.toLowerCase().trim())) ||
      (q.singleStructure.document_label &&
        drillSet.has(q.singleStructure.document_label.toLowerCase().trim())))
  ) {
    return true;
  }

  // Check correct structure IDs
  if (
    Array.isArray(q.correctStructureIds) &&
    q.correctStructureIds.some((id) => drillSet.has(id.toLowerCase().trim()))
  ) {
    return true;
  }

  return false;
});

assert.ok(
  isolatedDrillQuestions.length > 0,
  'Remediation filter must isolate at least one question targeting struggled structures'
);
assert.ok(
  isolatedDrillQuestions.length <= bank.length,
  'Isolated drill questions must be a subset of the full question bank'
);

// Verify that every question in the isolated drill set actually addresses at least one struggled structure
isolatedDrillQuestions.forEach((q) => {
  const matchesCandidate =
    Array.isArray(q.candidateStructures) &&
    q.candidateStructures.some(
      (s) =>
        drillSet.has(s.id.toLowerCase().trim()) ||
        (s.name && drillSet.has(s.name.toLowerCase().trim())) ||
        (s.document_label && drillSet.has(s.document_label.toLowerCase().trim()))
    );

  const matchesSingle =
    !!q.singleStructure &&
    (drillSet.has(q.singleStructure.id.toLowerCase().trim()) ||
      (q.singleStructure.name && drillSet.has(q.singleStructure.name.toLowerCase().trim())) ||
      (q.singleStructure.document_label &&
        drillSet.has(q.singleStructure.document_label.toLowerCase().trim())));

  const matchesCorrect =
    Array.isArray(q.correctStructureIds) &&
    q.correctStructureIds.some((id) => drillSet.has(id.toLowerCase().trim()));

  assert.ok(
    matchesCandidate || matchesSingle || matchesCorrect,
    `Isolated question ${q.id} must match at least one candidate in drillSet`
  );
});

console.log(`✓ 1-click remediation filtered bank from ${bank.length} questions to ${isolatedDrillQuestions.length} targeted questions.\n`);

// ============================================================================
// Step 7: Standalone Top 200 Drugs Catalog Deck Retrieval & Taxonomy Verification
// ============================================================================
console.log('Step 7: Validating Standalone Top 200 Drugs deck retrieval and taxonomy metadata...');

const top200Cards = getTop200Flashcards();
assert.ok(Array.isArray(top200Cards), 'getTop200Flashcards() must return an array');
assert.strictEqual(
  top200Cards.length,
  250,
  `Top 200 catalog deck must contain exactly 250 drugs, got ${top200Cards.length}`
);

// Verify identifier uniqueness across all 250 cards
const top200UniqueIds = new Set(top200Cards.map((c) => c.structureId));
assert.strictEqual(
  top200UniqueIds.size,
  250,
  'All 250 Top 200 flashcards must have strictly unique structureIds'
);

// Verify taxonomy metadata, structure integrity, and spaced repetition defaults
const presentClasses = new Set<number>();
top200Cards.forEach((c) => {
  assert.ok(c.drugName && c.drugName.trim().length > 0, `Card ${c.structureId} must have drugName`);
  assert.ok(c.structure && c.structure.id, `Card ${c.structureId} must have chemical structure`);
  assert.ok(
    c.structure.canonicalSmiles || c.structure.canonical_smiles || c.structure.smiles,
    `Card ${c.structureId} (${c.drugName}) must have valid SMILES`
  );
  assert.strictEqual(c.state, 'new', `Top 200 card ${c.structureId} must start in "new" state`);
  assert.strictEqual(c.intervalMinutes, 0, `Top 200 card ${c.structureId} must have intervalMinutes 0`);
  assert.strictEqual(c.repetitionCount, 0, `Top 200 card ${c.structureId} must have repetitionCount 0`);
  assert.strictEqual(c.struggleCount, 0, `Top 200 card ${c.structureId} must have struggleCount 0`);

  // Taxonomy fields
  const classNum = c.structure.therapeuticClassNumber;
  assert.ok(
    typeof classNum === 'number' && classNum >= 1 && classNum <= 39,
    `Card ${c.drugName} must have valid therapeuticClassNumber (1-39), got ${classNum}`
  );
  presentClasses.add(classNum);

  assert.ok(
    c.structure.therapeuticCategory && c.structure.therapeuticCategory.trim().length > 0,
    `Card ${c.drugName} must have non-empty therapeuticCategory`
  );
  assert.ok(
    c.structure.broadPharmacologicClass && c.structure.broadPharmacologicClass.trim().length > 0,
    `Card ${c.drugName} must have non-empty broadPharmacologicClass`
  );
  assert.ok(
    c.structure.specificPharmacologicClass && c.structure.specificPharmacologicClass.trim().length > 0,
    `Card ${c.drugName} must have non-empty specificPharmacologicClass`
  );
});

assert.strictEqual(
  presentClasses.size,
  39,
  'All 39 therapeutic classes (1 through 39) must be represented across the 250 Top Drugs catalog'
);

// Verify active categories derivation for the top 200 deck
const activeCats = getTherapeuticCategoriesForCards(top200Cards);
assert.strictEqual(
  activeCats.length,
  39,
  'getTherapeuticCategoriesForCards on top200Cards must return all 39 therapeutic categories'
);
for (let i = 0; i < 39; i++) {
  assert.strictEqual(activeCats[i].classNumber, i + 1, `Category index ${i} should be classNumber ${i + 1}`);
}

// Verify pharmacophore tag generation and highlighting compatibility on sample Top 200 cards
const sampleDrugs = ['metoprolol', 'furosemide', 'cephalexin', 'lisinopril', 'amlodipine', 'atorvastatin'];
for (const drug of sampleDrugs) {
  const card = top200Cards.find((c) => c.drugName.toLowerCase().includes(drug));
  assert.ok(card, `Top 200 cards must include sample drug ${drug}`);
  const groups = getPharmacophoresForStructure(card.structure);
  assert.ok(Array.isArray(groups) && groups.length > 0, `Pharmacophores for ${drug} must not be empty`);
  groups.forEach((g) => {
    assert.ok(g.id, `Pharmacophore group in ${drug} must have id`);
    assert.ok(g.name, `Pharmacophore group in ${drug} must have name`);
    assert.ok(g.purpose, `Pharmacophore group in ${drug} must have purpose`);
    assert.ok(g.region, `Pharmacophore group in ${drug} must have region coordinates`);
  });
}

// Verify spaced repetition and struggle diagnostic workflow on Top 200 cards
const [topAgain, topGood] = top200Cards.slice(0, 2);
const topAgainResult = processReviewRating(topAgain, 'again', now);
assert.strictEqual(topAgainResult.nextCardState.struggleCount, 1);
assert.strictEqual(topAgainResult.nextCardState.state, 'learning');

const topGoodResult = processReviewRating(topGood, 'good', now);
assert.strictEqual(topGoodResult.nextCardState.struggleCount, 0);
assert.strictEqual(topGoodResult.nextCardState.state, 'review');

const topReport = generateStruggleReport({
  sessionType: 'flashcards',
  flashcardHistory: [topAgainResult.nextCardState, topGoodResult.nextCardState],
});
assert.strictEqual(topReport.totalItemsReviewed, 2);
assert.strictEqual(topReport.struggledStructures.length, 1);
assert.strictEqual(topReport.struggledStructures[0].drugName, topAgain.drugName);
assert.ok(Array.isArray(topReport.remediationCandidateIds), 'remediationCandidateIds must be an array');
assert.ok(topReport.remediationCandidateIds.includes(topAgain.structureId));

console.log(`✓ Validated 250 Top Drugs cards across all 39 therapeutic classes with pharmacophores & SRS diagnostics.\n`);

// ============================================================================
// Step 8: CumulativeStudyHubModal Top 200 Preset Integration Contract Verification
// ============================================================================
console.log('Step 8: Verifying CumulativeStudyHubModal Top 200 preset integration contract...');

const modalPath = 'src/components/CumulativeStudyHubModal.tsx';
assert.ok(fs.existsSync(modalPath), `Component file ${modalPath} must exist`);
const modalContent = fs.readFileSync(modalPath, 'utf-8');

// Contract 1: getTop200Flashcards import
assert.ok(
  modalContent.includes('getTop200Flashcards') &&
    (modalContent.includes("from '../utils/topDrugsTaxonomy'") ||
      modalContent.includes('from "../utils/topDrugsTaxonomy"')),
  'CumulativeStudyHubModal must import getTop200Flashcards from ../utils/topDrugsTaxonomy'
);

// Contract 2: Deck preset state definition ('curriculum' | 'top200')
assert.ok(
  modalContent.includes('deckMode') || modalContent.includes('deckPreset'),
  'CumulativeStudyHubModal must maintain deck preset state (deckMode or deckPreset)'
);
assert.ok(
  modalContent.includes("'curriculum'") && modalContent.includes("'top200'"),
  "CumulativeStudyHubModal must support 'curriculum' and 'top200' preset modes"
);

// Contract 3: Memoized loading of Top 200 cards via getTop200Flashcards()
assert.ok(
  modalContent.includes('getTop200Flashcards()'),
  'CumulativeStudyHubModal must invoke getTop200Flashcards()'
);

// Contract 4: Feeding active deck cards to StructureFlashcardDeck
assert.ok(
  modalContent.includes('<StructureFlashcardDeck') &&
    (modalContent.includes('cards={active') ||
      modalContent.includes('cards={deckMode') ||
      modalContent.includes('cards={currentCards')),
  'CumulativeStudyHubModal must supply the active deck cards to StructureFlashcardDeck based on the selected preset'
);

// Contract 5: Accessible toggle or selector buttons for both presets with count badges
assert.ok(
  modalContent.includes('Curriculum') || modalContent.includes('Curriculum Structures'),
  'CumulativeStudyHubModal must render Curriculum preset option'
);
assert.ok(
  modalContent.includes('Top 200') || modalContent.includes('Top 200 Drugs'),
  'CumulativeStudyHubModal must render Top 200 preset option'
);
assert.ok(
  modalContent.includes('harvestedCards.length'),
  'CumulativeStudyHubModal must display harvestedCards count badge'
);
assert.ok(
  modalContent.includes('top200Cards.length'),
  'CumulativeStudyHubModal must display top200Cards count badge'
);

// Contract 6: Spaced repetition session completion & struggle diagnostics preserved
assert.ok(
  modalContent.includes('onSessionComplete={handleFlashcardSessionComplete}'),
  'CumulativeStudyHubModal must pass handleFlashcardSessionComplete to StructureFlashcardDeck'
);
assert.ok(
  modalContent.includes('onClose={onClose}'),
  'CumulativeStudyHubModal must pass onClose to StructureFlashcardDeck'
);

console.log('✓ CumulativeStudyHubModal Top 200 preset integration contracts verified.\n');

console.log('========================================================================');
console.log('🎉 END-TO-END CUMULATIVE STUDY HUB INTEGRATION WORKFLOW TEST PASSED!');
console.log('========================================================================');
