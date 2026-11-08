import test from 'node:test';
import assert from 'node:assert/strict';

// Helper matching completion evaluation logic
export function isMatchingComplete(
  targets: { id: string; acceptedStructureIds: string[] }[],
  placements: Record<string, string[]>,
  unassignedCount: number,
  examModeActive = false
): boolean {
  if (examModeActive || targets.length === 0 || unassignedCount > 0) return false;
  return targets.every((t) => {
    const placed = placements[t.id] || [];
    return placed.length > 0 && placed.every((id) => t.acceptedStructureIds.includes(id));
  });
}

// Helper matching structure resolution logic
export function resolveMatchingStructures(
  question: { type?: string; structuresDisplayed?: any[]; referenced_structures?: string[] },
  allSectionStructures: any[] = [],
  allModuleStructures: any[] = []
): any[] {
  if (question.structuresDisplayed && question.structuresDisplayed.length > 0) {
    return question.structuresDisplayed;
  }
  if (question.type === 'matching') {
    if (allSectionStructures && allSectionStructures.length > 0) {
      return allSectionStructures;
    }
    if (allModuleStructures && allModuleStructures.length > 0) {
      return allModuleStructures;
    }
  }
  return [];
}

test('isMatchingComplete handles targets with multiple alias acceptedStructureIds without inflating required placements', () => {
  const targets = [
    { id: 'target_anoro', acceptedStructureIds: ['umeclidinium', 'I'] },
    { id: 'target_breo', acceptedStructureIds: ['fluticasone_furoate', 'II'] },
    { id: 'target_stiolto', acceptedStructureIds: ['olodaterol', 'III'] },
  ];

  // Placements with 1 valid structure per target
  const placements = {
    target_anoro: ['I'],
    target_breo: ['fluticasone_furoate'],
    target_stiolto: ['III'],
  };

  assert.equal(isMatchingComplete(targets, placements, 0), true);
  // Unassigned structures remain -> not completed
  assert.equal(isMatchingComplete(targets, placements, 1), false);
  // Incorrect placement in target -> not completed
  assert.equal(isMatchingComplete(targets, { ...placements, target_anoro: ['wrong_id'] }, 0), false);
});

test('resolveMatchingStructures falls back to allSectionStructures or allModuleStructures for matching questions with no explicit structures', () => {
  const dummySectionStructures = [{ id: 'str1', name: 'Drug A' }, { id: 'str2', name: 'Drug B' }];
  const dummyModuleStructures = [{ id: 'strM', name: 'Drug M' }];

  const emptyMatchingQ = { type: 'matching' };
  const resolved = resolveMatchingStructures(emptyMatchingQ, dummySectionStructures, dummyModuleStructures);
  assert.equal(resolved.length, 2);
  assert.equal(resolved[0].id, 'str1');

  const qWithExplicit = { type: 'matching', structuresDisplayed: [{ id: 'explicit1', name: 'Explicit Drug' }] };
  const resolvedExplicit = resolveMatchingStructures(qWithExplicit, dummySectionStructures, dummyModuleStructures);
  assert.equal(resolvedExplicit.length, 1);
  assert.equal(resolvedExplicit[0].id, 'explicit1');
});
