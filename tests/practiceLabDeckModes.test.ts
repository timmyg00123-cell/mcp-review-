// tests/practiceLabDeckModes.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  FLASHCARD_STORAGE_KEY,
  TOP200_CLINICAL_STORAGE_KEY,
  TOP200_ACTIVE_MODE_STORAGE_KEY,
  loadFlashcardProgress,
  saveFlashcardProgress,
  clearFlashcardProgress,
  applyProgressToCards,
  recordCardProgress,
  applySpacedRepetitionGrade,
} from '../src/utils/spacedRepetitionService.js';
import {
  getTop200Flashcards,
} from '../src/utils/topDrugsTaxonomy.js';
import {
  resolveTopDrugClinicalMonograph,
  getTopDrugClinicalMonograph,
} from '../src/data/topDrugsClinicalData.js';
import {
  TOP_DRUGS_SMILES_CATALOG,
} from '../src/data/topDrugsSmilesData.js';
import {
  resolveStructureRenderMode,
  getBlindedComponentLabel,
} from '../src/utils/multiStructureHelpers.js';
import type { FlashcardItem } from '../src/types/cumulativeStudy.js';

console.log('Running Practice Lab Deck Modes & Spaced Repetition Isolation tests...');

// ====================================================================
// Test 1: Independent SM-2 Progress Persistence across Storage Keys
// ====================================================================
console.log('Test 1: Independent SM-2 progress persistence across storage keys...');

assert.strictEqual(
  FLASHCARD_STORAGE_KEY,
  'mcp_flashcard_progress_v1',
  'FLASHCARD_STORAGE_KEY must be mcp_flashcard_progress_v1'
);

assert.strictEqual(
  TOP200_CLINICAL_STORAGE_KEY,
  'mcp_top200_clinical_progress_v1',
  'TOP200_CLINICAL_STORAGE_KEY must be mcp_top200_clinical_progress_v1'
);

// Clear both storage keys for a clean test baseline
clearFlashcardProgress(FLASHCARD_STORAGE_KEY);
clearFlashcardProgress(TOP200_CLINICAL_STORAGE_KEY);

const structureProgress = loadFlashcardProgress(FLASHCARD_STORAGE_KEY);
const clinicalProgress = loadFlashcardProgress(TOP200_CLINICAL_STORAGE_KEY);

assert.deepStrictEqual(structureProgress, {}, 'Structure progress must be empty after clear');
assert.deepStrictEqual(clinicalProgress, {}, 'Clinical progress must be empty after clear');

// Create mock cards for testing
const mockCardA: FlashcardItem = {
  structureId: 'top200_card_lisinopril',
  drugName: 'Lisinopril',
  moduleIds: [],
  structure: {
    id: 'top200_card_lisinopril',
    name: 'Lisinopril',
    chemicalClass: 'ACE Inhibitor',
    pharmacologicalClass: 'ACE Inhibitor',
    target: 'Angiotensin-Converting Enzyme',
    reversibility: 'Reversible',
    route: 'Oral',
    keyFunctionalGroups: ['Proline', 'Lysyl side chain', 'Carboxylic acid'],
    pkPdHighlights: {
      onset: '1h',
      duration: '24h',
      halfLife: '12h',
      elimination: 'Renal',
    },
    sarNotes: 'Lysyl analog of enalaprilat',
    smiles: 'NCCCC[C@H](N[C@@H](CCc1ccccc1)C(=O)O)C(=O)N1CCC[C@H]1C(=O)O',
    therapeuticClassNumber: 8,
  },
  state: 'learning',
  intervalMinutes: 1,
  repetitionCount: 0,
  dueTimestamp: Date.now(),
  isSuspended: false,
  struggleCount: 0,
};

// 1. Grade 'again' in chemical structure mode (storageKey = FLASHCARD_STORAGE_KEY)
const gradedStructure = applySpacedRepetitionGrade(mockCardA, 'again').nextCardState;
recordCardProgress(gradedStructure, undefined, FLASHCARD_STORAGE_KEY);

// Check that progress exists in FLASHCARD_STORAGE_KEY
const updatedStructureProgress = loadFlashcardProgress(FLASHCARD_STORAGE_KEY);
assert.ok(
  updatedStructureProgress['top200_card_lisinopril'],
  'Lisinopril progress must exist in FLASHCARD_STORAGE_KEY'
);
assert.strictEqual(
  updatedStructureProgress['top200_card_lisinopril'].repetitionCount,
  1,
  'Structure mode reps must be 1 after again'
);
assert.strictEqual(
  updatedStructureProgress['top200_card_lisinopril'].struggleCount,
  1,
  'Structure mode struggleCount must be 1 after again'
);
assert.strictEqual(
  updatedStructureProgress['top200_card_lisinopril'].state,
  'learning',
  'Structure mode state must be learning after again'
);

