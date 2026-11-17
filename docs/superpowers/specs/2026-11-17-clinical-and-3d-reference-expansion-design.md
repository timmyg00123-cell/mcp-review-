# Clinical & 3D Reference Cross-Module Expansion Design Spec

> **Date:** 2026-11-17  
> **Status:** Finalized (Builder Check Passed — Ready for Plan Authoring)  
> **Size:** Project  

---

## 1. Intent & Context

The application has established a comprehensive clinical and scientific reference stack:
1. **Clinical Dossier Service & Modal Drawer (`clinicalDossierService.ts`, `ClinicalDossierModal.tsx`):** Aggregates NLM DailyMed boxed warnings, indications, dosage forms; NLM RxNav RxCUIs and brand names/synonyms; and NCBI Bookshelf StatPearls clinical monographs with local IndexedDB (Dexie) 7-day caching.
2. **Institutional Launchpad (`launchpadUrls.ts`):** Generates deep-link search queries for proprietary clinical databases (Lexicomp and AccessPharmacy) and facilitates Single Sign-On (SSO) authentication.
3. **3D Molecular Lab (`ThreeDLabLibrary.tsx`, `ThreeDLabCanvas.tsx`):** Provides Mol* 3D binding pocket visualizations, canonical PDB co-crystal structures, and EMBL-EBI ChEMBL bioactivity metrics ($IC_{50}, K_i$).

Previously, these capabilities were wired exclusively into the lecture slide review cards (`ChemicalStructureCard.tsx`) and accessible through the top-level `3D Lab` tab.

This project expands this ecosystem across the primary study surfaces:
- **Top 200 Clinical Flashcards (`TopDrugClinicalCard.tsx`)**
- **2D Chemical Structure Flashcards (`StructureFlashcardCardFace.tsx`)**
- **MedChem Comparative Matrix (`MedChemMatrix.tsx`)**
- **Structure Lightbox Modal & Dual-Drug Comparator (`StructureLightboxModal.tsx`)**
- **Institutional Launchpad Settings (`SettingsModal.tsx`)**
- **Universal Indications Display:** Ensuring approved clinical indications are prominently and consistently surfaced across all flashcard faces.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Unified Reusability:** Provide a single shared `<ClinicalReferenceToolbar />` component supporting both `full` (banner) and `compact` (icon pill) display variants.
- **Top 200 Flashcard Integration:** Integrate the reference toolbar on the back face of Top 200 cards immediately beneath the header chips (Option A layout) without compromising blinded active recall on the front face.
- **Universal Indications:** Explicitly display approved clinical indications on both Top 200 clinical flashcard backs and 2D chemical structure flashcard backs.
- **Matrix Integration:** Place compact reference pills directly inside the sticky drug column of `MedChemMatrix.tsx` so references remain accessible during horizontal scrolling without inflating row heights.
- **Lightbox & Dual Comparator:** Equip the fullscreen Structure Lightbox with reference controls, giving Compound A and Compound B independent toolbars in dual-drug comparator mode.
- **Universal Proxy Customization:** Allow students to configure their institution name, choose between OpenAthens SSO and custom EZProxy URL prefixes, and toggle badge visibility within `SettingsModal.tsx`, persisted to `localStorage`.

### Non-Goals
- Programmatic scraping or unauthorized automated retrieval of proprietary text from Lexicomp or AccessPharmacy (strictly deep-linking to search endpoints).
- Rewriting the Mol* 3D rendering engine or Dexie database schemas.
- Adding server-side proxy middleware (all proxy resolutions are handled client-side).

### Anti-Goals
- **Zero Front-Face Leaks:** No reference links, drug brand names, or indication hints may ever appear on the unrevealed (front) face of flashcards during active recall mode.
- **Zero Unwanted WebGL Overhead:** Never mount 3D canvases inside flashcards or table rows; "Open in 3D Lab →" triggers an intentional tab handoff to the isolated `3d-lab` route.
- **Zero Flashcard State Loss:** Switching to 3D Lab or opening modal drawers must never reset flashcard deck progress, pre-flip question answers, or matrix filter states.

