import type { OpenFdaClinicalData } from '../services/openFdaService';

export interface PubChemAuditInfo {
  cid?: number;
  status?: 'verified' | 'unresolved' | 'manual_override';
  verifiedAt?: string;
  source?: 'nih_pug_rest' | 'document_crop_with_pubchem_match';
  canonicalSmiles?: string;
  iupacName?: string;
  molecularFormula?: string;
  molecularWeight?: number;
  xlogp?: number;
  pubChemUrl?: string;
  matchScore?: number;
}

export interface PharmacophoreRegion {
  x: number; // percentage (0-100) left
  y: number; // percentage (0-100) top
  width: number; // percentage (0-100) width
  height: number; // percentage (0-100) height
  label?: string;
  isRing?: boolean; // When true, tints internal enclosed area produced by lines/rings
}

export interface PharmacophoreGroup {
  id: string; // unique tag id e.g. "carboxyl", "piperidine"
  name: string; // e.g. "Carboxylic acid (-COOH)"
  purpose: string; // Molecular role, SAR explanation, receptor binding contribution
  casual_sar_explanation?: string; // Conversational plain-language analogy for non-chemists
  category?: 'binding' | 'pk' | 'prodrug' | 'stability' | 'solubility';
  region?: PharmacophoreRegion;
  smarts?: string; // Exact SMARTS pattern string for cheminformatics highlight (e.g. "[#6]1:[#6]:[#6]:[#6]:[#6]:[#6]1")
  description?: string; // Brief note on its purpose
}

export interface ChemicalStructure {
  id: string; // e.g., 'I', 'II', 'III', 'IV'
  document_label?: string; // Exact Roman numeral, number, or letter label assigned in source document (e.g. 'I', 'II', 'IV', 'Drug X')
  name: string; // e.g., 'Tirofiban'
  tradeName?: string; // e.g., 'Aggrastat'
  chemicalClass: string; // e.g., 'N-sulfonyl tyrosine-based peptidomimetic'
  pharmacologicalClass: string; // e.g., 'Glycoprotein IIb/IIIa inhibitor'
  cid?: number;
  canonical_smiles?: string; // Valid raw Daylight Canonical SMILES string
  canonicalSmiles?: string; // Valid Daylight Canonical SMILES string
  smiles?: string; // Canonical or isomeric SMILES fallback
  pharmacophore_smarts?: string; // Core active pharmacophore SMARTS string
  pubchemMolBlock?: string; // 2D SDF/MOL block from PubChem PUG REST containing 2D coordinates
  pubchemUrl?: string;
  pngUrl?: string;
  fallbackSvg?: string;
  target: string;
  target_receptor?: string; // Biological target receptor & binding site
  reversibility: 'Reversible' | 'Irreversible' | string;
  drug_state?: 'Active Drug' | 'Prodrug' | 'Active Metabolite' | 'Inactive Metabolite' | string;
  mw?: number;
  logP?: number;
  properties?: Record<string, any>;
  route: 'Oral' | 'IV Infusion' | 'IV Bolus/Infusion' | string;
  keyFunctionalGroups: string[];
  pharmacophores?: PharmacophoreGroup[]; // Rich pharmacophores with region coordinates and purpose
  pkPdHighlights: {
    onset: string;
    duration: string;
    halfLife: string;
    elimination: string;
    bioactivation?: string;
  };
  sarNotes: string;
  moa_summary?: string; // Concise Mechanism of Action (MOA) summary
  sar_rationale?: string; // Detailed structure-activity relationship rationale / legacy fallback
  majorToxicityOrLimitation?: string; // Clinical toxicities, adverse reactions or contraindications
  pubchemAudit?: PubChemAuditInfo; // Universal PubChem audit metadata
  clinicalData?: OpenFdaClinicalData; // Structured clinical data hydrated via OpenFDA
  location_of_metabolism?: string; // Distilled primary organ and mechanism
  elimination_half_life?: { value: string; unit: string } | string; // Distilled elimination half-life
  metabolism_pathway?: string[];
  unique_differentiator?: string;
  structural_differences?: string;
  pk_pd_profile?: string;
  clinical_use_cases?: string;
  croppedImageUrl?: string;
  sourcePageNumber?: number; // 1-based originating slide number where this molecule was first introduced
  sourcePageNumbers?: number[]; // All 1-based slide numbers where this molecule is referenced
}

export interface SubStatement {
  id: string; // e.g., 'a', 'b', 'c'
  statement?: string;
  text?: string;
  isCorrect: boolean; // True or False
  rationale?: string;
  explanation?: string;
  keyPharmacophore?: string;
}

export interface MatchingTarget {
  id: string; // e.g., 'a', 'b', 'c', 'd', 'e'
  label: string;
  acceptedStructureIds: string[]; // Roman numerals, e.g. ['I'] or ['II', 'IV']
  rationale?: string;
}

export interface RankingItem {
  id: string; // e.g., 'rank_1', 'rank_2'
  label: string; // e.g., 'Antiplatelet I (Prasugrel)'
  correctRank: number; // 1-indexed rank (1, 2, 3...)
  rationale?: string;
}

