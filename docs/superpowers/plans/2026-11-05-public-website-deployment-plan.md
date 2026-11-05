# Public Website Deployment & Student-Mode Gating Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure the MedChem II review platform for high-speed public web hosting on Vercel as a standalone static Single-Page Application, gating authoring and AI tools in production so students enjoy a clean, distraction-free study portal.

**Architecture:** A lightweight environment utility (`envMode.ts`) evaluates build mode (`import.meta.env.PROD` with `VITE_STUDENT_MODE` override). In production/student mode, authoring and AI tools (slide uploader, module editor, and AI tutor panel) are hidden from the UI while all 4 core study modules, question rationales, chemical structures, matrices, and exam modes remain fully active. A root `vercel.json` configures SPA rewrites and proper WebAssembly/worker headers for global CDN delivery.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, Lucide Icons, Vercel SPA Hosting

**Spec:** `docs/superpowers/specs/2026-11-05-public-website-deployment-design.md`

## Global Constraints
* In production builds (`import.meta.env.PROD = true`), `isStudentMode()` must default to `true`.
* In development mode (`import.meta.env.DEV = true`), `isStudentMode()` must default to `false`.
* An explicit `VITE_STUDENT_MODE=true` or `VITE_STUDENT_MODE=false` environment variable must take precedence over default mode.
* Student mode must hide AI Tutor (`Sparkles`), slide importer (`MedChemReviewImporterModal`), and module editing/deletion controls.
* All 4 core review modules (Chapters 8, 9, 10, 11), quizzes, rationales, workbench, structure comparator, and exam mode must remain 100% interactive.
* Static distribution bundle must build cleanly via `npm run build` and pass strict TypeScript validation (`npx tsc --noEmit`).

## Review Focus
1. **Accidental core module deletion in student mode**: When a student explores the module selector, core course modules must not expose destructive delete or edit buttons.
2. **WebAssembly MIME type delivery**: On static hosting, `.wasm` files (`RDKit_minimal.wasm`) must be served with `Content-Type: application/wasm` without failing RDKit initialization.
3. **SPA deep-link / page refresh 404s**: Navigating or refreshing on any client route must be rewritten by `vercel.json` to `/index.html`.
4. **Developer tool leakage**: In production mode, keyboard shortcuts or stray modals for slide ingestion or AI tutor must not pop up or attempt to call offline `/api/gemini` backend routes.
5. **Private IndexedDB isolation**: Each visitor's answers and theme preferences must stay in their own local browser storage without cross-student collisions.

---

### Task 1: Environment Gating Utility & Unit Tests

**Files:**
- Create: `src/utils/envMode.ts`
- Test: `tests/envModeGating.test.ts`

**Interfaces:**
- Consumes: `import.meta.env.PROD`, `import.meta.env.DEV`, `import.meta.env.VITE_STUDENT_MODE`
- Produces: `isStudentMode(): boolean`, `isAuthoringAllowed(): boolean`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/envModeGating.test.ts
import assert from 'node:assert';
import { evaluateStudentMode, evaluateAuthoringAllowed } from '../src/utils/envMode';

// Test 1: Production defaults to student mode
assert.strictEqual(
  evaluateStudentMode({ PROD: true, DEV: false }),
  true,
  'Production build must default to student mode'
);

// Test 2: Development defaults to authoring mode (not student mode)
assert.strictEqual(
  evaluateStudentMode({ PROD: false, DEV: true }),
  false,
  'Development build must default to authoring mode'
);

// Test 3: Explicit VITE_STUDENT_MODE override
assert.strictEqual(
  evaluateStudentMode({ PROD: false, DEV: true, VITE_STUDENT_MODE: 'true' }),
  true,
  'VITE_STUDENT_MODE="true" override must force student mode even in DEV'
);

assert.strictEqual(
  evaluateStudentMode({ PROD: true, DEV: false, VITE_STUDENT_MODE: 'false' }),
  false,
  'VITE_STUDENT_MODE="false" override must allow authoring even in PROD'
);

// Test 4: Authoring allowed helper
assert.strictEqual(evaluateAuthoringAllowed({ PROD: true, DEV: false }), false);
assert.strictEqual(evaluateAuthoringAllowed({ PROD: false, DEV: true }), true);

