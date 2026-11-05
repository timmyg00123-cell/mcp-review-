import { ReviewModule, QuizSessionProgress } from '../types/reviewModule';
import {
  TopicProfile,
  loadTopicProfiles,
  saveTopicProfile,
  loadActiveProfileId,
  saveActiveProfileId,
  getInitialTheme,
  saveTheme,
  getInitialShowKnowledgeGraph,
  saveShowKnowledgeGraph,
} from './storage';
import {
  loadAllReviewModules,
  saveReviewModule,
  loadActiveModuleId,
  saveActiveModuleId,
  loadModuleProgress,
  saveModuleProgress,
} from './moduleStorage';

export interface ManifestHeader {
  $schema: string;
  version: string;
  exportedAt: string;
  sourceApp: 'medchem-review-platform';
}

export interface ReviewModuleExportManifest extends ManifestHeader {
  type: 'review_module';
  data: ReviewModule;
}

export interface TopicProfileExportManifest extends ManifestHeader {
  type: 'topic_profile';
  data: TopicProfile;
}

export interface FullBackupManifest extends ManifestHeader {
  type: 'full_backup';
  payload: {
    modules: ReviewModule[];
    activeModuleId?: string;
    profiles: TopicProfile[];
    activeProfileId?: string;
    sessionProgress: Record<string, QuizSessionProgress>;
    preferences: {
      theme: 'light' | 'dark';
      hideDrugNames?: boolean;
      showKnowledgeGraph: boolean;
    };
  };
}

export type AnyJsonExportManifest =
  | ReviewModuleExportManifest
  | TopicProfileExportManifest
  | FullBackupManifest;

export type ParsedImportResult =
  | {
      kind: 'review_module';
      module: ReviewModule;
      isBare: boolean;
    }
  | {
      kind: 'topic_profile';
      profile: TopicProfile;
      isBare: boolean;
    }
  | {
      kind: 'full_backup';
      backup: FullBackupManifest['payload'];
    }
  | {
      kind: 'modules_array';
      modules: ReviewModule[];
    };

export interface ImportCollision {
  itemType: 'module' | 'profile';
  id: string;
  title: string;
  existingTitle: string;
}

/**
 * Triggers a native browser file download for any serializable JSON object.
 */
export function downloadJsonFile(filename: string, data: any): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Exports a single ReviewModule as an auto-detectable JSON manifest.
 */
