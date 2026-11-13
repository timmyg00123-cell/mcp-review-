# Practice Lab Full-Screen Workspace & Navigation Restructuring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Cumulative Study Hub from a floating popout modal into a first-class, full-screen top-level navigation workspace ("Practice Lab") situated between Review Deck and MedChem Matrix, while relocating Question Studio exclusively into Settings.

**Architecture:** Refactor `CumulativeStudyHubModal.tsx` into a dedicated full-viewport workspace view `PracticeLabView.tsx` with a top sub-navigation bar (Practice Tests, Flashcards, Diagnostics). Expand `activeTab` across `App.tsx` and `Navbar.tsx` with `'practice-lab'`, update the primary navbar tab strip sequence, remove the auxiliary right-toolbar pill, and maintain in-flight study session state using a keep-alive DOM container.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React icons, Node assert / tsx test runner.

**Spec:** `docs/superpowers/specs/2026-11-12-practice-lab-workspace-design.md`

## Global Constraints

- Full-Screen Viewport: `PracticeLabView` must fill the main workspace (`flex-1 min-h-0 flex flex-col`) with zero dialog overlays, backdrop dimmers, or Escape key listeners.
- Tab Sequence: `Dashboard` -> `Review Deck` -> `Practice Lab` -> `MedChem Matrix` -> `Knowledge Graph` (if enabled) -> `3D Lab`.
- Closed-Book Exam Rules: `practice-lab` must be disabled during active timed exam simulations (`examStatus === 'active'`), and starting an exam must evict to `document-review`.
- In-Progress State Preservation: Switching tabs away from Practice Lab and back must not reset in-flight practice test answers or flashcard positions (achieved via DOM visibility toggling: `hidden` when inactive).
- Blinding Guarantee: Structure flashcards in Practice Lab must never leak drug names, brand names, or taxonomy breadcrumbs on the un-flipped card face.
- TypeScript Rigor: Zero TypeScript errors (`npm run lint` / `tsc --noEmit`) and all tests passing.

## Review Focus

- Escape key handling: pressing Escape inside Practice Lab must not close or dismiss the workspace view.
- Closed-book exam boundary: attempting to switch to Practice Lab during an active exam simulation must be blocked.
- Keep-alive state: flipping to Review Deck and returning to Practice Lab must keep the active question / flashcard intact.
- Exam dropdown synchronization: switching the active exam in the top navbar must reactively update question bank and flashcard sets.
- Responsive navbar: on tablet viewports (>= 768px), Practice Lab must be accessible in the tab strip.

---

### Task 1: Dedicated Full-Screen Workspace Component (`PracticeLabView.tsx`)

**Files:**
- Create: `src/components/PracticeLabView.tsx`
- Modify: `src/components/CumulativeStudyHubModal.tsx` (re-export or lightweight adapter for backward compatibility)
- Test: `tests/PracticeLabView.test.ts`

**Interfaces:**
- Consumes:
  - `harvestCumulativeFlashcards` from `src/utils/cumulativeStructureHarvester.ts`
  - `getTop200Flashcards` from `src/utils/topDrugsTaxonomy.ts`
  - `getCumulativeQuestionBank` from `src/data/cumulativeQuizData.ts`
  - `generateStruggleReport` from `src/utils/struggleDiagnosticService.ts`
  - `CumulativePracticeTestView` from `src/components/CumulativePracticeTestView.tsx`
  - `StructureFlashcardDeck` from `src/components/StructureFlashcardDeck.tsx`
  - `StruggleDiagnosticOverview` from `src/components/StruggleDiagnosticOverview.tsx`
- Produces:
  - `PracticeLabView` component and `PracticeLabViewProps` interface
  - `PracticeLabTab` type (`'practice-test' | 'flashcards' | 'diagnostics'`)

- [ ] **Step 1: Write the failing unit and integration test**

