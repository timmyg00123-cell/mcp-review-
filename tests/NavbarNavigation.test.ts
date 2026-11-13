import assert from 'node:assert';
import fs from 'node:fs';

console.log('Running Navbar Navigation Restructuring Test...\n');

const navbarPath = 'src/components/Navbar.tsx';
const content = fs.readFileSync(navbarPath, 'utf-8');

// 1. Verify activeTab prop includes 'practice-lab'
assert.ok(content.includes("'practice-lab'"), "NavbarProps activeTab must include 'practice-lab'");

// 2. Verify tab placement in sequence: dashboard -> document-review -> practice-lab -> matrix
const reviewIndex = content.indexOf("onSelectTab('document-review')");
const practiceLabIndex = content.indexOf("onSelectTab('practice-lab')");
const matrixIndex = content.indexOf("onSelectTab('matrix')");

assert.ok(reviewIndex !== -1, "Must contain 'document-review' tab");
assert.ok(practiceLabIndex !== -1, "Must contain 'practice-lab' tab");
assert.ok(matrixIndex !== -1, "Must contain 'matrix' tab");
assert.ok(practiceLabIndex > reviewIndex, "Practice Lab must be positioned after Review Deck");
assert.ok(practiceLabIndex < matrixIndex, "Practice Lab must be positioned before MedChem Matrix");

// 3. Verify Question Studio tab removed from main tab strip
assert.ok(!content.includes("<span>Question Studio</span>"), "Question Studio must be removed from Navbar tab strip");

// 4. Verify old Cumulative pill button removed from right toolbar
assert.ok(!content.includes('title="Open Cumulative Study Hub: Practice Test'), "Old Cumulative right-toolbar button must be removed");

// 5. Verify closed-book exam guard (disabled or hidden when examStatus === 'active')
assert.ok(content.includes("disabled={examStatus === 'active'}"), "Navbar tabs must be disabled during active timed exam");

console.log('✓ Navbar navigation restructuring verified.\n');
