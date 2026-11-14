import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  TherapeuticClassFilterDrawer,
  type TherapeuticClassFilterDrawerProps,
} from '../src/components/TherapeuticClassFilterDrawer';
import type { FlashcardItem } from '../src/types/cumulativeStudy';
import {
  ALL_THERAPEUTIC_CLASS_NUMBERS,
  ORGAN_SYSTEM_CLUSTERS,
} from '../src/utils/therapeuticClassFilter';

console.log('Running TherapeuticClassFilterDrawer contract & functional tests...\n');

const drawerPath = 'src/components/TherapeuticClassFilterDrawer.tsx';
assert.ok(fs.existsSync(drawerPath), `Drawer file ${drawerPath} must exist`);

const content = fs.readFileSync(drawerPath, 'utf-8');

// --- Contract Tests ---

// Test 1: Interface exports
assert.ok(
  content.includes('export interface TherapeuticClassFilterDrawerProps'),
  'Must export TherapeuticClassFilterDrawerProps'
);
assert.ok(
  content.includes('export const TherapeuticClassFilterDrawer'),
  'Must export TherapeuticClassFilterDrawer'
);

// Test 2: Required props
assert.ok(content.includes('isOpen: boolean'), 'Must accept isOpen');
assert.ok(content.includes('onClose: () => void'), 'Must accept onClose');
assert.ok(content.includes('selectedClassNumbers: Set<number>'), 'Must accept selectedClassNumbers');
assert.ok(content.includes('onSelectionChange: ('), 'Must accept onSelectionChange');

// Test 3: Strict 1-39 Ascending Ordering
assert.ok(
  content.includes('ALL_THERAPEUTIC_CLASS_NUMBERS') || content.includes('categories.map'),
  'Must map all 39 categories'
);
assert.ok(
  content.includes('1. Analgesics') || content.includes('cat.classNumber') || content.includes('classNumber'),
  'Must display numeric class labels 1 to 39'
);

// Test 4: Left-hand scrubber rail with pointer capture and touch-action: none
assert.ok(
  content.includes('setPointerCapture'),
  'Must use HTML5 setPointerCapture for drag scrubbing'
);
assert.ok(
  content.includes('touch-action: none') || content.includes('touch-none'),
  'Must apply touch-action: none strictly to slide rail'
);
assert.ok(
  content.includes('onPointerDown') && content.includes('onPointerMove') && content.includes('onPointerUp'),
  'Must wire onPointerDown, onPointerMove, and onPointerUp'
);
assert.ok(
  content.includes('onLostPointerCapture') || content.includes('releasePointerCapture'),
  'Must safely handle lost pointer capture when dragging off-screen (Review Focus 4)'
);

// Test 5: Organ system cluster presets (Isolate Mode)
assert.ok(content.includes('Cardio'), 'Must include Cardio cluster button');
assert.ok(content.includes('CNS') || content.includes('Psych'), 'Must include CNS cluster button');
assert.ok(content.includes('Anti-Infective'), 'Must include Anti-Infective cluster button');
assert.ok(content.includes('Endocrine') || content.includes('Metabolic'), 'Must include Endocrine cluster button');
assert.ok(content.includes('Select All') || content.includes('All (1-39)'), 'Must include Select All button');
assert.ok(content.includes('Deselect All'), 'Must include Deselect All button');

// Test 6: Checkbox and count badges
assert.ok(content.includes('type="checkbox"'), 'Must render explicit checkbox for each class');
assert.ok(content.includes('drugCount') || content.includes('count') || content.includes('cards'), 'Must render drug counts');

// --- Functional Component Rendering Tests ---

// Test 7: Closed state returns nothing
const closedHtml = renderToString(
  React.createElement(TherapeuticClassFilterDrawer, {
    isOpen: false,
    onClose: () => {},
    selectedClassNumbers: new Set([1, 2, 3]),
    onSelectionChange: () => {},
  })
);
assert.strictEqual(closedHtml, '', 'Drawer should render nothing when isOpen is false');

