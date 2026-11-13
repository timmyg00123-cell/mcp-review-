import type { TopDrugStructureRecord, MultiComponentPart, TopDrugStructureType } from '../data/topDrugsSmilesData.js';

/**
 * Returns a blinded, non-identifying component badge label for unrevealed multi-component cards.
 * Example: index 0 -> "Component A", index 1 -> "Component B", index 2 -> "Component C"
 */
export function getBlindedComponentLabel(idx: number): string {
  if (idx >= 0 && idx < 26) {
    return `Component ${String.fromCharCode(65 + idx)}`;
  }
  return `Component ${idx + 1}`;
}

/**
 * Resolves the visual render mode for a structure record.
 * Handles 'multi-component', 'biologic', and defaults safely to 'single-molecule'.
 */
export function resolveStructureRenderMode(
  record?: TopDrugStructureRecord
): TopDrugStructureType {
  if (record?.structureType === 'multi-component' && record.components && record.components.length > 0) {
    return 'multi-component';
  }
  if (record?.structureType === 'biologic') {
    return 'biologic';
  }
  return 'single-molecule';
}

/**
 * Formats a component part with its name and optional clinical role.
 */
export function formatComponentDescription(part: MultiComponentPart): string {
  return part.role ? `${part.componentName} (${part.role})` : part.componentName;
}
