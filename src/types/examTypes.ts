import type { ReviewModule } from './reviewModule';

export interface ExamDefinition {
  id: string; // 'exam_1', 'exam_2', 'exam_3'
  code: string; // 'Exam 1', 'Exam 2', 'Exam 3'
  title: string; // Full title
  shortTitle: string; // Short label
  description: string;
  chapters: string; // e.g. 'Chapters 8–11'
  builtInModuleIds: string[];
  defaultModuleId?: string;
  isAvailable: boolean; // false if awaiting materials
}

export const EXAM_DEFINITIONS: ExamDefinition[] = [
  {
    id: 'exam_1',
    code: 'Exam 1',
    title: 'Exam 1: Renal & Respiratory Medicinal Chemistry',
    shortTitle: 'Renal & Respiratory',
    description: 'Diuretics, Vaptans, Potassium Binders, Bronchodilators, Glucocorticoids & Antileukotrienes.',
    chapters: 'Modules 1–3',
    builtInModuleIds: [
      'renal_drugs_mcp2',
      'respiratory_bronchodilators_mcp2',
      'respiratory_antiinflammatories_mcp2',
    ],
    defaultModuleId: 'renal_drugs_mcp2',
    isAvailable: true,
  },
  {
    id: 'exam_2',
    code: 'Exam 2',
    title: 'Exam 2: Antihypertensives & Antihyperlipidemics',
    shortTitle: 'Anti-HTN & Lipids',
    description: 'Diuretics, Sympatholytics, CCBs, RAAS Inhibitors, Vasodilators & Antihyperlipidemics.',
    chapters: 'Chapters 3–7',
    builtInModuleIds: [
      'antihypertensives_1_mcp2',
      'antihypertensives_2_mcp2',
      'antihypertensives_3_mcp2',
      'antihypertensives_4_mcp2',
      'antihyperlipidemics_mcp2',
    ],
    defaultModuleId: 'antihypertensives_1_mcp2',
    isAvailable: true,
  },
  {
    id: 'exam_3',
    code: 'Exam 3',
    title: 'Exam 3: Blood Products, Heart Failure & Antiarrhythmics',
    shortTitle: 'Blood, HF & Arrhythmias',
    description: 'Antiplatelets, Anticoagulants/Thrombolytics, Heart Failure & Antiarrhythmics.',
    chapters: 'Chapters 8–11',
    builtInModuleIds: [
      'antiplatelets_mcp2',
      'anticoagulants_mcp2',
      'heart_failure_mcp2',
      'antiarrhythmics_mcp2',
    ],
    defaultModuleId: 'antiplatelets_mcp2',
    isAvailable: true,
  },
];

export const ACTIVE_EXAM_ID_KEY = 'medchem_active_exam_id_v2';

let inMemoryActiveExamId: string | null = null;

export function loadActiveExamId(): string {
  if (inMemoryActiveExamId) {
    return inMemoryActiveExamId;
  }
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(ACTIVE_EXAM_ID_KEY);
      if (stored && EXAM_DEFINITIONS.some((e) => e.id === stored)) {
        inMemoryActiveExamId = stored;
        return stored;
      }
    } catch {}
  }
  inMemoryActiveExamId = 'exam_3';
  return 'exam_3';
}

export function saveActiveExamId(examId: string): void {
  inMemoryActiveExamId = examId;
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(ACTIVE_EXAM_ID_KEY, examId);
    } catch {}
  }
}

/**
 * Returns the exam ID that a given ReviewModule belongs to.
 * Explicit `examId` takes precedence; otherwise falls back based on known module IDs.
 */
export function getModuleExamId(module: ReviewModule | null | undefined): string {
  if (!module) return 'exam_3';
  if (module.examId) return module.examId;

  // Exam 3 built-ins
  if (
    [
      'antiplatelets_mcp2',
      'anticoagulants_mcp2',
      'heart_failure_mcp2',
      'antiarrhythmics_mcp2',
    ].includes(module.id)
  ) {
    return 'exam_3';
  }

  // Exam 2 built-ins or custom matching pattern
  if (
    module.id.startsWith('antihypertensives_') ||
    module.id.startsWith('antihyperlipidemic') ||
    module.title.toLowerCase().includes('antihypertensive') ||
    module.title.toLowerCase().includes('antihyperlipidemic')
  ) {
    return 'exam_2';
  }

  // Exam 1 built-ins or custom matching pattern
  if (
    [
      'renal_drugs_mcp2',
      'respiratory_bronchodilators_mcp2',
      'respiratory_antiinflammatories_mcp2',
    ].includes(module.id) ||
    module.id.startsWith('renal_') ||
    module.id.startsWith('respiratory_') ||
    module.title.toLowerCase().includes('renal') ||
    module.title.toLowerCase().includes('respiratory') ||
    module.title.toLowerCase().includes('bronchodilator')
  ) {
    return 'exam_1';
  }

  // If code was explicitly set to an exam
  if (module.code === 'Exam 1' || module.code === 'exam_1') return 'exam_1';
  if (module.code === 'Exam 2' || module.code === 'exam_2') return 'exam_2';
  if (module.code === 'Exam 3' || module.code === 'exam_3') return 'exam_3';

  // Default to Exam 3 (current semester modules)
  return 'exam_3';
}

/**
 * Resolves an ExamDefinition by id (falls back to Exam 3).
 */
export function getExamDefinition(examId: string): ExamDefinition {
  return (
    EXAM_DEFINITIONS.find((e) => e.id === examId) ||
    EXAM_DEFINITIONS.find((e) => e.id === 'exam_3')!
  );
}