console.log('Task 1 envModeGating tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/envModeGating.test.ts`  
Expected: FAIL with module `../src/utils/envMode` not found.

- [ ] **Step 3: Implement `src/utils/envMode.ts`**

Implement `evaluateStudentMode(env)` and `evaluateAuthoringAllowed(env)` pure functions alongside runtime parameterless wrappers `isStudentMode()` and `isAuthoringAllowed()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/envModeGating.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/envMode.ts tests/envModeGating.test.ts
git commit -m "feat: add environment gating utility for student mode"
```

---

### Task 2: Student-Mode Navbar & App UI Gating

**Files:**
- Modify: `src/components/Navbar.tsx:80-130,230-310,480-550`
- Modify: `src/App.tsx:320-360,540-580`
- Test: `tests/studentModeUiGating.test.ts`

**Interfaces:**
- Consumes: `isStudentMode()` from `src/utils/envMode.ts`
- Produces: Gated UI that renders AI Tutor and slide ingestion in dev mode, but hides them completely in student mode.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/studentModeUiGating.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const navbarSource = fs.readFileSync(path.resolve('src/components/Navbar.tsx'), 'utf-8');
const appSource = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');

assert.ok(
  navbarSource.includes('isStudentMode'),
  'Navbar.tsx must import and check isStudentMode'
);
assert.ok(
  appSource.includes('isStudentMode'),
  'App.tsx must import and check isStudentMode'
);

console.log('Task 2 studentModeUiGating tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/studentModeUiGating.test.ts`  
Expected: FAIL with assertion error that `Navbar.tsx` does not include `isStudentMode`.

- [ ] **Step 3: Implement gating in `Navbar.tsx` and `App.tsx`**

1. In `Navbar.tsx`:
   - Import `isStudentMode` from `../utils/envMode`.
   - If `isStudentMode()`, do not render the AI Tutor button (`Sparkles`), the "Import Slides" button (`Upload`), or the JSON Import button in the Tools menu.
   - If `isStudentMode()`, do not render the "Edit Module" button (`Edit3`).
   - If `isStudentMode()`, disable or hide the delete module trash icon for built-in core module IDs (`antiplatelets_mcp2`, `anticoagulants_mcp2`, `heart_failure_mcp2`, `antiarrhythmic_drugs_mcp2`).
2. In `App.tsx`:
   - Import `isStudentMode` from `./utils/envMode`.
   - Only render `<AITutorPanel>` if `!isStudentMode() && showTutor`.
   - Only render `<MedChemReviewImporterModal>` if `!isStudentMode() && isImporterOpen`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/studentModeUiGating.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.tsx src/App.tsx tests/studentModeUiGating.test.ts
git commit -m "feat: gate AI tutor, slide importer, and module editing in student mode"
```

---

### Task 3: Vercel SPA Configuration & Static Assets Setup

**Files:**
- Create: `vercel.json`
- Modify: `package.json:7-15`
- Test: `tests/vercelConfigAudit.test.ts`

**Interfaces:**
- Consumes: Vite static build output in `dist/`
- Produces: Production deployment configuration with clean SPA routing and WASM MIME headers.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/vercelConfigAudit.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const vercelPath = path.resolve('vercel.json');
assert.ok(fs.existsSync(vercelPath), 'vercel.json must exist in project root');

const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
assert.strictEqual(vercelConfig.outputDirectory, 'dist', 'outputDirectory must be dist');

// Must include SPA rewrite
const hasSpaRewrite = vercelConfig.rewrites?.some(
  (r: any) => r.source === '/(.*)' && r.destination === '/index.html'
);
assert.ok(hasSpaRewrite, 'vercel.json must include SPA catch-all rewrite to /index.html');

// Must include WASM header
const hasWasmHeader = vercelConfig.headers?.some(
  (h: any) => h.headers?.some((item: any) => item.value === 'application/wasm')
);
assert.ok(hasWasmHeader, 'vercel.json must specify application/wasm content-type');

console.log('Task 3 vercelConfigAudit tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/vercelConfigAudit.test.ts`  
Expected: FAIL with `vercel.json must exist in project root`.

- [ ] **Step 3: Implement `vercel.json` and update `package.json`**

Create `vercel.json` with framework `"vite"`, `outputDirectory: "dist"`, SPA catch-all rewrite, and immutable caching headers for `/assets/(.*)`. Add `"deploy:vercel": "vercel --prod"` script in `package.json`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/vercelConfigAudit.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add vercel.json package.json tests/vercelConfigAudit.test.ts
git commit -m "feat: add vercel SPA routing and static asset headers configuration"
```

---

### Task 4: Deployment Guide & Full End-to-End Build Audit

**Files:**
- Create: `docs/deployment/VERCEL_DEPLOYMENT_GUIDE.md`
- Run full test suite & production build audit

**Interfaces:**
- Consumes: All 11 unit/integration test suites, `npx tsc --noEmit`, `npm run build`
- Produces: Complete production build in `dist/` ready for instant deployment with user-facing guide.

- [ ] **Step 1: Create Vercel Deployment Guide**

Create `docs/deployment/VERCEL_DEPLOYMENT_GUIDE.md` with step-by-step instructions:
- **Option A (Easiest - 1 click via Web)**: Go to vercel.com, click "Add New Project", choose the GitHub repository, click "Deploy". Everything builds automatically.
- **Option B (Fast CLI - 1 command)**: Run `npx vercel` in the terminal, follow the prompts, and get a live public `.vercel.app` URL immediately.
- How to share with friends and verify student mode.

- [ ] **Step 2: Run all unit and integration test suites**

Run in PowerShell:
```powershell
npx tsx tests/clinicalWarningFormatter.test.ts; npx tsx tests/singleStructureStage.test.ts; npx tsx tests/antiarrhythmicFixes.test.ts; npx tsx tests/chemicalClassDictionary.test.ts; npx tsx tests/chemicalClassIntegration.test.ts; npx tsx tests/minimizedStructureCard.test.ts; npx tsx tests/questionViewIntegration.test.ts; npx tsx tests/anticoagulantsThrombolytics.test.ts; npx tsx tests/anticoagulantsModule.test.ts; npx tsx tests/workbenchHaloVerification.test.ts; npx tsx tests/envModeGating.test.ts; npx tsx tests/studentModeUiGating.test.ts; npx tsx tests/vercelConfigAudit.test.ts
```
Expected: All 13 test suites PASS.

- [ ] **Step 3: Run TypeScript typecheck**

Run: `npx tsc --noEmit`  
Expected: Exit code 0 with 0 errors.

- [ ] **Step 4: Run production Vite build**

Run: `npm run build`  
Expected: Production build finishes cleanly in `dist/`.

- [ ] **Step 5: Commit**

```bash
git add docs/deployment/VERCEL_DEPLOYMENT_GUIDE.md
git commit -m "docs: add comprehensive Vercel deployment guide"
```
