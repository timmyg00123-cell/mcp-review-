# Design Document: Public Website Deployment & Student Mode (Approach 1)

**Date**: 2026-11-05  
**Topic**: Public Web Deployment via Vercel with Student-Mode Feature Gating  
**Status**: Pending Review & Builder Check  

---

## 1. Intent & The Why
The goal is to publish the Medicinal Chemistry II (MCP II) review platform online with a public web link so pharmacy students, classmates, and friends can access it from their phones, tablets, or computers to study course modules, solve review questions, and read detailed answer rationales without needing any software installation.

Because students only need the core study experience (answering questions, reviewing rationales, comparing chemical structures, and taking timed practice exams), the public site can be delivered as a high-performance, zero-maintenance static Single Page Application (SPA). To prevent student confusion and eliminate backend server dependencies, authoring and AI tools (slide ingestion and Gemini tutor chat) will be hidden in the public production build while remaining fully functional in local development.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
* **High-Speed Public Deployment (Vercel SPA)**: Build and publish the static bundle (`dist/`) on Vercel with global CDN caching, zero cold starts, automatic HTTPS, and clean root URLs (e.g., `https://medchem-review.vercel.app`).
* **Environment-Based Feature Gating**: Differentiate between the local developer studio and the public student portal using build-time flags (`import.meta.env.PROD` with a configurable `VITE_STUDENT_MODE` override).
* **Clean Student UI**: In the public build, hide authoring and server-dependent features:
  * Hide AI Tutor toggle and panel (`Sparkles` icon and `AITutorPanel`).
  * Hide Lecture Ingestion modal and controls (`MedChemReviewImporterModal`, "Import Slides" button, and "Add Questions").
  * Protect the 4 core course modules (Antiplatelets, Anticoagulants, Heart Failure, and Antiarrhythmics) from accidental deletion or destructive editing in the public UI.
* **Full Interactive Study Tool Suite**:
  * Deliver all 4 preloaded lecture modules with 100% of questions, options, rationales, structural workbench, hints, and minimized chemical structure cards.
  * Deliver the Chemical Structure Comparator (including single-structure stage mode), MedChem Matrix (with filters, SAR notes, and FDA clinical warnings), Knowledge Graph Explorer, High-Yield pearls, and Timed Exam Mode.
  * Preserve client-side persistence via browser IndexedDB (Dexie) so each visitor's quiz answers, dark/light theme, and pastel color preferences persist on their own device.
* **Web Standards & WASM Asset Support**: Ensure `vercel.json` configures proper SPA rewrites (`/(.*) -> /index.html`) and MIME type headers for WebAssembly (`RDKit_minimal.wasm`) and web workers (`pdf.worker.min.mjs`).

### Non-Goals
* No user authentication or cloud accounts (each student has a private local session in their browser; no passwords or sign-ups required).
* No cloud database or server hosting (no Express server or Docker container running in production).
* No live Gemini API keys or Vertex AI access on the public site.
* No changes to the local development workflow (`npm run dev` keeps all authoring and AI tools active).

### Anti-Goals
* No broken or non-responsive buttons visible to students (features that cannot work in production must be hidden, not left in a dead or broken state).
* No cold-start delays (avoiding free container hosts like Render that sleep after inactivity).
* No exposure of private API credentials or environment secrets in client-side bundles.

---

## 3. Constraints
* The application must compile cleanly with `npm run build` using Vite.
* Must pass strict TypeScript typechecking (`npx tsc --noEmit`) with 0 errors.
* Static assets must load reliably from the root path without hardcoded local paths.

---

## 4. Approaches Considered

### Approach 1: Vercel Static Web App (Selected)
* **Architecture**: Vite builds static bundle to `dist/`. Vercel hosts on its global Edge Network with SPA rewrite configuration in `vercel.json`.
* **Trade-offs**: Requires connecting the repository to a free Vercel account or running `npx vercel`.
* **Why Selected**: Delivers instant load times on mobile/desktop, zero server maintenance, zero cold-start delay, automated redeployments on Git push, and clean root URLs.

### Approach 2: GitHub Pages (Discarded)
* **Architecture**: Build static bundle via GitHub Actions and publish to `github.io/<repo-name>`.
* **Trade-offs**: Requires setting a subpath `base` in Vite, which adds configuration complexity for RDKit WASM loading, and GitHub Action build times take 1–2 minutes per update.
* **Why Discarded**: Slower deployments and subpath routing friction compared to Vercel root domains.

### Approach 3: Containerized Full-Stack Cloud Host (Render / Railway) (Discarded)
* **Architecture**: Run Express `server.ts` in a cloud container.
* **Trade-offs**: Complex deployment, requires cloud environment variable management, and free tiers incur 45–60 second sleeping container cold starts.
* **Why Discarded**: Completely unnecessary since the user specified that students do not need slide uploads or Gemini chat.

---

## 5. Architectural & Implementation Details

### A. Environment Gating Utility (`src/utils/envMode.ts`)
A centralized helper determines whether the app is running in student (public) mode:
```typescript
/**
 * Evaluates whether the app is in public student mode.
 * Defaults to true in production builds (import.meta.env.PROD),
 * but can be explicitly forced via VITE_STUDENT_MODE boolean string.
 */
export const isStudentMode = (): boolean => {
  if (import.meta.env.VITE_STUDENT_MODE !== undefined) {
    return import.meta.env.VITE_STUDENT_MODE === 'true';
  }
  return import.meta.env.PROD;
};
```

### B. Navbar & UI Adjustments (`src/components/Navbar.tsx`, `src/App.tsx`)
* When `isStudentMode()` is true:
  1. Hide the AI Tutor toggle button (`Sparkles` icon).
  2. Hide the "Import Slides" / Ingestion button and JSON Import button in the Tools menu.
  3. Hide the "Edit Module" action.
  4. Disable or hide the "Delete Module" option for built-in core modules (Chapters 8, 9, 10, 11).
  5. In `App.tsx`, bypass rendering `<AITutorPanel>` and `<MedChemReviewImporterModal>` when student mode is active.

### C. Vercel SPA Configuration (`vercel.json`)
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*).wasm",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/wasm"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### D. Package & Deploy Scripts (`package.json`)
* Ensure `build` compiles the app: `vite build`.
* Add `deploy:vercel` convenience script: `npx vercel --prod`.

---

## 6. What's Left to the Builder
* Adding unit tests in `tests/envModeGating.test.ts` to verify `isStudentMode()` logic and conditional component rendering.
* Verifying that WebAssembly files (`RDKit_minimal.wasm`) and PDF workers load without 404 errors during static preview.
* Creating a clear, step-by-step deployment guide for the user to publish their site to Vercel via either the Vercel Web Dashboard (importing GitHub repo) or the Vercel CLI.
