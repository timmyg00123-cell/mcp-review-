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
  document_label?: string; // The exact Roman numeral, number, or letter label assigned to this specific structure in the source document (e.g., 'I', 'II', 'IV', 'Drug X')
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
  displayed_structure_entity_ids?: string[];
  referenced_structures?: string[];
  hide_drug_name_show_structure_for?: string | string[];
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
}

export interface QuestionBlock {
  block_instructions: string; // The overarching text (e.g., "Consider the following chemical structures to answer questions 15-16:")
  local_structures: ChemicalStructure[]; // The specific structures displayed for this section, with their local document_label (e.g., I, II, III)
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

/**
 * Strict Senior Cheminformatics Engine System Instruction
 * Enforces Daylight SMILES/SMARTS graph consistency, prevents 1-to-many array misalignments,
 * eliminates chemical hallucinations/placeholders, and guarantees topological precision.
 */
export const SENIOR_CHEMINFORMATICS_ENGINE_SYSTEM_INSTRUCTION = `You are a Senior Cheminformatics Engine and Computational Molecular Architect specializing in structure-activity relationship (SAR) modeling, Daylight SMILES/SMARTS graph parsing, and automated medicinal chemistry knowledge extraction.

Your primary mission is to guarantee 100% topological precision and prevent SMARTS/SMILES array misalignments, invalid substructure queries, and chemical hallucinations.

================================================================================
CORE DIRECTIVE 1: STRICT SMARTS-TO-SMILES GRAPH ALIGNMENT
================================================================================
1. SUBSTRUCTURE EMBEDDING: Every SMARTS pattern specified in a structure's "pharmacophores" array MUST represent a topologically valid, verifiable substructure of that exact molecule's SMILES representation.
2. ZERO PHANTOM MOIETIES: Never assign a SMARTS pattern containing atoms, rings, or functional groups that do not physically exist in the parent chemical structure (e.g., never include a halogen, nitro, or sulfonamide SMARTS for an aliphatic ester).
3. 1-TO-1 ARRAY CONSISTENCY: Maintain strict 1-to-1 semantic alignment between "keyFunctionalGroups" and "pharmacophores". The sequence and medicinal chemistry descriptors must correspond directly.
4. VALID SMARTS SYNTAX:
   - Adhere strictly to the Daylight SMARTS specification.
   - Ensure all ring closure digits are balanced (e.g., c1ccccc1).
   - Ensure all branching parentheses are properly opened and closed (e.g., C(=O)O).
   - Use correct aliphatic vs. aromatic primitives (c, n, o vs. C, N, O) and atomic number wildcards when appropriate (e.g., [#6]1:[#6]:[#6]:[#6]:[#6]:[#6]1).

================================================================================
CORE DIRECTIVE 2: MEDICINAL CHEMISTRY NOMENCLATURE RIGOR
================================================================================
1. SPECIFIC FUNCTIONAL GROUPS: Always use precise IUPAC / medicinal chemistry terminology for functional groups and pharmacophores (e.g., "1,4-dihydropyridine ring", "2,3-dichlorophenyl group", "sulfonamide moiety", "carboxylate group", "tetrazole ring").
2. BANNED PLACEHOLDERS: ABSOLUTELY NEVER output generic placeholders such as "DRUG Core", "Main Scaffold", "Active Moiety", or "Generic Ring".
3. PHARMACOPHORE ROLES: For every pharmacophore entry, provide an exact pharmacodynamic, pharmacokinetic, or physicochemical role in "purpose" (e.g., "Primary hydrogen bond acceptor engaging catalytic residue Lys123", "Lipophilic anchor occupying hydrophobic subpocket S1").

================================================================================
CORE DIRECTIVE 3: STRUCTURAL IDENTIFIER & QUESTION SYNCHRONIZATION
================================================================================
1. DOCUMENT LABEL PRESERVATION: For each chemical structure extracted or evaluated, retain its exact printed document label ("I", "II", "III", "IV", "Drug X").
2. SCOPED QUESTION ALIGNMENT: Ensure each question referencing chemical structures links directly and exclusively to the appropriate local structures via "referenced_structures" (e.g., ["I", "II"]).
3. IDENTITY REDACTION: Redact explicit drug trade and generic names inside question stems, replacing them with bracketed labels (e.g., "[Structure I]", "[Drug X]") to require students to deduce properties from chemical structure and SAR alone.

================================================================================
CORE DIRECTIVE 4: STRICT JSON FORMATTING & OUTPUT PURITY
================================================================================
1. Output MUST be pure, valid JSON adhering strictly to the response schema.
2. Content-Type is application/json. Do not include markdown code fences, backticks, conversational preamble, or trailing commentary.`;

/**
 * Strict Dual-Directive System prompt instructing Gemini to:
 * 1. SCOPED QUESTION BLOCKS DIRECTIVE: Group extracted content into discrete blocks based on the document's structure
 *    so local chemical structures (I, II, III...) are strictly isolated to that block and never collide across pages.
 * 2. ROLE 1 (The Chemist): Synthesize deep, expert-level medicinal chemistry data (pharmacophores, target_receptor, reversibility, moa_summary) for each block's \`local_structures\`.
 * 3. ROLE 2 (The Transcriptionist): Strictly extract and digitize existing worksheet questions verbatim for each block's \`questions\`.
 */
export const MEDCHEM_WORKSHEET_SYSTEM_PROMPT = `${SENIOR_CHEMINFORMATICS_ENGINE_SYSTEM_INSTRUCTION}

You are an elite Professor of Medicinal Chemistry and Molecular Pharmacology digitizing curriculum examination worksheets into scoped Question Blocks.

================================================================================
CRITICAL DIRECTIVE: DISCRETE QUESTION BLOCKS (SCOPED LOCAL STRUCTURE BANKS)
================================================================================
Group the extracted content into discrete blocks ("question_blocks") based on the document's structure (e.g., when the document says 'Consider the following structures for questions X-Y').
STRICT BLOCK ISOLATION: Tightly scope each block's "local_structures" strictly to that block's questions so Roman numerals (I, II, III, IV...) are completely isolated and never collide across different pages or blocks. Questions in a block must refer ONLY to their block's "local_structures" via "referenced_structures".
Ensure that the structures referenced in a block are strictly isolated to that block's "local_structures" array so Roman numerals do not collide across different sections of the document.

Each item in "question_blocks" MUST contain:
1. "block_instructions": The overarching text or instructions for this block (e.g., "Consider the following chemical structures to answer questions 15-16:", "Match the following antiplatelet agents (I–IV) with their respective targets (questions 1–5):", "Case Questions 1–5").
2. "local_structures": The specific chemical structures displayed and referenced for this section, with their local "document_label" (e.g., 'I', 'II', 'III', 'Drug X').
3. "questions": The specific numbered questions tied directly to this block.

================================================================================
ROLE 1 (The Chemist) — FOR EACH BLOCK'S "local_structures" ARRAY:
================================================================================
For the "local_structures" array of each block, you MUST synthesize deep, expert-level medicinal chemistry data. Even if the document only contains a picture of the structure, you must independently generate the "pharmacophores" list, identify the "target_receptor", and write a detailed "moa_summary" exactly matching the schema.
CRITICAL DIRECTIVE: Instead of explaining the structural chemistry (SAR), you MUST write a highly accurate Mechanism of Action (MOA) summary for each drug, explaining exactly how it works physiologically to achieve its clinical effect.

Chemist Directives:
1. FORCE 100% LOCAL STRUCTURE CAPTURE:
   CRITICAL: You MUST extract a complete, independent item into "local_structures" for EVERY chemical drawing displayed in that specific block or section of the document.
   You MUST capture the exact Roman numeral printed next to the structure in that block and save it as "document_label" (e.g. "I", "II", "III", "Drug X"). DO NOT re-number them, sort them alphabetically, or invent your own sequence.
2. For EVERY structure in "local_structures", you MUST synthesize:
   - "id": Sequential Roman numeral ("I", "II", "III", "IV", ... "X") or named placeholder ("Drug X") local to this block.
   - "document_label": The exact Roman numeral, number, or letter label assigned to this specific structure in the source document block (e.g. "I", "II", "IV", "Drug X").
   - "name": Clean chemical or generic drug name (e.g. "Tirofiban", "Ticagrelor", "Aspirin", "Ezetimibe", "Lomitapide").
   - "tradeName": Brand/trade name if known (e.g. "Aggrastat", "Brilinta", "Zetia").
   - "chemicalClass": Chemical scaffold class (e.g. "N-sulfonyl tyrosine-based peptidomimetic", "Triazolopyrimidine", "2-Azetidinone derivative").
   - "pharmacologicalClass": Pharmacological mechanism (e.g. "Glycoprotein IIb/IIIa inhibitor", "P2Y12 receptor antagonist", "NPC1L1 sterol transporter inhibitor").
   - "target_receptor": Exact biological target and binding pocket (e.g. "Glycoprotein IIb/IIIa (αIIbβ3) fibrinogen receptor", "P2Y12 ADP receptor (Allosteric site)", "Niemann-Pick C1-Like 1 (NPC1L1)").
   - "reversibility": Exact receptor binding kinetics: "Reversible" or "Irreversible".
   - "drug_state": Classify the molecule's drug_state strictly as 'Active Drug', 'Prodrug', 'Active Metabolite', or 'Inactive Metabolite'.
   - "route": Route of administration (e.g. "Oral", "IV Infusion", "Subcutaneous").
   - "keyFunctionalGroups": Key functional groups present (e.g. ["Carboxylic acid (-COOH)", "Piperidine 2° basic amine", "Butyl sulfonamide (-SO2-nBu)"]).
   - "pharmacophores": Array of discrete pharmacophore groups.
     CRITICAL: You MUST use specific medicinal chemistry nomenclature for functional groups and pharmacophores (e.g., '1,4-dihydropyridine ring', 'butyryloxymethyl ester', 'ortho-chlorophenyl group'). ABSOLUTELY DO NOT use generic terms like 'DRUG Core', 'Main Scaffold', or 'Active Moiety'.
     For every pharmacophore identified, you MUST provide its valid SMARTS pattern string so the frontend cheminformatics renderer can highlight the exact atoms on the 2D canvas.
     Each item in "pharmacophores" MUST include:
     * "name": Specific medicinal chemistry nomenclature (e.g. "1,4-Dihydropyridine ring", "Butyryloxymethyl ester", "Ortho-chlorophenyl group"). NEVER use "DRUG Core", "Main Scaffold", or "Active Moiety".
     * "smarts": The exact SMARTS string pattern for this functional group/moiety (e.g., "[#6]1[#6]=[#6][#7][#6]=[#6]1", "C(=O)OCC(=O)C", "c1c(Cl)cccc1") so the frontend cheminformatics renderer can highlight the exact atoms on the 2D canvas.
     * "description": A brief note on its purpose, receptor binding interaction, and functional contribution.
     * "id": Unique slug identifier (e.g. "dihydropyridine_ring", "butyryloxymethyl_ester", "ortho_chlorophenyl").
     * "purpose": Rigorous explanation of its molecular role, binding interaction (e.g. ionic salt bridge, RGD mimicry, hydrophobic pocket anchor), and functional contribution.
     * "category": "binding", "pk", "prodrug", "stability", or "solubility".
   - "pkPdHighlights": Object containing "onset", "duration", "halfLife", "elimination", and optional "bioactivation".
   - "moa_summary": Keep the MOA summary extremely concise and punchy (1-2 sentences maximum). Do not write giant walls of text. Describe its primary physiological target, how it interacts with that receptor/enzyme, and the resulting pharmacological/clinical effect. Instead of explaining the structural chemistry (SAR), you MUST write a highly accurate Mechanism of Action (MOA) summary for each drug, explaining exactly how it works physiologically to achieve its clinical effect.
   - "cid": PubChem Compound ID (CID) if identifiable.
   - "mw": Molecular weight in g/mol if explicitly stated on the slide/document.
   - "logP": LogP or XLogP value (lipophilicity) if explicitly stated on the slide/document.

================================================================================
ROLE 2 (The Transcriptionist) — FOR EACH BLOCK'S "questions" ARRAY:
================================================================================
For the "questions" array, strictly extract the text verbatim from the document. Do not invent or summarize.

Transcriptionist Directives:
1. Extract and digitize the exact questions verbatim from the provided document.
2. DO NOT invent, summarize, or alter the questions. Find the numbered questions (e.g., 1 through 25) in the text/images and copy them exactly as written into the JSON schema under their respective parent block.
3. DO NOT synthesize, create, or generate synthetic distractors or questions not physically printed on the slide or page. Only output what is physically written on the document.
4. STRICT TYPE CLASSIFICATION FOR MULTI-STRUCTURE QUESTIONS:
   If a question asks to "identify", "match", or apply properties to MULTIPLE structures from the block (e.g., "What is the chemical class of the above active molecules?", "Match each structure to its target", "Which compound corresponds to each mechanism?"), you MUST classify the "type" / "question_type" as "matching" (drag-and-drop). Do NOT classify it as "multiple_choice".
5. DRAG & DROP SCHEMA SUPPORT:
   For every question classified as "matching", populate:
   - "matchingTargets" (or drop zones): The exact text options / bins to match to printed on the worksheet.
   - "acceptedStructureIds": Array of the correct local Roman numeral structure IDs or draggable items (e.g., ["I"], ["II", "IV"]) that belong in each target.
   - "draggable_items": Array of the available draggable item labels (e.g., ["I", "II", "III", "IV"]).
6. BAN PLACEHOLDER HALLUCINATIONS (VERBATIM OPTIONS ONLY):
   CRITICAL: When extracting options for any question, you MUST transcribe the exact, full text of the options as printed in the document (e.g., "Benzothiadiazine-1,1-dioxide", "Sulfonamide derivative", "Phenoxyacetic acid").
   ABSOLUTELY NEVER output generic placeholders like "A", "B", "C", or "D".
7. If a question is multiple choice, extract the exact question stem and the exact choices printed on the worksheet (with full verbatim option text, never placeholders).
8. If a question is a True/False statement or SAR evaluation block, copy the exact sub-statements verbatim.
9. MULTI-PART QUESTION BLOCKS & LOCAL STRUCTURE BANKS:
   - For multi-part blocks referencing a shared structure bank, place all associated questions inside the same "question_block" alongside its "local_structures".
   - Populate "displayed_structure_entity_ids" with the local Roman numerals (e.g. ["I", "II", "III", "IV"]).
10. If an answer key or explanations are printed in the document, extract them verbatim. If explanations are not explicitly printed, provide a rigorous scientific explanation ("overallExplanation") and high-yield pearl ("highYieldPearl") explaining the correct pharmacology without altering the question stem or options.
11. Populate "correctIndex" (for multiple-choice) or "isCorrect" (for True/False) based on authoritative medicinal chemistry knowledge.
12. LINK QUESTIONS TO REFERENCED STRUCTURES:
    For every question extracted, analyze the text and determine which chemical structures are being referenced. Populate the "referenced_structures" array with their exact local document labels from this block (e.g., ["I", "II", "Drug X"]) so the frontend UI knows which local chemical structures to display alongside the question.
13. BLIND IDENTITY LEAKS (STRICT REDACTION OF EXPLICIT DRUG NAMES):
    CRITICAL: You MUST strictly REDACT explicit drug names and trade names from the question stem text, sub-statements, and multiple-choice options.
    Replace explicit drug names with the generic document label in brackets (e.g., "Considering the SAR of [Structure I]..." instead of "...of Tirofiban", "Which functional group on [Structure II] confers reversibility?" instead of "...on Ticagrelor", or "[Drug X]" instead of "Aspirin").
    The student must deduce the identity and pharmacological properties of the compound from its chemical structure or local Roman numeral label alone.
    NEVER leak the identity of the drug in the questionStem or options.

Return valid JSON adhering strictly to the response schema containing "question_blocks".`;

export const MEDCHEM_VIGNETTE_SYSTEM_PROMPT = MEDCHEM_WORKSHEET_SYSTEM_PROMPT;

/**
 * Strict JSON schema for Gemini Structured Outputs representing a digitized MedChem review worksheet.
 * Groups content into scoped `question_blocks` containing `block_instructions`, `local_structures`, and `questions`.
 */
export const MEDCHEM_QUIZ_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    question_blocks: {
      type: 'ARRAY',
      description: "Array of discrete question blocks grouping content based on document structure. Structures referenced in a block are strictly isolated to that block's local_structures array so Roman numerals do not collide across different sections of the document.",
      items: {
        type: 'OBJECT',
        properties: {
          block_instructions: {
            type: 'STRING',
            description: "The overarching text or instructions for this block (e.g., 'Consider the following chemical structures to answer questions 15-16:').",
          },
          local_structures: {
            type: 'ARRAY',
            description: "The specific chemical structures displayed for this section, with their local document_label (e.g., I, II, III, Drug X) and rich medicinal chemistry synthesis.",
            items: {
              type: 'OBJECT',
              properties: {
                id: {
                  type: 'STRING',
                  description: 'Local Roman numeral identifier (e.g. "I", "II", "III", "IV", ... "X") or named placeholder (e.g. "Drug X").',
                },
                document_label: {
                  type: 'STRING',
                  description: "The exact Roman numeral, number, or letter label assigned to this specific structure in this block of the source document (e.g., 'I', 'II', 'IV', 'Drug X').",
                },
                name: {
                  type: 'STRING',
                  description: 'Generic drug name or chemical entity name (e.g. "Tirofiban", "Ticagrelor", "Aspirin", "Ezetimibe", "Lomitapide").',
                },
                tradeName: {
                  type: 'STRING',
                  description: 'Brand/trade name if known (e.g. "Aggrastat", "Brilinta", "Zetia").',
                },
                chemicalClass: {
                  type: 'STRING',
                  description: 'Chemical scaffold or core chemical family (e.g. "N-sulfonyl tyrosine-based peptidomimetic", "Triazolopyrimidine", "2-Azetidinone derivative").',
                },
                pharmacologicalClass: {
                  type: 'STRING',
                  description: 'Pharmacological mechanism class (e.g. "Glycoprotein IIb/IIIa inhibitor", "P2Y12 receptor antagonist", "NPC1L1 sterol transporter inhibitor").',
                },
                target_receptor: {
                  type: 'STRING',
                  description: 'Exact biological target or receptor, including binding site details (e.g. "Glycoprotein IIb/IIIa (αIIbβ3) fibrinogen receptor", "P2Y12 ADP receptor (Allosteric site)", "Niemann-Pick C1-Like 1 (NPC1L1)").',
                },
                reversibility: {
                  type: 'STRING',
                  enum: ['Reversible', 'Irreversible'],
                  description: 'Reversibility of receptor binding: "Reversible" or "Irreversible".',
                },
                drug_state: {
                  type: 'STRING',
                  enum: ['Active Drug', 'Prodrug', 'Active Metabolite', 'Inactive Metabolite'],
                  description: "Classify the molecule's drug_state strictly as 'Active Drug', 'Prodrug', 'Active Metabolite', or 'Inactive Metabolite'.",
                },
                route: {
                  type: 'STRING',
                  description: 'Route of administration (e.g. "Oral", "IV Infusion", "Subcutaneous").',
                },
                keyFunctionalGroups: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                  description: 'List of critical functional groups (e.g. ["Carboxylic acid (-COOH)", "Piperidine 2° basic amine", "Butyl sulfonamide (-SO2-nBu)"]).',
                },
                pharmacophores: {
                  type: 'ARRAY',
                  description: 'List of pharmacophore groups identifying the molecular role, binding contribution, and SAR contribution of key fragments. For every pharmacophore identified, you MUST provide its valid SMARTS pattern string so the frontend cheminformatics renderer can highlight the exact atoms on the 2D canvas. CRITICAL: You MUST use specific medicinal chemistry nomenclature for functional groups and pharmacophores (e.g., "1,4-dihydropyridine ring", "butyryloxymethyl ester", "ortho-chlorophenyl group"). ABSOLUTELY DO NOT use generic terms like "DRUG Core", "Main Scaffold", or "Active Moiety".',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      name: {
                        type: 'STRING',
                        description: 'Specific medicinal chemistry nomenclature name (e.g. "1,4-Dihydropyridine ring", "Butyryloxymethyl ester", "Ortho-chlorophenyl group"). ABSOLUTELY DO NOT use generic terms like "DRUG Core", "Main Scaffold", or "Active Moiety".',
                      },
                      smarts: {
                        type: 'STRING',
                        description: 'The exact SMARTS string pattern for this functional group/moiety (e.g., "[#6]1[#6]=[#6][#7][#6]=[#6]1", "C(=O)OCC(=O)C", "c1c(Cl)cccc1") so the frontend cheminformatics renderer can highlight the exact atoms on the 2D canvas.',
                      },
                      description: {
                        type: 'STRING',
                        description: 'A brief note on its purpose, receptor binding interaction, and SAR contribution.',
                      },
                      id: {
                        type: 'STRING',
                        description: 'Unique slug ID (e.g. "dihydropyridine_ring", "butyryloxymethyl_ester", "ortho_chlorophenyl")',
                      },
                      purpose: {
                        type: 'STRING',
                        description: 'Detailed molecular role, receptor binding interaction (e.g. ionic salt bridge, mimicry of RGD motif, hydrophobic pocket insertion), and SAR contribution.',
                      },
                      category: {
                        type: 'STRING',
                        enum: ['binding', 'pk', 'prodrug', 'stability', 'solubility'],
                        description: 'Pharmacophore category: "binding", "pk", "prodrug", "stability", or "solubility".',
                      },
                    },
                    required: ['name', 'smarts', 'description'],
                  },
                },
                pkPdHighlights: {
                  type: 'OBJECT',
                  properties: {
                    onset: { type: 'STRING', description: 'Onset of action (e.g. "Rapid oral absorption", "Immediate upon IV infusion").' },
                    duration: { type: 'STRING', description: 'Duration of therapeutic effect.' },
                    halfLife: { type: 'STRING', description: 'Elimination half-life (t1/2).' },
                    elimination: { type: 'STRING', description: 'Primary route of elimination / metabolizing enzymes (e.g. "Hepatic CYP3A4", "Renal unchanged").' },
                    bioactivation: { type: 'STRING', description: 'Prodrug bioactivation pathway or active metabolite details (e.g. "Directly active", "CYP2C19 two-step oxidation to thiol metabolite").' },
                  },
                  required: ['onset', 'duration', 'halfLife', 'elimination'],
                },
                moa_summary: {
                  type: 'STRING',
                  description: "Keep the MOA summary extremely concise and punchy (1-2 sentences maximum). Do not write giant walls of text.",
                },
                cid: {
                  type: 'INTEGER',
                  description: 'PubChem Compound ID (CID) if identifiable.',
                },
                mw: {
                  type: 'NUMBER',
                  description: 'Molecular weight in g/mol, if explicitly stated in the document.',
                },
                logP: {
                  type: 'NUMBER',
                  description: 'LogP or XLogP value (lipophilicity), if explicitly stated in the document.',
                },
              },
              required: [
                'id',
                'document_label',
                'name',
                'chemicalClass',
                'pharmacologicalClass',
                'target_receptor',
                'reversibility',
                'drug_state',
                'moa_summary',
                'pharmacophores',
              ],
            },
          },
          questions: {
            type: 'ARRAY',
            description: 'Array of numbered questions extracted verbatim from the document tied strictly to this block.',
            items: {
              type: 'OBJECT',
              properties: {
                id: {
                  type: 'INTEGER',
                  description: 'The exact question number from the document (e.g., 1, 2, ... 17, 18 ... 25).',
                },
                questionNumberLabel: {
                  type: 'STRING',
                  description: 'Exact question label from the document, e.g. "Question 1", "Question 17", "17."',
                },
                category: {
                  type: 'STRING',
                  description: 'Curriculum category or section heading from the document, e.g. "Classification", "Mechanism & Reversibility", "SAR Analysis".',
                },
                type: {
                  type: 'STRING',
                  enum: ['matching', 'sub-statements', 'multiple-choice'],
                  description: 'Interactive question format: "matching" (drag-and-drop), "sub-statements" (True/False block), or "multiple-choice". CRITICAL CLASSIFICATION RULE: If a question asks to "identify", "match", or apply properties to MULTIPLE structures from the block (e.g., "What is the chemical class of the above active molecules?", "Match each structure to its target"), you MUST classify the question_type as "matching" (drag-and-drop). Do NOT classify it as "multiple_choice".',
                },
                questionStem: {
                  type: 'STRING',
                  description: 'The exact question stem extracted from the document, with explicit drug names strictly REDACTED and replaced by bracketed document labels (e.g. "[Structure I]", "[Structure II]", "[Drug X]") to prevent identity leaks.',
                },
                blinded_structure_id: {
                  type: 'STRING',
                  description: 'Local Roman numeral ID (I, II, III, IV, V, VI, VII, VIII, IX, X) or placeholder name (e.g. Drug X) from this block tested by this question.',
                },
                displayed_structure_entity_ids: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                  description: 'Array of local Roman numeral structure IDs (I, II, III, IV, V, VI, VII, VIII, IX, X) or named placeholder structures (Drug X, Drug Y, Drug Z) from this block referenced by this question.',
                },
                referenced_structures: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                  description: "An array of the exact local document labels (e.g., ['I', 'II', 'Drug X']) from this block that this specific question asks about or refers to.",
                },
                hide_drug_name_show_structure_for: {
                  type: 'STRING',
                  description: 'Local Roman numeral ID (I, II, III, IV, V, VI, VII, VIII, IX, X) or placeholder name of the structure whose name is blinded for structure identification in this block.',
                },
                matchingTargets: {
                  type: 'ARRAY',
                  description: 'If type is "matching": array of exact target bins or drop zones (the text options to match to) printed on the worksheet. Do NOT invent synthetic distractors.',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      id: { type: 'STRING', description: 'Target identifier ("a", "b", "c", "d", "e")' },
                      label: { type: 'STRING', description: 'Exact target class or label from the worksheet to match/drop structures into' },
                      acceptedStructureIds: {
                        type: 'ARRAY',
                        items: { type: 'STRING' },
                        description: 'Local Roman numeral structure IDs or draggable items (I, II, III, IV, V, VI, VII, VIII, IX, X) from this block that correctly match this target.',
                      },
                      rationale: { type: 'STRING', description: 'Scientific explanation of why this target matches the structure(s).' },
                    },
                    required: ['id', 'label', 'acceptedStructureIds', 'rationale'],
                  },
                },
                draggable_items: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                  description: 'If type is "matching": array of draggable item labels, typically the Roman numerals from this block (e.g., ["I", "II", "III", "IV"]).',
                },
                subStatements: {
                  type: 'ARRAY',
                  description: 'If type is "sub-statements": array of True/False sub-statements extracted verbatim from the worksheet.',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      id: { type: 'STRING', description: 'Sub-statement letter ("a", "b", "c", "d")' },
                      statement: { type: 'STRING', description: 'Verbatim text of the True/False assertion from the worksheet.' },
                      isCorrect: { type: 'BOOLEAN', description: 'True if scientifically accurate, False otherwise.' },
                      rationale: { type: 'STRING', description: 'Molecular and pharmacological explanation for True/False evaluation.' },
                      keyPharmacophore: { type: 'STRING', description: 'Key functional group, pharmacophore, or enzyme involved.' },
                    },
                    required: ['id', 'statement', 'isCorrect', 'rationale'],
                  },
                },
                options: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                  description: 'Verbatim multiple-choice choices copied directly from the worksheet. CRITICAL DIRECTIVE: When extracting options for any question, you MUST transcribe the exact, full text of the options as printed in the document (e.g., "Benzothiadiazine-1,1-dioxide", "Sulfonamide derivative", "Phenoxyacetic acid"). ABSOLUTELY NEVER output generic placeholders like "A", "B", "C", or "D". Explicit drug names must be redacted and replaced with bracketed document labels (e.g. "[Structure I]") if asking to deduce compounds from chemical structures.',
                },
                correctIndex: {
                  type: 'INTEGER',
                  description: '0-based index of correct option (0 for A, 1 for B, 2 for C, 3 for D...).',
                },
                optionExplanations: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                  description: 'Scientific explanation for each multiple-choice option.',
                },
                overallExplanation: {
                  type: 'STRING',
                  description: 'Rigorous explanation synthesizing the chemical mechanisms and SAR for this question.',
                },
                highYieldPearl: {
                  type: 'STRING',
                  description: 'High-yield board exam takeaway pearl.',
                },
                sourceReference: {
                  type: 'STRING',
                  description: 'Source document page number or question reference (e.g. "Worksheet Page 2, Question 18").',
                },
              },
              required: [
                'id',
                'questionNumberLabel',
                'category',
                'type',
                'questionStem',
                'overallExplanation',
                'highYieldPearl',
              ],
            },
          },
        },
        required: ['block_instructions', 'local_structures', 'questions'],
      },
    },
  },
  required: ['question_blocks'],
};

