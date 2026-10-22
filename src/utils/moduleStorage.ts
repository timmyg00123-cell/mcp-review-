import {
  ReviewModule,
  QuizSessionProgress,
} from '../types/reviewModule';
import { pdfPages } from '../data/antiplateletQuizData';
import { medChemGraphDb } from '../db/medChemGraphDb';

const MODULES_STORAGE_KEY = 'medchem_review_modules_v2';
const BUILTIN_OVERRIDES_KEY = 'medchem_builtin_overrides_v2';
const HIDDEN_BUILTIN_KEY = 'medchem_hidden_builtins_v2';
const ACTIVE_MODULE_ID_KEY = 'medchem_active_module_id_v2';
const MODULE_ANSWERS_PREFIX = 'medchem_answers_v2_';

// In-memory cache for synchronous instant rendering without waiting for IndexedDB
let inMemoryModules: ReviewModule[] | null = null;
const inMemoryProgress: Record<string, QuizSessionProgress> = {};
let inMemoryHiddenBuiltins: string[] | null = null;
let inMemoryActiveModuleId: string | null = null;
let isDexieInitialized = false;

export function getHiddenBuiltins(): string[] {
  if (inMemoryHiddenBuiltins) return inMemoryHiddenBuiltins;
  try {
    const raw = localStorage.getItem(HIDDEN_BUILTIN_KEY);
    inMemoryHiddenBuiltins = raw ? JSON.parse(raw) : [];
    return inMemoryHiddenBuiltins || [];
  } catch {
    inMemoryHiddenBuiltins = [];
    return [];
  }
}

export function restoreBuiltInModule(moduleId: string): void {
  try {
    const hidden = getHiddenBuiltins().filter((id) => id !== moduleId);
    inMemoryHiddenBuiltins = hidden;
    localStorage.setItem(HIDDEN_BUILTIN_KEY, JSON.stringify(hidden));
  } catch (err) {
    console.error('Failed to restore built-in module:', err);
  }
}

export function getDefaultAntiplateletModule(): ReviewModule {
  return {
    id: 'antiplatelets_mcp2',
    title: 'Review for Antiplatelets',
    subtitle: 'Thienopyridines, Nucleosides, Peptidomimetics & Gp IIb/IIIa Antagonists',
    course: 'Medicinal Chemistry (MCP II)',
    semester: 'Fall 2026',
    code: 'RAAH',
    isBuiltIn: true,
    createdAt: '2026-10-14',
    pages: pdfPages as any,
  };
}

/**
 * Synchronous read from in-memory cache for instant 0ms first paint.
 * Avoids blocking the main thread during LCP with heavy localStorage JSON deserialization.
 * User-created modules and Dexie persistence are hydrated asynchronously post-mount.
 */
export function loadAllReviewModules(): ReviewModule[] {
  if (inMemoryModules && inMemoryModules.length > 0) {
    return inMemoryModules;
  }

  const defaultAntiplatelet = getDefaultAntiplateletModule();
  const hiddenBuiltins = getHiddenBuiltins();

  let overrides: Record<string, ReviewModule> = {};
  try {
    const rawOverrides = localStorage.getItem(BUILTIN_OVERRIDES_KEY);
    if (rawOverrides) {
      overrides = JSON.parse(rawOverrides) || {};
      if (overrides['vasodilators_mcp2']) {
        delete overrides['vasodilators_mcp2'];
        localStorage.setItem(BUILTIN_OVERRIDES_KEY, JSON.stringify(overrides));
      }
    }
  } catch (e) {
    console.warn('Could not parse built-in overrides:', e);
  }

  const finalAntiplatelet = overrides['antiplatelets_mcp2'] || defaultAntiplatelet;
  const initialList = hiddenBuiltins.includes('antiplatelets_mcp2') ? [] : [finalAntiplatelet];

  inMemoryModules = initialList.length > 0 ? initialList : [finalAntiplatelet];
  return inMemoryModules;
}

/**
 * Initializes and synchronizes review modules and session progress with Dexie IndexedDB.
 * Migrates existing localStorage modules to Dexie if needed and eliminates the 5MB quota limit.
 */