Create `tests/PracticeLabView.test.ts`:
```typescript
import assert from 'node:assert';
import fs from 'node:fs';

console.log('Running PracticeLabView Component Verification Test...\n');

// 1. Verify file exists
const viewPath = 'src/components/PracticeLabView.tsx';
assert.ok(fs.existsSync(viewPath), 'src/components/PracticeLabView.tsx must exist');

const content = fs.readFileSync(viewPath, 'utf-8');

// 2. Verify interface and component exports
assert.ok(content.includes('export interface PracticeLabViewProps'), 'Must export PracticeLabViewProps');
assert.ok(content.includes('export const PracticeLabView') || content.includes('export function PracticeLabView'), 'Must export PracticeLabView component');
assert.ok(content.includes('export type PracticeLabTab'), 'Must export PracticeLabTab type');

// 3. Verify lack of modal dialog / backdrop wrappers
assert.ok(!content.includes('role="dialog"'), 'PracticeLabView must not have role="dialog"');
assert.ok(!content.includes('aria-modal="true"'), 'PracticeLabView must not be aria-modal');
assert.ok(!content.includes('bg-black/60'), 'PracticeLabView must not have modal backdrop dimmer');
assert.ok(!content.includes('Escape'), 'PracticeLabView must not register modal Escape key dismiss listener');

// 4. Verify sub-tabs navigation
assert.ok(content.includes('practice-test'), 'Must support practice-test sub-tab');
assert.ok(content.includes('flashcards'), 'Must support flashcards sub-tab');
assert.ok(content.includes('diagnostics'), 'Must support diagnostics sub-tab');

// 5. Verify child study views integration
assert.ok(content.includes('CumulativePracticeTestView'), 'Must integrate CumulativePracticeTestView');
assert.ok(content.includes('StructureFlashcardDeck'), 'Must integrate StructureFlashcardDeck');
assert.ok(content.includes('StruggleDiagnosticOverview'), 'Must integrate StruggleDiagnosticOverview');

// 6. Verify Top 200 catalog deck integration
assert.ok(content.includes('getTop200Flashcards'), 'Must integrate getTop200Flashcards');

console.log('✓ PracticeLabView component contracts verified.\n');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/PracticeLabView.test.ts`
Expected: FAIL (`src/components/PracticeLabView.tsx must exist`).

- [ ] **Step 3: Implement `PracticeLabView.tsx` and adapter in `CumulativeStudyHubModal.tsx`**

1. Create `src/components/PracticeLabView.tsx`:
   - Full-height page container: `<div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden">`.
   - Secondary sub-navigation bar: Sticky or top-anchored bar rendering Practice Tests, Structure Flashcards, and Diagnostics tabs.
   - Include active exam badge (`{currentExam.code}`) and chapter badge.
   - Retain full deck preset toggle (Curriculum vs Top 200 catalog), spaced repetition handlers, and struggle diagnostic drill generation.
   - Remove dialog wrappers (`role="dialog"`, `aria-modal="true"`), backdrop overlays (`fixed inset-0 bg-black/60`), modal max-width/max-height constraints (`max-w-6xl`, `max-h-[92vh]`), and `Escape` key close listeners.
2. In `src/components/CumulativeStudyHubModal.tsx`:
   - Re-export `PracticeLabView` as `CumulativeStudyHubModal` (or render `PracticeLabView` inside a thin modal shell if `isOpen` is passed) for full backward compatibility with any legacy imports.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/PracticeLabView.test.ts`
Expected: PASS.

- [ ] **Step 5: Run full existing test battery**

Run:
```bash
npx tsx tests/topDrugsTaxonomyData.test.ts
npx tsx tests/topDrugsTaxonomy.test.ts
npx tsx tests/StructureFlashcardCardFace.test.ts
npx tsx tests/StructureFlashcardDeck.test.ts
npx tsx tests/e2eCumulativeStudyHub.test.ts
```
Expected: ALL PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/PracticeLabView.tsx src/components/CumulativeStudyHubModal.tsx tests/PracticeLabView.test.ts
git commit -m "feat(practice-lab): create full-screen PracticeLabView component and modal adapter"
```

---

### Task 2: Navbar Navigation Restructuring (`Navbar.tsx`)

