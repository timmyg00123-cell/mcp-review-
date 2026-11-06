// tests/cumulativeStructureHarvester.test.ts
import assert from 'node:assert';
import {
  harvestCurriculumStructures,
  filterFlashcardsByModules,
} from '../src/utils/cumulativeStructureHarvester';
import { getDefaultAntiplateletModule } from '../src/utils/moduleStorage';
import { getDefaultAnticoagulantsModule } from '../src/data/anticoagulantsQuizData';
import { getDefaultHeartFailureModule } from '../src/data/heartFailureModuleData';
import { getDefaultAntiarrhythmicModule } from '../src/data/antiarrhythmicModuleData';
import type { ReviewModule, ChemicalStructure } from '../src/types/reviewModule';
import type { FlashcardItem } from '../src/types/cumulativeStudy';

console.log('Testing Cumulative Structure Harvester & Flashcard Deck Builder...');

// ---------------------------------------------------------------------------
// 1. Basic harvesting across all 4 landmark cardiovascular curriculum modules
// ---------------------------------------------------------------------------
const modules: ReviewModule[] = [
  getDefaultAntiplateletModule(),
  getDefaultAnticoagulantsModule(),
  getDefaultHeartFailureModule(),
  getDefaultAntiarrhythmicModule(),
];

const cards: FlashcardItem[] = harvestCurriculumStructures(modules);

console.log(`Harvested ${cards.length} unique cards across ${modules.length} modules.`);
assert.ok(
  cards.length >= 25,
  `Harvested card deck should contain at least 25 unique structures (found ${cards.length})`
);

// ---------------------------------------------------------------------------
// 2. Strict uniqueness of structure IDs
// ---------------------------------------------------------------------------
const idSet = new Set(cards.map((c) => c.structureId));
assert.strictEqual(
  idSet.size,
  cards.length,
  `All structure IDs must be strictly deduplicated (${idSet.size} unique vs ${cards.length} cards)`
);

// ---------------------------------------------------------------------------
// 3. FlashcardItem field initialization & back-of-card requirements
// ---------------------------------------------------------------------------
const now = Date.now();
cards.forEach((c, idx) => {
  const label = `Card #${idx + 1} (${c.drugName || c.structureId})`;

  // Structure identity
  assert.ok(c.structureId && typeof c.structureId === 'string', `${label} must have a valid structureId`);
  assert.ok(c.drugName && typeof c.drugName === 'string', `${label} must have a valid drugName`);
  assert.strictEqual(c.drugName, c.structure.name, `${label} drugName must match structure.name`);

  // Module ownership
  assert.ok(Array.isArray(c.moduleIds) && c.moduleIds.length >= 1, `${label} must belong to at least 1 module`);
  const uniqueModIds = new Set(c.moduleIds);
  assert.strictEqual(uniqueModIds.size, c.moduleIds.length, `${label} moduleIds must not have duplicates`);

  // Initial spaced-repetition state
  assert.strictEqual(c.intervalMinutes, 0, `${label} must initialize with intervalMinutes 0`);
  assert.ok(
    typeof c.dueTimestamp === 'number' && c.dueTimestamp <= now + 5000,
    `${label} must initialize dueTimestamp to current timestamp`
  );
  assert.strictEqual(c.repetitionCount, 0, `${label} must initialize with repetitionCount 0`);
  assert.strictEqual(c.state, 'new', `${label} must initialize state to 'new'`);
  assert.strictEqual(c.isSuspended, false, `${label} must initialize isSuspended to false`);
  assert.strictEqual(c.struggleCount, 0, `${label} must initialize struggleCount to 0`);

  // Back-of-card educational content
  assert.ok(c.structure.name, `${label} structure must contain name`);
  assert.ok(
    c.structure.pharmacologicalClass || c.structure.chemicalClass,
    `${label} structure must contain pharmacologicalClass or chemicalClass`
  );
});

// ---------------------------------------------------------------------------
// 4. Verification of cross-module deduplication (e.g. Metoprolol)
// ---------------------------------------------------------------------------
const metoprololCards = cards.filter((c) => c.drugName.toLowerCase() === 'metoprolol');
assert.strictEqual(
  metoprololCards.length,
  1,
  `Metoprolol appears in heart failure and antiarrhythmics modules, but must yield exactly 1 flashcard (found ${metoprololCards.length})`
);
const metoprolol = metoprololCards[0];
assert.ok(
  metoprolol.moduleIds.includes('heart_failure_mcp2'),
  'Metoprolol card must tag heart_failure_mcp2 module'
);
assert.ok(
  metoprolol.moduleIds.includes('antiarrhythmics_mcp2'),
  'Metoprolol card must tag antiarrhythmics_mcp2 module'
);

