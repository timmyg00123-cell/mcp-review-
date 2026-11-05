import assert from 'node:assert';
import {
  normWorkbenchX,
  normWorkbenchY,
  normWorkbenchRadius,
  verifyWorkbenchGeometry,
} from '../src/utils/workbenchCoordinates';
import { ANTIARRHYTHMIC_WORKBENCH_DATA } from '../src/data/antiarrhythmicWorkbenchData';
import { DABIGATRAN_WORKBENCH_QUESTION } from '../src/data/anticoagulantsQuizData';

// Test 1: Normalization math
// Percentage <= 100 maps to 880 / 320 viewBox
assert.strictEqual(normWorkbenchX(50), (50 / 100) * 880);
assert.strictEqual(normWorkbenchY(50), (50 / 100) * 320);
// Direct coordinates (> 100) are clamped and bounded
assert.strictEqual(normWorkbenchX(440), 440);
assert.strictEqual(normWorkbenchY(160), 160);

// Test 2: Bounding checks
assert.strictEqual(normWorkbenchX(-10), 40); // Clamped to min safe margin
assert.strictEqual(normWorkbenchX(950), 840); // Clamped to max safe margin
assert.strictEqual(normWorkbenchY(-20), 30);
assert.strictEqual(normWorkbenchY(400), 290);

// Test 3: Radius normalization
assert.strictEqual(normWorkbenchRadius(25), 25);
assert.strictEqual(normWorkbenchRadius(5), 12); // Minimum radius clamp
assert.strictEqual(normWorkbenchRadius(150), 90); // Maximum radius clamp

// Test 4: Verification function on actual Antiarrhythmic workbench data (Lidocaine, Amiodarone)
const lidoVerify = verifyWorkbenchGeometry(ANTIARRHYTHMIC_WORKBENCH_DATA.lidocaine);
assert.strictEqual(lidoVerify.isValid, true, `Lidocaine workbench geometry invalid: ${lidoVerify.errors.join('; ')}`);

const amioVerify = verifyWorkbenchGeometry(ANTIARRHYTHMIC_WORKBENCH_DATA.amiodarone);
assert.strictEqual(amioVerify.isValid, true, `Amiodarone workbench geometry invalid: ${amioVerify.errors.join('; ')}`);

// Test 5: Verify Dabigatran workbench question in Anticoagulants
assert.ok(DABIGATRAN_WORKBENCH_QUESTION?.structuralWorkbench, 'Dabigatran workbench question must contain structuralWorkbench');
if (DABIGATRAN_WORKBENCH_QUESTION?.structuralWorkbench) {
  const dabiVerify = verifyWorkbenchGeometry(DABIGATRAN_WORKBENCH_QUESTION.structuralWorkbench);
  assert.strictEqual(dabiVerify.isValid, true, `Dabigatran workbench geometry invalid: ${dabiVerify.errors.join('; ')}`);
}

console.log('Task 6 workbenchHaloVerification tests passed!');
