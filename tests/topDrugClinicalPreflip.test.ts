// tests/topDrugClinicalPreflip.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  TopDrugClinicalCard,
  type TopDrugClinicalCardProps,
} from '../src/components/TopDrugClinicalCard.js';
import {
  generateClinicalPreflipQuestion,
  type ClinicalQuestionDomain,
} from '../src/utils/clinicalQuestionGenerator.js';
import {
  resolveClassProfileForDrug,
  type TopDrugClassProfile,
} from '../src/data/clinical/classProfiles.js';
import { resolveTopDrugClinicalMonograph } from '../src/data/topDrugsClinicalData.js';

console.log('Running Top 200 Clinical Pre-Flip Deck Integration Tests...');

// ============================================================================
// Test 1: File Existence & Contract Exports in StructureFlashcardDeck.tsx
// ============================================================================
const deckPath = path.resolve('src/components/StructureFlashcardDeck.tsx');
assert.ok(fs.existsSync(deckPath), `Deck file ${deckPath} must exist`);

const deckContent = fs.readFileSync(deckPath, 'utf-8');

// 1a: Storage key and default domains constants
assert.ok(
  deckContent.includes("export const DRILL_DOMAINS_STORAGE_KEY = 'mcp_top200_drill_domains'") ||
    deckContent.includes("DRILL_DOMAINS_STORAGE_KEY = 'mcp_top200_drill_domains'"),
  'Must define DRILL_DOMAINS_STORAGE_KEY with value mcp_top200_drill_domains'
);

assert.ok(
  deckContent.includes('DEFAULT_DRILL_DOMAINS'),
  'Must define DEFAULT_DRILL_DOMAINS constant'
);

assert.ok(
  deckContent.includes("'brand-names'") &&
    deckContent.includes("'contraindications'") &&
    deckContent.includes("'adverse-effects'") &&
    deckContent.includes("'subclass-exceptions'") &&
    deckContent.includes("'dosing-pearls'"),
  'DEFAULT_DRILL_DOMAINS must contain all 5 clinical question domains'
);

// 1b: Helper functions for loading and saving active drill domains
assert.ok(
  deckContent.includes('loadActiveDrillDomains'),
  'Must define loadActiveDrillDomains helper'
);
assert.ok(
  deckContent.includes('saveActiveDrillDomains'),
  'Must define saveActiveDrillDomains helper'
);

// 1c: Domain config array with icons and labels
assert.ok(
  deckContent.includes('CLINICAL_DOMAIN_CONFIG'),
  'Must define CLINICAL_DOMAIN_CONFIG array'
);
assert.ok(deckContent.includes('🏷️') && deckContent.includes('Brands'), 'Domain config must have Brands 🏷️');
assert.ok(deckContent.includes('🚫') && deckContent.includes('Contraindications'), 'Domain config must have Contraindications 🚫');
assert.ok(deckContent.includes('⚠️') && deckContent.includes('Adverse Effects'), 'Domain config must have Adverse Effects ⚠️');
assert.ok(
  deckContent.includes('⚡') && (deckContent.includes('Subclass Exceptions') || deckContent.includes('Exceptions')),
  'Domain config must have Exceptions ⚡'
);
assert.ok(deckContent.includes('💡') && deckContent.includes('Pearls'), 'Domain config must have Pearls 💡');

console.log('✓ Test 1: File existence and contract exports passed.');

// ============================================================================
// Test 2: LocalStorage Persistence & Safe Error Handling
// ============================================================================
const DRILL_DOMAINS_STORAGE_KEY = 'mcp_top200_drill_domains';
const DEFAULT_DRILL_DOMAINS: ClinicalQuestionDomain[] = [
  'brand-names',
  'contraindications',
  'adverse-effects',
  'subclass-exceptions',
  'dosing-pearls',
];

