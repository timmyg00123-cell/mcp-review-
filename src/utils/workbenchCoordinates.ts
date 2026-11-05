import { StructuralWorkbenchData } from '../types/reviewModule';

export const SVG_VIEWPORT_WIDTH = 880;
export const SVG_VIEWPORT_HEIGHT = 320;

export const SAFE_MARGIN_X_MIN = 40;
export const SAFE_MARGIN_X_MAX = 840;
export const SAFE_MARGIN_Y_MIN = 30;
export const SAFE_MARGIN_Y_MAX = 290;

export const MIN_RADIUS = 12;
export const MAX_RADIUS = 90;

/**
 * Normalizes an X coordinate for the 880x320 SVG workbench canvas.
 * - If x <= 100 and x >= 0, treats x as a percentage and scales to 880px width.
 * - If x > 100, treats x as an absolute SVG coordinate.
 * - Clamps result within safe margins [SAFE_MARGIN_X_MIN, SAFE_MARGIN_X_MAX].
 */
export function normWorkbenchX(x?: number): number {
  if (x === undefined || x === null || Number.isNaN(x)) return 440;
  const raw = x <= 100 && x >= 0 ? (x / 100) * SVG_VIEWPORT_WIDTH : x;
  return Math.max(SAFE_MARGIN_X_MIN, Math.min(SAFE_MARGIN_X_MAX, raw));
}

/**
 * Normalizes a Y coordinate for the 880x320 SVG workbench canvas.
 * - If y <= 100 and y >= 0, treats y as a percentage and scales to 320px height.
 * - If y > 100, treats y as an absolute SVG coordinate.
 * - Clamps result within safe margins [SAFE_MARGIN_Y_MIN, SAFE_MARGIN_Y_MAX].
 */
export function normWorkbenchY(y?: number): number {
  if (y === undefined || y === null || Number.isNaN(y)) return 160;
  const raw = y <= 100 && y >= 0 ? (y / 100) * SVG_VIEWPORT_HEIGHT : y;
  return Math.max(SAFE_MARGIN_Y_MIN, Math.min(SAFE_MARGIN_Y_MAX, raw));
}

/**
 * Normalizes and clamps a radius for SVG halos and dropzones.
 * - Enforces minimum visibility (MIN_RADIUS = 12px) and maximum boundary (MAX_RADIUS = 90px).
 */
export function normWorkbenchRadius(r?: number, defaultR = 32): number {
  if (r === undefined || r === null || Number.isNaN(r)) return defaultR;
  return Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, r));
}

export interface WorkbenchGeometryVerificationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Enforces geometric verification for workbench halos, moieties, and dropzones.
 * Verifies that all coordinates fall within the 880x320 viewport safe boundaries
 * and radii stay within appropriate target bounds.
 */
export function verifyWorkbenchGeometry(data: StructuralWorkbenchData): WorkbenchGeometryVerificationResult {
  const errors: string[] = [];

  const checkTarget = (
    t: { id?: string; label?: string; x?: number; y?: number; radius?: number },
    stepName: string
  ) => {
    if (t.x === undefined || t.x === null) {
      errors.push(`${stepName} target '${t.id || t.label}' is missing x coordinate`);
      return;
    }
    if (t.y === undefined || t.y === null) {
      errors.push(`${stepName} target '${t.id || t.label}' is missing y coordinate`);
      return;
    }

    const normX = normWorkbenchX(t.x);
    const normY = normWorkbenchY(t.y);

    if (normX < SAFE_MARGIN_X_MIN || normX > SAFE_MARGIN_X_MAX) {
      errors.push(
        `${stepName} target '${t.id || t.label}' x=${normX} out of safe bounds [${SAFE_MARGIN_X_MIN}, ${SAFE_MARGIN_X_MAX}]`
      );
    }
    if (normY < SAFE_MARGIN_Y_MIN || normY > SAFE_MARGIN_Y_MAX) {
      errors.push(
        `${stepName} target '${t.id || t.label}' y=${normY} out of safe bounds [${SAFE_MARGIN_Y_MIN}, ${SAFE_MARGIN_Y_MAX}]`
      );
    }

    if (t.radius !== undefined) {
      const r = normWorkbenchRadius(t.radius);
      if (r < 10 || r > 100) {
        errors.push(`${stepName} target '${t.id || t.label}' radius=${r} out of bounds [10, 100]`);
      }
    }
  };

  if (data.step2a_amides?.targets) {
    for (const t of data.step2a_amides.targets) {
      checkTarget(t, 'step2a_amides');
    }
  }

  if (data.step2b_moieties?.targets) {
    for (const t of data.step2b_moieties.targets) {
      checkTarget(t, 'step2b_moieties');
    }
  }

  if (data.step2c_nature?.dropZones) {
    for (const z of data.step2c_nature.dropZones) {
      checkTarget(z, 'step2c_nature.dropZones');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
