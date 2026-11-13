// tests/StructureFlashcardCardFace.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

const filePath = 'src/components/StructureFlashcardCardFace.tsx';
assert.ok(fs.existsSync(filePath), `Target component file ${filePath} must exist`);

const fileContent = fs.readFileSync(filePath, 'utf8');

// =========================================================
// Test 1: Component exports and Props interface
// =========================================================
assert.ok(fileContent.includes('export interface StructureFlashcardCardFaceProps'), 'Must export StructureFlashcardCardFaceProps interface');
assert.ok(fileContent.includes('export const StructureFlashcardCardFace'), 'Must export StructureFlashcardCardFace component');
assert.ok(fileContent.includes('export interface FlashcardDisplaySettings'), 'Must export FlashcardDisplaySettings interface');
assert.ok(fileContent.includes('export const DEFAULT_FLASHCARD_DISPLAY_SETTINGS'), 'Must export DEFAULT_FLASHCARD_DISPLAY_SETTINGS constant');
assert.ok(fileContent.includes('displaySettings?: FlashcardDisplaySettings'), 'StructureFlashcardCardFaceProps must include optional displaySettings');

// =========================================================
// Test 2: Display Settings interface contract & defaults
// =========================================================
assert.ok(fileContent.includes("density: 'split' | 'structure-focus' | 'minimalist'"), 'FlashcardDisplaySettings must declare density modes');
assert.ok(fileContent.includes('showBrandNames: boolean'), 'FlashcardDisplaySettings must declare showBrandNames');
assert.ok(fileContent.includes('showTaxonomyBreadcrumbs: boolean'), 'FlashcardDisplaySettings must declare showTaxonomyBreadcrumbs');
assert.ok(fileContent.includes('showPharmacophoreTags: boolean'), 'FlashcardDisplaySettings must declare showPharmacophoreTags');
assert.ok(fileContent.includes('showClinicalPearls: boolean'), 'FlashcardDisplaySettings must declare showClinicalPearls');

// Defaults verification
assert.ok(fileContent.includes("density: 'split'"), "Default density must be 'split'");
assert.ok(fileContent.includes('showBrandNames: true'), 'Default showBrandNames must be true');
assert.ok(fileContent.includes('showTaxonomyBreadcrumbs: true'), 'Default showTaxonomyBreadcrumbs must be true');
assert.ok(fileContent.includes('showPharmacophoreTags: true'), 'Default showPharmacophoreTags must be true');
assert.ok(fileContent.includes('showClinicalPearls: true'), 'Default showClinicalPearls must be true');

// =========================================================
// Test 3: Front Face Blinding Requirements (Zero Leaks)
// =========================================================
assert.ok(fileContent.includes('Identify the Pharmacologic Class & Key Moieties'), 'Must display blinded front prompt');
assert.ok(fileContent.includes('Blinded Card Face'), 'Must display blinded badge');
assert.ok(fileContent.includes('Show Answer') || fileContent.includes('Flip Card'), 'Must provide Show Answer / Flip Card button');
assert.ok(fileContent.includes('!isFlipped'), 'Must have distinct unrevealed branch');

// Check that front face does NOT render drug names, brand names or taxonomy breadcrumbs
const frontFaceSection = fileContent.split('{!isFlipped && (')[1]?.split('{/* ========================================================= */}')[0] || '';
assert.ok(frontFaceSection.length > 0, 'Must contain unrevealed front face JSX block');
assert.ok(!frontFaceSection.includes('{cleanName}'), 'Front face must not expose drug cleanName');
assert.ok(!frontFaceSection.includes('structure.name'), 'Front face must not expose structure.name');
assert.ok(!frontFaceSection.includes('structure.brandNames'), 'Front face must not expose brandNames');
assert.ok(!frontFaceSection.includes('structure.tradeName'), 'Front face must not expose tradeName');
assert.ok(!frontFaceSection.includes('structure.therapeuticCategory'), 'Front face must not expose therapeuticCategory');
assert.ok(!frontFaceSection.includes('structure.broadPharmacologicClass'), 'Front face must not expose broadPharmacologicClass');
assert.ok(!frontFaceSection.includes('structure.specificPharmacologicClass'), 'Front face must not expose specificPharmacologicClass');
assert.ok(!frontFaceSection.includes('activePharmacophoresList'), 'Front face vector canvas must not receive activePharmacophoresList');

// Front face zoom modal must also remain blinded
assert.ok(fileContent.includes("isFlipped ? cleanName : 'Chemical Structure Vector View (Blinded)'"), 'Zoom modal header must stay blinded when not flipped');
assert.ok(fileContent.includes('activePharmacophores={isFlipped ? activePharmacophoresList : undefined}'), 'Zoom modal canvas must only pass active highlights when flipped');