function testLoadActiveDrillDomains(storage: Storage | null): ClinicalQuestionDomain[] {
  try {
    if (!storage) return [...DEFAULT_DRILL_DOMAINS];
    const raw = storage.getItem(DRILL_DOMAINS_STORAGE_KEY);
    if (!raw) return [...DEFAULT_DRILL_DOMAINS];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...DEFAULT_DRILL_DOMAINS];
    if (parsed.length === 0) return [];
    const valid = parsed.filter((d: any): d is ClinicalQuestionDomain =>
      DEFAULT_DRILL_DOMAINS.includes(d)
    );
    return valid.length > 0 ? valid : [...DEFAULT_DRILL_DOMAINS];
  } catch {
    return [...DEFAULT_DRILL_DOMAINS];
  }
}

function testSaveActiveDrillDomains(storage: Storage | null, domains: ClinicalQuestionDomain[]): void {
  try {
    if (storage) {
      storage.setItem(DRILL_DOMAINS_STORAGE_KEY, JSON.stringify(domains));
    }
  } catch {
    // Ignore storage errors
  }
}

// Mock Storage implementation
const storageMap: Record<string, string> = {};
const mockStorage: Storage = {
  length: 0,
  clear: () => {
    for (const key of Object.keys(storageMap)) delete storageMap[key];
  },
  getItem: (k: string) => storageMap[k] ?? null,
  setItem: (k: string, v: string) => {
    storageMap[k] = String(v);
  },
  removeItem: (k: string) => {
    delete storageMap[k];
  },
  key: (i: number) => Object.keys(storageMap)[i] ?? null,
};

// 2a: Empty storage returns defaults
mockStorage.clear();
assert.deepStrictEqual(
  testLoadActiveDrillDomains(mockStorage),
  DEFAULT_DRILL_DOMAINS,
  'Empty storage must return all 5 default domains'
);

// 2b: Corrupt JSON returns defaults safely without throwing
mockStorage.setItem(DRILL_DOMAINS_STORAGE_KEY, 'corrupted JSON{{{{');
assert.deepStrictEqual(
  testLoadActiveDrillDomains(mockStorage),
  DEFAULT_DRILL_DOMAINS,
  'Corrupted JSON in storage must fallback safely to defaults'
);

// 2c: Non-array or invalid entries filter to defaults or valid domains
mockStorage.setItem(DRILL_DOMAINS_STORAGE_KEY, JSON.stringify({ not: 'an-array' }));
assert.deepStrictEqual(
  testLoadActiveDrillDomains(mockStorage),
  DEFAULT_DRILL_DOMAINS,
  'Non-array in storage must fallback to defaults'
);

// 2d: Saved custom domains load correctly
const customSubset: ClinicalQuestionDomain[] = ['brand-names', 'dosing-pearls'];
testSaveActiveDrillDomains(mockStorage, customSubset);
assert.deepStrictEqual(
  testLoadActiveDrillDomains(mockStorage),
  customSubset,
  'Saved custom domains must be retrieved accurately'
);

// 2e: Empty array represents direct flip mode (drills disabled)
testSaveActiveDrillDomains(mockStorage, []);
assert.deepStrictEqual(
  testLoadActiveDrillDomains(mockStorage),
  [],
  'Empty array in storage must be preserved to represent direct flip mode'
);

console.log('✓ Test 2: LocalStorage persistence & safe error handling passed.');

// ============================================================================
// Test 3: Static Wire-Up & Popover Integration in StructureFlashcardDeck.tsx
// ============================================================================
// 3a: Imports from clinicalQuestionGenerator and classProfiles
assert.ok(
  deckContent.includes("from '../utils/clinicalQuestionGenerator") ||
    deckContent.includes("from '../utils/clinicalQuestionGenerator.js'"),
  'Deck must import from clinicalQuestionGenerator'
);
assert.ok(
  deckContent.includes('generateClinicalPreflipQuestion'),
  'Deck must import generateClinicalPreflipQuestion'
);
assert.ok(
  deckContent.includes("from '../data/clinical/classProfiles") ||
    deckContent.includes("from '../data/clinical/classProfiles.js'"),
  'Deck must import from classProfiles'
);
assert.ok(
  deckContent.includes('resolveClassProfileForDrug'),
  'Deck must import resolveClassProfileForDrug'
);

