import assert from 'node:assert';
import { evaluateStudentMode, evaluateAuthoringAllowed } from '../src/utils/envMode';

// Test 1: Production defaults to student mode
assert.strictEqual(
  evaluateStudentMode({ PROD: true, DEV: false }),
  true,
  'Production build must default to student mode'
);

// Test 2: Development defaults to authoring mode (not student mode)
assert.strictEqual(
  evaluateStudentMode({ PROD: false, DEV: true }),
  false,
  'Development build must default to authoring mode'
);

// Test 3: Explicit VITE_STUDENT_MODE override
assert.strictEqual(
  evaluateStudentMode({ PROD: false, DEV: true, VITE_STUDENT_MODE: 'true' }),
  true,
  'VITE_STUDENT_MODE="true" override must force student mode even in DEV'
);

assert.strictEqual(
  evaluateStudentMode({ PROD: true, DEV: false, VITE_STUDENT_MODE: 'false' }),
  false,
  'VITE_STUDENT_MODE="false" override must allow authoring even in PROD'
);

// Test 4: Authoring allowed helper
assert.strictEqual(evaluateAuthoringAllowed({ PROD: true, DEV: false }), false);
assert.strictEqual(evaluateAuthoringAllowed({ PROD: false, DEV: true }), true);

console.log('Task 1 envModeGating tests passed!');
