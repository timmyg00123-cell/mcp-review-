// tests/cumulativeStudyHubIntegration.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

console.log('Testing Practice Lab Workspace & App/Navbar Integration...');

// ---------------------------------------------------------------------------
// 1. Verify Navbar Navigation Restructuring Contract
// ---------------------------------------------------------------------------
const navbarContent = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
assert.ok(
  navbarContent.includes("'practice-lab'"),
  "Navbar must support 'practice-lab' in activeTab type definition"
);
assert.ok(
  navbarContent.includes('FlaskConical'),
  'Navbar must import and render FlaskConical icon from lucide-react for Practice Lab'
);
assert.ok(
  navbarContent.includes('Practice Lab'),
  'Navbar must render Practice Lab navigation tab'
);

// ---------------------------------------------------------------------------
// 2. Verify App.tsx Lazy-loading, ActiveTab & Keep-Alive Mounting
// ---------------------------------------------------------------------------
const appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// App must import and lazy-load PracticeLabView
assert.ok(
  appContent.includes('PracticeLabView'),
  'App.tsx must reference PracticeLabView'
);
assert.ok(
  appContent.includes("import('./components/PracticeLabView')") ||
    appContent.includes('import("./components/PracticeLabView")'),
  'App.tsx must lazy-load PracticeLabView'
);

// App must support 'practice-lab' in AppTab
assert.ok(
  appContent.includes("'practice-lab'"),
  "App.tsx must declare 'practice-lab' as an allowed AppTab"
);

// App must render PracticeLabView with keep-alive container
assert.ok(
  appContent.includes("activeTab === 'practice-lab'") &&
    appContent.includes("examStatus !== 'active'") &&
    appContent.includes("'flex flex-1 flex-col min-h-0' : 'hidden'"),
  "App.tsx must render PracticeLabView with keep-alive container ('flex flex-1 flex-col min-h-0' when active, 'hidden' when inactive or timed exam active)"
);

// App must pass exam props to PracticeLabView
assert.ok(
  appContent.includes('activeExamId={activeExamId}') &&
    appContent.includes('activeExam={activeExam}') &&
    appContent.includes('examModules={examModules}'),
  'App.tsx must pass activeExamId, activeExam, and examModules to PracticeLabView'
);

// Closed-book exam simulation eviction: handleStartExam must reset practice-lab
assert.ok(
  appContent.includes('handleStartExam'),
  'App.tsx must define handleStartExam'
);
// Verify that handleStartExam switches tab to 'document-review' if on 'practice-lab'
const startExamMatch = appContent.match(/const handleStartExam =[\s\S]*?\{([\s\S]*?)\n\s*\};/);
assert.ok(startExamMatch, 'handleStartExam implementation found in App.tsx');
assert.ok(
  startExamMatch[1].includes("'document-review'") &&
    (startExamMatch[1].includes("'practice-lab'") || startExamMatch[1].includes('switchTab') || startExamMatch[1].includes('setActiveTab')),
  "handleStartExam must evict active 'practice-lab' tab to 'document-review'"
);

// Legacy modal state removed from App.tsx
assert.ok(
  !appContent.includes('isCumulativeHubOpen'),
  'App.tsx must not maintain legacy isCumulativeHubOpen state'
);
assert.ok(
  !appContent.includes('setIsCumulativeHubOpen'),
  'App.tsx must not maintain legacy setIsCumulativeHubOpen state'
);
assert.ok(
  !appContent.includes('<CumulativeStudyHubModal'),
  'App.tsx must not render CumulativeStudyHubModal overlay'
);

// ---------------------------------------------------------------------------
// 3. Verify SettingsModal Retains Question & Structure Editor Button
// ---------------------------------------------------------------------------
assert.ok(
  fs.existsSync('src/components/SettingsModal.tsx'),
  'src/components/SettingsModal.tsx must exist'
);
const settingsModalContent = fs.readFileSync('src/components/SettingsModal.tsx', 'utf-8');
assert.ok(
  settingsModalContent.includes('onOpenEditor'),
  'SettingsModal must accept onOpenEditor prop'
);
assert.ok(
  settingsModalContent.includes('Open Question &amp; Structure Editor') ||
    settingsModalContent.includes('Open Question & Structure Editor') ||
    (settingsModalContent.includes('Structure Editor') && settingsModalContent.includes('onOpenEditor')),
  'SettingsModal must render Open Question & Structure Editor button'
);

// ---------------------------------------------------------------------------
// 4. Verify PracticeLabView Component Implementation Exists
// ---------------------------------------------------------------------------
assert.ok(
  fs.existsSync('src/components/PracticeLabView.tsx'),
  'src/components/PracticeLabView.tsx must exist'
);

const practiceLabContent = fs.readFileSync('src/components/PracticeLabView.tsx', 'utf-8');
assert.ok(
  practiceLabContent.includes('export interface PracticeLabViewProps'),
  'Must export PracticeLabViewProps interface'
);
assert.ok(
  practiceLabContent.includes('export const PracticeLabView') ||
    practiceLabContent.includes('export function PracticeLabView'),
  'Must export PracticeLabView component'
);
assert.ok(
  practiceLabContent.includes('CumulativePracticeTestView'),
  'Must integrate CumulativePracticeTestView'
);
assert.ok(
  practiceLabContent.includes('StructureFlashcardDeck'),
  'Must integrate StructureFlashcardDeck'
);
assert.ok(
  practiceLabContent.includes('StruggleDiagnosticOverview'),
  'Must integrate StruggleDiagnosticOverview'
);
assert.ok(
  practiceLabContent.includes('practice-test') &&
    practiceLabContent.includes('flashcards') &&
    practiceLabContent.includes('diagnostics'),
  'Must support sub-views: practice-test, flashcards, diagnostics'
);

console.log('Practice Lab workspace integration tests passed.');
