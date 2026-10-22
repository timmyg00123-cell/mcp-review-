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
