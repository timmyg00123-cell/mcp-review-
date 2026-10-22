# Medicinal Chemistry & Pharmacology Review Platform

An intelligent, interactive study suite and review platform for medicinal chemistry, pharmacokinetics (PK), pharmacodynamics (PD), and drug design courses. Powered by **Gemini 3.8 Flash** and the **PubChem REST API**, this platform transforms lecture slides and course notes into structured review decks, interactive chemical structure visualizers, SAR (Structure-Activity Relationship) matrices, and concept graphs.

---

## Key Features

- **Multimodal Document & Slide Ingestion**:
  - Ingests lecture materials across formats: PDF (`pdfjs-dist`), PowerPoint (`officeparser`/PPTX extraction), Word documents (`mammoth`), and raw text notes.
  - Page-by-page and slide-by-slide automated extraction using Gemini 3.8 Flash with strict JSON schema validation.
  - Intelligent chunking and throttling to respect Google Cloud API rate limits.

- **Universal PubChem Audit Engine**:
  - Automatically verifies chemical structures against the official NCBI PubChem database.
  - Cross-references compound names, IUPAC nomenclature, PubChem Compound ID (CID), SMILES representations, Molecular Weight (MW), and partition coefficient ($\log P$ / XLogP).
  - High-fidelity 2D vector chemical structure rendering directly in the browser via `smiles-drawer`.

- **Comprehensive Study & Review Modes**:
  - **Structure & SAR Review Deck**: High-yield flashcard vignettes featuring chemical structures, drug states (`Active Drug`, `Prodrug`, `Active Metabolite`, `Inactive Metabolite`), mechanism of action (MOA) summaries, target receptor interactions, and clinical pharmacokinetics.
  - **Structure Comparator**: Side-by-side molecular comparisons highlighting pharmacophores, bioisosteric replacements, and functional group modifications.
  - **MedChem Knowledge Graph**: Interactive force-directed 2D graph (`react-force-graph-2d`) linking drug classes, receptor targets, chemical scaffolds, and clinical indications.

- **Offline-First Local Storage**:
  - Complete client-side caching and persistence using **Dexie.js** (IndexedDB).
  - Saved review decks, ingested documents, custom notes, and chemical graph databases persist across sessions without requiring external database hosting.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript |
| **Styling & Animation** | Tailwind CSS v4, Motion (Framer Motion), Lucide React |
| **Chemical Rendering** | SmilesDrawer 2.4 |
| **Graph Visualization** | React Force Graph 2D |
| **Document Processing**| PDF.js (`pdfjs-dist`), OfficeParser, Mammoth, JSZip |
| **AI Extraction & Reasoning** | Google GenAI SDK (`@google/genai`) with `gemini-3.8-flash` |
| **Cheminformatics Source** | NCBI PubChem REST API |
| **Client Storage** | Dexie.js (IndexedDB) |
| **Server & Bundler** | Express, Vite, tsx |

---

## Project Structure

```text
├── src/
│   ├── components/            # UI components (ReviewDeck, StructureComparator, DocumentStudioModal, etc.)
│   ├── services/              # Core business logic:
│   │   ├── geminiPrompts.ts   # System prompts, TypeScript interfaces & strict JSON schemas
│   │   ├── lectureIngestion.ts# Multimodal document parsing, chunking & PubChem enrichment
│   │   ├── pubchemService.ts  # NCBI PubChem REST API queries & structure fetching
│   │   └── db.ts              # Dexie.js IndexedDB schema and persistent store
│   ├── App.tsx                # Main application layout and view navigation
│   └── main.tsx               # Client entry point
├── server.ts                  # Express backend server with Vite dev middleware & Gemini API router
├── vite.config.ts             # Vite configuration with Tailwind CSS v4
├── tsconfig.json              # TypeScript compilation settings
├── package.json               # Dependencies and build scripts
└── .env.example               # Template for environment variables
```

---

## Getting Started

### Prerequisites

- **Node.js**: Version 20.x or higher recommended.
- **npm** (or **bun** / **pnpm**).
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file by copying the provided example:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and set your API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will start on [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

- `npm run dev`: Starts the Express server with Vite in development mode (hot reloading enabled).
- `npm run build`: Compiles TypeScript and creates optimized production client bundles in `dist/`.
- `npm run start`: Launches the server in production mode.
- `npm run lint`: Runs `tsc --noEmit` to verify type safety across the entire codebase.
- `npm run preview`: Previews the production build locally.

---

## Security & Environment Configuration

- **Never commit your `.env` or `.env.local` files!** These files are strictly included in `.gitignore`.
- When deploying to platforms like Google Cloud Run, Vercel, or Render, set the `GEMINI_API_KEY` as an environment variable in your provider's settings console.

---

## License

This project is open-source. Feel free to customize and extend it for your own academic or research workflows.