---

## 3. Approaches Considered

### Approach 1: Shared Centralized Reference Toolbar Component (Selected)
- **Design:** Build `<ClinicalReferenceToolbar />` that encapsulates institutional config retrieval, proxy resolution, `ClinicalDossierModal` lazy-loading, and 3D tab handoff.
- **Why Chosen:** Guarantees absolute consistency in styling, behavior, and telemetry across all four study surfaces. Any future additions (e.g. PubMed or DailyMed direct links) update universally in one location.

### Approach 2: Per-Component Ad-Hoc Wiring (Rejected)
- **Design:** Duplicate buttons, URL resolvers, and modal drawer states across each component.
- **Why Rejected:** High code duplication, high maintenance burden, and prone to UI/URL drift.

### Approach 3: Global Context Provider (Rejected)
- **Design:** Wrap the application tree in a React context hosting a single global modal instance and hook.
- **Why Rejected:** Introduces unnecessary re-rendering across root components for what is cleanly managed as an isolated modal overlay.

---

## 4. User Rulings & Design Decisions

1. **Top 200 Flashcards:**
   - **Placement:** Option A — prominent reference bar placed immediately beneath the taxonomy chips on the card back (post-reveal).
   - **Indications:** Prominently display approved clinical indications on the back face.
2. **MedChem Matrix:**
   - Tucked directly inside the sticky drug name column as a compact action strip (`[📄 Dossier]`, `[🧊 3D]`, `[Lexi ↗]`, `[Access ↗]`).
3. **Structure Lightbox Modal & Dual Comparator:**
   - In single structure view: reference bar located in the top toolbar.
   - In dual-drug compare mode: Compound A and Compound B each have independent reference bars.
4. **Institutional Settings:**
   - Support both OpenAthens portal URLs and custom EZProxy prefixes (`https://proxy.school.edu/login?url=...`).
   - Store settings in `localStorage` under `launchpad_config` with Xavier University of Louisiana (XULA) as the initial default.
   - Include a toggle to show/hide institutional launchpad badges on cards.
5. **Universal Flashcard Indications:**
   - Both `StructureFlashcardCardFace.tsx` and `TopDrugClinicalCard.tsx` must explicitly render approved clinical indications on their back faces.
6. **Class Profile Anchor Drawer in Clinical Top 200 Drugs Taxonomy:**
   - Wire `ClassProfileAnchorDrawer` directly into the Top 200 taxonomy surfaces:
     - **`TopDrugClinicalCard.tsx` Taxonomy Chips:** Interactive triggers on both front (blinded trigger) and back faces (explicit class badge) allowing students to slide open the anchor profile.
     - **`StructureFlashcardCardFace.tsx` Taxonomy Trail:** When viewing Top 200 drug flashcards, clicking the taxonomy breadcrumbs or class tags opens the `ClassProfileAnchorDrawer`.
     - **`TherapeuticClassFilterDrawer.tsx` (Top Drugs 39 Classes):** Provide a direct `[📖 Class Profile]` inspection button on each class entry (or selected class) in the filter drawer to view the class anchor profile (universal MOA, toxicities, monitoring, warnings, exceptions) while filtering.

---

## 5. Detailed Component & System Architecture

### 5.1. Institutional Launchpad Configuration (`src/utils/launchpadUrls.ts`)

#### Schema & Types
```typescript
export type LaunchpadAuthType = 'openathens' | 'ezproxy' | 'direct';

export interface LaunchpadConfig {
  institutionName: string;
  authType: LaunchpadAuthType;
  openAthensAuthUrl: string;
  ezproxyPrefix: string;
  showBadges: boolean;
}

export const DEFAULT_LAUNCHPAD_CONFIG: LaunchpadConfig = {
  institutionName: 'Xavier University of Louisiana (XULA)',
  authType: 'openathens',
  openAthensAuthUrl: 'https://login.openathens.net/auth/xula.edu/o/71625811',
  ezproxyPrefix: '',
  showBadges: true,
};
```

