# Design Specification: Practice Lab Full-Screen Workspace & Navigation Restructuring

**Date:** 2026-11-12  
**Status:** In Review  
**Author:** Antigravity / Google DeepMind  
**Topic:** Transition Cumulative Study Hub from Popout Modal to Full-Screen "Practice Lab" Tab  

---

## 1. Intent & The Why

### Background
Currently, the cross-curriculum study capabilities (Practice Tests, Rapid Structure Flashcards, and Struggle Diagnostics) are housed in `CumulativeStudyHubModal.tsx`. This component is launched from a floating pill button in the top-right toolbar of `Navbar.tsx` and renders as a centered popout dialog modal (`max-w-6xl`, `max-h-[92vh]`) with a dimmed backdrop.

### Problem
1. **Viewport Constraints**: Flashcards (especially in split density with 2D vector canvases and interactive pharmacophore tags) and multi-select clinical vignette questions feel cramped inside a fixed-height modal window.
2. **Accidental Dismissals**: Because it is mounted as a dialog with Escape key and backdrop-click handlers, students risk accidentally closing active flashcard reviews or practice exams mid-session.
3. **Disjointed Navigation**: Long-term memorization and practice testing represent a core, primary study modality of the platform. Hiding it behind an auxiliary toolbar button rather than a primary top-level navigation tab obscures its value.
4. **Navbar Crowding**: The main tab strip currently contains an authoring tool ("Question Studio"), which is seldom used during primary student study sessions and creates unnecessary visual clutter.

### Intent
Promote the cumulative study hub into a primary, full-screen top-level navigation tab named **"Practice Lab"** situated directly between **"Review Deck"** and **"MedChem Matrix"**. Relocate **Question Studio** exclusively into the Settings modal, and eliminate the old auxiliary toolbar pill.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Full-Screen Workspace**: Replace the floating modal wrapper with a dedicated `PracticeLabView.tsx` component that occupies the entire main workspace area (`flex-1 min-h-0`) below `Navbar.tsx`.
- **Primary Tab Integration**: Add `'practice-lab'` to `activeTab` across `App.tsx` and `Navbar.tsx`. Position the **Practice Lab** tab button between `Review Deck` and `MedChem Matrix`.
- **Top Toolbar Streamlining**: Remove the "Cumulative" pill button from the right toolbar of `Navbar.tsx`.
- **Settings Relocation for Question Studio**: Remove the "Question Studio" tab button from the main navbar tab strip. Verify that Question Studio can still be launched via the existing button inside `SettingsModal.tsx`.
- **Retain Core Sub-Workflows**: Preserve all three sub-modes within Practice Lab:
  1. 📝 **Practice Tests** (`practice-test`)
  2. 🗂️ **Structure Flashcards** (`flashcards`) with curriculum vs. Top 200 catalog deck switcher, 39 therapeutic class cascading filters, display settings popover, and interactive pharmacophore highlighting.
  3. 📊 **Struggle Diagnostics** (`diagnostics`) with friction reports and 1-click remediation drill generation.
- **Synchronized Exam Scoping**: Keep Practice Lab synchronized with the active exam selected in the top-left exam dropdown (`activeExamId`, `activeExam`, `examModules`).

### Non-Goals
- Modifying the internal logic of `CumulativePracticeTestView.tsx`, `StructureFlashcardDeck.tsx`, or `StruggleDiagnosticOverview.tsx`.
- Changing how spaced repetition intervals or struggle diagnostics are calculated.
- Redesigning the Question Studio modal itself.

### Anti-Goals
- Retaining modal backdrop classes, fixed positioning, or Escape-key window dismissal inside `PracticeLabView`.
- Breaking backward compatibility with existing tests that reference cumulative flashcard harvesting or quiz data banks.
- Leaking drug names or taxonomy metadata on the un-flipped face of flashcards.

---

## 3. Constraints

- **Responsive Viewport**: The layout must accommodate screens from mobile/tablet up to large desktop monitors without vertical clipping or horizontal overflow. In `Navbar.tsx`, tab strip responsiveness is upgraded to `hidden md:flex overflow-x-auto`.
- **Zero Loss of In-Progress State (Keep-Alive)**: Switching tabs away from Practice Lab to Review Deck or MedChem Matrix and back must not wipe Anki card queue states, active question answers, or diagnostic progress. Handled via a keep-alive DOM container pattern (`hidden` when inactive).
- **Closed-Book Timed Exam Enforcement**: Like all secondary study tabs (Matrix, Dashboard, 3D Lab), Practice Lab is locked out when an official Timed Exam simulation is active (`examStatus === 'active'`). Starting an exam evicts the user to `document-review`.
- **Zero Modal Traps**: When rendered as a page view, pressing `Escape` or clicking whitespace must not "close" the tab.
- **TypeScript Integrity**: Zero compiler errors (`tsc --noEmit` / `npm run lint`).

---

## 4. Approaches Considered

### Approach A: Dedicated Full-Screen Workspace Component (`PracticeLabView`) [SELECTED]
- **Architecture**:
  - Refactor `CumulativeStudyHubModal.tsx` into a first-class full-page workspace component `PracticeLabView.tsx` (re-exporting a thin adapter if any legacy imports require `CumulativeStudyHubModal`).
  - Expand `activeTab` type to `'document-review' | 'matrix' | 'knowledge-graph' | 'dashboard' | '3d-lab' | 'practice-lab'`.
  - In `Navbar.tsx`, position the `Practice Lab` tab (with `FlaskConical` icon) directly between `Review Deck` and `MedChem Matrix`.
  - Remove `Question Studio` from the navbar tab bar.
  - Remove the floating right-side "Cumulative" pill button from `Navbar.tsx`.
  - In `App.tsx`, render `<PracticeLabView ... />` directly in the main layout container when `activeTab === 'practice-lab'`.
