export interface PubChemAuditInfo {
  cid: number;
  status: 'verified' | 'unresolved' | 'manual_override';
  verifiedAt: string;
  source: 'nih_pug_rest' | 'document_crop_with_pubchem_match';
  canonicalSmiles?: string;
  iupacName?: string;
  molecularFormula?: string;
  molecularWeight?: number;
  xlogp?: number;
  pubChemUrl: string;
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
  pubchemUrl?: string;
  pngUrl: string;
  fallbackSvg?: string;
  target: string;
  target_receptor?: string; // Biological target receptor & binding site
  reversibility: 'Reversible' | 'Irreversible' | string;
  drug_state?: 'Active Drug' | 'Prodrug' | 'Active Metabolite' | 'Inactive Metabolite' | string;
  mw?: number;
  logP?: number;
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
  pubchemAudit: PubChemAuditInfo; // Universal PubChem audit metadata
  croppedImageUrl?: string;
  sourcePageNumber?: number; // 1-based originating slide number where this molecule was first introduced
  sourcePageNumbers?: number[]; // All 1-based slide numbers where this molecule is referenced
}

export interface SubStatement {
  id: string; // e.g., 'a', 'b', 'c'
  statement: string;
  isCorrect: boolean; // True or False
  rationale: string;
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

export interface AntiplateletQuestion {
  id: number;
  title?: string;
  questionNumberLabel: string; // e.g. "Question 1", "Question 5"
  category: string;
  questionStem: string;
  structuresDisplayed?: ChemicalStructure[];
  type: 'multiple-choice' | 'sub-statements' | 'matching' | 'ranking';
  matchingTargets?: MatchingTarget[];
  drop_zones?: MatchingTarget[];
  draggable_items?: string[];
  options?: string[];
  correctIndex?: number;
  optionExplanations?: string[];
  subStatements?: SubStatement[];
  rankingPrompt?: string;
  rankingItems?: RankingItem[];
  overallExplanation: string;
  highYieldPearl: string;
  sourceReference: string;
  referenced_structures?: string[];
  displayed_structure_entity_ids?: string[];
  hide_drug_name_show_structure_for?: string | string[];
  sourcePageNumber?: number; // 1-based originating slide number where this question is anchored
}

export interface QuestionBlock {
  block_instructions: string; // The overarching text (e.g., "Consider the following chemical structures to answer questions 15-16:")
  local_structures: ChemicalStructure[]; // The specific structures displayed for this section, with local document_label (e.g., I, II, III)
  questions: AntiplateletQuestion[]; // The specific questions tied to this block
}

export interface ReviewSection {
  sectionTitle?: string;
  headerNote?: string;
  block_instructions?: string;
  structures?: ChemicalStructure[];
  local_structures?: ChemicalStructure[];
  questions: AntiplateletQuestion[];
}

export interface ReviewPage {
  pageNumber: number;
  pageTitle: string;
  subtitle: string;
  sections: ReviewSection[];
}

export interface ReviewModule {
  id: string;
  title: string;
  subtitle: string;
  course: string;
  semester: string;
  code?: string;
  isBuiltIn?: boolean;
  createdAt: string;
  pages: ReviewPage[];
}

export interface QuizSessionProgress {
  mcAnswers: Record<number, number>; // questionId -> selected option index
  tfAnswers: Record<number, Record<string, boolean>>; // questionId -> { stmtId: boolean }
  matchingAnswers: Record<number, Record<string, string[]>>; // questionId -> { targetId: structureIds[] }
  rankingAnswers: Record<number, string[]>; // questionId -> ordered array of RankingItem.id
  rankingChecked?: Record<number, boolean>; // questionId -> whether student clicked "Check Order" in study mode
}

export type ExamModeStatus = 'off' | 'active' | 'submitted';