/**
 * Strict System prompt for extracting a Medicinal Chemistry Knowledge Graph from lecture slides or diagrams.
 * Enforces discrete small molecules and bans non-chemical entities (foods, beverages, fluids, slide headings).
 */
export const MEDCHEM_INGESTION_SYSTEM_PROMPT = `You are an expert Professor of Medicinal Chemistry and Molecular Pharmacology parsing pharmaceutical lecture slides into a strict Knowledge Graph.

CRITICAL DISCRETE SMALL MOLECULE RULES FOR CHEMICAL STRUCTURES:
1. ONLY discrete, definable small chemical molecules with 2D chemical structures (and verifiable PubChem CIDs) can be tagged as "DRUG" or "METABOLITE".
   - Valid examples: "Lomitapide", "Icosapent ethyl", "Ezetimibe", "Ezetimibe glucuronide", "Clopidogrel", "Clopidogrel active thiol metabolite", "Atorvastatin", "Bergamottin", "6',7'-Dihydroxybergamottin".

2. EXPLICITLY BANNED AS "DRUG" OR "METABOLITE":
   - NEVER create a "DRUG" or "METABOLITE" node for:
     a) Foods, beverages, or botanicals: "Grapefruit Juice", "Grapefruit", "Orange Juice", "Dietary Fiber", "High-fat Meal", "Food".
     b) Body fluids or anatomical matrices: "Urine", "Plasma", "Serum", "Blood", "Bile", "Feces", "Saliva".
     c) Generic placeholders or slide headings: "Active Metabolite", "Inactive Metabolite", "Major Metabolite", "Primary Metabolite", "Drug A", "Compound B", "Metabolites", "Parent Drug".
     d) Clinical outcomes, syndromes, or adverse effects: "Bleeding", "Myopathy", "Rhabdomyolysis", "CYP3A4 Inhibition".

3. HANDLING FOOD/DRUG INTERACTIONS (e.g., Grapefruit Juice):
   - If a slide discusses food/drug or beverage interactions (e.g., grapefruit juice inhibiting CYP3A4):
     a) Extract the specific bioactive small molecule chemical constituent responsible for the interaction (e.g., "bergamottin" or "6',7'-dihydroxybergamottin") as the "DRUG" entity.
     b) OR classify the interaction strictly as clinical context, adverse effect, or disease state without creating an empty structure node.

4. PRESERVE EXACT SLIDE/PAGE CHRONOLOGICAL ORDER:
   - For every extracted entity and relationship, record the exact 1-based "source_slide_index" (e.g. 1, 2, 3...) corresponding to the slide where it was introduced.

5. ENTITY TYPES:
   - "DRUG": Discrete definable active pharmaceutical ingredient or bioactive small molecule.
   - "METABOLITE": Discrete chemically defined metabolite with identifiable chemical structure.
   - "DRUG_CLASS": Therapeutic or chemical family (e.g., "MTP Inhibitors", "Statins", "PCSK9 Inhibitors").
   - "PHARMACOPHORE_OR_MOIETY": Chemical sub-structural fragment (e.g., "Fluorene ring", "Piperidine ring", "Carboxylic acid").
   - "TARGET_OR_ENZYME": Biological target or metabolizing enzyme (e.g., "CYP3A4", "MTP", "NPC1L1", "P-gp").
   - "ADVERSE_EFFECT": Clinical side effect (e.g., "Hepatic Steatosis", "Elevated Transaminases").
   - "DISEASE_STATE": Clinical indication or pathology (e.g., "Homozygous Familial Hypercholesterolemia", "Severe Hypertriglyceridemia").

6. RELATIONSHIP TYPES:
   - "INHIBITS", "METABOLIZED_BY", "BIOACTIVATED_TO", "CONTAINS_PHARMACOPHORE", "BINDS_TO", "CAUSES_ADVERSE_EFFECT", "INDICATED_FOR", "ANALOG_OF", "RESISTANT_TO".
   - CRITICAL GDMT & CLINICAL GUIDELINE RELATIONSHIPS:
     - "FIRST_LINE_FOR": First-line guideline-directed medical therapy (GDMT) recommendation for a disease state.
     - "CONTRAINDICATED_IN": Boxed warning, Class III harm, or absolute/relative contraindication for a clinical condition or phenotype.

Return valid JSON adhering strictly to the schema.`;

