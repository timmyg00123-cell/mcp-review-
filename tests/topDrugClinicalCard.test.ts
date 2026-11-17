import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  TopDrugClinicalCard,
  type TopDrugClinicalCardProps,
  type ClinicalTabId,
} from '../src/components/TopDrugClinicalCard.js';
import {
  TOP_DRUGS_CLINICAL_CATALOG,
  type TopDrugClinicalMonograph,
} from '../src/data/topDrugsClinicalData.js';
import type { ClinicalPreflipQuestion } from '../src/utils/clinicalQuestionGenerator.js';
import {
  CLASS_PROFILES,
  resolveClassProfileForDrug,
  type TopDrugClassProfile,
} from '../src/data/clinical/classProfiles.js';

function decodeHtmlEntities(html: string): string {
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
}

const componentFilePath = path.resolve('src/components/TopDrugClinicalCard.tsx');
assert.ok(fs.existsSync(componentFilePath), `Component file ${componentFilePath} must exist`);

const fileContent = fs.readFileSync(componentFilePath, 'utf8');

// ============================================================================
// Test 1: Interface and Export Contracts
// ============================================================================
assert.ok(
  fileContent.includes("export type ClinicalTabId = 'pharmacology' | 'regimens' | 'patientCare'"),
  'Must export ClinicalTabId union type matching specification'
);
assert.ok(
  fileContent.includes('export interface TopDrugClinicalCardProps'),
  'Must export TopDrugClinicalCardProps interface'
);
assert.ok(
  fileContent.includes('export const TopDrugClinicalCard'),
  'Must export TopDrugClinicalCard component'
);
assert.ok(fileContent.includes('monograph: TopDrugClinicalMonograph'), 'Props must include monograph');
assert.ok(fileContent.includes('isFlipped: boolean'), 'Props must include isFlipped');
assert.ok(fileContent.includes('activeTab?: ClinicalTabId'), 'Props must include optional activeTab');
assert.ok(
  fileContent.includes('onTabChange?: (tab: ClinicalTabId) => void') ||
    fileContent.includes('onTabChange?: (tab: ClinicalTabId)'),
  'Props must include optional onTabChange'
);
assert.ok(
  fileContent.includes('onFlip?: () => void') || fileContent.includes('onFlip?: ()'),
  'Props must include optional onFlip'
);
assert.ok(
  fileContent.includes('preflipQuestion?: ClinicalPreflipQuestion | null') ||
    fileContent.includes('preflipQuestion?:'),
  'Props must include optional preflipQuestion'
);
assert.ok(
  fileContent.includes('onAnswerSubmitted?: (isFullyCorrect: boolean) => void') ||
    fileContent.includes('onAnswerSubmitted?:'),
  'Props must include optional onAnswerSubmitted callback'
);
assert.ok(
  fileContent.includes('classProfile?: TopDrugClassProfile | null') ||
    fileContent.includes('classProfile?:'),
  'Props must include optional classProfile'
);

// Sample medications for testing
const lisinopril = TOP_DRUGS_CLINICAL_CATALOG['Lisinopril'];
assert.ok(lisinopril, 'Lisinopril monograph must exist in catalog');
assert.ok(lisinopril.blackBoxWarning, 'Lisinopril must have a Black Box Warning');

const atorvastatin = TOP_DRUGS_CLINICAL_CATALOG['Atorvastatin'];
assert.ok(atorvastatin, 'Atorvastatin monograph must exist in catalog');
assert.strictEqual(
  atorvastatin.blackBoxWarning,
  undefined,
  'Atorvastatin must have no Black Box Warning'
);