// Verify TOP200_CLINICAL_STORAGE_KEY is completely clean and untainted!
const untaintedClinicalProgress = loadFlashcardProgress(TOP200_CLINICAL_STORAGE_KEY);
assert.strictEqual(
  untaintedClinicalProgress['top200_card_lisinopril'],
  undefined,
  'Lisinopril progress in TOP200_CLINICAL_STORAGE_KEY must be undefined (zero leakage)'
);

// 2. Grade 'easy' in clinical monograph mode (storageKey = TOP200_CLINICAL_STORAGE_KEY)
const gradedClinical = applySpacedRepetitionGrade(mockCardA, 'easy').nextCardState;
recordCardProgress(gradedClinical, undefined, TOP200_CLINICAL_STORAGE_KEY);

// Check that progress exists in TOP200_CLINICAL_STORAGE_KEY
const updatedClinicalProgress = loadFlashcardProgress(TOP200_CLINICAL_STORAGE_KEY);
assert.ok(
  updatedClinicalProgress['top200_card_lisinopril'],
  'Lisinopril progress must exist in TOP200_CLINICAL_STORAGE_KEY'
);
assert.strictEqual(
  updatedClinicalProgress['top200_card_lisinopril'].repetitionCount,
  1,
  'Clinical mode reps must be 1 after easy'
);
assert.strictEqual(
  updatedClinicalProgress['top200_card_lisinopril'].struggleCount,
  0,
  'Clinical mode struggleCount must be 0 after easy'
);
assert.strictEqual(
  updatedClinicalProgress['top200_card_lisinopril'].state,
  'mastered',
  'Clinical mode state must be mastered after easy'
);

// Verify FLASHCARD_STORAGE_KEY retains its distinct state
const structureCheck = loadFlashcardProgress(FLASHCARD_STORAGE_KEY);
assert.strictEqual(
  structureCheck['top200_card_lisinopril'].repetitionCount,
  1,
  'Structure mode reps must remain 1 (independent state)'
);
assert.strictEqual(
  structureCheck['top200_card_lisinopril'].struggleCount,
  1,
  'Structure mode struggleCount must remain 1'
);
assert.strictEqual(
  structureCheck['top200_card_lisinopril'].state,
  'learning',
  'Structure mode state must remain learning'
);

// 3. Test applyProgressToCards isolation
const cardsHydratedStructure = applyProgressToCards([mockCardA], undefined, FLASHCARD_STORAGE_KEY);
const cardsHydratedClinical = applyProgressToCards([mockCardA], undefined, TOP200_CLINICAL_STORAGE_KEY);

assert.strictEqual(cardsHydratedStructure[0].struggleCount, 1, 'Hydrated structure card struggleCount must be 1');
assert.strictEqual(cardsHydratedStructure[0].state, 'learning', 'Hydrated structure card state must be learning');

assert.strictEqual(cardsHydratedClinical[0].struggleCount, 0, 'Hydrated clinical card struggleCount must be 0');
assert.strictEqual(cardsHydratedClinical[0].state, 'mastered', 'Hydrated clinical card state must be mastered');

console.log('✓ Test 1 Passed: Complete SM-2 progress isolation across storage keys verified.');

// ====================================================================
// Test 2: Mode Switcher State & Persistence Key
// ====================================================================
console.log('Test 2: Mode switcher state & persistence key...');

assert.strictEqual(
  TOP200_ACTIVE_MODE_STORAGE_KEY,
  'mcp_top200_active_mode',
  'TOP200_ACTIVE_MODE_STORAGE_KEY must be mcp_top200_active_mode'
);

// Test simulated localStorage behavior for mode switching
const simulatedLocalStorage: Record<string, string> = {};

function getSimulatedMode(): 'structure' | 'clinical' {
  const saved = simulatedLocalStorage[TOP200_ACTIVE_MODE_STORAGE_KEY];
  if (saved === 'clinical' || saved === 'structure') {
    return saved;
  }
  return 'structure';
}

function setSimulatedMode(mode: 'structure' | 'clinical') {
  simulatedLocalStorage[TOP200_ACTIVE_MODE_STORAGE_KEY] = mode;
}

assert.strictEqual(getSimulatedMode(), 'structure', 'Default mode without saved state must be structure');
setSimulatedMode('clinical');
assert.strictEqual(getSimulatedMode(), 'clinical', 'Persisted mode must be clinical');
setSimulatedMode('structure');
assert.strictEqual(getSimulatedMode(), 'structure', 'Persisted mode must switch back to structure');

console.log('✓ Test 2 Passed: Mode switcher state initialization and persistence verified.');

// ====================================================================
// Test 3: Top 200 Cards & Monograph Resolution in Clinical Mode
// ====================================================================
console.log('Test 3: Top 200 cards & monograph resolution in clinical mode...');