// =========================================================
// Test 4: Taxonomy Breadcrumbs & Brand Badges on Back Face
// =========================================================
assert.ok(
  fileContent.includes('structure.therapeuticCategory') || fileContent.includes('therapeuticCategory'),
  'Back face must inspect therapeuticCategory'
);
assert.ok(
  fileContent.includes('structure.broadPharmacologicClass') || fileContent.includes('broadPharmacologicClass'),
  'Back face must inspect broadPharmacologicClass'
);
assert.ok(
  fileContent.includes('structure.specificPharmacologicClass') || fileContent.includes('specificPharmacologicClass'),
  'Back face must inspect specificPharmacologicClass'
);
assert.ok(fileContent.includes('›'), 'Back face must render breadcrumb hierarchy separator (›)');
assert.ok(fileContent.includes('Brand:'), 'Back face must render brand name label (Brand:)');
assert.ok(fileContent.includes('showBrandNames'), 'Back face must conditionally check showBrandNames');
assert.ok(
  fileContent.includes('showTaxonomyBreadcrumbs') || fileContent.includes('showHierarchyBreadcrumb'),
  'Back face must conditionally check breadcrumbs toggle'
);

// =========================================================
// Test 5: Interactive Pharmacophore State & Integration
// =========================================================
assert.ok(fileContent.includes('activePharmacophoreIds'), 'Must manage activePharmacophoreIds state');
assert.ok(fileContent.includes('hoveredPharmacophoreId'), 'Must manage hoveredPharmacophoreId state');
assert.ok(fileContent.includes('activePharmacophoresList'), 'Must derive activePharmacophoresList for SmilesCanvas');
assert.ok(fileContent.includes('PharmacophoreTagList'), 'Must mount PharmacophoreTagList component');
assert.ok(fileContent.includes('onTogglePharmacophore'), 'Must provide onTogglePharmacophore handler');
assert.ok(fileContent.includes('onHoverPharmacophore'), 'Must provide onHoverPharmacophore handler');
assert.ok(fileContent.includes('onClearAllHighlights'), 'Must provide onClearAllHighlights handler');
assert.ok(fileContent.includes('containerClassName="mt-2.5"'), 'Must pass containerClassName to PharmacophoreTagList');

// Both inline canvas and modal canvas must receive activePharmacophores
const canvasMatches = fileContent.match(/<SmilesCanvas[\s\S]*?\/>/g) || [];
assert.ok(canvasMatches.length >= 2, 'Must render at least two SmilesCanvas instances (inline and modal)');
const inlineCanvas = canvasMatches.find(c => c.includes('activePharmacophores={activePharmacophoresList}'));
assert.ok(inlineCanvas, 'Inline SmilesCanvas must receive activePharmacophores={activePharmacophoresList}');

// State reset on flip or structure id change
assert.ok(
  fileContent.includes('[structure.id, isFlipped]') || fileContent.includes('[isFlipped, structure.id]'),
  'Must reset active/hovered pharmacophore highlights when structure.id or isFlipped changes'
);

// =========================================================
// Test 6: Density Modes ('split', 'structure-focus', 'minimalist')
// =========================================================
assert.ok(fileContent.includes("density === 'split'"), "Must handle 'split' density mode");
assert.ok(fileContent.includes("density === 'structure-focus'"), "Must handle 'structure-focus' density mode");
assert.ok(fileContent.includes("density === 'minimalist'"), "Must handle 'minimalist' density mode");

// Verify 'split' mode has 2-column grid
assert.ok(fileContent.includes('grid grid-cols-1 lg:grid-cols-2'), "Split mode must use responsive 2-column grid 'grid grid-cols-1 lg:grid-cols-2'");

// Verify 'structure-focus' mode has expandable accordion details
assert.ok(fileContent.includes('<details') && fileContent.includes('<summary'), 'Structure-focus mode must provide expandable <details> accordion');
assert.ok(fileContent.includes('Clinical Pharmacology & SAR Details'), 'Structure-focus accordion must have descriptive summary label');

// Verify 'minimalist' mode has ultra-compact canvas view and omits large details
assert.ok(fileContent.includes('h-56') && fileContent.includes('compact={true}'), 'Minimalist mode must use compact canvas and tag presentation');

// Verify clinical pearls toggle
assert.ok(fileContent.includes('showClinicalPearls'), 'Must check showClinicalPearls toggle for clinical pharmacology sections');

// =========================================================
// Test 7: Children slot for Anki spaced repetition rating buttons
// =========================================================
assert.ok(fileContent.includes('{children}'), 'Must render children slot for Anki rating buttons');

console.log('✓ All StructureFlashcardCardFace tests passed!');