// ============================================================================
// Test 2: Front Face Rendering Contract (!isFlipped)
// ============================================================================
{
  const frontHtmlLisinopril = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: lisinopril,
      isFlipped: false,
    })
  );

  // Prominent Generic Name
  assert.ok(
    frontHtmlLisinopril.includes('Lisinopril'),
    'Front face must display generic name'
  );
  assert.ok(
    frontHtmlLisinopril.includes('text-2xl') || frontHtmlLisinopril.includes('text-3xl'),
    'Front face generic name must have text-2xl or text-3xl font size styling'
  );
  assert.ok(
    frontHtmlLisinopril.includes('font-extrabold'),
    'Front face generic name must have font-extrabold styling'
  );

  // Taxonomy Class Chips
  assert.ok(
    frontHtmlLisinopril.includes(lisinopril.pharmacologicClass),
    'Front face must render Pharmacologic Class chip'
  );
  assert.ok(
    frontHtmlLisinopril.includes(lisinopril.therapeuticClass),
    'Front face must render Therapeutic Class chip'
  );
  assert.ok(
    frontHtmlLisinopril.includes('bg-emerald-950/60') || frontHtmlLisinopril.includes('text-emerald-400'),
    'Front face must style Pharmacologic Class chip with emerald theme'
  );
  assert.ok(
    frontHtmlLisinopril.includes('bg-cyan-950/60') || frontHtmlLisinopril.includes('text-cyan-400'),
    'Front face must style Therapeutic Class chip with cyan theme'
  );

  // FDA Boxed Warning badge pill on Front Face (WHEN PRESENT)
  assert.ok(
    frontHtmlLisinopril.includes('FDA Boxed Warning Prescribed') ||
      frontHtmlLisinopril.includes('Boxed Warning Prescribed'),
    'Front face must display warning badge pill for drug with BBW'
  );

  // Dosage Forms Summary Pill
  assert.ok(
    frontHtmlLisinopril.includes('Forms:'),
    'Front face must display dosage forms summary pill'
  );

  // Subtle Flip Cue
  assert.ok(
    frontHtmlLisinopril.includes('Click card or press Space to reveal clinical monograph'),
    'Front face must display subtle flip cue'
  );

  // Front Face Blinding / Zero-Leaks Guarantee:
  // Must NOT expose full mechanism of action, contraindications, side effects, or dosing on the front face!
  assert.ok(
    !frontHtmlLisinopril.includes(lisinopril.mechanismOfAction),
    'Front face must NOT leak mechanism of action'
  );
  assert.ok(
    !frontHtmlLisinopril.includes(lisinopril.contraindications[0]),
    'Front face must NOT leak contraindications'
  );
  assert.ok(
    !frontHtmlLisinopril.includes(lisinopril.dosingRegimens[0]),
    'Front face must NOT leak dosing regimens'
  );
}

// ============================================================================
// Test 3: Front Face Suppression of BBW Pill (WHEN ABSENT)
// ============================================================================
{
  const frontHtmlAtorvastatin = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: atorvastatin,
      isFlipped: false,
    })
  );

  assert.ok(
    frontHtmlAtorvastatin.includes('Atorvastatin'),
    'Front face must display Atorvastatin generic name'
  );
  assert.ok(
    !frontHtmlAtorvastatin.includes('Boxed Warning Prescribed'),
    'Front face must NOT render Boxed Warning pill when blackBoxWarning is absent'
  );
  assert.ok(
    !frontHtmlAtorvastatin.includes('FDA Boxed Warning Prescribed'),
    'Front face must cleanly suppress Boxed Warning badge when blackBoxWarning is absent'
  );
}

// ============================================================================
// Test 4: Back Face Rendering - Header Zone & Callout Banners
// ============================================================================
{
  const backHtmlLisinopril = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: lisinopril,
      isFlipped: true,
      activeTab: 'pharmacology',
    })
  );

  // Header Zone: Generic Name, Brand Names, Dosage Forms
  assert.ok(backHtmlLisinopril.includes('Lisinopril'), 'Back face must render generic name in header');
  assert.ok(
    backHtmlLisinopril.includes('Brand Names:') || backHtmlLisinopril.includes('Prinivil'),
    'Back face must render brand names'
  );
  for (const brand of lisinopril.brandNames) {
    assert.ok(backHtmlLisinopril.includes(brand), `Back face must include brand name ${brand}`);
  }

  // Top Callout Banners: FDA Black Box Warning Callout (WHEN PRESENT)
  assert.ok(
    backHtmlLisinopril.includes('FDA BLACK BOX WARNING'),
    'Back face must display FDA BLACK BOX WARNING header when BBW is present'
  );
  assert.ok(
    backHtmlLisinopril.includes(lisinopril.blackBoxWarning!),
    'Back face must display BBW body text when present'
  );
  assert.ok(
    backHtmlLisinopril.includes('bg-rose-950/40') || backHtmlLisinopril.includes('border-rose-500/50'),
    'BBW banner must be styled with rose callout classes'
  );

  // Top Callout Banners: Contraindications Callout
  assert.ok(
    backHtmlLisinopril.includes('Contraindications:'),
    'Back face must render Contraindications header'
  );
  assert.ok(
    backHtmlLisinopril.includes(lisinopril.contraindications[0]),
    'Back face must render contraindications list'
  );
  assert.ok(
    backHtmlLisinopril.includes('bg-amber-950/30') || backHtmlLisinopril.includes('border-amber-500/40'),
    'Contraindications banner must be styled with amber callout classes'
  );
}

