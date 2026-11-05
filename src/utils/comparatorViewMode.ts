export type ComparatorViewMode = 'auto' | 'single' | 'compare';

export interface ResolveComparatorViewModeParams {
  viewMode?: ComparatorViewMode;
  structureCount: number;
}

/**
 * Resolves whether the StructureComparator should render in 'single' or 'compare' layout.
 * - If only 1 structure is available, always returns 'single' (comparison is impossible).
 * - If viewMode is explicitly 'single', returns 'single'.
 * - If viewMode is explicitly 'compare' and 2+ structures exist, returns 'compare'.
 * - In 'auto' mode (default), returns 'single' for 1 structure and 'compare' for 2+ structures.
 */
export function resolveComparatorViewMode({
  viewMode = 'auto',
  structureCount,
}: ResolveComparatorViewModeParams): 'single' | 'compare' {
  if (structureCount <= 1) {
    return 'single';
  }

  if (viewMode === 'single') {
    return 'single';
  }

  if (viewMode === 'compare') {
    return 'compare';
  }

  // 'auto' mode
  return structureCount === 1 ? 'single' : 'compare';
}
