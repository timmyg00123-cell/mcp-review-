import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ClinicalPreflipQuestionCard,
  type ClinicalPreflipQuestionCardProps,
} from '../src/components/ClinicalPreflipQuestionCard.js';
import type {
  ClinicalPreflipQuestion,
} from '../src/utils/clinicalQuestionGenerator.js';

console.log('Running ClinicalPreflipQuestionCard Component Tests...\n');

const componentPath = path.resolve('src/components/ClinicalPreflipQuestionCard.tsx');
assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

const fileContent = fs.readFileSync(componentPath, 'utf8');

// ============================================================================
// Test 1: Interface and Export Contracts
// ============================================================================
console.log('Test 1: Component and Props interface exports...');
assert.ok(
  fileContent.includes('export interface ClinicalPreflipQuestionCardProps'),
  'Must export ClinicalPreflipQuestionCardProps'
);
assert.ok(
  fileContent.includes('export const ClinicalPreflipQuestionCard'),
  'Must export ClinicalPreflipQuestionCard'
);

// Props contract check
assert.ok(fileContent.includes('question: ClinicalPreflipQuestion'), 'Props must include question');
assert.ok(fileContent.includes('onFlipToMonograph: () => void'), 'Props must include onFlipToMonograph');
assert.ok(
  fileContent.includes('onAnswerSubmitted?: (isFullyCorrect: boolean) => void'),
  'Props must include optional onAnswerSubmitted callback'
);
assert.ok(
  fileContent.includes('onOpenClassProfile?: () => void'),
  'Props must include optional onOpenClassProfile callback'
);
assert.ok(fileContent.includes('className?: string'), 'Props must include optional className');

// ============================================================================
// Test 2: Event Safety and Neutrality Contracts
// ============================================================================
console.log('Test 2: Event safety and drawer trigger neutrality contracts...');

// Event propagation check
assert.ok(
  fileContent.includes('stopPropagation'),
  'Component must call stopPropagation to prevent parent card flipping'
);
assert.ok(
  fileContent.includes('Space') || fileContent.includes("' '") || fileContent.includes('" "'),
  'Component must handle Spacebar keydown event'
);
assert.ok(
  fileContent.includes('Enter'),
  'Component must handle Enter keydown event'
);

// Drawer neutrality check
assert.ok(
  fileContent.includes('📖 Class Profile'),
  'Must use neutral label "📖 Class Profile" for drawer trigger'
);

// Sample questions
const sampleMcqQuestion: ClinicalPreflipQuestion = {
  id: 'test-q-mcq-1',
  domain: 'contraindications',
  type: 'mcq',
  prompt: 'Which of the following is an absolute contraindication for Lisinopril?',
  options: [
    {
      id: 'opt-1',
      text: 'History of ACE inhibitor-induced angioedema',
      isCorrect: true,
      explanation: 'Angioedema is an absolute contraindication for ACE inhibitors.',
    },
    {
      id: 'opt-2',
      text: 'Mild essential hypertension',
      isCorrect: false,
      explanation: 'Hypertension is an indication, not a contraindication.',
    },
    {
      id: 'opt-3',
      text: 'Concomitant use of low-dose aspirin',
      isCorrect: false,
    },
    {
      id: 'opt-4',
      text: 'Controlled dyslipidemia',
      isCorrect: false,
    },
  ],
  explanation: 'ACE inhibitors are strictly contraindicated in patients with prior angioedema or pregnancy.',
};

const sampleSataQuestion: ClinicalPreflipQuestion = {
  id: 'test-q-sata-1',
  domain: 'adverse-effects',
  type: 'sata',
  prompt: 'Select all key adverse effects associated with Atorvastatin (Select All That Apply):',
  options: [
    {
      id: 'opt-sata-1',
      text: 'Myalgia and muscle weakness',
      isCorrect: true,
      explanation: 'Statin-associated muscle symptoms are common.',
    },
    {
      id: 'opt-sata-2',
      text: 'Elevated transaminases (LFTs)',
      isCorrect: true,
      explanation: 'Hepatic transaminase elevation occurs in up to 1-2% of patients.',
    },
    {
      id: 'opt-sata-3',
      text: 'Severe hypocalcemia and tetany',
      isCorrect: false,
      explanation: 'Hypocalcemia is not a characteristic statin adverse effect.',
    },
    {
      id: 'opt-sata-4',
      text: 'Significant dry cough',
      isCorrect: false,
      explanation: 'Dry cough is typical of ACE inhibitors, not statins.',
    },
  ],
  explanation: 'Statins frequently cause myalgias and mild LFT elevations; rhabdomyolysis is rare.',
};