#### Storage & URL Resolution
- `loadLaunchpadConfig(): LaunchpadConfig`: Reads from `localStorage['launchpad_config']`, falling back to `DEFAULT_LAUNCHPAD_CONFIG`.
- `saveLaunchpadConfig(config: LaunchpadConfig): void`: Writes to `localStorage` and dispatches a `'launchpad-config-changed'` custom window event for instant multi-component reactivity.
- `getLexicompSearchUrl(drugName: string, config?: LaunchpadConfig): string`:
  - Base URL: `https://online.lexi.com/lco/action/search?q=${encodeURIComponent(drugName)}`
  - If `authType === 'ezproxy'` and `ezproxyPrefix` is set: returns `${ezproxyPrefix}${encodeURIComponent(baseUrl)}` (or direct concatenation depending on proxy convention).
- `getAccessPharmacySearchUrl(drugName: string, config?: LaunchpadConfig): string`:
  - Base URL: `https://accesspharmacy.mhmedical.com/SearchResults.aspx?q=${encodeURIComponent(drugName)}`
  - If `authType === 'ezproxy'`: applies proxy prefix.

---

### 5.2. Shared Component: `ClinicalReferenceToolbar.tsx`

Located at `src/components/ClinicalReferenceToolbar.tsx`.

#### Props Interface
```typescript
export interface ClinicalReferenceToolbarProps {
  drugName: string;
  structure?: ChemicalStructure | null;
  onSelectStructureFor3D?: (structure: ChemicalStructure) => void;
  variant?: 'full' | 'compact';
  show3DButton?: boolean;
  className?: string;
}
```

#### Behavior & Variants
1. **Full Variant (`variant="full"`):**
   - Renders a styled container matching `ChemicalStructureCard.tsx`:
     - Top row: "Clinical Pharmacology & References:", `[🧊 Open in 3D Lab →]`, and `[📄 Clinical Info Box]`.
     - Bottom row: "Institutional Launchpad:", `Lexicomp ↗`, `AccessPharmacy ↗`, and `Auth 🔑` (if OpenAthens selected in config).
2. **Compact Variant (`variant="compact"`):**
   - Renders a dense horizontal strip:
     - `[📄 Dossier]` button (opens `ClinicalDossierModal`).
     - `[🧊 3D]` button (if `structure` or canonical 3D target is available).
     - Compact badges: `Lexi ↗`, `Access ↗`.
3. **Modal Drawer Handling:**
   - Manages local `isDossierOpen` boolean state.
   - Lazy-loads `ClinicalDossierModal` (`React.lazy`) wrapped in `Suspense fallback={null}` to ensure zero render penalty when closed.
4. **3D Target Availability Check & Guard:**
   - Evaluates whether a canonical PDB co-crystal model exists via `findCanonicalTargetForDrug(drugName) || resolveDrug3DEntry(drugName)`.
   - If no 3D crystal complex exists in the catalog: the 3D button is rendered in a disabled state with tooltip `"3D crystal complex not yet available for this compound"`, preventing false routing to the default Clopidogrel structure.
5. **3D Lab Navigation (Dual Callback & Event Dispatch):**
   - If `onSelectStructureFor3D` is passed as a prop, it is invoked directly.
   - In deeply nested containers where prop drilling would be fragile, the toolbar also dispatches a standard custom event:
     ```typescript
     window.dispatchEvent(new CustomEvent('app-open-3d-lab', {
       detail: { structure, drugName }
     }));
     ```
   - `App.tsx` listens to this event to transition active view to `'3d-lab'` and select the target structure.

---

