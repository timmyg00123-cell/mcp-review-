import {
  ReviewModule,
  ReviewPage,
  ReviewSection,
  ChemicalStructure,
  PharmacophoreGroup,
  QuizSessionProgress,
} from '../types/reviewModule';
import { pdfPages } from '../data/antiplateletQuizData';
import { getDefaultAnticoagulantsModule } from '../data/anticoagulantsQuizData';
import { getDefaultHeartFailureModule } from '../data/heartFailureModuleData';
import { medChemGraphDb } from '../db/medChemGraphDb';
import { getCorrectedSmarts } from './smartsDictionary';

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
  if (typeof localStorage === 'undefined') return [];
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
 * Synchronous read from in-memory cache and localStorage for instant 0ms first paint.
 * Ensures custom modules are immediately available on refresh while Dexie IndexedDB
 * hydrates asynchronously post-mount.
 */
export function loadAllReviewModules(): ReviewModule[] {
  if (inMemoryModules && inMemoryModules.length > 0) {
    return inMemoryModules;
  }

  const defaultAntiplatelet = getDefaultAntiplateletModule();
  const defaultAnticoagulant = getDefaultAnticoagulantsModule();
  const defaultHeartFailure = getDefaultHeartFailureModule();
  const hiddenBuiltins = getHiddenBuiltins();

  let overrides: Record<string, ReviewModule> = {};
  if (typeof localStorage !== 'undefined') {
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
  }

  const finalAntiplatelet = overrides['antiplatelets_mcp2'] || defaultAntiplatelet;
  const finalAnticoagulant = overrides['anticoagulants_mcp2'] || defaultAnticoagulant;
  const finalHeartFailure = overrides['heart_failure_mcp2'] || defaultHeartFailure;

  const builtIns: ReviewModule[] = [];
  if (!hiddenBuiltins.includes('antiplatelets_mcp2')) builtIns.push(finalAntiplatelet);
  if (!hiddenBuiltins.includes('anticoagulants_mcp2')) builtIns.push(finalAnticoagulant);
  if (!hiddenBuiltins.includes('heart_failure_mcp2')) builtIns.push(finalHeartFailure);

  // Synchronously load custom modules from localStorage so 0ms first-paint never drops them on reload
  let customList: ReviewModule[] = [];
  if (typeof localStorage !== 'undefined') {
    try {
      const rawCustom = localStorage.getItem(MODULES_STORAGE_KEY);
      if (rawCustom) {
        const parsed = JSON.parse(rawCustom);
        if (Array.isArray(parsed)) {
          customList = parsed.filter(
            (m) =>
              m &&
              m.id &&
              m.id !== 'antiplatelets_mcp2' &&
              m.id !== 'anticoagulants_mcp2' &&
              m.id !== 'heart_failure_mcp2' &&
              m.id !== 'vasodilators_mcp2'
          );
        }
      }
    } catch (customErr) {
      console.warn('Could not read custom modules from localStorage:', customErr);
    }
  }

  const combined = [...builtIns, ...customList];
  inMemoryModules = combined.length > 0 ? combined : [finalAntiplatelet, finalAnticoagulant, finalHeartFailure];
  return inMemoryModules;
}

/**
 * Initializes and synchronizes review modules and session progress bidirectionally with Dexie IndexedDB.
 * Merges localStorage and Dexie modules, migrates any missing records, and eliminates 5MB quota errors.
 */
