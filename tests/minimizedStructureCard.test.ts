import assert from 'node:assert';
import fs from 'node:fs';

const fileContent = fs.readFileSync('src/components/MinimizedStructureCard.tsx', 'utf8');

// Test 1: Verify component exports and props structure
assert(fileContent.includes('export interface MinimizedStructureCardProps'), 'Must export MinimizedStructureCardProps');
assert(fileContent.includes('export const MinimizedStructureCard: React.FC<MinimizedStructureCardProps>'), 'Must export MinimizedStructureCard React component');

// Test 2: Must import authoritative chemical class resolver and structure utils
assert(fileContent.includes("from '../utils/chemicalClassDictionary'"), 'Must import from chemicalClassDictionary');
assert(fileContent.includes('resolveChemicalClass(structure)'), 'Must call resolveChemicalClass(structure)');

// Test 3: Must render SmilesCanvas for high-contrast structure visualization
assert(fileContent.includes('<SmilesCanvas'), 'Must render SmilesCanvas');
assert(fileContent.includes('var(--structure-canvas-bg)'), 'Must use --structure-canvas-bg for canvas container');

// Test 4: Must support exam mode blinding
assert(fileContent.includes('[Blinded for exam]'), 'Must support exam mode blinding text');
assert(fileContent.includes('onTogglePeek'), 'Must support onTogglePeek callback');

// Test 5: Must contain stat badges (MW, LogP, Drug State, Target, Reversibility)
assert(fileContent.includes('Molecular Wt') || fileContent.includes('MW'), 'Must include Molecular Weight badge');
assert(fileContent.includes('LogP'), 'Must include LogP badge');
assert(fileContent.includes('Drug State'), 'Must include Drug State badge');
assert(fileContent.includes('Target'), 'Must include Target badge');
assert(fileContent.includes('Reversibility'), 'Must include Reversibility badge');

// Test 6: Must support zoom and select interactions
assert(fileContent.includes('onZoom'), 'Must support onZoom callback');
assert(fileContent.includes('onToggleSelect'), 'Must support onToggleSelect callback');

console.log('Task 3 MinimizedStructureCard tests passed!');