**Files:**
- Modify: `src/components/Navbar.tsx`
- Test: `tests/NavbarNavigation.test.ts`

**Interfaces:**
- Consumes:
  - `activeTab`: `'document-review' | 'matrix' | 'knowledge-graph' | 'dashboard' | '3d-lab' | 'practice-lab'`
  - `onSelectTab`: `(tab: ... | 'practice-lab') => void`
  - `examStatus`: `ExamModeStatus`
- Produces:
  - Primary "Practice Lab" tab in center tab strip
  - Removal of "Question Studio" from navbar tab strip
  - Removal of "Cumulative" pill button from right toolbar
  - Closed-book exam guard on `practice-lab` tab button

- [ ] **Step 1: Write the failing test**

Create `tests/NavbarNavigation.test.ts`:
```typescript
import assert from 'node:assert';
import fs from 'node:fs';

console.log('Running Navbar Navigation Restructuring Test...\n');

const navbarPath = 'src/components/Navbar.tsx';
const content = fs.readFileSync(navbarPath, 'utf-8');

// 1. Verify activeTab prop includes 'practice-lab'
assert.ok(content.includes("'practice-lab'"), "NavbarProps activeTab must include 'practice-lab'");

// 2. Verify tab placement in sequence: dashboard -> document-review -> practice-lab -> matrix
const reviewIndex = content.indexOf("onSelectTab('document-review')");
const practiceLabIndex = content.indexOf("onSelectTab('practice-lab')");
const matrixIndex = content.indexOf("onSelectTab('matrix')");

assert.ok(reviewIndex !== -1, "Must contain 'document-review' tab");
assert.ok(practiceLabIndex !== -1, "Must contain 'practice-lab' tab");
assert.ok(matrixIndex !== -1, "Must contain 'matrix' tab");
assert.ok(practiceLabIndex > reviewIndex, "Practice Lab must be positioned after Review Deck");
assert.ok(practiceLabIndex < matrixIndex, "Practice Lab must be positioned before MedChem Matrix");

// 3. Verify Question Studio tab removed from main tab strip
assert.ok(!content.includes("<span>Question Studio</span>"), "Question Studio must be removed from Navbar tab strip");

// 4. Verify old Cumulative pill button removed from right toolbar
assert.ok(!content.includes('title="Open Cumulative Study Hub: Practice Test'), "Old Cumulative right-toolbar button must be removed");

// 5. Verify closed-book exam guard (disabled or hidden when examStatus === 'active')
assert.ok(content.includes("disabled={examStatus === 'active'}"), "Navbar tabs must be disabled during active timed exam");

console.log('✓ Navbar navigation restructuring verified.\n');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/NavbarNavigation.test.ts`
Expected: FAIL (`Practice Lab must be positioned after Review Deck` or missing `'practice-lab'`).

- [ ] **Step 3: Update `Navbar.tsx`**

1. In `NavbarProps`:
   - Update `activeTab` and `onSelectTab` to:
     `'document-review' | 'matrix' | 'knowledge-graph' | 'dashboard' | '3d-lab' | 'practice-lab'`
   - Make `onOpenCumulativeHub` optional/deprecated.
2. In center tab strip:
   - Upgrade container from `hidden lg:flex` to `hidden md:flex overflow-x-auto`.
   - Insert "Practice Lab" button between `document-review` and `matrix`:
     - Text: `"Practice Lab"`
     - Icon: `FlaskConical` (`className="w-3.5 h-3.5 text-indigo-500"`)
     - Click handler: `onClick={() => onSelectTab('practice-lab')}`
     - Disabled guard: `disabled={examStatus === 'active'}`
     - Tooltip: `"Practice Lab: SAR deduction practice tests, rapid flashcards, and struggle diagnostics"`