export async function initModuleStorageFromDexie(): Promise<ReviewModule[]> {
  try {
    const defaultAntiplatelet = getDefaultAntiplateletModule();
    const hiddenBuiltins = getHiddenBuiltins();

    // 1. Load custom modules from Dexie
    const dexieModules = await medChemGraphDb.modules.toArray();

    // 2. Load progress from Dexie
    const dexieProgress = await medChemGraphDb.sessionProgress.toArray();
    dexieProgress.forEach((p) => {
      if (p.moduleId && p.progress) {
        inMemoryProgress[p.moduleId] = p.progress;
      }
    });

    let overrides: Record<string, ReviewModule> = {};
    try {
      const rawOverrides = localStorage.getItem(BUILTIN_OVERRIDES_KEY);
      if (rawOverrides) {
        overrides = JSON.parse(rawOverrides) || {};
      }
    } catch {}

    const finalAntiplatelet = overrides['antiplatelets_mcp2'] || defaultAntiplatelet;

    if (dexieModules.length > 0) {
      // Dexie contains saved modules
      const customList = dexieModules
        .map((m) => m.module)
        .filter((m) => m && m.id !== 'antiplatelets_mcp2' && m.id !== 'vasodilators_mcp2');

      let combined: ReviewModule[];
      if (hiddenBuiltins.includes('antiplatelets_mcp2') && customList.length > 0) {
        combined = customList;
      } else {
        combined = [finalAntiplatelet, ...customList];
      }

      inMemoryModules = combined;
      isDexieInitialized = true;
      return combined;
    } else {
      // Dexie table is empty: migrate existing custom modules from localStorage to Dexie
      const raw = localStorage.getItem(MODULES_STORAGE_KEY);
      const parsed: ReviewModule[] = raw ? JSON.parse(raw) : [];
      const customList = Array.isArray(parsed)
        ? parsed.filter((m) => m.id !== 'antiplatelets_mcp2' && m.id !== 'vasodilators_mcp2')
        : [];

      for (const m of customList) {
        await medChemGraphDb.modules.put({
          id: m.id,
          module: m,
          updatedAt: new Date().toISOString(),
        });
      }

      // Also migrate any localStorage progress to Dexie
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(MODULE_ANSWERS_PREFIX)) {
            const mId = key.replace(MODULE_ANSWERS_PREFIX, '');
            const val = localStorage.getItem(key);
            if (val) {
              const prog = JSON.parse(val);
              inMemoryProgress[mId] = prog;
              await medChemGraphDb.sessionProgress.put({
                moduleId: mId,
                progress: prog,
                updatedAt: new Date().toISOString(),
              });
            }
          }
        }
      } catch (migErr) {
        console.warn('Progress migration warning:', migErr);
      }

      let combined: ReviewModule[];
      if (hiddenBuiltins.includes('antiplatelets_mcp2') && customList.length > 0) {
        combined = customList;
      } else {
        combined = [finalAntiplatelet, ...customList];
      }

      inMemoryModules = combined;
      isDexieInitialized = true;
      return combined;
    }
  } catch (err) {
    console.error('Failed to init Dexie module storage, falling back to synchronous load:', err);
    return loadAllReviewModules();
  }
}

/**
 * Saves a ReviewModule to Dexie IndexedDB (async) and updates in-memory cache and localStorage.
 * Gracefully handles any LocalStorage QuotaExceededError without crashing.
 */
export function saveReviewModule(newModule: ReviewModule): void {
  try {
    if (newModule.id === 'antiplatelets_mcp2') {
      const rawOverrides = localStorage.getItem(BUILTIN_OVERRIDES_KEY);
      const overrides: Record<string, ReviewModule> = rawOverrides ? JSON.parse(rawOverrides) : {};
      overrides[newModule.id] = { ...newModule, isBuiltIn: true };
      try {
        localStorage.setItem(BUILTIN_OVERRIDES_KEY, JSON.stringify(overrides));
      } catch (quotaErr) {
        console.warn('LocalStorage quota exceeded on override, persisting in Dexie:', quotaErr);
      }
      // Async persist in Dexie
      medChemGraphDb.modules.put({
        id: newModule.id,
        module: { ...newModule, isBuiltIn: true },
        updatedAt: new Date().toISOString(),
      }).catch((e) => console.warn('Dexie save override error:', e));
      return;
    }

    const current = loadAllReviewModules();
    const existingIndex = current.findIndex((m) => m.id === newModule.id);
    let updated: ReviewModule[];

    if (existingIndex !== -1) {
      current[existingIndex] = newModule;
      updated = current;
    } else {
      updated = [...current, newModule];
    }

    inMemoryModules = updated;

    const toPersist = updated.filter((m) => !m.isBuiltIn && m.id !== 'vasodilators_mcp2');
    try {
      localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(toPersist));
    } catch (quotaErr) {
      console.warn('LocalStorage quota exceeded for review modules, persisting in Dexie IndexedDB:', quotaErr);
    }

    // Persist to Dexie IndexedDB (eliminates 5MB quota errors)
    medChemGraphDb.modules.put({
      id: newModule.id,
      module: newModule,
      updatedAt: new Date().toISOString(),
    }).catch((dexieErr) => {
      console.error('Dexie save module error:', dexieErr);
    });
  } catch (err) {
    console.error('Failed to save review module:', err);
  }
}