// ============================================================================
// Test 5: Back Face Clean Suppression of FDA Black Box Warning (WHEN ABSENT)
// ============================================================================
{
  const backHtmlAtorvastatin = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: atorvastatin,
      isFlipped: true,
      activeTab: 'pharmacology',
    })
  );

  assert.ok(
    !backHtmlAtorvastatin.includes('FDA BLACK BOX WARNING'),
    'Back face must cleanly suppress FDA BLACK BOX WARNING header when absent'
  );
  assert.ok(
    !backHtmlAtorvastatin.includes('bg-rose-950/40'),
    'Back face must not render rose BBW container when absent'
  );
}

// ============================================================================
// Test 6: 3 Structured Tabs Switcher & Panes Content
// ============================================================================
{
  // Tab 1: Pharmacology
  const tab1Html = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: lisinopril,
      isFlipped: true,
      activeTab: 'pharmacology',
    })
  );

  assert.ok(
    tab1Html.includes('Tab 1: Pharmacology') ||
      (tab1Html.includes('Pharmacology') && tab1Html.includes('1')),
    'Must display Tab 1: Pharmacology segmented button with indicator 1'
  );
  assert.ok(
    tab1Html.includes('Tab 2: Regimens &amp; Safety') ||
      tab1Html.includes('Tab 2: Regimens & Safety') ||
      (tab1Html.includes('Regimens') && tab1Html.includes('2')),
    'Must display Tab 2: Regimens & Safety segmented button with indicator 2'
  );
  assert.ok(
    tab1Html.includes('Tab 3: Patient Care &amp; Monitoring') ||
      tab1Html.includes('Tab 3: Patient Care & Monitoring') ||
      (tab1Html.includes('Patient Care') && tab1Html.includes('3')),
    'Must display Tab 3: Patient Care & Monitoring segmented button with indicator 3'
  );

  // Tab 1 Content: Mechanism of Action & Side Effects
  assert.ok(
    tab1Html.includes(lisinopril.mechanismOfAction),
    'Tab 1 must render full Mechanism of Action'
  );
  assert.ok(
    tab1Html.includes(lisinopril.sideEffects.common[0]),
    'Tab 1 must render common side effects'
  );
  if (lisinopril.sideEffects.severe && lisinopril.sideEffects.severe.length > 0) {
    assert.ok(
      tab1Html.includes(lisinopril.sideEffects.severe[0]),
      'Tab 1 must render severe side effects'
    );
  }

  // Tab 2: Regimens & Safety
  const tab2HtmlRaw = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: lisinopril,
      isFlipped: true,
      activeTab: 'regimens',
    })
  );
  const tab2Html = decodeHtmlEntities(tab2HtmlRaw);

  assert.ok(
    tab2Html.includes(lisinopril.dosingRegimens[0]),
    'Tab 2 must render Dosing Regimens'
  );
  assert.ok(
    tab2Html.includes(lisinopril.drugInteractions.major[0]),
    'Tab 2 must render Major Drug Interactions'
  );
  assert.ok(
    tab2Html.includes(lisinopril.drugInteractions.common[0]),
    'Tab 2 must render Common Drug Interactions'
  );

  // Tab 3: Patient Care & Monitoring
  const tab3HtmlRaw = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: lisinopril,
      isFlipped: true,
      activeTab: 'patientCare',
    })
  );
  const tab3Html = decodeHtmlEntities(tab3HtmlRaw);

  assert.ok(
    tab3Html.includes(lisinopril.monitoringParameters[0]),
    'Tab 3 must render Monitoring Parameters'
  );
  assert.ok(
    tab3Html.includes(lisinopril.administrationAndCounseling[0]),
    'Tab 3 must render Administration & Counseling Points'
  );
  assert.ok(
    tab3Html.includes(lisinopril.dosageForms[0]),
    'Tab 3 must render Dosage Forms details'
  );
}