export function exportReviewModuleAsJson(module: ReviewModule): void {
  const safeSlug = (module.title || module.id || 'module')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .slice(0, 40);
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${safeSlug}_review_${dateStr}.json`;

  const manifest: ReviewModuleExportManifest = {
    $schema: 'https://mcp-review.app/schemas/review-module-v1.json',
    type: 'review_module',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    sourceApp: 'medchem-review-platform',
    data: module,
  };

  downloadJsonFile(filename, manifest);
}

/**
 * Exports the complete application state (all modules, profiles, progress, settings)
 * as a unified FullBackupManifest JSON file.
 */
export async function exportFullBackupAsJson(hideDrugNames = false): Promise<void> {
  const modules = loadAllReviewModules();
  const profiles = loadTopicProfiles();
  const activeModuleId = loadActiveModuleId();
  const activeProfileId = loadActiveProfileId();

  const sessionProgress: Record<string, QuizSessionProgress> = {};
  for (const m of modules) {
    sessionProgress[m.id] = loadModuleProgress(m.id);
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `mcp_full_backup_${dateStr}.json`;

  const manifest: FullBackupManifest = {
    $schema: 'https://mcp-review.app/schemas/full-backup-v1.json',
    type: 'full_backup',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    sourceApp: 'medchem-review-platform',
    payload: {
      modules,
      activeModuleId,
      profiles,
      activeProfileId,
      sessionProgress,
      preferences: {
        theme: getInitialTheme(),
        hideDrugNames,
        showKnowledgeGraph: getInitialShowKnowledgeGraph(),
      },
    },
  };

  downloadJsonFile(filename, manifest);
}

/**
 * Validates whether an arbitrary object conforms to a ReviewModule structure.
 */
export function isValidReviewModule(obj: any): obj is ReviewModule {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    Array.isArray(obj.pages)
  );
}

/**
 * Validates whether an arbitrary object conforms to a TopicProfile structure.
 */
export function isValidTopicProfile(obj: any): obj is TopicProfile {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    Array.isArray(obj.questions)
  );
}

/**
 * Parses and validates an uploaded JSON string, identifying its manifest type
 * or falling back to duck-typed legacy objects.
 */
export function parseAndValidateJsonPayload(jsonString: string): ParsedImportResult {
  let raw: any;
  try {
    raw = JSON.parse(jsonString);
  } catch (err: any) {
    throw new Error(`Invalid JSON syntax: ${err?.message || 'Failed to parse JSON file'}`);
  }

  if (!raw || typeof raw !== 'object') {
    throw new Error('Uploaded file is not a valid JSON object.');
  }

  // 1. Versioned Manifest: Full Backup
  if (raw.type === 'full_backup' && raw.payload && Array.isArray(raw.payload.modules)) {
    return {
      kind: 'full_backup',
      backup: raw.payload,
    };
  }

  // 2. Versioned Manifest: Review Module
  if (raw.type === 'review_module' && raw.data) {
    if (isValidReviewModule(raw.data)) {
      return {
        kind: 'review_module',
        module: raw.data,
        isBare: false,
      };
    }
    throw new Error('The "data" property in the review_module manifest is missing required ReviewModule fields.');
  }

  // 3. Versioned Manifest: Topic Profile
  if (raw.type === 'topic_profile' && raw.data) {
    if (isValidTopicProfile(raw.data)) {
      return {
        kind: 'topic_profile',
        profile: raw.data,
        isBare: false,
      };
    }
    throw new Error('The "data" property in the topic_profile manifest is missing required TopicProfile fields.');
  }

  // 4. Duck-typing: Bare ReviewModule
  if (isValidReviewModule(raw)) {
    return {
      kind: 'review_module',
      module: raw,
      isBare: true,
    };
  }

  // 5. Duck-typing: Bare Array of ReviewModules
  if (Array.isArray(raw) && raw.length > 0 && isValidReviewModule(raw[0])) {
    return {
      kind: 'modules_array',
      modules: raw as ReviewModule[],
    };
  }

  // 6. Duck-typing: Bare TopicProfile
  if (isValidTopicProfile(raw)) {
    return {
      kind: 'topic_profile',
      profile: raw,
      isBare: true,
    };
  }

  throw new Error(
    'Unrecognized JSON structure. The file must be a Review Module, Topic Profile, or Full Application Backup.'
  );
}

/**
 * Detects if an imported item shares an ID or title with an existing item.
 */
export function detectCollisions(
  parsed: ParsedImportResult,
  existingModules: ReviewModule[],
  existingProfiles: TopicProfile[]
): ImportCollision[] {
  const collisions: ImportCollision[] = [];

  if (parsed.kind === 'review_module') {
    const existing = existingModules.find(
      (m) =>
        m.id === parsed.module.id ||
        m.title.trim().toLowerCase() === parsed.module.title.trim().toLowerCase()
    );
    if (existing) {
      collisions.push({
        itemType: 'module',
        id: parsed.module.id,
        title: parsed.module.title,
        existingTitle: existing.title,
      });
    }
  } else if (parsed.kind === 'modules_array') {
    for (const mod of parsed.modules) {
      const existing = existingModules.find(
        (m) =>
          m.id === mod.id ||
          m.title.trim().toLowerCase() === mod.title.trim().toLowerCase()
      );
      if (existing) {
        collisions.push({
          itemType: 'module',
          id: mod.id,
          title: mod.title,
          existingTitle: existing.title,
        });
      }
    }
  } else if (parsed.kind === 'topic_profile') {
    const existing = existingProfiles.find(
      (p) =>
        p.id === parsed.profile.id ||
        p.title.trim().toLowerCase() === parsed.profile.title.trim().toLowerCase()
    );
    if (existing) {
      collisions.push({
        itemType: 'profile',
        id: parsed.profile.id,
        title: parsed.profile.title,
        existingTitle: existing.title,
      });
    }
  }

  return collisions;
}

/**
 * Commits imported data into local storage / Dexie using the designated collision strategy.
 */
export function applyImport(
  parsed: ParsedImportResult,
  strategy: 'overwrite' | 'clone' = 'overwrite'
): { success: boolean; message: string; importedModuleId?: string } {
  if (parsed.kind === 'review_module') {
    let modToSave = { ...parsed.module };
    if (strategy === 'clone') {
      const uniqueSuffix = Date.now().toString(36).slice(-4);
      modToSave.id = `${modToSave.id}_copy_${uniqueSuffix}`;
      modToSave.title = `${modToSave.title} (Copy)`;
      modToSave.isBuiltIn = false;
    }
    saveReviewModule(modToSave);
    saveActiveModuleId(modToSave.id);

    const slideCount = modToSave.pages?.length || 0;
    const qCount = modToSave.pages?.reduce(
      (acc, p) => acc + p.sections.reduce((sAcc, s) => sAcc + (s.questions?.length || 0), 0),
      0
    ) || 0;

    return {
      success: true,
      message: `Successfully imported "${modToSave.title}" (${slideCount} slide${slideCount !== 1 ? 's' : ''}, ${qCount} question${qCount !== 1 ? 's' : ''}).`,
      importedModuleId: modToSave.id,
    };
  }

  if (parsed.kind === 'modules_array') {
    let importedCount = 0;
    let lastId: string | undefined;

    for (const origMod of parsed.modules) {
      let modToSave = { ...origMod };
      if (strategy === 'clone') {
        const uniqueSuffix = Date.now().toString(36).slice(-4);
        modToSave.id = `${modToSave.id}_copy_${uniqueSuffix}`;
        modToSave.title = `${modToSave.title} (Copy)`;
        modToSave.isBuiltIn = false;
      }
      saveReviewModule(modToSave);
      lastId = modToSave.id;
      importedCount++;
    }

    if (lastId) saveActiveModuleId(lastId);

    return {
      success: true,
      message: `Successfully imported ${importedCount} Review Module${importedCount !== 1 ? 's' : ''}.`,
      importedModuleId: lastId,
    };
  }

  if (parsed.kind === 'topic_profile') {
    let profToSave = { ...parsed.profile };
    if (strategy === 'clone') {
      const uniqueSuffix = Date.now().toString(36).slice(-4);
      profToSave.id = `${profToSave.id}_copy_${uniqueSuffix}`;
      profToSave.title = `${profToSave.title} (Copy)`;
    }
    saveTopicProfile(profToSave);
    saveActiveProfileId(profToSave.id);

    return {
      success: true,
      message: `Successfully imported Study Profile "${profToSave.title}" (${profToSave.questions.length} questions).`,
    };
  }

  if (parsed.kind === 'full_backup') {
    const { modules, activeModuleId, profiles, activeProfileId, sessionProgress, preferences } =
      parsed.backup;

    // 1. Modules
    if (Array.isArray(modules)) {
      modules.forEach((mod) => saveReviewModule(mod));
    }
    if (activeModuleId) {
      saveActiveModuleId(activeModuleId);
    }

    // 2. Profiles
    if (Array.isArray(profiles)) {
      profiles.forEach((prof) => saveTopicProfile(prof));
    }
    if (activeProfileId) {
      saveActiveProfileId(activeProfileId);
    }

    // 3. Session Progress
    if (sessionProgress && typeof sessionProgress === 'object') {
      Object.entries(sessionProgress).forEach(([mId, prog]) => {
        if (prog) saveModuleProgress(mId, prog);
      });
    }

    // 4. Preferences
    if (preferences) {
      if (preferences.theme) saveTheme(preferences.theme);
      if (typeof preferences.showKnowledgeGraph === 'boolean') {
        saveShowKnowledgeGraph(preferences.showKnowledgeGraph);
      }
    }

    return {
      success: true,
      message: `Successfully restored full platform backup (${modules?.length || 0} module${modules?.length !== 1 ? 's' : ''}, ${profiles?.length || 0} profile${profiles?.length !== 1 ? 's' : ''}).`,
      importedModuleId: activeModuleId,
    };
  }

  return { success: false, message: 'Unknown import kind.' };
}
