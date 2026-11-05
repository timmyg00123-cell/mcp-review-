import assert from 'node:assert';
import { getDefaultAnticoagulantsModule } from '../src/data/anticoagulantsQuizData';
import { loadAllReviewModules, loadActiveModuleId } from '../src/utils/moduleStorage';

const mod = getDefaultAnticoagulantsModule();

// Test 1: Page count is 8 (7 review worksheet pages + 1 thrombolytics page from lecture slides 30-31)
assert.strictEqual(mod.pages.length, 8, 'Module 9 should have 8 pages');

// Test 2: Page 8 title covers Fibrinolytic / Thrombolytic Agents
const page8 = mod.pages[7];
const page8Title = (page8?.title || '').toLowerCase();
assert(
  page8Title.includes('fibrinolytic') ||
  page8Title.includes('thrombolytic'),
  'Page 8 must cover thrombolytics'
);

// Test 3: Questions cover Alteplase, Streptokinase, and Urokinase
const page8Questions = page8.sections[0]?.questions || [];
assert(page8Questions.length >= 4, 'Page 8 must have at least 4 questions');
const allText = page8Questions.map((q) => q.questionStem + ' ' + (q.explanation || '')).join(' ');
assert(allText.includes('Alteplase') || allText.includes('t-PA'), 'Must cover Alteplase/t-PA');
assert(allText.includes('Streptokinase'), 'Must cover Streptokinase');
assert(allText.includes('Urokinase'), 'Must cover Urokinase');

// Test 4: Verify built-in core modules in moduleStorage
const allModules = loadAllReviewModules();
const ids = allModules.map((m) => m.id);
assert(ids.includes('antiplatelets_mcp2'), 'Must include Module 8');
assert(ids.includes('anticoagulants_mcp2'), 'Must include Module 9');
assert(ids.includes('heart_failure_mcp2'), 'Must include Module 10');
assert(ids.includes('antiarrhythmics_mcp2'), 'Must include Module 11');

// Test 5: Default module is antiplatelets
assert.strictEqual(loadActiveModuleId(), 'antiplatelets_mcp2');

console.log('Task 5 anticoagulantsThrombolytics tests passed!');