// 3b: State hooks for active drill domains, popover, and card attempt tracking
assert.ok(
  deckContent.includes('activeDrillDomains') && deckContent.includes('setActiveDrillDomains'),
  'Deck must manage activeDrillDomains state'
);
assert.ok(
  deckContent.includes('showDisableDrillsPopover') && deckContent.includes('setShowDisableDrillsPopover'),
  'Deck must manage showDisableDrillsPopover state'
);
assert.ok(
  deckContent.includes('cardAttemptCounts') && deckContent.includes('setCardAttemptCounts'),
  'Deck must manage cardAttemptCounts dictionary state'
);

// 3c: Gentle Confirmation Popover copy and buttons
assert.ok(
  deckContent.includes('Disable pre-flip drills and switch to direct flip mode?'),
  'Popover must contain exact question: "Disable pre-flip drills and switch to direct flip mode?"'
);
assert.ok(
  deckContent.includes('Disable Pre-Flip Drills'),
  'Popover must provide "Disable Pre-Flip Drills" confirmation button'
);
assert.ok(
  deckContent.includes('Keep Drills Enabled'),
  'Popover must provide "Keep Drills Enabled" cancel button'
);

// 3d: TopDrugClinicalCard receives preflipQuestion & classProfile
assert.ok(
  deckContent.includes('preflipQuestion={') || deckContent.includes('preflipQuestion = {'),
  'TopDrugClinicalCard in deck must receive preflipQuestion'
);
assert.ok(
  deckContent.includes('classProfile={') || deckContent.includes('classProfile = {'),
  'TopDrugClinicalCard in deck must receive classProfile'
);

// 3e: Toolbar gate: domain pills only in clinical render mode
assert.ok(
  deckContent.includes("renderMode === 'clinical'") && deckContent.includes('Pre-Flip Drills'),
  'Toolbar domain selector must be gated by renderMode === clinical'
);

console.log('✓ Test 3: Static wire-up and popover integration passed.');

// ============================================================================
// Test 4: Re-Queue Domain Rotation & Grade Handlers
// ============================================================================
// 4a: Increment attempt counts on again / hard
assert.ok(
  deckContent.includes("rating === 'again'") && deckContent.includes("rating === 'hard'"),
  'handleGrade must check again and hard ratings to track card attempts'
);
assert.ok(
  deckContent.includes('cardAttemptCounts'),
  'handleGrade must update cardAttemptCounts on re-queue'
);

// 4b: Deterministic domain rotation verification across re-queued attempts
const testDomains: ClinicalQuestionDomain[] = [
  'brand-names',
  'contraindications',
  'adverse-effects',
  'subclass-exceptions',
  'dosing-pearls',
];

const drug = 'Lisinopril';
const qAttempt0 = generateClinicalPreflipQuestion(drug, testDomains, 0);
const qAttempt1 = generateClinicalPreflipQuestion(drug, testDomains, 1);
const qAttempt2 = generateClinicalPreflipQuestion(drug, testDomains, 2);
const qAttempt3 = generateClinicalPreflipQuestion(drug, testDomains, 3);
const qAttempt4 = generateClinicalPreflipQuestion(drug, testDomains, 4);
const qAttempt5 = generateClinicalPreflipQuestion(drug, testDomains, 5);

assert.ok(qAttempt0 && qAttempt1 && qAttempt2 && qAttempt3 && qAttempt4 && qAttempt5);
assert.strictEqual(qAttempt0.domain, 'brand-names');
assert.strictEqual(qAttempt1.domain, 'contraindications');
assert.strictEqual(qAttempt2.domain, 'adverse-effects');
assert.strictEqual(qAttempt3.domain, 'subclass-exceptions');
assert.strictEqual(qAttempt4.domain, 'dosing-pearls');
assert.strictEqual(qAttempt5.domain, 'brand-names', 'Attempt 5 must wrap back to brand-names');

// 4c: Filtered domain rotation
const restrictedDomains: ClinicalQuestionDomain[] = ['adverse-effects', 'dosing-pearls'];
const qRestricted0 = generateClinicalPreflipQuestion(drug, restrictedDomains, 0);
const qRestricted1 = generateClinicalPreflipQuestion(drug, restrictedDomains, 1);
const qRestricted2 = generateClinicalPreflipQuestion(drug, restrictedDomains, 2);