3. Remove `{ !isStudentMode() && <button ...>Question Studio</button> }` from the tab strip.
4. Remove `{ onOpenCumulativeHub && <button ...>Cumulative</button> }` from the right-hand toolbar.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/NavbarNavigation.test.ts`
Expected: PASS.

- [ ] **Step 5: Run typecheck**

Run: `npm run lint` (`tsc --noEmit`)
Expected: Check for any remaining signature misalignments.

- [ ] **Step 6: Commit**

```bash
git add src/components/Navbar.tsx tests/NavbarNavigation.test.ts
git commit -m "feat(nav): add Practice Lab tab between Review Deck and Matrix, relocate Question Studio"
```

---

### Task 3: Main App Workspace Integration (`App.tsx`) & Full Regression

**Files:**
- Modify: `src/App.tsx`
- Modify: `tests/e2eCumulativeStudyHub.test.ts`
- Modify: `tests/cumulativeStudyHubIntegration.test.ts`

**Interfaces:**
- Consumes:
  - `PracticeLabView` from `src/components/PracticeLabView.tsx`
  - `Navbar` with `'practice-lab'` tab support
- Produces:
  - Full-screen Practice Lab workspace rendering in `App.tsx`
  - Keep-alive DOM container for in-progress session persistence
  - Closed-book timed exam simulation eviction

- [ ] **Step 1: Write integration test assertions**

Update `tests/cumulativeStudyHubIntegration.test.ts`:
- Assert `App.tsx` imports and lazy-loads `PracticeLabView`.
- Assert `App.tsx` supports `'practice-lab'` in `activeTab`.
- Assert `App.tsx` renders `PracticeLabView` with keep-alive container (`hidden` when inactive).
- Assert `handleStartExam` evicts user if on `'practice-lab'`.
- Assert SettingsModal retains "Open Question & Structure Editor" button.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/cumulativeStudyHubIntegration.test.ts`
Expected: FAIL due to missing `PracticeLabView` in `App.tsx`.

- [ ] **Step 3: Update `App.tsx`**

1. Replace lazy import:
   ```typescript
   const PracticeLabView = React.lazy(() =>
     import('./components/PracticeLabView').then((m) => ({ default: m.PracticeLabView }))
   );
   ```
2. Update `activeTab` type to include `'practice-lab'`.
3. In main content rendering, mount `PracticeLabView` using a keep-alive container:
   ```tsx
   <div className={activeTab === 'practice-lab' && examStatus !== 'active' ? 'flex flex-1 flex-col min-h-0' : 'hidden'}>
     <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Practice Lab...</div>}>
       <PracticeLabView
         activeExamId={activeExamId}
         activeExam={activeExam}
         examModules={examModules}
       />
     </React.Suspense>
   </div>
   ```
4. In `handleStartExam`:
   Ensure any active view on `practice-lab` resets to `'document-review'` when a timed exam begins.
5. Remove `isCumulativeHubOpen` state, `onOpenCumulativeHub` wiring, and modal overlay rendering block.

- [ ] **Step 4: Update `tests/e2eCumulativeStudyHub.test.ts`**

Update `tests/e2eCumulativeStudyHub.test.ts` step 8 to verify `PracticeLabView` integration contracts and keep-alive lifecycle.

- [ ] **Step 5: Run all test suites**

Run:
```bash
npx tsx tests/PracticeLabView.test.ts
npx tsx tests/NavbarNavigation.test.ts
npx tsx tests/cumulativeStudyHubIntegration.test.ts
npx tsx tests/e2eCumulativeStudyHub.test.ts
npx tsx tests/topDrugsTaxonomyData.test.ts
npx tsx tests/topDrugsTaxonomy.test.ts
npx tsx tests/StructureFlashcardCardFace.test.ts
npx tsx tests/StructureFlashcardDeck.test.ts
npx tsx tests/smartsDictionary.test.ts
```
Expected: ALL PASS.

- [ ] **Step 6: Run typecheck**

Run: `npm run lint` (`tsc --noEmit`)
Expected: PASS with 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx tests/cumulativeStudyHubIntegration.test.ts tests/e2eCumulativeStudyHub.test.ts
git commit -m "feat: integrate full-screen Practice Lab workspace and keep-alive lifecycle into App"
```
