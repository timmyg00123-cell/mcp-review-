// tests/cumulativeStudyHubIntegration.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

console.log('Testing Cumulative Study Hub Modal & App/Navbar Integration...');

// ---------------------------------------------------------------------------
// 1. Verify Navbar Contract & Trigger Integration
// ---------------------------------------------------------------------------
const navbarContent = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
assert.ok(
  navbarContent.includes('onOpenCumulativeHub?: () => void'),
  'NavbarProps must declare optional onOpenCumulativeHub callback'
);
assert.ok(
  navbarContent.includes('GraduationCap'),
  'Navbar must import and render GraduationCap icon from lucide-react'
);
assert.ok(
  navbarContent.includes('onOpenCumulativeHub') && navbarContent.includes('Cumulative'),
  'Navbar must render Cumulative Study Hub action button'
);

// ---------------------------------------------------------------------------
// 2. Verify App.tsx Lazy-loading & Modal Mounting
// ---------------------------------------------------------------------------
const appContent = fs.readFileSync('src/App.tsx', 'utf-8');
assert.ok(
  appContent.includes('CumulativeStudyHubModal'),
  'App.tsx must reference CumulativeStudyHubModal'
);
assert.ok(
  appContent.includes('isCumulativeHubOpen'),
  'App.tsx must maintain isCumulativeHubOpen state'
);
assert.ok(
  appContent.includes('onOpenCumulativeHub'),
  'App.tsx must pass onOpenCumulativeHub callback to Navbar'
);

// ---------------------------------------------------------------------------
// 3. Verify CumulativeStudyHubModal Component Implementation
// ---------------------------------------------------------------------------
assert.ok(
  fs.existsSync('src/components/CumulativeStudyHubModal.tsx'),
  'src/components/CumulativeStudyHubModal.tsx must exist'
);

const modalContent = fs.readFileSync('src/components/CumulativeStudyHubModal.tsx', 'utf-8');
assert.ok(
  modalContent.includes('export interface CumulativeStudyHubModalProps'),
  'Must export CumulativeStudyHubModalProps interface'
);
assert.ok(
  modalContent.includes('export const CumulativeStudyHubModal') ||
    modalContent.includes('export function CumulativeStudyHubModal'),
  'Must export CumulativeStudyHubModal component'
);
assert.ok(
  modalContent.includes('CumulativePracticeTestView'),
  'Must integrate CumulativePracticeTestView'
);
assert.ok(
  modalContent.includes('StructureFlashcardDeck'),
  'Must integrate StructureFlashcardDeck'
);
assert.ok(
  modalContent.includes('StruggleDiagnosticOverview'),
  'Must integrate StruggleDiagnosticOverview'
);
assert.ok(
  modalContent.includes('practice-test') &&
    modalContent.includes('flashcards') &&
    modalContent.includes('diagnostics'),
  'Must support tabs: practice-test, flashcards, diagnostics'
);
assert.ok(
  modalContent.includes('Escape') || modalContent.includes('keydown'),
  'Must listen for Escape key to close modal'
);

console.log('Cumulative study hub integration tests passed.');