### 5.3. Top 200 Clinical Flashcard Integration (`TopDrugClinicalCard.tsx`) & Indications Sourcing

1. **Indications Resolution Utility (`src/utils/clinicalIndications.ts`):**
   - Implements `resolveClinicalIndications(monograph: TopDrugClinicalMonograph): string[]`.
   - Parses disease indications from `monograph.dosingRegimens` keys (e.g., extracting `"Hypertension"`, `"Heart Failure"`, `"Type 2 Diabetes"`, `"Major Depressive Disorder"` while filtering out generic labels like `"Initial"`, `"Maintenance"`, `"Renal Impairment"`).
   - Deduplicates and synthesizes with `monograph.therapeuticClass` and `monograph.pharmacologicClass`.
   - If the monograph specifies an explicit `indications?: string[]` field, that takes immediate precedence.
2. **Option A Reference Bar Placement:**
   - In `TopDrugClinicalCard.tsx`, directly below the header zone (generic name, brand names, dosage form chips) and above the FDA Black Box Warning banner:
   - Renders:
     ```tsx
     <ClinicalReferenceToolbar
       drugName={monograph.genericName}
       structure={matchedStructure}
       onSelectStructureFor3D={onSelectStructureFor3D}
       variant="full"
     />
     ```
3. **Approved Indications UI:**
   - Add a dedicated **Approved Clinical Indications** section on the card back directly above the clinical pearls / mechanism:
   - Visual styling: Clean emerald-tinted tags with a stethoscope icon (`🩺 Approved Indications: [Hypertension] [Heart Failure Post-MI]`).

---

### 5.4. 2D Chemical Structure Flashcards (`StructureFlashcardCardFace.tsx`)

1. **Indications Display:**
   - Resolves indications using:
     1. `structure.clinicalIndications` (from `ChemicalStructure` definition).
     2. If missing, resolves via `resolveClinicalIndications(resolveTopDrugClinicalMonograph(structure.name))` or `clinicalPharmacologyDictionary[structure.name]?.indications`.
   - Renders an **Approved Indications** badge strip on the card back.
2. **Density Mode Responsiveness:**
   - **`split` mode:** Full `<ClinicalReferenceToolbar variant="full" />` and indication badges placed in the clinical pharmacology column.
   - **`structure-focus` mode:** Indications badge strip pinned beneath the 2D structure preview; compact reference toolbar located inside the collapsible details accordion.
   - **`minimalist` mode:** Compact reference pills and indication chips rendered neatly below the recall rating buttons.
3. **Reference Toolbar:**
   - Uses the shared `<ClinicalReferenceToolbar />` with automatic event dispatch to 3D Lab.

---

### 5.5. MedChem Matrix Integration (`MedChemMatrix.tsx`)

1. In `src/components/MedChemMatrix.tsx`, within the sticky first column (`<td>` containing the 2D thumbnail and drug name):
2. Beneath the CID and prodrug/active drug badge, render:
   ```tsx
   <ClinicalReferenceToolbar
     drugName={row.drug}
     structure={row.structure}
     onSelectStructureFor3D={onSelectStructureFor3D}
     variant="compact"
   />
   ```
3. Wire `onSelectStructureFor3D` from `App.tsx` through `MedChemMatrix.tsx`.

---

### 5.6. Structure Lightbox Modal & Dual Comparator (`StructureLightboxModal.tsx`)

1. **Single Structure View:**
   - Add `<ClinicalReferenceToolbar variant="compact" drugName={structure.name} structure={structure} onSelectStructureFor3D={...} />` inside the top toolbar next to zoom and layout controls.
2. **Dual-Drug Compare Mode:**
   - In the dual comparison cards for Compound A and Compound B, render individual compact reference toolbars directly in the card header for each drug.
   - Ensure clicking "Clinical Info Box" opens the dossier for that specific compound as a top-level modal layer.
   - Clicking "Open in 3D Lab →" closes the Lightbox and routes to `3d-lab`.