export const MEDCHEM_INGESTION_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    entities: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: {
            type: 'STRING',
            description: 'Canonical lowercase string without spaces or punctuation (e.g. "lomitapide", "cyp3a4").',
          },
          name: {
            type: 'STRING',
            description: 'Clean human-readable title (e.g. "Lomitapide", "CYP3A4").',
          },
          type: {
            type: 'STRING',
            enum: [
              'DRUG',
              'DRUG_CLASS',
              'PHARMACOPHORE_OR_MOIETY',
              'TARGET_OR_ENZYME',
              'METABOLITE',
              'ADVERSE_EFFECT',
              'DISEASE_STATE',
            ],
          },
          clinical_and_sar_summary: {
            type: 'STRING',
            description: 'Detailed explanation of SAR, mechanism, bioactivation, functional groups, or clinical pharmacodynamics.',
          },
          source_slide_index: {
            type: 'INTEGER',
            description: '1-based slide or page number where this entity was introduced (e.g. 1, 2, 3...).',
          },
        },
        required: ['id', 'name', 'type', 'clinical_and_sar_summary'],
      },
    },
    relationships: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          source: { type: 'STRING' },
          relation: {
            type: 'STRING',
            description:
              'Standardized uppercase relation e.g. "INHIBITS", "METABOLIZED_BY", "BIOACTIVATED_TO", "CONTAINS_PHARMACOPHORE", "BINDS_TO", "CAUSES_ADVERSE_EFFECT", "INDICATED_FOR", "FIRST_LINE_FOR", "CONTRAINDICATED_IN", "ANALOG_OF", "RESISTANT_TO".',
          },
          target: { type: 'STRING' },
          sar_and_mechanism_context: { type: 'STRING' },
          theme_keywords: {
            type: 'ARRAY',
            items: { type: 'STRING' },
          },
          source_slide_index: {
            type: 'INTEGER',
            description: '1-based slide or page number where this relationship was introduced.',
          },
        },
        required: ['source', 'relation', 'target', 'sar_and_mechanism_context'],
      },
    },
  },
  required: ['entities', 'relationships'],
};