// ============================================================================
// Test 7: Scrollable Container Constraint
// ============================================================================
assert.ok(
  fileContent.includes('max-h-[360px]') || fileContent.includes('max-h-90'),
  'Tab content container must enforce max-h-[360px] scrollable constraint'
);
assert.ok(
  fileContent.includes('overflow-y-auto'),
  'Tab content container must enforce overflow-y-auto'
);

// ============================================================================
// Test 8: Keyboard Shortcuts (1, 2, 3) for Flipped Tab Switching
// ============================================================================
assert.ok(fileContent.includes('keydown'), 'Must register keydown listener for keyboard shortcuts');
assert.ok(
  fileContent.includes("'1'") || fileContent.includes('"1"'),
  "Must listen for key '1' to switch to pharmacology"
);
assert.ok(
  fileContent.includes("'2'") || fileContent.includes('"2"'),
  "Must listen for key '2' to switch to regimens"
);
assert.ok(
  fileContent.includes("'3'") || fileContent.includes('"3"'),
  "Must listen for key '3' to switch to patientCare"
);
assert.ok(
  fileContent.includes('isFlipped'),
  'Tab hotkeys must be conditional on card being flipped'
);
assert.ok(
  fileContent.includes('INPUT') || fileContent.includes('TEXTAREA') || fileContent.includes('isContentEditable'),
  'Must guard against active input or textarea elements during hotkey capture'
);

// ============================================================================
// Test 9: Complete Coverage of All 12 Clinical Domains
// ============================================================================
// Domains check:
// 1. Generic Name (Front & Back)
// 2. Brand Names (Back)
// 3. Pharmacologic Class (Front & Back)
// 4. Therapeutic Class (Front & Back)
// 5. Mechanism of Action (Tab 1)
// 6. Side Effects (Common & Severe) (Tab 1)
// 7. Contraindications (Callout Banner)
// 8. FDA Black Box Warning (Front pill + Callout Banner when present)
// 9. Dosing Regimens (Tab 2)
// 10. Drug Interactions (Major & Common) (Tab 2)
// 11. Monitoring Parameters (Tab 3)
// 12. Dosage Forms & Administration / Counseling (Front, Back header, Tab 3)

assert.ok(fileContent.includes('monograph.genericName'), 'Must render genericName');
assert.ok(fileContent.includes('monograph.brandNames'), 'Must render brandNames');
assert.ok(fileContent.includes('monograph.pharmacologicClass'), 'Must render pharmacologicClass');
assert.ok(fileContent.includes('monograph.therapeuticClass'), 'Must render therapeuticClass');
assert.ok(fileContent.includes('monograph.mechanismOfAction'), 'Must render mechanismOfAction');
assert.ok(fileContent.includes('monograph.sideEffects'), 'Must render sideEffects');
assert.ok(fileContent.includes('monograph.contraindications'), 'Must render contraindications');
assert.ok(fileContent.includes('monograph.blackBoxWarning'), 'Must inspect blackBoxWarning');
assert.ok(fileContent.includes('monograph.dosingRegimens'), 'Must render dosingRegimens');
assert.ok(fileContent.includes('monograph.drugInteractions'), 'Must render drugInteractions');
assert.ok(fileContent.includes('monograph.monitoringParameters'), 'Must render monitoringParameters');
assert.ok(fileContent.includes('monograph.dosageForms'), 'Must render dosageForms');
assert.ok(fileContent.includes('monograph.administrationAndCounseling'), 'Must render administrationAndCounseling');

