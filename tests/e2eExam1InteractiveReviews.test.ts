import assert from 'node:assert/strict';
import fs from 'node:fs';
import { EXAM_DEFINITIONS, getExamDefinition, getModuleExamId } from '../src/types/examTypes';
import { loadAllReviewModules, getBuiltInModule, getModulesForExam } from '../src/utils/moduleStorage';
import { harvestCumulativeFlashcards, filterFlashcardsByModules } from '../src/utils/cumulativeStructureHarvester';
import { applySpacedRepetitionGrade, recordCardProgress, loadFlashcardProgress } from '../src/utils/spacedRepetitionService';

console.log('Running End-to-End Exam 1 Interactive Reviews & Flashcards Verification Suite...');

// ============================================================================
// 1. Exam Selection & Module Scope Isolation
// ============================================================================
console.log('\nStep 1: Verifying Exam 1 Scaffolding and Isolation...');
const exam1Def = getExamDefinition('exam_1');
assert.ok(exam1Def, 'Exam 1 definition must be available');
assert.strictEqual(exam1Def.code, 'Exam 1');
assert.strictEqual(exam1Def.defaultModuleId, 'renal_review_mcp2');
assert.strictEqual(exam1Def.description, 'Interactive slide-by-slide reviews for Renal and Respiratory medicinal chemistry.');
assert.deepStrictEqual(
  exam1Def.builtInModuleIds,
  ['renal_review_mcp2', 'respiratory_review_mcp2'],
  'Exam 1 must strictly contain the 2 review modules'
);

const allModules = loadAllReviewModules();
assert.strictEqual(allModules.length, 11, 'Total built-in modules must equal 11 (2 for Exam 1, 5 for Exam 2, 4 for Exam 3)');

const exam1Modules = getModulesForExam('exam_1', allModules);
assert.strictEqual(exam1Modules.length, 2, 'Exam 1 module selector must show strictly 2 review modules');
assert.strictEqual(exam1Modules[0].id, 'renal_review_mcp2');
assert.strictEqual(exam1Modules[0].title, 'Review for Renal Drugs');
assert.strictEqual(exam1Modules[1].id, 'respiratory_review_mcp2');
assert.strictEqual(exam1Modules[1].title, 'Review for Respiratory Drugs');

const exam2Modules = getModulesForExam('exam_2', allModules);
assert.strictEqual(exam2Modules.length, 5, 'Exam 2 must retain strictly 5 modules');

const exam3Modules = getModulesForExam('exam_3', allModules);
assert.strictEqual(exam3Modules.length, 4, 'Exam 3 must retain strictly 4 modules');
console.log('✓ Exam 1, 2, and 3 module scope isolation verified.');

// ============================================================================
// 2. Renal Review Interactive Module (renal_review_mcp2) Deep Inspection
// ============================================================================
console.log('\nStep 2: Inspecting Renal Review Module (renal_review_mcp2)...');
const renalMod = getBuiltInModule('renal_review_mcp2')!;
assert.ok(renalMod, 'Renal review module must be retrievable');
assert.strictEqual(renalMod.pages.length, 3, 'Renal review module must have exactly 3 slide pages');

// Slide 1: Loop, Thiazide, Carbonic Anhydrase (Q1 - Q14)
const renalP1 = renalMod.pages[0];
assert.ok(renalP1.title?.includes('Slide 1') || renalP1.subtitle?.includes('Structures I–V'));
const renalP1Structs = renalP1.sections[0].structures || [];
assert.strictEqual(renalP1Structs.length, 5, 'Slide 1 must feature Structures I–V');
const renalP1Questions = renalP1.sections.flatMap((s) => s.questions);
assert.strictEqual(renalP1Questions.length, 14, 'Slide 1 must contain exactly 14 questions (Q1 to Q14)');

// Slide 2: K-Sparing, Vaptans, Binders (Q15 - Q18)
const renalP2 = renalMod.pages[1];
const renalP2Structs = renalP2.sections[0].structures || [];
assert.strictEqual(renalP2Structs.length, 7, 'Slide 2 must feature 7 landmark structures (Structures I–V plus Vasopressin & Oxytocin)');
const renalP2Questions = renalP2.sections.flatMap((s) => s.questions);
assert.strictEqual(renalP2Questions.length, 4, 'Slide 2 must contain exactly 4 questions (Q15 to Q18)');

// Slide 3: Synthesis, Vasopressin Derivatives (Q19)
const renalP3 = renalMod.pages[2];
const renalP3Structs = renalP3.sections[0].structures || [];
assert.strictEqual(renalP3Structs.length, 5, 'Slide 3 must feature Structures I–V');
const renalP3Questions = renalP3.sections.flatMap((s) => s.questions);
assert.strictEqual(renalP3Questions.length, 1, 'Slide 3 must contain Question 19');

const totalRenalQuestions = renalMod.pages.reduce((acc, p) =>
  acc + p.sections.reduce((sAcc, s) => sAcc + s.questions.length, 0), 0);