export interface WorkbenchHaloTarget {
  id: string;
  label: string;
  smarts?: string;
  isCorrect: boolean;
  rationale: string;
  x: number;
  y: number;
  radius?: number;
}

export interface WorkbenchDropZone {
  id: string;
  targetMoietyId?: string;
  label?: string;
  correctBadge?: string;
  expectedBadge?: string;
  rationale?: string;
  x?: number;
  y?: number;
}

export interface WorkbenchStructureCandidate {
  id: string;
  name?: string;
  label?: string;
  smiles?: string;
  smarts?: string;
  cid?: number;
  isCorrect: boolean;
  classification?: 'active' | 'intermediate' | 'degradant' | string;
  rationale: string;
}

export interface StructuralWorkbenchData {
  stemStructure: ChemicalStructure;
  instructions?: string;
  step2a_amides: {
    title: string;
    prompt: string;
    targets: WorkbenchHaloTarget[];
  };
  step2b_moieties: {
    title: string;
    prompt: string;
    targets: WorkbenchHaloTarget[];
  };
  step2c_nature: {
    title: string;
    prompt: string;
    badgeBank: string[];
    dropZones: WorkbenchDropZone[];
  };
  step2d_activeForm: {
    title: string;
    prompt: string;
    candidates: WorkbenchStructureCandidate[];
  };
}

export interface StructuralWorkbenchAnswer {
  selectedAmideIds: string[];
  selectedMoietyIds: string[];
  dropZoneAssignments: Record<string, string>;
  selectedCandidateId: string | null;
  submittedAt?: string;
}

export interface AntiplateletQuestion {
  id: number;
  title?: string;
  prompt?: string;
  questionNumberLabel?: string; // e.g. "Question 1", "Question 5"
  category?: string;
  questionStem?: string;
  structuresDisplayed?: ChemicalStructure[];
  type: 'multiple-choice' | 'sub-statements' | 'matching' | 'ranking' | 'structural-workbench';
  matchingTargets?: MatchingTarget[];
  drop_zones?: MatchingTarget[];
  draggable_items?: string[];
  options?: string[];
  correctIndex?: number;
  correctAnswer?: string | number;
  optionExplanations?: string[];
  explanation?: string;
  subStatements?: SubStatement[];
  rankingPrompt?: string;
  rankingItems?: RankingItem[];
  structuralWorkbench?: StructuralWorkbenchData;
  overallExplanation?: string;
  highYieldPearl?: string;
  sourceReference?: string;
  referenced_structures?: string[];
  displayed_structure_entity_ids?: string[];
  hide_drug_name_show_structure_for?: string | string[];
  sourcePageNumber?: number; // 1-based originating slide number where this question is anchored
}

export interface QuestionBlock {
  block_instructions: string; // The overarching text (e.g., "Consider the following chemical structures to answer questions 15-16:")
  structural_differences?: string; // Head-to-head structural differences explicitly naming both drugs
  pk_pd_profile?: string; // Head-to-head PK/PD profile comparison explicitly naming both drugs
  clinical_use_cases?: string; // Head-to-head clinical use cases comparison explicitly naming both drugs
  local_structures: ChemicalStructure[]; // The specific structures displayed for this section, with local document_label (e.g., I, II, III)
  questions: AntiplateletQuestion[]; // The specific questions tied to this block
}

export interface ReviewSection {
  id?: string;
  title?: string;
  sectionTitle?: string;
  headerNote?: string;
  block_instructions?: string;
  structures?: ChemicalStructure[];
  local_structures?: ChemicalStructure[];
  questions: AntiplateletQuestion[];
}

export interface ReviewPage {
  pageNumber: number;
  pageTitle?: string;
  title?: string;
  subtitle?: string;
  sections: ReviewSection[];
}

export interface ReviewModule {
  id: string;
  title: string;
  subtitle: string;
  course: string;
  semester: string;
  code?: string;
  examId?: string; // 'exam_1', 'exam_2', 'exam_3'
  examTitle?: string; // 'Exam 3', 'Exam 2: Antihypertensives & Lipids'
  isBuiltIn?: boolean;
  createdAt: string;
  version?: string;
  chemicalStructures?: ChemicalStructure[];
  pages: ReviewPage[];
}

export interface QuizSessionProgress {
  mcAnswers: Record<number, number>; // questionId -> selected option index
  tfAnswers: Record<number, Record<string, boolean>>; // questionId -> { stmtId: boolean }
  matchingAnswers: Record<number, Record<string, string[]>>; // questionId -> { targetId: structureIds[] }
  rankingAnswers: Record<number, string[]>; // questionId -> ordered array of RankingItem.id
  rankingChecked?: Record<number, boolean>; // questionId -> whether student clicked "Check Order" in study mode
  workbenchAnswers?: Record<number, StructuralWorkbenchAnswer>; // questionId -> StructuralWorkbenchAnswer
  workbenchSubmitted?: Record<number, boolean>; // questionId -> whether user submitted workbench answer
}

export type ExamModeStatus = 'off' | 'active' | 'submitted';
