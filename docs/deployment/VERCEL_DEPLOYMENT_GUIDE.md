# Vercel Deployment Guide: MedChem Review Web App

This guide walks you through deploying the **Medicinal Chemistry Exam Review Application** as a fast, free, and publicly accessible web application on **Vercel** so your classmates and friends can study anywhere on their laptops, tablets, or phones.

---

## 🌟 Why Vercel?

- **100% Free**: Operates entirely within Vercel's generous Hobby tier with zero hosting or server bills.
- **Zero Cold Starts**: The app is built as a static Single-Page Application (SPA); pages load instantly.
- **Client-Side Privacy**: Each student's study progress, quiz history, and exam scores are stored privately in their own browser's IndexedDB.
- **WASM & RDKit Support**: Chemical structure rendering with WebAssembly is pre-configured with the correct MIME headers in `vercel.json`.
- **Automatic Student Mode**: Production builds automatically hide developer tools (slide ingestion, Question Studio, AI Tutor) while keeping all 4 review modules (Chapters 8, 9, 10, 11), chemical structures, 2D/3D viewers, and timed exams 100% active.

---

## 🚀 Deployment Options

Choose either **Option A** (recommended for continuous deployment with GitHub) or **Option B** (fastest command-line deployment).

---

### Option A: Web Dashboard (Recommended — Zero CLI)

Deploy directly from GitHub with automatic updates whenever you push changes.

1. **Push your code to GitHub**:
   If your repository is already on GitHub, ensure your latest commits are pushed:
   ```bash
   git push origin main
   ```

2. **Log in to Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **Sign Up** or **Log In** (logging in with your GitHub account is recommended).

3. **Import Project**:
   - In the Vercel dashboard, click **Add New...** > **Project**.
   - Under **Import Git Repository**, locate your repository and click **Import**.

4. **Verify Build Settings**:
   Vercel detects the `vercel.json` configuration automatically:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

   *(No environment variables are required! All review content is bundled in the static build).*

5. **Deploy**:
   - Click **Deploy**.
   - Within 45–60 seconds, your deployment will finish and you will receive a live URL:
     `https://your-project-name.vercel.app`

6. **Automatic Updates**:
   - Any future commits pushed to `main` will automatically trigger a new deployment on Vercel.

---

### Option B: Fast CLI Deployment (Direct Terminal)

Deploy directly from your machine without opening a browser dashboard.

1. **Run the Vercel CLI**:
   Open PowerShell in the project root directory and run:
   ```powershell
   npx vercel
   ```

2. **Follow Prompts**:
   - `Log in to Vercel`: Select your preferred login method (GitHub, Email, etc.).
   - `Set up and deploy "~/mcp-review-app"`: Press `Y`.
   - `Which scope do you want to deploy to?`: Select your personal account.
   - `Link to existing project?`: Press `N` (for a first-time deployment).
   - `What's your project's name?`: Press `Enter` (accept default).
   - `In which directory is your code located?`: Press `Enter` (`./`).
   - `Want to modify these settings?`: Press `N` (uses `vercel.json` settings).

3. **Deploy to Production Domain**:
   Once the preview deployment completes, publish to the production domain:
   ```powershell
   npm run deploy:vercel
   ```
   *(Or run `npx vercel --prod`)*

4. Your production website is live! The console will display your live public URL.

---

## 🔍 Verification & Testing the Live Site

Once deployed, visit your live `.vercel.app` URL and check the following:

| Feature | Student / Production Behavior | Status |
| :--- | :--- | :--- |
| **All 4 Review Modules** | Antiplatelets, Anticoagulants, Heart Failure, Antiarrhythmics loaded | ✅ Active |
| **Quiz Practice & Rationales** | Detailed rationales, clinical pearls, and mechanism explanations | ✅ Active |
| **Chemical Structure Viewer** | 2D RDKit structures & 3D PDB/CIF Mol* viewers | ✅ Active |
| **MedChem Matrix & Comparator**| Side-by-side SAR comparison & property table | ✅ Active |
| **Timed Exam Simulation** | 20-question randomized exam with timer & review | ✅ Active |
| **AI Tutor Panel** | Hidden from students (no API key needed) | 🔒 Hidden |
| **Slide Deck Importer** | Hidden from students | 🔒 Hidden |
| **Question Studio / Editor** | Hidden from students; core modules locked | 🔒 Hidden |

---

## 🌐 Custom Domains (Optional)

If you'd like to use a custom domain (e.g., `study.medchemreview.com` or `myreviewapp.com`):

1. Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard).
2. Navigate to **Settings** > **Domains**.
3. Enter your domain or subdomain and click **Add**.
4. Follow the DNS instructions (add a `CNAME` or `A` record) provided by Vercel. Free SSL certificates are issued and managed automatically.

---

## 💻 Local Testing in Student Mode

If you want to test the exact production student experience locally on your machine before deploying:

```powershell
# Build the production bundle
npm run build

# Preview the production build locally
npm run preview
```
Visit the local preview URL (typically `http://localhost:4173`) to confirm that all authoring and AI tools are cleanly hidden and all reviews are fully interactive.