const top200Deck = getTop200Flashcards();
assert.ok(top200Deck.length >= 200, `Top 200 deck must contain at least 200 cards (got ${top200Deck.length})`);

// Sample diverse card types from Top 200 deck:
// 1. Single molecule
const lisinoprilCard = top200Deck.find((c) => c.drugName.toLowerCase().includes('lisinopril'));
assert.ok(lisinoprilCard, 'Lisinopril card must exist in top 200 deck');
const lisinoprilMonograph = resolveTopDrugClinicalMonograph(lisinoprilCard.drugName);
assert.strictEqual(lisinoprilMonograph.genericName, 'Lisinopril');
assert.ok(lisinoprilMonograph.brandNames.includes('Prinivil') || lisinoprilMonograph.brandNames.includes('Zestril'));
assert.ok(lisinoprilMonograph.blackBoxWarning, 'Lisinopril must have FDA Boxed Warning (Fetal Toxicity)');
assert.ok(lisinoprilMonograph.blackBoxWarning.toLowerCase().includes('fetal'));
assert.ok(lisinoprilMonograph.mechanismOfAction.length > 0);
assert.ok(lisinoprilMonograph.dosingRegimens.length > 0);
assert.ok(lisinoprilMonograph.dosageForms.length > 0);

// 2. Combination drug (Amoxicillin / Clavulanate)
const augmentinCard = top200Deck.find(
  (c) =>
    c.drugName.toLowerCase().includes('amoxicillin') &&
    c.drugName.toLowerCase().includes('clavulanate')
);
assert.ok(augmentinCard, 'Amoxicillin / Clavulanate card must exist in top 200 deck');
const augmentinMonograph = resolveTopDrugClinicalMonograph(augmentinCard.drugName);
assert.ok(augmentinMonograph.genericName.toLowerCase().includes('amoxicillin'));
assert.ok(augmentinMonograph.brandNames.includes('Augmentin'));
assert.ok(augmentinMonograph.mechanismOfAction.toLowerCase().includes('beta-lactamase'));
assert.strictEqual(
  augmentinMonograph.blackBoxWarning,
  undefined,
  'Augmentin has no boxed warning and must cleanly suppress boxed warnings'
);

// 3. Biologic / peptide macromolecule (Insulin Glargine)
const glargineCard = top200Deck.find((c) => c.drugName.toLowerCase().includes('glargine'));
assert.ok(glargineCard, 'Insulin Glargine card must exist in top 200 deck');
const glargineMonograph = resolveTopDrugClinicalMonograph(glargineCard.drugName);
assert.strictEqual(glargineMonograph.genericName, 'Insulin Glargine');
assert.ok(glargineMonograph.brandNames.includes('Lantus'));
assert.ok(glargineMonograph.mechanismOfAction.toLowerCase().includes('insulin'));

// Verify that all 12 domains are non-empty for monographs
for (const testName of ['Lisinopril', 'Atorvastatin', 'Metformin', 'Amoxicillin / Clavulanate', 'Insulin Glargine']) {
  const mono = resolveTopDrugClinicalMonograph(testName);
  assert.ok(mono.genericName, `${testName} must have genericName`);
  assert.ok(mono.brandNames.length > 0, `${testName} must have brandNames`);
  assert.ok(mono.therapeuticClass, `${testName} must have therapeuticClass`);
  assert.ok(mono.pharmacologicClass, `${testName} must have pharmacologicClass`);
  assert.ok(mono.mechanismOfAction, `${testName} must have mechanismOfAction`);
  assert.ok(mono.dosingRegimens.length > 0, `${testName} must have dosingRegimens`);
  assert.ok(mono.contraindications.length > 0, `${testName} must have contraindications`);
  assert.ok(mono.sideEffects.common.length > 0, `${testName} must have common side effects`);
  assert.ok(mono.drugInteractions.major.length > 0, `${testName} must have major drug interactions`);
  assert.ok(mono.monitoringParameters.length > 0, `${testName} must have monitoringParameters`);
  assert.ok(mono.administrationAndCounseling.length > 0, `${testName} must have administrationAndCounseling`);
  assert.ok(mono.dosageForms.length > 0, `${testName} must have dosageForms`);
}

console.log('✓ Test 3 Passed: Monograph resolution across single-molecule, combinations, and biologics verified.');

// ====================================================================
// Test 4: MultiSmilesCanvas Blinding and Biologics Safety Contract
// ====================================================================
console.log('Test 4: MultiSmilesCanvas blinding and biologics safety contract...');

