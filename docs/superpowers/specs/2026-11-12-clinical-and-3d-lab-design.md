# Clinical Knowledge Dossier, Institutional Launchpad & 3D Lab Library

## 1. Intent & The Why
The MedChem Review Platform currently provides high-fidelity 2D molecular structures, SAR matrix comparisons, and OpenFDA clinical warning summaries. However, pharmacy and medicinal chemistry students frequently require:
1. Deeper, peer-reviewed clinical monographs (DailyMed FDA package inserts, standardized RxNorm identifiers, and NCBI StatPearls clinical pearls).
2. Frictionless access to university-subscribed clinical reference suites (Lexicomp and AccessPharmacy) without copyright infringement or scraping violations.
3. 3D co-crystal target-ligand visualization and quantitative binding affinity data ($K_i, IC_{50}$ from ChEMBL and RCSB PDB) to understand the physical basis of SAR without bogging down everyday flashcard performance.

This design establishes an on-demand federated client architecture that connects these scientific and clinical sources seamlessly while keeping review decks lightweight and responsive.

---

## 2. Goals, Non-Goals, & Anti-Goals

### Goals
- **Clinical Info Box:** An on-demand, tabbed clinical knowledge dossier accessible directly from structure cards, aggregating DailyMed (FDA SPL), RxNorm (RxNav), and StatPearls (NCBI Bookshelf) with local Dexie/IndexedDB caching.
- **Institutional Launchpad:** Deep search link-outs to Lexicomp and AccessPharmacy tailored to the current drug name, paired with an OpenAthens session helper configured for Xavier University of Louisiana (XULA) and editable in Settings.
- **3D Lab Library Tab:** A dedicated top-level application tab (`3d-lab`) featuring an interactive Mol* 3D viewer for target-ligand co-crystal structures (PDB) and a quantitative ChEMBL bioactivity panel ($K_i, IC_{50}$, selectivity), accessible via top navigation or via an "Open in 3D Lab →" button on any structure card.

### Non-Goals
- Programmatic scraping or unauthorized storage of paywalled Lexicomp or AccessPharmacy full-text chapters.
- In-place 3D WebGL rendering on every small card in grid/matrix views (which degrades mobile/laptop battery and GPU performance).
- Real-time cloud synchronization; persistence remains offline-first via Dexie (IndexedDB).

### Anti-Goals
- Blocking or slowing down lecture slide/PDF ingestion with synchronous clinical API calls.
- Storing copyrighted commercial monographs in public repository code.

---

## 3. Constraints
- Must function purely client-side or through lightweight proxy routes that respect CORS and public API rate limits (NLM DailyMed, RxNav, NCBI E-Utilities, ChEMBL REST API, RCSB PDB API).
- Must adhere to the project's existing React 19 + TypeScript + Tailwind CSS v4 stack and Dexie.js database schema.
- Must preserve full backward compatibility with existing saved modules, review pages, and exam decks.

---

## 4. Approaches Considered

### Approach 1: On-Demand Federated Client Services with Dedicated Tab Route (Selected)
- **Clinical Info Box:** Fetches DailyMed, RxNorm, and StatPearls data on-demand only when a user clicks the card button, caching the result in Dexie.
- **Launchpad:** Direct URL resolvers for Lexicomp and AccessPharmacy, with OpenAthens session launcher.
- **3D Lab Library:** Standalone top-level tab (`3d-lab`) mounting Mol* and ChEMBL services only when navigated to. Structure cards feature an "Open in 3D Lab →" button that selects the drug and switches tabs.
- **Trade-offs:** Fast initial load, zero GPU overhead on flashcards, resilient to network hiccups, offline-capable after first inspection.

### Approach 2: Pre-Ingestion Baking
- Fetches all clinical and 3D data during slide upload in `lectureIngestion.ts` and bakes it into the module JSON.
- **Trade-offs:** Significantly slows down document ingestion, frequently exceeds API rate limits during multi-slide imports, and inflates local storage size with data the student may never review.

**Decision:** Approach 1 was selected because it maximizes performance, preserves battery life, and cleanly separates high-volume card review from compute-heavy 3D visualization.

---

## 5. Detailed Architecture & Design Decisions