// ---------------------------------------------------------------------------
// 5. Verification of deduplication algorithms with synthetic modules
// ---------------------------------------------------------------------------
const mockStructA: ChemicalStructure = {
  id: 'aspirin_mod1',
  name: 'Aspirin',
  cid: 2244,
  canonicalSmiles: 'CC(=O)Oc1ccccc1C(=O)O',
  chemicalClass: 'Salicylate ester',
  pharmacologicalClass: 'COX-1 inhibitor',
  target: 'COX-1',
  reversibility: 'Irreversible',
  route: 'Oral',
  keyFunctionalGroups: ['Ester', 'Carboxylic acid'],
  pkPdHighlights: { onset: '15m', duration: '7d', halfLife: '20m', elimination: 'Hepatic' },
  sarNotes: 'Acetylation of Ser529',
};

const mockStructB_sameCidDiffName: ChemicalStructure = {
  id: 'asa_mod2',
  name: 'Aspirin (Acetylsalicylic Acid)',
  cid: 2244,
  canonicalSmiles: 'CC(=O)Oc1ccccc1C(=O)O',
  chemicalClass: 'Salicylate ester',
  pharmacologicalClass: 'Antiplatelet',
  target: 'COX-1',
  reversibility: 'Irreversible',
  route: 'Oral',
  keyFunctionalGroups: ['Ester', 'Carboxylic acid'],
  pkPdHighlights: { onset: '15m', duration: '7d', halfLife: '20m', elimination: 'Hepatic' },
  sarNotes: 'Acetylation of Ser529',
};

const mockStructC_diffDrug: ChemicalStructure = {
  id: 'clopidogrel_mod2',
  name: 'Clopidogrel',
  cid: 60606,
  canonicalSmiles: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
  chemicalClass: 'Thienopyridine',
  pharmacologicalClass: 'P2Y12 Antagonist',
  target: 'P2Y12',
  reversibility: 'Irreversible',
  route: 'Oral',
  keyFunctionalGroups: ['Thiophene', 'Tetrahydropyridine', 'Methyl ester'],
  pkPdHighlights: { onset: '2h', duration: '7d', halfLife: '6h', elimination: 'Hepatic' },
  sarNotes: 'Requires CYP2C19 bioactivation',
};

const syntheticModules: ReviewModule[] = [
  {
    id: 'module_alpha',
    title: 'Alpha',
    subtitle: 'Test',
    course: 'MCP',
    semester: 'Fall',
    createdAt: '2026-11-05',
    pages: [
      {
        pageNumber: 1,
        sections: [
          {
            structures: [mockStructA],
            questions: [],
          },
        ],
      },
    ],
  },
  {
    id: 'module_beta',
    title: 'Beta',
    subtitle: 'Test',
    course: 'MCP',
    semester: 'Fall',
    createdAt: '2026-11-05',
    pages: [
      {
        pageNumber: 1,
        sections: [
          {
            structures: [mockStructB_sameCidDiffName, mockStructC_diffDrug],
            questions: [],
          },
        ],
      },
    ],
  },
];

const syntheticCards = harvestCurriculumStructures(syntheticModules);
assert.strictEqual(
  syntheticCards.length,
  2,
  `Synthetic modules with shared CID 2244 should deduplicate to 2 cards (Aspirin + Clopidogrel), found ${syntheticCards.length}`
);

const harvestedAspirin = syntheticCards.find((c) => c.structure.cid === 2244);
assert.ok(harvestedAspirin, 'Harvested deck must contain the deduplicated Aspirin card');
assert.deepStrictEqual(
  harvestedAspirin.moduleIds.sort(),
  ['module_alpha', 'module_beta'].sort(),
  'Deduplicated Aspirin card must have both module_alpha and module_beta IDs'
);

// ---------------------------------------------------------------------------
// 6. Verification of filterFlashcardsByModules helper
// ---------------------------------------------------------------------------
const alphaOnly = filterFlashcardsByModules(syntheticCards, ['module_alpha']);
assert.strictEqual(alphaOnly.length, 1, 'Filtering for module_alpha should only return Aspirin');
assert.strictEqual(alphaOnly[0].structure.cid, 2244);

const betaOnly = filterFlashcardsByModules(syntheticCards, ['module_beta']);
assert.strictEqual(betaOnly.length, 2, 'Filtering for module_beta should return both Aspirin and Clopidogrel');

const emptyFilter = filterFlashcardsByModules(syntheticCards, []);
assert.strictEqual(emptyFilter.length, 0, 'Empty active module filter should return 0 cards');

const nonExistentFilter = filterFlashcardsByModules(syntheticCards, ['module_gamma']);
assert.strictEqual(nonExistentFilter.length, 0, 'Non-existent module filter should return 0 cards');

// ---------------------------------------------------------------------------
// 7. Edge cases (empty modules, modules without structures)
// ---------------------------------------------------------------------------
assert.deepStrictEqual(harvestCurriculumStructures([]), [], 'Empty modules array must return empty cards array');

const emptyModule: ReviewModule = {
  id: 'empty_module',
  title: 'Empty',
  subtitle: 'None',
  course: 'MCP',
  semester: 'Fall',
  createdAt: '2026-11-05',
  pages: [],
};
assert.deepStrictEqual(
  harvestCurriculumStructures([emptyModule]),
  [],
  'Module with no pages or chemicalStructures must return empty cards array'
);

console.log('All Cumulative Structure Harvester tests passed successfully!');