// ============================================================================
// Test 10: Multi-Medication Black Box Warning & Suppression Rigor
// ============================================================================
{
  const bbwMedications = ['Metformin', 'Apixaban', 'Sertraline', 'Levothyroxine'];
  const nonBbwMedications = ['Amoxicillin', 'Omeprazole', 'Albuterol'];

  for (const name of bbwMedications) {
    const mono = TOP_DRUGS_CLINICAL_CATALOG[name];
    assert.ok(mono, `Monograph for ${name} must exist`);
    assert.ok(mono.blackBoxWarning, `${name} must have a blackBoxWarning in catalog`);

    // Front face
    const frontHtml = renderToStaticMarkup(
      React.createElement(TopDrugClinicalCard, { monograph: mono, isFlipped: false })
    );
    assert.ok(
      frontHtml.includes('Boxed Warning Prescribed'),
      `Front face of ${name} must render Boxed Warning pill`
    );

    // Back face
    const backHtml = renderToStaticMarkup(
      React.createElement(TopDrugClinicalCard, { monograph: mono, isFlipped: true })
    );
    assert.ok(
      backHtml.includes('FDA BLACK BOX WARNING'),
      `Back face of ${name} must render FDA BLACK BOX WARNING banner`
    );
    assert.ok(
      backHtml.includes(mono.blackBoxWarning),
      `Back face of ${name} must display exact warning text`
    );
  }

  for (const name of nonBbwMedications) {
    const mono = TOP_DRUGS_CLINICAL_CATALOG[name];
    assert.ok(mono, `Monograph for ${name} must exist`);
    assert.strictEqual(
      mono.blackBoxWarning,
      undefined,
      `${name} must not have blackBoxWarning in catalog`
    );

    // Front face
    const frontHtml = renderToStaticMarkup(
      React.createElement(TopDrugClinicalCard, { monograph: mono, isFlipped: false })
    );
    assert.ok(
      !frontHtml.includes('Boxed Warning Prescribed'),
      `Front face of ${name} must NOT render Boxed Warning pill`
    );

    // Back face
    const backHtml = renderToStaticMarkup(
      React.createElement(TopDrugClinicalCard, { monograph: mono, isFlipped: true })
    );
    assert.ok(
      !backHtml.includes('FDA BLACK BOX WARNING'),
      `Back face of ${name} must cleanly suppress FDA BLACK BOX WARNING banner`
    );
    assert.ok(
      !backHtml.includes('bg-rose-950/40'),
      `Back face of ${name} must not render rose callout box`
    );
  }
}

// ============================================================================
// Test 11: Children Slot Rendering on Back Face
// ============================================================================
{
  const testChildren = React.createElement(
    'div',
    { className: 'test-rating-buttons-slot' },
    'Rating Buttons Slot'
  );

  const backHtmlWithChildren = renderToStaticMarkup(
    React.createElement(
      TopDrugClinicalCard,
      {
        monograph: lisinopril,
        isFlipped: true,
      },
      testChildren
    )
  );

  assert.ok(
    backHtmlWithChildren.includes('Rating Buttons Slot'),
    'Back face must render children slot when provided'
  );
  assert.ok(
    backHtmlWithChildren.includes('test-rating-buttons-slot'),
    'Back face must render children wrapper'
  );

  const frontHtmlWithChildren = renderToStaticMarkup(
    React.createElement(
      TopDrugClinicalCard,
      {
        monograph: lisinopril,
        isFlipped: false,
      },
      testChildren
    )
  );

  assert.ok(
    !frontHtmlWithChildren.includes('Rating Buttons Slot'),
    'Front face must not render back-face children slot'
  );
}

// ============================================================================
// Test 12: Front Face Pre-Flip Micro-Drill Rendering & Insulation
// ============================================================================
{
  const sampleQuestion: ClinicalPreflipQuestion = {
    id: 'test-q-1',
    domain: 'contraindications',
    type: 'mcq',
    prompt: 'Which of the following is an absolute contraindication for Lisinopril?',
    options: [
      {
        id: 'opt-1',
        text: 'History of ACE inhibitor-induced angioedema',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        text: 'Essential hypertension',
        isCorrect: false,
      },
    ],
  };

  const frontHtmlWithQuestion = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: lisinopril,
      isFlipped: false,
      preflipQuestion: sampleQuestion,
    })
  );

  // Renders the question prompt and options
  assert.ok(
    frontHtmlWithQuestion.includes('Which of the following is an absolute contraindication for Lisinopril?'),
    'Front face must render pre-flip question prompt when preflipQuestion is provided'
  );
  assert.ok(
    frontHtmlWithQuestion.includes('History of ACE inhibitor-induced angioedema'),
    'Front face must render question option text'
  );

  // Pre-flip active suppresses the standard blinded prompt click-to-flip text
  assert.ok(
    !frontHtmlWithQuestion.includes('Click card or press Space to reveal clinical monograph'),
    'Pre-flip question mode must suppress the generic blinded prompt flip cue'
  );

  // Code inspection contract: Preflip area event insulation
  assert.ok(
    fileContent.includes('ClinicalPreflipQuestionCard'),
    'TopDrugClinicalCard must incorporate ClinicalPreflipQuestionCard component'
  );
}

