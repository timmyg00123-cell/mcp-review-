import assert from 'node:assert';
import { getDefaultAntiarrhythmicModule } from '../src/data/antiarrhythmicModuleData';
import { CLASS_I_KINETICS_WORKBENCH_DATA } from '../src/data/antiarrhythmicWorkbenchData';

// 1. Test Question 1 in Antiarrhythmics Module
const mod = getDefaultAntiarrhythmicModule();
const page1 = mod.pages[0];
const q1 = page1.sections[0].questions[0];

assert.strictEqual(q1.id, 1, 'Q1 must be first question on page 1');
assert.strictEqual(q1.type, 'matching', 'Q1 must be type matching');
assert(Array.isArray(q1.matchingTargets), 'Q1 must have matchingTargets array');
assert.strictEqual(q1.matchingTargets!.length, 5, 'Q1 matchingTargets must have 5 targets');

const allAccepted = q1.matchingTargets!.flatMap((t) => t.acceptedStructureIds);
assert(allAccepted.includes('propafenone'), 'matchingTargets must include propafenone');
assert(allAccepted.includes('lidocaine'), 'matchingTargets must include lidocaine');
assert(allAccepted.includes('procainamide'), 'matchingTargets must include procainamide');
assert(allAccepted.includes('disopyramide'), 'matchingTargets must include disopyramide');
assert(allAccepted.includes('flecainide'), 'matchingTargets must include flecainide');

// 2. Test Question 14 (Workbench) coordinates in CLASS_I_KINETICS_WORKBENCH_DATA
const step2aTargets = CLASS_I_KINETICS_WORKBENCH_DATA.step2a_amides.targets;
assert(step2aTargets.length >= 2, 'step2a must have at least 2 targets');
step2aTargets.forEach((t) => {
  assert(t.x > 100, `Target ${t.id} x coordinate should be calibrated pixels > 100, got ${t.x}`);
  assert(t.y > 50, `Target ${t.id} y coordinate should be calibrated pixels > 50, got ${t.y}`);
  assert(t.radius && t.radius >= 25, `Target ${t.id} radius should be calibrated pixels >= 25, got ${t.radius}`);
});

const step2bTargets = CLASS_I_KINETICS_WORKBENCH_DATA.step2b_moieties.targets;
assert(step2bTargets.length >= 1, 'step2b must have targets');
step2bTargets.forEach((t) => {
  assert(t.x > 100, `Target ${t.id} x coordinate should be calibrated pixels > 100, got ${t.x}`);
  assert(t.y > 50, `Target ${t.id} y coordinate should be calibrated pixels > 50, got ${t.y}`);
});

console.log('Task 2 antiarrhythmic fixes tests passed!');