assert.strictEqual(totalRenalQuestions, 19, 'Renal review module must feature exactly 19 slide questions');
console.log('✓ Renal review module verified: 3 slide pages, 15 structure panels, 19 interactive slide questions.');

// ============================================================================
// 3. Respiratory Review Interactive Module (respiratory_review_mcp2) Deep Inspection
// ============================================================================
console.log('\nStep 3: Inspecting Respiratory Review Module (respiratory_review_mcp2)...');
const respMod = getBuiltInModule('respiratory_review_mcp2')!;
assert.ok(respMod, 'Respiratory review module must be retrievable');
assert.strictEqual(respMod.pages.length, 9, 'Respiratory review module must have exactly 9 slide pages');
assert.strictEqual(respMod.chemicalStructures?.length, 41, 'Respiratory review module must define 41 landmark structures');

// Verbatim question verification on Slides 6, 7, and 9
const p6 = respMod.pages[5];
const q601 = p6.sections[0].questions.find((q) => q.id === 601)!;
assert.ok(q601, 'Slide 6 must have Question 601');
assert.strictEqual(q601.subStatements?.length, 4, 'Question 601 must have 4 True/False statements');

const p7 = respMod.pages[6];
const q703 = p7.sections[0].questions.find((q) => q.id === 703)!;
assert.ok(q703, 'Slide 7 must have Question 703 (Theophylline vs Roflumilast)');
assert.strictEqual(q703.subStatements?.length, 5, 'Question 703 must have 5 True/False statements');

const p9 = respMod.pages[8];
const q901 = p9.sections[0].questions.find((q) => q.id === 901)!;
assert.ok(q901, 'Slide 9 must have Question 901 (BDP vs Hydrocortisone succinate)');
assert.strictEqual(q901.subStatements?.length, 10, 'Question 901 must have 10 True/False statements');

const q902 = p9.sections[0].questions.find((q) => q.id === 902)!;
assert.ok(q902, 'Slide 9 must have Question 902 (Tiotropium vs Pirbuterol)');
assert.strictEqual(q902.subStatements?.length, 5, 'Question 902 must have 5 True/False statements');

const totalRespStatements = respMod.pages.reduce((acc, p) =>
  acc + p.sections.reduce((sAcc, s) =>
    sAcc + s.questions.reduce((qAcc, q) => qAcc + (q.subStatements?.length || 0), 0), 0), 0);
assert.strictEqual(totalRespStatements, 47, 'Respiratory review module must feature exactly 47 True/False statements');
console.log('✓ Respiratory review module verified: 9 slide pages, 41 structures, 47 interactive sub-statements.');

// ============================================================================
// 4. Flashcard Deck Harvesting, Module Filtering & Spaced Repetition Workflow
// ============================================================================
console.log('\nStep 4: Testing Flashcard Deck Harvesting & Spaced Repetition Workflow...');
const exam1Flashcards = harvestCumulativeFlashcards('exam_1');
assert.strictEqual(exam1Flashcards.length, 52, 'Exam 1 must harvest 52 unique chemical structure cards');

// Verify StructureFlashcardDeck component has dynamic module filtering and Retry Full Deck button
const deckContent = fs.readFileSync('src/components/StructureFlashcardDeck.tsx', 'utf-8');
assert.ok(deckContent.includes('getAvailableModuleFilters'), 'Must implement dynamic module filter derivation');
assert.ok(deckContent.includes('Retry Full Deck'), 'Must feature Retry Full Deck button');
assert.ok(deckContent.includes('<RotateCcw'), 'Must use RotateCcw icon on retry button');
assert.ok(deckContent.includes('handleRestartDeck'), 'Must wire handleRestartDeck action');

// Verify filtering by module
const renalCards = filterFlashcardsByModules(exam1Flashcards, ['renal_review_mcp2']);
assert.ok(renalCards.length > 0, 'Renal filtered cards must be non-empty');
assert.ok(renalCards.every((c) => c.moduleIds.includes('renal_review_mcp2')));

const respCards = filterFlashcardsByModules(exam1Flashcards, ['respiratory_review_mcp2']);
assert.ok(respCards.length > 0, 'Respiratory filtered cards must be non-empty');
assert.ok(respCards.every((c) => c.moduleIds.includes('respiratory_review_mcp2')));

// Simulate studying and rating a card
const sampleCard = exam1Flashcards[0];
const { nextCardState } = applySpacedRepetitionGrade(sampleCard, 'good');
assert.strictEqual(nextCardState.repetitionCount, 1);
assert.strictEqual(nextCardState.state, 'review');
assert.ok(nextCardState.intervalMinutes > 0);

// Simulate recording progress
recordCardProgress(nextCardState);
const savedProgress = loadFlashcardProgress();
assert.ok(savedProgress[sampleCard.structureId]);
assert.strictEqual(savedProgress[sampleCard.structureId].repetitionCount, 1);

console.log('✓ Flashcard harvesting, dynamic module filtering, and spaced repetition simulation verified.');

console.log('\n========================================================================');
console.log('🎉 ALL END-TO-END VERIFICATION CHECKS PASSED FOR EXAM 1 INTERACTIVE REVIEWS');
console.log('========================================================================');
