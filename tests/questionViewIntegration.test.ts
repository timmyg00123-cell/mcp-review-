import assert from 'node:assert';
import fs from 'node:fs';

const fileContent = fs.readFileSync('src/components/DocumentQuestionItem.tsx', 'utf8');

// Test 1: Must import MinimizedStructureCard
assert(fileContent.includes("import { MinimizedStructureCard } from './MinimizedStructureCard';"), 'Must import MinimizedStructureCard');

// Test 2: Must use MinimizedStructureCard in the referenced structures grid
assert(fileContent.includes('<MinimizedStructureCard'), 'Must render MinimizedStructureCard');

// Test 3: Must NOT contain old raw chemical class fallback 'Class:'
assert(!fileContent.includes('<span className="font-semibold text-slate-500 dark:text-slate-400">Class:</span>'), 'Old ad-hoc Class: text should be replaced by MinimizedStructureCard');

console.log('Task 4 questionViewIntegration tests passed!');
