export interface EnvModeContext {
  PROD?: boolean;
  DEV?: boolean;
  VITE_STUDENT_MODE?: string;
}

/**
 * Pure evaluation function for student mode given an environment context.
 * In production (PROD=true), defaults to student mode (true).
 * In development (DEV=true), defaults to authoring mode (false).
 * Can be explicitly overridden by VITE_STUDENT_MODE boolean string ('true' / 'false').
 */
export function evaluateStudentMode(env: EnvModeContext): boolean {
  if (env.VITE_STUDENT_MODE !== undefined && env.VITE_STUDENT_MODE !== '') {
    return env.VITE_STUDENT_MODE.toLowerCase() === 'true';
  }
  return Boolean(env.PROD);
}

/**
 * Pure evaluation function for whether creator authoring tools
 * (slide ingestion, AI tutor, module editing) are allowed.
 */
export function evaluateAuthoringAllowed(env: EnvModeContext): boolean {
  return !evaluateStudentMode(env);
}

/**
 * Evaluates whether the app is currently running in public student mode.
 * In Vite production builds, import.meta.env.PROD is true.
 */
export function isStudentMode(): boolean {
  try {
    const env: EnvModeContext = {
      PROD: typeof import.meta !== 'undefined' && import.meta.env?.PROD,
      DEV: typeof import.meta !== 'undefined' && import.meta.env?.DEV,
      VITE_STUDENT_MODE:
        typeof import.meta !== 'undefined' ? (import.meta.env?.VITE_STUDENT_MODE as string) : undefined,
    };
    return evaluateStudentMode(env);
  } catch {
    return true;
  }
}

/**
 * Evaluates whether creator authoring features are allowed in the current environment.
 */
export function isAuthoringAllowed(): boolean {
  return !isStudentMode();
}