// ============================================================================
// Test 3: Unsubmitted MCQ Rendering
// ============================================================================
console.log('Test 3: Unsubmitted MCQ rendering...');
{
  const html = renderToStaticMarkup(
    React.createElement(ClinicalPreflipQuestionCard, {
      question: sampleMcqQuestion,
      onFlipToMonograph: () => {},
      onOpenClassProfile: () => {},
    })
  );

  // Question Prompt
  assert.ok(
    html.includes('Which of the following is an absolute contraindication for Lisinopril?'),
    'Must render question prompt'
  );

  // Domain Badge & Type Badge
  assert.ok(
    html.toLowerCase().includes('contraindication'),
    'Must render domain badge (Contraindications)'
  );
  assert.ok(html.includes('MCQ'), 'Must render MCQ type badge');

  // Input Type: radio for MCQ
  assert.ok(html.includes('type="radio"'), 'MCQ options must render radio inputs');
  assert.ok(!html.includes('type="checkbox"'), 'MCQ options must not render checkbox inputs');

  // Check Answer button is initially disabled
  assert.ok(
    html.includes('disabled') && html.includes('Check Answer'),
    'Check Answer button must be disabled when no options are selected'
  );

  // Escape hatch
  assert.ok(
    html.includes('Skip / Flip to Monograph') || html.includes('Skip to Monograph'),
    'Must render escape hatch skip button'
  );

  // Class Profile Neutral Drawer Button
  assert.ok(
    html.includes('📖 Class Profile'),
    'Must render neutral "📖 Class Profile" button when onOpenClassProfile provided'
  );
}

// ============================================================================
// Test 4: Unsubmitted SATA Rendering
// ============================================================================
console.log('Test 4: Unsubmitted SATA rendering...');
{
  const html = renderToStaticMarkup(
    React.createElement(ClinicalPreflipQuestionCard, {
      question: sampleSataQuestion,
      onFlipToMonograph: () => {},
    })
  );

  // Prompt & Badges
  assert.ok(
    html.includes('Select all key adverse effects associated with Atorvastatin'),
    'Must render SATA prompt'
  );
  assert.ok(
    html.toLowerCase().includes('adverse') || html.toLowerCase().includes('side effects'),
    'Must render Adverse Effects domain badge'
  );
  assert.ok(html.includes('SATA'), 'Must render SATA type badge');

  // Input Type: checkbox for SATA
  assert.ok(html.includes('type="checkbox"'), 'SATA options must render checkbox inputs');

  // No Class Profile button when callback omitted
  assert.ok(
    !html.includes('📖 Class Profile'),
    'Must not render class profile button when onOpenClassProfile omitted'
  );
}

// ============================================================================
// Test 5: Submitted State - Full Correct Verification (MCQ)
// ============================================================================
console.log('Test 5: Submitted state with fully correct selection (MCQ)...');
{
  const html = renderToStaticMarkup(
    React.createElement(ClinicalPreflipQuestionCard, {
      question: sampleMcqQuestion,
      onFlipToMonograph: () => {},
      initialSelectedOptionIds: ['opt-1'],
      initialSubmitted: true,
    })
  );

  // Success Banner
  assert.ok(
    html.includes('Correct') && (html.includes('🎉') || html.includes('Correct!')),
    'Must display success banner with "Correct!"'
  );
  assert.ok(
    html.includes(sampleMcqQuestion.explanation!),
    'Must display question explanation'
  );

  // 3-State Styling: Selected Correct must have emerald highlight
  assert.ok(
    html.includes('emerald') || html.includes('text-emerald') || html.includes('border-emerald'),
    'Selected correct option must have emerald styling'
  );

  // Primary action transforms to reveal monograph
  assert.ok(
    html.includes('Reveal Clinical Monograph →'),
    'Must display "Reveal Clinical Monograph →" action button'
  );
}

// ============================================================================
// Test 6: Submitted State - 3-State Visual Evaluation (SATA with partial/incorrect)
// ============================================================================
console.log('Test 6: Submitted state with 3-state evaluation (SATA with correct, incorrect, and missed)...');
{
  // Student selected opt-sata-1 (correct) and opt-sata-3 (incorrect), missed opt-sata-2 (correct)
  const html = renderToStaticMarkup(
    React.createElement(ClinicalPreflipQuestionCard, {
      question: sampleSataQuestion,
      onFlipToMonograph: () => {},
      initialSelectedOptionIds: ['opt-sata-1', 'opt-sata-3'],
      initialSubmitted: true,
    })
  );

  // Review Needed Banner
  assert.ok(
    html.includes('Review Needed'),
    'Must display review needed banner when submission is not fully correct'
  );

  // 1. Correctly selected item (opt-sata-1): Emerald styling
  assert.ok(
    html.includes('emerald') || html.includes('border-emerald') || html.includes('bg-emerald'),
    'Correctly selected option must display emerald highlight'
  );

  // 2. Incorrectly selected item (opt-sata-3): Rose styling
  assert.ok(
    html.includes('rose') || html.includes('border-rose') || html.includes('bg-rose'),
    'Incorrectly selected option must display rose highlight'
  );

  // 3. Unselected and missed item (opt-sata-2): Amber dashed border
  assert.ok(
    html.includes('amber') || html.includes('border-amber') || html.includes('bg-amber'),
    'Unselected missed option must display amber alert styling'
  );
  assert.ok(
    html.includes('dashed') || html.includes('border-dashed'),
    'Unselected missed option must have dashed border'
  );

  // Reveal monograph button
  assert.ok(
    html.includes('Reveal Clinical Monograph →'),
    'Must display "Reveal Clinical Monograph →" after submission'
  );
}

console.log('\nAll ClinicalPreflipQuestionCard tests passed successfully!');