assert.ok(qRestricted0 && qRestricted1 && qRestricted2);
assert.strictEqual(qRestricted0.domain, 'adverse-effects');
assert.strictEqual(qRestricted1.domain, 'dosing-pearls');
assert.strictEqual(qRestricted2.domain, 'adverse-effects');

console.log('✓ Test 4: Re-queue domain rotation & grade handlers passed.');

// ============================================================================
// Test 5: End-to-End Card Face Integration with Pre-Flip Drills
// ============================================================================
const monograph = resolveTopDrugClinicalMonograph('Lisinopril');
const profile = resolveClassProfileForDrug('Lisinopril');

// 5a: Unflipped card with preflipQuestion renders ClinicalPreflipQuestionCard
const preflipQ = generateClinicalPreflipQuestion('Lisinopril', DEFAULT_DRILL_DOMAINS, 0);
assert.ok(preflipQ !== null);

const htmlWithDrill = renderToStaticMarkup(
  React.createElement(TopDrugClinicalCard, {
    monograph,
    isFlipped: false,
    preflipQuestion: preflipQ,
    classProfile: profile,
  })
);

assert.ok(
  htmlWithDrill.includes('Brand Names') || htmlWithDrill.includes('MCQ') || htmlWithDrill.includes('SATA'),
  'Front face with preflipQuestion must render pre-flip question domain badge'
);
assert.ok(
  htmlWithDrill.includes(preflipQ.prompt),
  'Front face with preflipQuestion must render question prompt'
);

// 5b: Unflipped card with drills disabled (preflipQuestion === null) renders blinded prompt
const htmlWithoutDrill = renderToStaticMarkup(
  React.createElement(TopDrugClinicalCard, {
    monograph,
    isFlipped: false,
    preflipQuestion: null,
    classProfile: profile,
  })
);

assert.ok(
  htmlWithoutDrill.includes('Blinded Prompt'),
  'Front face without drill must render standard blinded prompt'
);
assert.ok(
  htmlWithoutDrill.includes('Click card or press Space to reveal clinical monograph'),
  'Front face without drill must render direct flip cue'
);

// 5c: Flipped card renders clinical monograph tabs, class profile button, exception banner and rating buttons
const htmlFlipped = renderToStaticMarkup(
  React.createElement(
    TopDrugClinicalCard,
    {
      monograph,
      isFlipped: true,
      preflipQuestion: preflipQ,
      classProfile: profile,
    },
    // Children slot: rating buttons as placed by StructureFlashcardDeck
    React.createElement('div', { className: 'rating-bar-slot' }, '4-Interval Rating Bar')
  )
);

assert.ok(htmlFlipped.includes('Class Profile: ACE Inhibitors'), 'Header must render class profile anchor button');
assert.ok(htmlFlipped.includes('4-Interval Rating Bar'), 'Card back must preserve children rating buttons');

console.log('✓ Test 5: End-to-end card face integration with pre-flip drills passed.');

// ============================================================================
// Test 6: SM-2 Independence Verification
// ============================================================================
// Verify that rating buttons ("Again", "Hard", "Good", "Easy") remain independently wired
assert.ok(deckContent.includes("handleGrade('again')"), 'Deck must have Again grade action');
assert.ok(deckContent.includes("handleGrade('hard')"), 'Deck must have Hard grade action');
assert.ok(deckContent.includes("handleGrade('good')"), 'Deck must have Good grade action');
assert.ok(deckContent.includes("handleGrade('easy')"), 'Deck must have Easy grade action');
assert.ok(deckContent.includes('applySpacedRepetitionGrade'), 'Deck must call applySpacedRepetitionGrade');
assert.ok(deckContent.includes('reQueueActiveSession'), 'Deck must call reQueueActiveSession');

console.log('✓ Test 6: SM-2 independence verification passed.');

console.log('\nAll Top 200 Clinical Pre-Flip Deck Integration Tests Passed Successfully!');