### A. Clinical Knowledge Info Box & Service (`clinicalDossierService.ts`)
1. **API Endpoints & Sourcing Strategy:**
   - **FDA / DailyMed SPL Integration:** To ensure 100% static client-side compatibility and eliminate CORS failures, structured FDA label data (`boxedWarning`, `indications`, `dosageForms`) is sourced via the official OpenFDA Drug Label API (`https://api.fda.gov/drug/label.json?search=openfda.generic_name:"{name}"`), paired with a direct deep-link to the official NLM DailyMed SPL webpage (`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query={name}`).
   - **RxNorm RxNav API:** Direct CORS-enabled REST calls to `https://rxnav.nlm.nih.gov/REST/rxcui.json?name={name}` and `/REST/rxcui/{rxcui}/allProperties.json` to extract official RxCUI, brand names (e.g., Plavix, Effient), and dosage forms.
   - **NCBI Bookshelf (StatPearls):** Query syntax using `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=books&term={name}+AND+statpearls[book]&retmode=json` and `esummary.fcgi` to retrieve the peer-reviewed chapter accession, article title, and verified direct Bookshelf reading URL (`https://www.ncbi.nlm.nih.gov/books/{UID}/`).
2. **Persistence Schema (`db.ts`):**
   - Table `clinicalDossiers`:
     ```ts
     interface ClinicalDossierRecord {
       genericName: string;
       dailyMed?: {
         boxedWarning?: string;
         indications?: string[];
         dosageForms?: string[];
         splWebUrl?: string;
       };
       rxNorm?: {
         rxcui: string;
         brandNames: string[];
         synonyms: string[];
       };
       statPearls?: {
         title?: string;
         bookshelfUid?: string;
         bookshelfUrl?: string;
         summary?: string;
       };
       lastUpdated: number;
     }
     ```
3. **UI Component (`ClinicalDossierModal.tsx`):**
   - Slide-over drawer or modal with 3 tabs: FDA / DailyMed Labeling, RxNorm Identifiers & Brands, and StatPearls Peer-Reviewed Chapter.
   - Includes graceful fallback states and direct link-outs if an experimental compound is not yet in the FDA registry.

### B. Institutional Launchpad & OpenAthens Federation
1. **URL Construction:**
   - Lexicomp: `https://online.lexi.com/lco/action/search?q={encodeURIComponent(drugName)}`
   - AccessPharmacy: `https://accesspharmacy.mhmedical.com/SearchResults.aspx?q={encodeURIComponent(drugName)}`
2. **OpenAthens Helper:**
   - Default institution: Xavier University of Louisiana (XULA).
   - Direct OpenAthens portal link: `https://login.openathens.net/auth/xula.edu/o/71625811`
   - Displayed in:
     - Card action row: "Search Lexicomp ↗", "Search AccessPharmacy ↗", and "XULA Auth 🔑".
     - Settings modal (`SettingsModal.tsx`): Custom institutional entity URL or proxy prefix if the student belongs to a different school.

### C. 3D Lab Library Tab (`src/components/ThreeDLabLibrary.tsx`)
1. **Navigation Integration:**
   - Add `'3d-lab'` to `NavbarProps['activeTab']` in `src/components/Navbar.tsx` and `src/App.tsx`.
   - Labeled "3D Lab Library" with a 3D molecule icon.
2. **Card Linkage:**
   - On `ChemicalStructureCard.tsx`, add an "Open in 3D Lab →" button that triggers `onSelectStructureFor3D(structure)`.
   - Switches active tab to `'3d-lab'` and pre-selects the drug and associated target complex.
3. **Sub-components:**
   - **Target & Ligand Selector:** Left panel listing drug targets with a curated dictionary of canonical curricular targets and PDB IDs (e.g. `4NTJ` for P2Y12, `1O86` for ACE, `4Z9O` for AT1 receptor, `1HWK` for HMGCR).
   - **ChEMBL Quantitative SAR Panel (`chemblService.ts`):** Drug-centric query flow: resolves `molecule_chembl_id` via `https://www.ebi.ac.uk/chembl/api/data/molecule?pref_name__iexact={drugName}&format=json`, then retrieves `/chembl/api/data/mechanism` and `/chembl/api/data/activity` for binding affinities ($K_i, IC_{50}$) and selectivity against off-targets.
   - **Mol* / 3D Canvas:** WebGL container embedding Mol* (or RCSB PDB 3D Web Viewer) with controls for cartoon ribbon, binding pocket zoom, and ligand ball-and-stick representations.

---

## 6. What's Left to the Builder
- Precise Tailwind styling details, icon assignments, and responsive break-points for mobile screens.
- Fallback dictionary of canonical PDB IDs for primary curricular drug targets (e.g. `4NTJ` for P2Y12, `1O86` for ACE, `4Z9O` for AT1 receptor) so known course drugs automatically open to their respective target complexes.
- Error boundary wrappers to ensure an invalid PDB or external API timeout never crashes the main application.