export async function initModuleStorageFromDexie(): Promise<ReviewModule[]> {
  try {
    const defaultAntiplatelet = getDefaultAntiplateletModule();
    const defaultAnticoagulant = getDefaultAnticoagulantsModule();
    const defaultHeartFailure = getDefaultHeartFailureModule();
    const hiddenBuiltins = getHiddenBuiltins();

    // 1. Load custom modules and overrides from Dexie
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

    // Check if Dexie has a newer or existing override for built-ins
    const dexieAntiplatelet = dexieModules.find((m) => m.id === 'antiplatelets_mcp2')?.module;
    if (dexieAntiplatelet) {
      overrides['antiplatelets_mcp2'] = dexieAntiplatelet;
    }
    const dexieAnticoagulant = dexieModules.find((m) => m.id === 'anticoagulants_mcp2')?.module;
    if (dexieAnticoagulant) {
      overrides['anticoagulants_mcp2'] = dexieAnticoagulant;
    }
    const dexieHeartFailure = dexieModules.find((m) => m.id === 'heart_failure_mcp2')?.module;
    if (dexieHeartFailure) {
      overrides['heart_failure_mcp2'] = dexieHeartFailure;
    }

    const finalAntiplatelet = overrides['antiplatelets_mcp2'] || defaultAntiplatelet;
    const finalAnticoagulant = overrides['anticoagulants_mcp2'] || defaultAnticoagulant;
    const finalHeartFailure = overrides['heart_failure_mcp2'] || defaultHeartFailure;

    // 3. Bidirectional merge of custom modules between Dexie and localStorage
    const rawLocal = localStorage.getItem(MODULES_STORAGE_KEY);
    const localParsed: ReviewModule[] = rawLocal ? JSON.parse(rawLocal) : [];
    const localCustom = Array.isArray(localParsed)
      ? localParsed.filter(
          (m) =>
            m &&
            m.id &&
            m.id !== 'antiplatelets_mcp2' &&
            m.id !== 'anticoagulants_mcp2' &&
            m.id !== 'heart_failure_mcp2' &&
            m.id !== 'vasodilators_mcp2'
        )
      : [];

    const customModuleMap = new Map<string, ReviewModule>();

    // Start with localStorage entries
    localCustom.forEach((m) => customModuleMap.set(m.id, m));

    // Overlay Dexie entries (Dexie has full unbounded payloads)
    dexieModules.forEach((dm) => {
      if (
        dm.module &&
        dm.id !== 'antiplatelets_mcp2' &&
        dm.id !== 'anticoagulants_mcp2' &&
        dm.id !== 'heart_failure_mcp2' &&
        dm.id !== 'vasodilators_mcp2'
      ) {
        customModuleMap.set(dm.id, dm.module);
      }
    });

    const mergedCustom = Array.from(customModuleMap.values());

    // Sync any missing custom modules to Dexie
    for (const m of mergedCustom) {
      const existsInDexie = dexieModules.some((dm) => dm.id === m.id);
      if (!existsInDexie) {
        await medChemGraphDb.modules.put({
          id: m.id,
          module: m,
          updatedAt: new Date().toISOString(),
        }).catch((e) => console.warn('Dexie put during sync warning:', e));
      }
    }

    // Sync any missing custom modules back to localStorage (with quota safety)
    try {
      localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(mergedCustom));
    } catch (quotaErr) {
      console.warn('LocalStorage quota limit reached while syncing merged modules:', quotaErr);
    }

    // Also migrate any un-migrated localStorage progress to Dexie
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(MODULE_ANSWERS_PREFIX)) {
          const mId = key.replace(MODULE_ANSWERS_PREFIX, '');
          const val = localStorage.getItem(key);
          if (val) {
            const prog = JSON.parse(val);
            if (!inMemoryProgress[mId]) {
              inMemoryProgress[mId] = prog;
            }
            const existsProgress = dexieProgress.some((p) => p.moduleId === mId);
            if (!existsProgress) {
              await medChemGraphDb.sessionProgress.put({
                moduleId: mId,
                progress: prog,
                updatedAt: new Date().toISOString(),
              }).catch(() => {});
            }
          }
        }
      }
    } catch (migErr) {
      console.warn('Progress migration warning:', migErr);
    }

    const builtIns: ReviewModule[] = [];
    if (!hiddenBuiltins.includes('antiplatelets_mcp2')) builtIns.push(finalAntiplatelet);
    if (!hiddenBuiltins.includes('anticoagulants_mcp2')) builtIns.push(finalAnticoagulant);
    if (!hiddenBuiltins.includes('heart_failure_mcp2')) builtIns.push(finalHeartFailure);

    const combined = [...builtIns, ...mergedCustom];
    inMemoryModules = combined.length > 0 ? combined : [finalAntiplatelet, finalAnticoagulant, finalHeartFailure];
    isDexieInitialized = true;
    return inMemoryModules;
  } catch (err) {
    console.error('Failed to init Dexie module storage, falling back to synchronous load:', err);
    return loadAllReviewModules();
  }
}

