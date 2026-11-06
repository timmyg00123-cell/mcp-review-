// tests/StructureFlashcardCardFace.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

const filePath = 'src/components/StructureFlashcardCardFace.tsx';
assert.ok(fs.existsSync(filePath), `Target component file ${filePath} must exist`);

const fileContent = fs.readFileSync(filePath, 'utf8');

// Test 1: Component exports and Props interface
assert.ok(fileContent.includes('export interface StructureFlashcardCardFaceProps'), 'Must export StructureFlashcardCardFaceProps interface');
assert.ok(fileContent.includes('export const StructureFlashcardCardFace'), 'Must export StructureFlashcardCardFace component');

// Test 2: Imports Clinical Pharmacology dictionary and SmilesCanvas
assert.ok(fileContent.includes("from '../utils/clinicalPharmacologyDictionary'"), 'Must import from clinicalPharmacologyDictionary');
assert.ok(fileContent.includes('resolveClinicalPharmacology'), 'Must invoke resolveClinicalPharmacology');
assert.ok(fileContent.includes('SmilesCanvas'), 'Must render SmilesCanvas');

// Test 3: High-contrast canvas background
assert.ok(fileContent.includes('var(--structure-canvas-bg)'), 'Must use --structure-canvas-bg for canvas container');

// Test 4: Front face blinding requirements
assert.ok(fileContent.includes('Identify the Pharmacologic Class & Key Moieties'), 'Must display blinded front prompt');
assert.ok(fileContent.includes('Show Answer') || fileContent.includes('Flip Card'), 'Must provide Show Answer / Flip Card button');

// Test 5: Click-to-zoom modal
assert.ok(fileContent.includes('isZoomModalOpen') || fileContent.includes('zoomModal') || fileContent.includes('ZoomIn'), 'Must provide click-to-zoom modal capability');

// Test 6: Option B Two-Column Split Layout on back face
assert.ok(fileContent.includes('lg:grid-cols-2') || fileContent.includes('grid-cols-2'), 'Must use responsive two-column grid on back face');
assert.ok(fileContent.includes('Metabolism') || fileContent.includes('Bioactivation'), 'Must display Metabolism & Bioactivation section');
assert.ok(fileContent.includes('BBB') || fileContent.includes('Blood-Brain Barrier'), 'Must display Blood-Brain Barrier section');
assert.ok(fileContent.includes('Pregnancy') || fileContent.includes('Teratogen'), 'Must display Pregnancy Profile section');
assert.ok(fileContent.includes('SAR') || fileContent.includes('Structure-Activity Relationship'), 'Must display SAR Notes section');

// Test 7: Pharmacophore and property tags
assert.ok(fileContent.includes('keyFunctionalGroups') || fileContent.includes('pharmacophore'), 'Must render pharmacophore tags');
assert.ok(fileContent.includes('mw') || fileContent.includes('Molecular Wt'), 'Must render MW stat');
assert.ok(fileContent.includes('logP'), 'Must render LogP stat');
assert.ok(fileContent.includes('target'), 'Must render Target stat');

// Test 8: Slot for Anki spaced repetition rating buttons
assert.ok(fileContent.includes('{children}'), 'Must render children slot for Anki rating buttons');

console.log('StructureFlashcardCardFace tests passed!');
