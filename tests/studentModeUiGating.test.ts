import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const navbarSource = fs.readFileSync(path.resolve('src/components/Navbar.tsx'), 'utf-8');
const appSource = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');

assert.ok(
  navbarSource.includes('isStudentMode'),
  'Navbar.tsx must import and check isStudentMode'
);
assert.ok(
  appSource.includes('isStudentMode'),
  'App.tsx must import and check isStudentMode'
);

// Check that Navbar guards tutor, importer, and module editing with isStudentMode
assert.ok(
  navbarSource.includes('!isStudentMode()') || navbarSource.includes('!studentMode'),
  'Navbar.tsx must conditionally hide authoring/AI controls in student mode'
);

// Check that App guards tutor and importer modals with isStudentMode
assert.ok(
  appSource.includes('!isStudentMode()') || appSource.includes('!studentMode'),
  'App.tsx must conditionally bypass rendering AI Tutor and Importer in student mode'
);

console.log('Task 2 studentModeUiGating tests passed!');