---

### 5.7. Settings Modal Configuration UI (`SettingsModal.tsx`)

Add an **"Institutional Launchpad & Library Portal"** settings section:
1. **Institution Name:** Text input (default: `Xavier University of Louisiana (XULA)`).
2. **Authentication Type:** Radio/Select group:
   - **OpenAthens Session (XULA Default):** Displays OpenAthens portal URL input (`https://login.openathens.net/auth/...`).
   - **EZProxy URL Prefix:** Displays proxy prefix input (e.g. `https://proxy.lib.school.edu/login?url=`).
   - **Direct / Off-Campus:** Direct links without proxy encapsulation.
3. **Referral Badges Toggle:** Checkbox to show or hide institutional links on cards.
4. **Save & Reset Defaults:** Buttons to persist to `localStorage` or restore XULA defaults.

---

### 5.8. Class Profile Anchor Drawer in Top 200 Drugs Taxonomy (`ClassProfileAnchorDrawer.tsx`)

1. **`TopDrugClinicalCard.tsx` Taxonomy Chips:**
   - Both the front (blinded prompt) and back (revealed clinical monograph) faces feature interactive taxonomy touchpoints.
   - On the front face, a neutral `[📖 Class Profile]` button or blinded badge allows opening the drawer without leaking the exact class identity before the student decides to inspect.
   - On the back face, the taxonomy class chips (`monograph.pharmacologicClass`, `monograph.therapeuticClass`) and the dedicated `[📖 Class Profile: <Name>]` button trigger the slide-out drawer.
2. **`StructureFlashcardCardFace.tsx` Taxonomy Breadcrumb Trail:**
   - When viewing flashcards enriched with Top Drugs Taxonomy (`therapeuticCategory`, `broadPharmacologicClass`, `specificPharmacologicClass`), the taxonomy breadcrumbs and class badges are rendered as interactive buttons that open the `ClassProfileAnchorDrawer` for that drug.
3. **`TherapeuticClassFilterDrawer.tsx` (Top Drugs 39 Standardized Classes):**
   - Each therapeutic class category row in the 1-39 scrubber rail includes a subtle `[📖 Profile]` action icon/button.
   - Clicking this button opens `ClassProfileAnchorDrawer` configured with `resolveClassProfileForCategory(category.name)` or the first canonical representative, allowing students to study class mechanics (universal MOA, toxicities, monitoring parameters, boxed warnings, subclass exceptions) directly while configuring their deck filter.

---

## 6. Verification & Test Plan

1. **Unit Tests:**
   - `tests/launchpadUrls.test.ts`: Verify EZProxy prefix formatting, OpenAthens URL resolution, and `localStorage` serialization.
   - `tests/clinicalReferenceToolbar.test.ts`: Verify full and compact rendering, modal open/close states, and 3D handoff callbacks.
   - `tests/classProfileTaxonomyIntegration.test.ts`: Verify Class Profile Anchor Drawer opening from Top 200 cards, 2D structure flashcards, and the therapeutic class filter drawer.
2. **Integration Tests:**
   - `tests/topDrugClinicalCardIndications.test.ts`: Verify indications display and reference toolbar rendering on Top 200 card back.
   - `tests/structureFlashcardIndications.test.ts`: Verify indications display on 2D chemical structure card back.
   - `tests/medChemMatrixLaunchpad.test.ts`: Verify compact toolbar in sticky matrix column.
   - `tests/structureLightboxLaunchpad.test.ts`: Verify single and dual-drug comparator toolbar integrations.
3. **Build & Quality:**
   - `npm run lint` (`tsc --noEmit`): 0 TypeScript errors.
   - `npm run build` (`vite build`): Clean production build.

---

## 7. What is Left to the Builder

- Exact Tailwind color shade tuning for dark/light themes.
- Minor icon spacing adjustments in the compact matrix strip.
- Responsive wrapping behavior on mobile viewports (<640px).
