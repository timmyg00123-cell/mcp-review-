import { QuizQuestion, HighYieldData, quizData, defaultHighYieldData } from '../data/quizData';

export interface QuizProgress {
  userAnswers: (number | null)[];
  revealed: boolean[];
  bookmarks: boolean[];
  currentIndex: number;
  selectedCategory: string;
  activeTab: 'practice' | 'highyield' | 'calculator' | 'pdf';
  isCompleted: boolean;
  lastSavedAt: string;
}

export interface SourceDocument {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export interface TopicProfile {
  id: string;
  title: string;
  subtitle: string;
  sources: SourceDocument[];
  questions: QuizQuestion[];
  highYield: HighYieldData;
  createdAt: string;
}

// Backwards compatibility alias
export type CustomQuizBank = TopicProfile;

const STORAGE_PREFIX = 'anemia_quiz_progress_v4_';
const TOPIC_PROFILES_KEY = 'anemia_custom_topic_profiles_v3';
const ACTIVE_PROFILE_ID_KEY = 'anemia_active_topic_profile_id_v3';
const THEME_KEY = 'anemia_quiz_theme';
const SHOW_KNOWLEDGE_GRAPH_KEY = 'mcp_show_knowledge_graph';

export function getDefaultAnemiaProfile(): TopicProfile {
  return {
    id: 'default',
    title: 'Clinical Hematology: Anemia',
    subtitle: 'Pharmacotherapy, Pathophysiology & Diagnostic Reasoning',
    sources: [
      {
        id: 'src_default_anemia',
        fileName: 'Clinical Hematology & Anemia Guidelines (WHO/ASH/KDIGO)',
        fileSize: 2450000,
        uploadedAt: 'Curriculum Core',
      },
    ],
    questions: quizData,
    highYield: defaultHighYieldData,
    createdAt: 'Core Curriculum',
  };
}

export function loadSavedProgress(profileId: string, totalQuestions: number): QuizProgress | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${profileId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    if (
      Array.isArray(parsed.userAnswers) &&
      Array.isArray(parsed.revealed) &&
      Array.isArray(parsed.bookmarks)
    ) {
      const userAnswers = new Array(totalQuestions).fill(null);
      const revealed = new Array(totalQuestions).fill(false);
      const bookmarks = new Array(totalQuestions).fill(false);

      parsed.userAnswers.forEach((ans: any, i: number) => {
        if (i < totalQuestions) userAnswers[i] = ans;
      });
      parsed.revealed.forEach((rev: any, i: number) => {
        if (i < totalQuestions) revealed[i] = Boolean(rev);
      });
      parsed.bookmarks.forEach((bm: any, i: number) => {
        if (i < totalQuestions) bookmarks[i] = Boolean(bm);
      });

      return {
        userAnswers,
        revealed,
        bookmarks,
        currentIndex:
          typeof parsed.currentIndex === 'number' &&
          parsed.currentIndex >= 0 &&
          parsed.currentIndex < totalQuestions
            ? parsed.currentIndex
            : 0,
        selectedCategory: typeof parsed.selectedCategory === 'string' ? parsed.selectedCategory : 'All Topics',
        activeTab:
          parsed.activeTab === 'highyield' ||
          parsed.activeTab === 'calculator' ||
          parsed.activeTab === 'pdf'
            ? parsed.activeTab
            : 'practice',
        isCompleted: Boolean(parsed.isCompleted),
        lastSavedAt: parsed.lastSavedAt || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.error('Failed to load saved progress:', err);
  }
  return null;
}

export function saveProgress(profileId: string, progress: Omit<QuizProgress, 'lastSavedAt'>): void {
  try {
    const data: QuizProgress = {
      ...progress,
      lastSavedAt: new Date().toISOString(),
    };
    localStorage.setItem(`${STORAGE_PREFIX}${profileId}`, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save progress:', err);
  }
}

export function clearSavedProgress(profileId: string = 'default'): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${profileId}`);
  } catch (err) {
    console.error('Failed to clear progress:', err);
  }
}

export function loadTopicProfiles(): TopicProfile[] {
  try {
    const raw = localStorage.getItem(TOPIC_PROFILES_KEY);
    const defaultProfile = getDefaultAnemiaProfile();
    if (!raw) return [defaultProfile];
    const parsed = JSON.parse(raw);
    const list: TopicProfile[] = Array.isArray(parsed) ? parsed : [];
    const defaultIdx = list.findIndex((p: TopicProfile) => p.id === 'default');
    if (defaultIdx === -1) {
      list.unshift(defaultProfile);
    } else {
      if (
        !list[defaultIdx].highYield?.additionalMatrices ||
        list[defaultIdx].highYield.additionalMatrices.length === 0
      ) {
        list[defaultIdx].highYield = {
          ...list[defaultIdx].highYield,
          additionalMatrices: defaultHighYieldData.additionalMatrices,
        };
      }
    }
    return list;
  } catch (err) {
    console.error('Failed to load topic profiles:', err);
    return [getDefaultAnemiaProfile()];
  }
}

export function saveTopicProfile(profile: TopicProfile): void {
  try {
    const current = loadTopicProfiles();
    const existingIndex = current.findIndex((p) => p.id === profile.id);
    if (existingIndex !== -1) {
      current[existingIndex] = profile;
    } else {
      current.push(profile);
    }
    localStorage.setItem(TOPIC_PROFILES_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save topic profile:', err);
  }
}

export function deleteTopicProfile(id: string): void {
  try {
    if (id === 'default') return; // Cannot delete default profile
    const current = loadTopicProfiles().filter((p) => p.id !== id);
    localStorage.setItem(TOPIC_PROFILES_KEY, JSON.stringify(current));
    localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
  } catch (err) {
    console.error('Failed to delete topic profile:', err);
  }
}

export function loadActiveProfileId(): string {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_ID_KEY) || 'default';
  } catch {
    return 'default';
  }
}

export function saveActiveProfileId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROFILE_ID_KEY, id);
  } catch {}
}

// Aliases for backwards compatibility
export const loadCustomBanks = loadTopicProfiles;
export const saveCustomBank = saveTopicProfile;
export const deleteCustomBank = deleteTopicProfile;
export const loadActiveBankId = loadActiveProfileId;
export const saveActiveBankId = saveActiveProfileId;

let inMemoryTheme: 'light' | 'dark' | null = null;

export function getInitialTheme(): 'light' | 'dark' {
  if (inMemoryTheme) return inMemoryTheme;
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      inMemoryTheme = saved;
      return saved;
    }
  } catch {}
  inMemoryTheme = 'dark'; // Dark mode is default per user specification
  return inMemoryTheme;
}

export function saveTheme(theme: 'light' | 'dark'): void {
  inMemoryTheme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

let inMemoryShowKnowledgeGraph: boolean | null = null;

export function getInitialShowKnowledgeGraph(): boolean {
  if (inMemoryShowKnowledgeGraph !== null) return inMemoryShowKnowledgeGraph;
  try {
    const saved = localStorage.getItem(SHOW_KNOWLEDGE_GRAPH_KEY);
    if (saved !== null) {
      inMemoryShowKnowledgeGraph = saved === 'true';
      return inMemoryShowKnowledgeGraph;
    }
  } catch {}
  inMemoryShowKnowledgeGraph = false; // Default to false (opt-in feature)
  return false;
}

export function saveShowKnowledgeGraph(enabled: boolean): void {
  inMemoryShowKnowledgeGraph = enabled;
  try {
    localStorage.setItem(SHOW_KNOWLEDGE_GRAPH_KEY, String(enabled));
  } catch {}
}

export const STRUCTURE_IMAGE_BG_KEY = 'mcp_structure_image_bg';
export const DEFAULT_STRUCTURE_IMAGE_BG = 'hsl(286, 55%, 94%)';

let inMemoryStructureImageBg: string | null = null;

export function getInitialStructureImageBg(): string {
  if (inMemoryStructureImageBg !== null) return inMemoryStructureImageBg;
  try {
    const saved = localStorage.getItem(STRUCTURE_IMAGE_BG_KEY);
    if (saved && saved.trim()) {
      inMemoryStructureImageBg = saved.trim();
      return inMemoryStructureImageBg;
    }
  } catch {}
  inMemoryStructureImageBg = DEFAULT_STRUCTURE_IMAGE_BG;
  return inMemoryStructureImageBg;
}

export function saveStructureImageBg(color: string): void {
  inMemoryStructureImageBg = color;
  try {
    localStorage.setItem(STRUCTURE_IMAGE_BG_KEY, color);
  } catch {}
}

export const STRUCTURE_IMAGE_DARK_BG_KEY = 'mcp_structure_image_dark_bg';
export const DEFAULT_STRUCTURE_IMAGE_DARK_BG = 'hsl(222, 47%, 14%)';

let inMemoryStructureImageDarkBg: string | null = null;

export function getInitialStructureImageDarkBg(): string {
  if (inMemoryStructureImageDarkBg !== null) return inMemoryStructureImageDarkBg;
  try {
    const saved = localStorage.getItem(STRUCTURE_IMAGE_DARK_BG_KEY);
    if (saved && saved.trim()) {
      inMemoryStructureImageDarkBg = saved.trim();
      return inMemoryStructureImageDarkBg;
    }
  } catch {}
  inMemoryStructureImageDarkBg = DEFAULT_STRUCTURE_IMAGE_DARK_BG;
  return inMemoryStructureImageDarkBg;
}

export function saveStructureImageDarkBg(color: string): void {
  inMemoryStructureImageDarkBg = color;
  try {
    localStorage.setItem(STRUCTURE_IMAGE_DARK_BG_KEY, color);
  } catch {}
}

export const STRUCTURE_LOCK_OBSIDIAN_KEY = 'mcp_structure_lock_obsidian';
export const DEFAULT_STRUCTURE_LOCK_OBSIDIAN = false;

let inMemoryStructureLockObsidian: boolean | null = null;

export function getInitialStructureLockObsidian(): boolean {
  if (inMemoryStructureLockObsidian !== null) return inMemoryStructureLockObsidian;
  try {
    const saved = localStorage.getItem(STRUCTURE_LOCK_OBSIDIAN_KEY);
    if (saved !== null) {
      inMemoryStructureLockObsidian = saved === 'true';
      return inMemoryStructureLockObsidian;
    }
  } catch {}
  inMemoryStructureLockObsidian = DEFAULT_STRUCTURE_LOCK_OBSIDIAN;
  return inMemoryStructureLockObsidian;
}

export function saveStructureLockObsidian(locked: boolean): void {
  inMemoryStructureLockObsidian = locked;
  try {
    localStorage.setItem(STRUCTURE_LOCK_OBSIDIAN_KEY, String(locked));
  } catch {}
}

export const BOND_LIGHT_COLOR_KEY = 'mcp_structure_bond_light_color';
export const DEFAULT_BOND_LIGHT_COLOR = '#475569';

let inMemoryBondLightColor: string | null = null;

export function getInitialBondLightColor(): string {
  if (inMemoryBondLightColor !== null) return inMemoryBondLightColor;
  try {
    const saved = localStorage.getItem(BOND_LIGHT_COLOR_KEY);
    if (saved && saved.trim()) {
      inMemoryBondLightColor = saved.trim();
      return inMemoryBondLightColor;
    }
  } catch {}
  inMemoryBondLightColor = DEFAULT_BOND_LIGHT_COLOR;
  return inMemoryBondLightColor;
}

export function saveBondLightColor(color: string): void {
  inMemoryBondLightColor = color;
  try {
    localStorage.setItem(BOND_LIGHT_COLOR_KEY, color);
  } catch {}
}

export const BOND_DARK_COLOR_KEY = 'mcp_structure_bond_dark_color';
export const DEFAULT_BOND_DARK_COLOR = '#e2e8f0';

let inMemoryBondDarkColor: string | null = null;

export function getInitialBondDarkColor(): string {
  if (inMemoryBondDarkColor !== null) return inMemoryBondDarkColor;
  try {
    const saved = localStorage.getItem(BOND_DARK_COLOR_KEY);
    if (saved && saved.trim()) {
      inMemoryBondDarkColor = saved.trim();
      return inMemoryBondDarkColor;
    }
  } catch {}
  inMemoryBondDarkColor = DEFAULT_BOND_DARK_COLOR;
  return inMemoryBondDarkColor;
}

export function saveBondDarkColor(color: string): void {
  inMemoryBondDarkColor = color;
  try {
    localStorage.setItem(BOND_DARK_COLOR_KEY, color);
  } catch {}
}