- **Trade-offs**: Cleanest architecture, complete separation of concerns, zero modal artifacts, and optimal screen real estate.
- **Selection Rationale**: Approved by user as the cleanest and most cohesive long-term structure.

### Approach B: Wrapper / Inline Embed of Existing Hub Modal
- **Architecture**:
  - Keep `CumulativeStudyHubModal.tsx` as a dialog modal, but add an `isEmbedded?: boolean` prop that conditionally removes the backdrop overlay and fixed positioning.
- **Trade-offs**: Retains modal logic (like escape key hooks) inside regular page flow, resulting in conditional layout bloat and potential focus/event leaks.
- **Selection Rationale**: Rejected in favor of Approach A.

### Approach C: Split Independent Top-Level Tabs (`Practice Tests` & `Flashcards`)
- **Architecture**:
  - Promote Practice Tests and Flashcards into two separate navbar tabs.
- **Trade-offs**: Crowds the navbar, fragments the struggle diagnostic feedback loop, and contradicts user request.
- **Selection Rationale**: Rejected.

---

## 5. Detailed Component & Navigation Specification

### 5.1 Navbar Tab Sequence & Layout
In `src/components/Navbar.tsx`:
1. **Tab Strip Order**:
   - `Dashboard` (`dashboard`)
   - `Review Deck` (`document-review`)
   - **`Practice Lab`** (`practice-lab`) [NEW]
   - `MedChem Matrix` (`matrix`)
   - `Knowledge Graph` (`knowledge-graph`, if enabled)
   - `3D Lab` (`3d-lab`)
2. **Tab Styling**:
   - Icon: `FlaskConical` (or `GraduationCap`), text: `"Practice Lab"`.
   - Active highlight: matching standard navbar active tab styling (`bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs`).
3. **Removals**:
   - Remove `{ !isStudentMode() && <button ...>Question Studio</button> }` from the tab strip.
   - Remove `{ onOpenCumulativeHub && <button ...>Cumulative</button> }` from the right tool strip.

### 5.2 Settings Modal Question Studio Access
In `src/components/SettingsModal.tsx`:
- Confirm Section 3 ("Question & Structure Editor") remains intact with its prominent "Open Question & Structure Editor" button triggering `onOpenEditor()`.
- Ensure it is clearly visible to instructors and authors.

### 5.3 Practice Lab Workspace View (`src/components/PracticeLabView.tsx`)
1. **Container Structure**:
   ```tsx
   <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden">
     {/* Sub-Header / Secondary Mode Navigation Bar */}
     <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 flex items-center justify-between gap-4 shrink-0 backdrop-blur-xs">
       ...
     </div>
     {/* Workspace Content Area */}
     <main className="flex-1 overflow-y-auto min-h-0">
       ...
     </main>
   </div>
   ```
2. **Sub-Navigation Modes**:
   - 📝 **Practice Tests** (`practice-test`)
   - 🗂️ **Structure Flashcards** (`flashcards`)
   - 📊 **Struggle Diagnostics** (`diagnostics`)
3. **Exam Context Integration**:
   - Displays active exam badge (e.g. `EXAM 3`) and short title.
   - Displays chapter coverage pills.
4. **Legacy Compatibility**:
   - Re-export `PracticeLabView` as `CumulativeStudyHubModal` (or provide a lightweight modal adapter) to prevent breaking existing test imports if needed.

### 5.4 App Layout Integration & State Lifecycle (`src/App.tsx`)
1. Add `'practice-lab'` to `activeTab` state type.
2. In main content rendering, mount `PracticeLabView` using a keep-alive container so in-flight questions and flashcards are not destroyed during quick slide reference lookups:
   ```tsx
   <div className={activeTab === 'practice-lab' && examStatus !== 'active' ? 'flex flex-1 flex-col min-h-0' : 'hidden'}>
     <React.Suspense fallback={<LoadingSpinner />}>
       <PracticeLabView
         activeExamId={activeExamId}
         activeExam={activeExam}
         examModules={examModules}
       />
     </React.Suspense>
   </div>
   ```
3. In `handleStartExam`, ensure any active session in `practice-lab` is evicted to `'document-review'` to maintain strict exam simulation isolation.
4. Remove `isCumulativeHubOpen` state and floating modal rendering block.

### 5.5 Architectural Calls Settled During Builder Review
- **Keep-Alive Tab Lifecycle**: By utilizing DOM visibility toggling (`hidden` when inactive) rather than conditional unmounting, active practice test answers and flashcard queues survive seamless back-and-forth navigation to lecture slides without altering child component internals.
- **Closed-Book Exam Guard**: Practice Lab is strictly closed-book during timed module simulations (`examStatus === 'active'`), consistent with Matrix, Dashboard, and 3D Lab.
- **Scope Reactivity**: Switching the active exam in the Navbar reactively scopes curriculum flashcards and question sets to the newly selected exam.
- **Responsive Nav Width**: Navbar tab bar upgraded to `hidden md:flex overflow-x-auto` to ensure Practice Lab is fully reachable on tablets and intermediate viewports.

---

## 6. What's Left to the Builder
- Choosing the exact Lucide icon for Practice Lab (`FlaskConical` vs `GraduationCap`; `FlaskConical` recommended for "Lab").
- Tuning padding and spacing in `PracticeLabView` so flashcards take full advantage of wide viewports.
- Updating test suites (`tests/cumulativeStudyHubIntegration.test.ts`, `tests/e2eCumulativeStudyHub.test.ts`) to validate the new `PracticeLabView` component and tab interactions.