// ============================================================================
// Test 13: Front Face Neutral Drawer Trigger (Zero Class Leaks)
// ============================================================================
{
  // 1. With pre-flip question
  const sampleQuestion: ClinicalPreflipQuestion = {
    id: 'test-q-2',
    domain: 'adverse-effects',
    type: 'mcq',
    prompt: 'Identify the common toxicity',
    options: [{ id: 'opt-1', text: 'Dry cough', isCorrect: true }],
  };

  const frontHtmlWithQuestion = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: lisinopril,
      isFlipped: false,
      preflipQuestion: sampleQuestion,
    })
  );

  assert.ok(
    frontHtmlWithQuestion.includes('📖 Class Profile'),
    'Front face with preflip question must provide neutral 📖 Class Profile drawer trigger'
  );
  // Ensure the class name is NOT leaked inside the trigger label on front face
  assert.ok(
    !frontHtmlWithQuestion.includes('📖 Class Profile: ACE Inhibitors'),
    'Front face must NOT leak the class name inside the drawer trigger label'
  );

  // 2. Without pre-flip question (blinded prompt mode)
  const frontHtmlWithoutQuestion = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: lisinopril,
      isFlipped: false,
    })
  );

  assert.ok(
    frontHtmlWithoutQuestion.includes('📖 Class Profile'),
    'Front face in blinded prompt mode must render neutral 📖 Class Profile button when profile exists'
  );
  assert.ok(
    !frontHtmlWithoutQuestion.includes('📖 Class Profile: ACE Inhibitors'),
    'Blinded prompt front face must NEVER reveal class name in class profile button'
  );
}

// ============================================================================
// Test 14: Back Face High-Yield Subclass Exceptions Banner
// ============================================================================
{
  // Lisinopril has exceptions in ACE Inhibitors profile
  const backHtmlLisinopril = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: lisinopril,
      isFlipped: true,
    })
  );

  assert.ok(
    backHtmlLisinopril.includes('🔥 High-Yield Subclass Exceptions'),
    'Back face must render 🔥 High-Yield Subclass Exceptions banner when drug has exceptions'
  );
  assert.ok(
    backHtmlLisinopril.includes('Hydrophilic lysine analog') ||
      backHtmlLisinopril.includes('active drug (not a prodrug)') ||
      backHtmlLisinopril.includes('renal impairment'),
    'Back face must render subclass exception details for Lisinopril'
  );

  // When class profile has no exceptions for drug, cleanly suppress banner
  const blankProfile: TopDrugClassProfile = {
    className: 'Test Class',
    therapeuticCategory: 'Test Category',
    universalMoa: 'Test MOA',
    classWideToxicities: ['Tox 1'],
    baselineMonitoring: ['Mon 1'],
    memberDrugNames: ['Lisinopril'],
    exceptionsByDrug: {},
  };

  const backHtmlBlank = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: lisinopril,
      isFlipped: true,
      classProfile: blankProfile,
    })
  );

  assert.ok(
    !backHtmlBlank.includes('🔥 High-Yield Subclass Exceptions'),
    'Back face must cleanly suppress exceptions banner when drug has no subclass exceptions'
  );
}

// ============================================================================
// Test 15: Back Face Class Profile Drawer Trigger
// ============================================================================
{
  const backHtmlLisinopril = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: lisinopril,
      isFlipped: true,
    })
  );

  assert.ok(
    backHtmlLisinopril.includes('📖 Class Profile: ACE Inhibitors'),
    'Back face header must display class profile drawer trigger with class name "📖 Class Profile: ACE Inhibitors"'
  );

  const backHtmlAtorvastatin = renderToStaticMarkup(
    React.createElement(TopDrugClinicalCard, {
      monograph: atorvastatin,
      isFlipped: true,
    })
  );

  assert.ok(
    backHtmlAtorvastatin.includes('📖 Class Profile: Statins'),
    'Back face header must display class profile drawer trigger with class name "📖 Class Profile: Statins"'
  );
}

// ============================================================================
// Test 16: Drawer Integration & State Architecture Contract
// ============================================================================
{
  assert.ok(
    fileContent.includes('ClassProfileAnchorDrawer'),
    'TopDrugClinicalCard must import and render ClassProfileAnchorDrawer'
  );
  assert.ok(
    fileContent.includes('isClassDrawerOpen'),
    'TopDrugClinicalCard must maintain isClassDrawerOpen state'
  );
  assert.ok(
    fileContent.includes('setIsClassDrawerOpen'),
    'TopDrugClinicalCard must maintain setIsClassDrawerOpen state setter'
  );
}

console.log('All TopDrugClinicalCard component tests passed successfully!');