export function resetBuiltInModule(moduleId: string): void {
  try {
    const rawOverrides = localStorage.getItem(BUILTIN_OVERRIDES_KEY);
    if (!rawOverrides) return;
    const overrides: Record<string, ReviewModule> = JSON.parse(rawOverrides);
    delete overrides[moduleId];
    localStorage.setItem(BUILTIN_OVERRIDES_KEY, JSON.stringify(overrides));
    inMemoryModules = null; // Invalidate cache so fresh default module loads
    medChemGraphDb.modules.delete(moduleId).catch(() => {});
  } catch (err) {
    console.error('Failed to reset built-in module:', err);
  }
}

export function deleteReviewModule(moduleId: string): void {
  try {
    if (moduleId === 'antiplatelets_mcp2') {
      const hidden = getHiddenBuiltins();
      if (!hidden.includes(moduleId)) {
        hidden.push(moduleId);
        inMemoryHiddenBuiltins = hidden;
        localStorage.setItem(HIDDEN_BUILTIN_KEY, JSON.stringify(hidden));
      }
      inMemoryModules = inMemoryModules ? inMemoryModules.filter((m) => m.id !== moduleId) : [];
      localStorage.removeItem(`${MODULE_ANSWERS_PREFIX}${moduleId}`);
      delete inMemoryProgress[moduleId];
      medChemGraphDb.modules.delete(moduleId).catch(() => {});
      medChemGraphDb.sessionProgress.delete(moduleId).catch(() => {});
      return;
    }

    const current = loadAllReviewModules();
    const filtered = current.filter((m) => m.id !== moduleId && !m.isBuiltIn && m.id !== 'vasodilators_mcp2');
    inMemoryModules = filtered;

    try {
      localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(filtered));
    } catch {}
    localStorage.removeItem(`${MODULE_ANSWERS_PREFIX}${moduleId}`);
    delete inMemoryProgress[moduleId];

    // Delete from Dexie IndexedDB
    medChemGraphDb.modules.delete(moduleId).catch((e) => console.warn('Dexie delete module error:', e));
    medChemGraphDb.sessionProgress.delete(moduleId).catch((e) => console.warn('Dexie delete progress error:', e));
  } catch (err) {
    console.error('Failed to delete review module:', err);
  }
}

export function loadActiveModuleId(): string {
  if (inMemoryActiveModuleId) {
    return inMemoryActiveModuleId;
  }
  try {
    const stored = localStorage.getItem(ACTIVE_MODULE_ID_KEY);
    if (stored) {
      inMemoryActiveModuleId = stored;
      return stored;
    }
  } catch {}
  inMemoryActiveModuleId = 'antiplatelets_mcp2';
  return 'antiplatelets_mcp2';
}

export function saveActiveModuleId(id: string): void {
  const target = id === 'vasodilators_mcp2' ? 'antiplatelets_mcp2' : id;
  inMemoryActiveModuleId = target;
  try {
    localStorage.setItem(ACTIVE_MODULE_ID_KEY, target);
  } catch {}
}

export function getEmptySessionProgress(): QuizSessionProgress {
  return {
    mcAnswers: {},
    tfAnswers: {},
    matchingAnswers: {},
    rankingAnswers: {},
  };
}

export function loadModuleProgress(moduleId: string): QuizSessionProgress {
  if (inMemoryProgress[moduleId]) {
    return inMemoryProgress[moduleId];
  }

  try {
    const raw = localStorage.getItem(`${MODULE_ANSWERS_PREFIX}${moduleId}`);
    if (raw) {
      const prog = JSON.parse(raw);
      inMemoryProgress[moduleId] = prog;
      return prog;
    }
  } catch (err) {
    console.error(`Failed to load answers for module ${moduleId}:`, err);
  }
  return getEmptySessionProgress();
}

export function saveModuleProgress(
  moduleId: string,
  progress: QuizSessionProgress
): void {
  try {
    inMemoryProgress[moduleId] = progress;

    try {
      localStorage.setItem(
        `${MODULE_ANSWERS_PREFIX}${moduleId}`,
        JSON.stringify(progress)
      );
    } catch (quotaErr) {
      console.warn('LocalStorage quota exceeded for progress, saving in Dexie:', quotaErr);
    }

    // Persist to Dexie IndexedDB
    medChemGraphDb.sessionProgress.put({
      moduleId,
      progress,
      updatedAt: new Date().toISOString(),
    }).catch((dexieErr) => {
      console.error('Dexie save progress error:', dexieErr);
    });
  } catch (err) {
    console.error(`Failed to save answers for module ${moduleId}:`, err);
  }
}

export function clearModuleProgress(moduleId: string): void {
  try {
    delete inMemoryProgress[moduleId];
    localStorage.removeItem(`${MODULE_ANSWERS_PREFIX}${moduleId}`);
    medChemGraphDb.sessionProgress.delete(moduleId).catch(() => {});
  } catch (err) {
    console.error(`Failed to clear answers for module ${moduleId}:`, err);
  }
}