export function sanitizeModulePharmacophores(mod: ReviewModule): ReviewModule {
  if (!mod || !Array.isArray(mod.pages)) return mod;

  const sanitizePharmaList = (list?: PharmacophoreGroup[]): PharmacophoreGroup[] | undefined => {
    if (!Array.isArray(list)) return list;
    return list.map((p) => ({
      ...p,
      smarts: getCorrectedSmarts(p?.name, p?.smarts || '') || undefined,
    }));
  };

  const sanitizeStruct = (s: ChemicalStructure): ChemicalStructure => {
    if (!s) return s;
    return {
      ...s,
      pharmacophores: sanitizePharmaList(s.pharmacophores),
    };
  };

  return {
    ...mod,
    pages: mod.pages.map((page: ReviewPage) => ({
      ...page,
      sections: Array.isArray(page.sections)
        ? page.sections.map((section: ReviewSection) => ({
            ...section,
            structures: Array.isArray(section.structures)
              ? section.structures.map(sanitizeStruct)
              : section.structures,
            local_structures: Array.isArray(section.local_structures)
              ? section.local_structures.map(sanitizeStruct)
              : section.local_structures,
            questions: Array.isArray(section.questions)
              ? section.questions.map((q) => ({
                  ...q,
                  structuresDisplayed: Array.isArray(q.structuresDisplayed)
                    ? q.structuresDisplayed.map(sanitizeStruct)
                    : q.structuresDisplayed,
                }))
              : section.questions,
          }))
        : page.sections,
    })),
  };
}

/**
 * Saves a ReviewModule to Dexie IndexedDB (async) and updates in-memory cache and localStorage.
 * Gracefully handles any LocalStorage QuotaExceededError without crashing.
 */
export function saveReviewModule(rawModule: ReviewModule): void {
  try {
    const newModule = sanitizeModulePharmacophores(rawModule);
    const isBuiltIn =
      newModule.id === 'antiplatelets_mcp2' ||
      newModule.id === 'anticoagulants_mcp2' ||
      newModule.id === 'heart_failure_mcp2' ||
      Boolean(newModule.isBuiltIn);

    if (isBuiltIn) {
      const rawOverrides = localStorage.getItem(BUILTIN_OVERRIDES_KEY);
      const overrides: Record<string, ReviewModule> = rawOverrides ? JSON.parse(rawOverrides) : {};
      overrides[newModule.id] = { ...newModule, isBuiltIn: true };
      try {
        localStorage.setItem(BUILTIN_OVERRIDES_KEY, JSON.stringify(overrides));
      } catch (quotaErr) {
        console.warn('LocalStorage quota exceeded on override, persisting in Dexie:', quotaErr);
      }
      // Update in-memory cache immediately
      if (inMemoryModules) {
        const idx = inMemoryModules.findIndex((m) => m.id === newModule.id);
        if (idx !== -1) {
          inMemoryModules[idx] = { ...newModule, isBuiltIn: true };
        } else {
          inMemoryModules = [{ ...newModule, isBuiltIn: true }, ...inMemoryModules];
        }
      } else {
        inMemoryModules = [{ ...newModule, isBuiltIn: true }];
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
      updated = [...current];
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

/**
 * Asynchronous version of saveReviewModule that awaits Dexie IndexedDB persistence.
 */
export async function saveReviewModuleAsync(rawModule: ReviewModule): Promise<void> {
  saveReviewModule(rawModule);
  const newModule = sanitizeModulePharmacophores(rawModule);
  const isBuiltIn =
    newModule.id === 'antiplatelets_mcp2' ||
    newModule.id === 'anticoagulants_mcp2' ||
    newModule.id === 'heart_failure_mcp2' ||
    Boolean(newModule.isBuiltIn);

  await medChemGraphDb.modules.put({
    id: newModule.id,
    module: isBuiltIn ? { ...newModule, isBuiltIn: true } : newModule,
    updatedAt: new Date().toISOString(),
  });
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
    if (
      moduleId === 'antiplatelets_mcp2' ||
      moduleId === 'anticoagulants_mcp2' ||
      moduleId === 'heart_failure_mcp2'
    ) {
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
    const remainingCustom = current.filter((m) => m.id !== moduleId && !m.isBuiltIn && m.id !== 'vasodilators_mcp2');
    const builtIns = current.filter((m) => m.isBuiltIn && m.id !== moduleId);
    inMemoryModules = [...builtIns, ...remainingCustom];

    try {
      localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(remainingCustom));
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
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(ACTIVE_MODULE_ID_KEY);
      if (stored) {
        inMemoryActiveModuleId = stored;
        return stored;
      }
    } catch {}
  }
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
    workbenchAnswers: {},
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