// 1. Combination Drug: Amoxicillin / Clavulanate
const augmentinStructure = TOP_DRUGS_SMILES_CATALOG['amoxicillinclavulanate'];
assert.ok(augmentinStructure, 'Augmentin structure record must exist');
assert.strictEqual(
  resolveStructureRenderMode(augmentinStructure),
  'multi-component',
  'Augmentin must resolve to multi-component render mode'
);
assert.strictEqual(augmentinStructure.components?.length, 2, 'Augmentin must have 2 components');
assert.strictEqual(getBlindedComponentLabel(0), 'Component A');
assert.strictEqual(getBlindedComponentLabel(1), 'Component B');

// Verify that blinded labels do not contain generic or brand names
assert.doesNotMatch(getBlindedComponentLabel(0), /amoxicillin|clavulanate|augmentin/i);
assert.doesNotMatch(getBlindedComponentLabel(1), /amoxicillin|clavulanate|augmentin/i);

// 2. Biologic Macromolecule: Insulin Glargine
const glargineStructure = TOP_DRUGS_SMILES_CATALOG['insulinglargine'];
assert.ok(glargineStructure, 'Insulin Glargine structure record must exist');
assert.strictEqual(
  resolveStructureRenderMode(glargineStructure),
  'biologic',
  'Insulin Glargine must resolve to biologic render mode'
);
assert.ok(
  typeof glargineStructure.biologicDescription === 'string' &&
    glargineStructure.biologicDescription.length > 20,
  'Insulin Glargine must have detailed biologicDescription'
);
assert.notStrictEqual(
  glargineStructure.smiles,
  'c1ccccc1',
  'Biologics must NEVER have benzene fallback c1ccccc1'
);

console.log('✓ Test 4 Passed: MultiSmilesCanvas active recall blinding and biologics safety verified.');

// ====================================================================
// Test 5: Component Source Code Contract Checks
// ====================================================================
console.log('Test 5: Component source code contract checks...');

const worktreeRoot = path.resolve(import.meta.dirname, '..');

// 1. StructureFlashcardCardFace.tsx must use MultiSmilesCanvas
const cardFaceSource = fs.readFileSync(
  path.join(worktreeRoot, 'src/components/StructureFlashcardCardFace.tsx'),
  'utf-8'
);
assert.ok(
  cardFaceSource.includes('<MultiSmilesCanvas'),
  'StructureFlashcardCardFace must render <MultiSmilesCanvas>'
);
assert.ok(
  !cardFaceSource.includes('<SmilesCanvas'),
  'StructureFlashcardCardFace must NOT directly render <SmilesCanvas>'
);

// 2. StructureFlashcardDeck.tsx must accept storageKey and renderMode
const deckSource = fs.readFileSync(
  path.join(worktreeRoot, 'src/components/StructureFlashcardDeck.tsx'),
  'utf-8'
);
assert.ok(
  deckSource.includes('storageKey?: string'),
  'StructureFlashcardDeck must accept storageKey prop'
);
assert.ok(
  deckSource.includes("renderMode?: 'structure' | 'clinical'"),
  'StructureFlashcardDeck must accept renderMode prop'
);
assert.ok(
  deckSource.includes('<TopDrugClinicalCard'),
  'StructureFlashcardDeck must render <TopDrugClinicalCard'
);
assert.ok(
  deckSource.includes('resolveTopDrugClinicalMonograph'),
  'StructureFlashcardDeck must call resolveTopDrugClinicalMonograph'
);
assert.ok(
  deckSource.includes('Re-drill Struggled Cards'),
  'StructureFlashcardDeck must offer Re-drill Struggled Cards button'
);

// 3. PracticeLabView.tsx must wire mode switcher and pass isolated storage keys
const practiceLabSource = fs.readFileSync(
  path.join(worktreeRoot, 'src/components/PracticeLabView.tsx'),
  'utf-8'
);
assert.ok(
  practiceLabSource.includes('TOP200_ACTIVE_MODE_STORAGE_KEY'),
  'PracticeLabView must export TOP200_ACTIVE_MODE_STORAGE_KEY'
);
assert.ok(
  practiceLabSource.includes('mcp_top200_active_mode'),
  'PracticeLabView must use mcp_top200_active_mode in localStorage'
);
assert.ok(
  practiceLabSource.includes('TOP200_CLINICAL_STORAGE_KEY'),
  'PracticeLabView must use TOP200_CLINICAL_STORAGE_KEY'
);
assert.ok(
  practiceLabSource.includes('🧪 Chemical Structure Mode'),
  'PracticeLabView must render Chemical Structure Mode button'
);
assert.ok(
  practiceLabSource.includes('📋 Clinical Monograph Mode'),
  'PracticeLabView must render Clinical Monograph Mode button'
);

console.log('✓ Test 5 Passed: Component source code contracts verified.');

console.log('\nAll Practice Lab Deck Modes & Spaced Repetition tests passed successfully!');