// Test 8: Open state renders modal dialog with 39 rows and active counter
const cardioClasses = new Set([10, 11, 12, 13, 14, 15]);
const openHtml = renderToString(
  React.createElement(TherapeuticClassFilterDrawer, {
    isOpen: true,
    onClose: () => {},
    selectedClassNumbers: cardioClasses,
    onSelectionChange: () => {},
  })
);
assert.ok(openHtml.includes('role="dialog"'), 'Must have role="dialog"');
assert.ok(openHtml.includes('Filter Therapeutic Classes (1–39)'), 'Must have title');
assert.ok(openHtml.includes('6/39 Active'), 'Must display correct active count badge');
assert.ok(openHtml.includes('Select All (1–39)'), 'Must have Select All button');
assert.ok(openHtml.includes('Deselect All'), 'Must have Deselect All button');

// Test 9: Organ system clusters are rendered
assert.ok(openHtml.includes('Cardio (10–15)'), 'Must render Cardio cluster');
assert.ok(openHtml.includes('CNS &amp; Psych') || openHtml.includes('CNS & Psych'), 'Must render CNS cluster');
assert.ok(openHtml.includes('Anti-Infective'), 'Must render Anti-Infective cluster');
assert.ok(openHtml.includes('Endocrine / Metabolic'), 'Must render Endocrine cluster');

// Test 10: Strict Ascending 1 to 39 Order
const pos1 = openHtml.indexOf('1. Analgesic');
const pos10 = openHtml.indexOf('10. Cardiovascular');
const pos20 = openHtml.indexOf('20. Anxiolytics');
const pos39 = openHtml.indexOf('39. Thyroid Product');

assert.ok(pos1 !== -1, 'Must render class 1');
assert.ok(pos10 !== -1, 'Must render class 10');
assert.ok(pos20 !== -1, 'Must render class 20');
assert.ok(pos39 !== -1, 'Must render class 39');

assert.ok(pos1 < pos10, 'Class 1 must appear before Class 10');
assert.ok(pos10 < pos20, 'Class 10 must appear before Class 20');
assert.ok(pos20 < pos39, 'Class 20 must appear before Class 39');

// Test 11: Drag rail attributes
assert.ok(openHtml.includes('touch-action:none'), 'Grip rail must include touch-action: none style');
assert.ok(openHtml.includes('data-class-number="1"'), 'Rows must declare data-class-number="1"');
assert.ok(openHtml.includes('data-class-number="39"'), 'Rows must declare data-class-number="39"');

// Test 12: Drug counts calculated from cards prop
const mockCards: FlashcardItem[] = [
  {
    id: 'c1',
    drugName: 'Aspirin',
    structure: { therapeuticClassNumber: 1 },
  } as unknown as FlashcardItem,
  {
    id: 'c2',
    drugName: 'Ibuprofen',
    structure: { therapeuticClassNumber: 1 },
  } as unknown as FlashcardItem,
  {
    id: 'c3',
    drugName: 'Metoprolol',
    structure: { therapeuticClassNumber: 10 },
  } as unknown as FlashcardItem,
];

const cardsHtml = renderToString(
  React.createElement(TherapeuticClassFilterDrawer, {
    isOpen: true,
    onClose: () => {},
    selectedClassNumbers: new Set([1]),
    onSelectionChange: () => {},
    cards: mockCards,
  })
);

// Class 1 has 2 drugs, Class 10 has 1 drug, Class 2 has 0 drugs
assert.ok(cardsHtml.includes('2 drugs'), 'Must render 2 drugs for class 1');
assert.ok(cardsHtml.includes('1 drug'), 'Must render 1 drug for class 10');
assert.ok(cardsHtml.includes('0 drugs'), 'Must render 0 drugs for class 2');

console.log('TherapeuticClassFilterDrawer contract tests passed.');
