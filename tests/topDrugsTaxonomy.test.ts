import assert from 'node:assert';
import {
  normalizeForTaxonomyMatch,
  findTopDrugMatch,
  enrichStructureWithTaxonomy,
  getTop200Flashcards,
  getTherapeuticCategoriesForCards,
} from '../src/utils/topDrugsTaxonomy.js';
import type { ChemicalStructure } from '../src/types/reviewModule.js';

// 1. Normalization with salt suffix removal
assert.strictEqual(normalizeForTaxonomyMatch('Metoprolol Tartrate'), 'metoprolol');
assert.strictEqual(normalizeForTaxonomyMatch('Cephalexin Monohydrate'), 'cephalexin');
assert.strictEqual(normalizeForTaxonomyMatch('Ampicillin Sodium / Sulbactam Sodium [Unasyn]'), 'ampicillinsulbactam');
assert.strictEqual(normalizeForTaxonomyMatch('Furosemide'), 'furosemide');

// 2. Direct match lookup
const matchFurosemide = findTopDrugMatch('Furosemide');
assert.ok(matchFurosemide);
assert.strictEqual(matchFurosemide.therapeuticClassNumber, 11);
assert.ok(matchFurosemide.brandNames.includes('Lasix'));

// 3. Structure enrichment
const baseCephalexin: ChemicalStructure = {
  id: 'struct_cef',
  name: 'Cephalexin Monohydrate',
  chemicalClass: 'Cephalosporin',
  pharmacologicalClass: 'Cell wall inhibitor',
  target: 'PBP',
  reversibility: 'Irreversible',
  route: 'Oral',
  keyFunctionalGroups: ['Beta-lactam'],
  pkPdHighlights: { onset: '1h', duration: '6h', halfLife: '1h', elimination: 'Renal' },
  sarNotes: '1st-generation cephalosporin; beta-lactam core targeting transpeptidases (PBPs).',
};

const enriched = enrichStructureWithTaxonomy(baseCephalexin);
assert.strictEqual(enriched.therapeuticClassNumber, 2);
assert.strictEqual(enriched.therapeuticCategory, '2. Antibiotic');
assert.strictEqual(enriched.broadPharmacologicClass, 'Cephalosporin');
assert.strictEqual(enriched.specificPharmacologicClass, '1st Generation Cephalosporin');
assert.ok(enriched.brandNames?.includes('Keflex'));

// 4. Standalone Top 200 deck generation
const topCards = getTop200Flashcards();
assert.ok(topCards.length >= 100, 'Must generate >= 100 flashcards for Top Drugs');
assert.ok(topCards.every((c) => c.structure.therapeuticClassNumber !== undefined));

// 5. Therapeutic category extraction for cards
const categories = getTherapeuticCategoriesForCards(topCards);
assert.ok(categories.length > 0, 'Must extract therapeutic categories');
assert.ok(categories.some((cat) => cat.classNumber === 2 && cat.categoryName === '2. Antibiotic'));
assert.ok(categories.some((cat) => cat.classNumber === 11 && cat.categoryName.includes('Cardiovascular')));
// Verify sorted order
for (let i = 1; i < categories.length; i++) {
  assert.ok(categories[i].classNumber >= categories[i - 1].classNumber, 'Categories must be sorted by classNumber');
}

// 6. Deduplication and ID consistency check with generateBaseStructureId
const cefCard = topCards.find((c) => c.drugName.toLowerCase().includes('cephalexin'));
assert.ok(cefCard, 'Must have Cephalexin card in topCards');
assert.ok(cefCard.structureId.includes('cephalexin'), 'Structure ID must be based on normalized name');

// 7. Verify Fallback SMILES is valid on all cards
assert.ok(topCards.every((c) => typeof c.structure.smiles === 'string' && c.structure.smiles.length > 0), 'Every top card must have a non-empty SMILES string');

console.log('✓ Top Drugs taxonomy matching & enrichment tests passed');
