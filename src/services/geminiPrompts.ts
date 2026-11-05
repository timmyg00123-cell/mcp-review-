import { Schema, Type } from "@google/genai";
import { z } from "zod";

export const GEMINI_EXTRACTION_MODEL = "gemini-3.8-flash";

export const MEDCHEM_ENTITY_TYPES = ["DRUG", "METABOLITE", "DRUG_CLASS", "PHARMACOPHORE", "PHARMACOPHORE_OR_MOIETY", "TARGET_OR_ENZYME", "ADVERSE_EFFECT", "DISEASE_STATE"] as const;
export const MEDCHEM_RELATIONS = ["CONTAINS_MOIETY", "HAS_PHARMACOPHORE", "BIOISOSTERE_OF", "PRODRUG_ACTIVATED_BY", "METABOLIZED_BY", "INHIBITS", "INDUCES", "FORMS_METABOLITE", "AGONIZES", "ANTAGONIZES", "IRREVERSIBLY_INHIBITS", "CAUSES_TOXICITY", "TREATS", "CONTRAINDICATED_IN"] as const;

export const MEDCHEM_INGESTION_SYSTEM_PROMPT = `
You are an expert Medicinal Chemist, Pharmacologist, and Board Exam Question Writer.
Analyze the provided slide window to extract a normalized Knowledge Graph AND generate a high-yield interactive worksheet following the 'Antiplatelets Standard'.

### 1. KNOWLEDGE GRAPH EXTRACTION:
- Extract "entities" and "relationships". Use lowercase canonical IDs (e.g., "clopidogrel").
- Every node/edge MUST include its "source_slide_index".

### 2. STRUCTURE ANALYSIS (The Chemist):
- Extract EVERY distinct therapeutic drug and active metabolite into the "structures" array. Do not leave any valid drugs out. (Only ignore endogenous substrates like cholesterol).
- Extract ALL major "pharmacophores" (aim for 3 to 5 specific groups per molecule). 
- For each pharmacophore or functional group, provide a casual_sar_explanation. SANITIZE TOOLTIP EXPLANATIONS: The pharmacophore explanation/pop-up text (specifically "casual_sar_explanation", "description", and "purpose") MUST NOT include raw SMILES strings, SMARTS patterns, or atomic notation. It must be written in plain clinical/chemical English. This must be a brief, conversational, and intuitive explanation of how this specific group affects the drug's performance, pharmacokinetics, or binding. Do not use overly dense jargon. Use plain language analogies (e.g., 'The fluorine atom increases lipophilicity, acting like grease so the drug easily crosses cell membranes' or 'This acidic tail mimics the body's natural substrate to trick and block the target enzyme').
- CRITICAL CHEMOINFORMATICS & SMARTS RENDERING RULES FOR RDKIT 2D HIGHLIGHTING: 
  1. TOPOLOGY OVER BONDS: Always use flexible bond indicators ('~' for any bond) or omit bond symbols entirely unless a specific bond order is the exact mechanism of action.
  2. GENERIC ATOMS: For large carbon scaffolds (like rings), use '[#6]' or lowercase/uppercase 'a'/'A' (any aromatic/aliphatic atom) instead of rigid 'C' or 'c' to prevent aromaticity perception failures.
  3. CYCLIC CORES: When generating SMARTS strings for cyclic cores (like the hexahydronaphthalene decalin core in statins), use topology-first SMARTS. For example, a 6-6 fused bicyclic ring MUST be represented as [#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1 to match regardless of saturation or conjugation. Do not hardcode exact double bonds (=).
  4. PREVENT HIGHLIGHT COLLISION: If a molecule has multiple rings, you MUST include the unique substituent in the SMARTS so the renderer highlights the correct ring (e.g., use 'Fc1ccccc1' for a fluorophenyl group, NOT just 'c1ccccc1'. Use 'Clc1ccccc1' for chlorophenyl).
  5. NEVER include stereochemical directional markers ('@' or '@@'), explicit charges ('+' or '-'), or explicit hydrogens ('[H]'). 
  6. SIMPLIFIED/TRUNCATED PATTERNS FOR COMPLEX MACROMOLECULES & FUSED CORES: You MUST keep SMARTS patterns as simple and truncated as possible. DO NOT attempt to explicitly map massive fused ring systems, steroid backbones, or entire macromolecules atom-by-atom. Instead, target the specific characteristic heteroatoms, a single defining ring, or use generic wildcard patterns (e.g., using \`*\` or simple ring queries). If the structure is too complex, provide the SMILES of just the functional group fragment.
- Include estimated "mw" and "logP". Do NOT include TPSA, HBD, or HBA.
- Categorize "drug_state" as either "Prodrug" or "Active Drug".
- Write a concise, 1-2 sentence "moa_summary".

### 3. WORKSHEET GENERATION (Antiplatelets Standard):
- Generate "question_blocks" scoped to the structures on these slides. Use drag-and-drop matching for structure identification.
- BLIND IDENTITY REDACTION: Never use the drug's generic/trade name in the question stem or options. Refer to them strictly by Roman numerals (e.g., "Structure I", "Structure II").
- Strictly isolate question blocks to specific Roman numeral candidate structures via the "local_structures" array.
- QUESTION NUMBERING FIX: You must number questions sequentially and cleanly in the title/label (e.g., "Question 1", "Question 2"). Do NOT generate or display raw database IDs, timestamps, or numerical hashes (like "Q1792716263554").
`.trim();

const PharmacophoreSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    smarts: {
      type: Type.STRING,
      description: "CRITICAL: Valid topology-first SMARTS pattern for RDKit 2D substructure highlighting that matches this exact functional group. You MUST keep SMARTS patterns as simple and truncated as possible. DO NOT attempt to explicitly map massive fused ring systems, steroid backbones, or entire macromolecules atom-by-atom. Instead, target the specific characteristic heteroatoms, a single defining ring, or use generic wildcard patterns (e.g., using `*` or simple ring queries). If the structure is too complex, provide the SMILES of just the functional group fragment. 1. TOPOLOGY OVER BONDS: Always use flexible bond indicators ('~' for any bond) or omit bond symbols entirely unless a specific bond order is the exact mechanism of action. 2. GENERIC ATOMS: For large carbon scaffolds (like rings), use '[#6]' or 'a'/'A' instead of rigid 'C' or 'c' to prevent aromaticity perception failures. When generating SMARTS strings for cyclic cores (like the hexahydronaphthalene decalin core in statins), use topology-first SMARTS. For example, a 6-6 fused bicyclic ring MUST be represented as [#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1 to match regardless of saturation or conjugation. Do not hardcode exact double bonds (=). PREVENT HIGHLIGHT COLLISION: If multiple rings exist, include distinguishing substituents (e.g., 'Fc1ccccc1', 'Clc1ccccc1'). NEVER include stereochemical @/@@ markers, explicit charges (+/-), or explicit hydrogens ([H]).",
    },
    purpose: { type: Type.STRING },
    casual_sar_explanation: {
      type: Type.STRING,
      description: "Brief, conversational, and intuitive explanation of how this specific group affects the drug's performance, pharmacokinetics, or binding. SANITIZE TOOLTIP EXPLANATIONS: The pharmacophore explanation/pop-up text (specifically 'casual_sar_explanation', 'description', and 'purpose') MUST NOT include raw SMILES strings, SMARTS patterns, or atomic notation; must be written in plain clinical/chemical English. Do not use overly dense jargon. Use plain language analogies (e.g., 'The fluorine atom increases lipophilicity, acting like grease so the drug easily crosses cell membranes' or 'This acidic tail mimics the body's natural substrate to trick and block the target enzyme').",
    },
    region: { type: Type.STRING, enum: ["Core Scaffold", "R-Group / Substituent", "Warhead", "Metabolic Site"] },
  },
  required: ["name", "smarts", "purpose", "casual_sar_explanation"],
};

const EnrichedStructureSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "Canonical ID matching entities array" },
    document_label: { type: Type.STRING, description: "Roman numeral assignment (I, II, III)" },
    name: { type: Type.STRING },
    canonicalSmiles: {
      type: Type.STRING,
      description: "Valid Daylight Canonical SMILES string for 2D structure rendering (e.g. 'CC(=O)OC1=CC=CC=C1C(=O)O' for Aspirin). You MUST provide a mathematically valid SMILES string for every drug or structure identified.",
    },
    pharmacophores: {
      type: Type.ARRAY,
      description: "CRITICAL: You MUST extract 3 to 5 specific pharmacophores for EVERY molecule. The pharmacophores array is strictly required.",
      items: PharmacophoreSchema,
    },
    moa_summary: { type: Type.STRING, description: "Strict 1-2 sentence concise summary" },
    drug_state: { type: Type.STRING, enum: ["Prodrug", "Active Drug"] },
    mw: { type: Type.NUMBER, description: "Estimated molecular weight in g/mol" },
    logP: { type: Type.NUMBER, description: "Estimated logP value" },
    source_slide_index: { type: Type.INTEGER },
  },
  required: ["id", "document_label", "name", "canonicalSmiles", "pharmacophores", "moa_summary", "drug_state", "source_slide_index"],
};

const QuestionSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.INTEGER, description: "Sequential question number (e.g., 1, 2, 3). Do NOT use database timestamps or numerical hashes." },
    title: { type: Type.STRING, description: "Sequential clean title e.g. 'Question 1', 'Question 2'. Do NOT use timestamps or raw hashes." },
    questionNumberLabel: { type: Type.STRING, description: "Sequential label e.g. 'Question 1', 'Question 2'. Do NOT output raw IDs or numerical hashes like 'Q1792716263554'." },
    category: { type: Type.STRING },
    questionStem: { type: Type.STRING, description: "Question stem transcribed verbatim with absolute clinical ground-truth drug names. Do not redact or substitute drug names with Structure I or Structure II." },
    type: { type: Type.STRING, enum: ["multiple-choice", "matching", "sub-statements", "ranking", "structural-workbench"] },
    options: { type: Type.ARRAY, items: { type: Type.STRING } },
    correctIndex: { type: Type.INTEGER },
    optionExplanations: { type: Type.ARRAY, items: { type: Type.STRING } },
    displayed_structure_entity_ids: { type: Type.ARRAY, items: { type: Type.STRING } },
    overallExplanation: { type: Type.STRING },
    highYieldPearl: { type: Type.STRING },
  },
  required: ["title", "category", "questionStem", "type", "overallExplanation", "highYieldPearl"],
};

export const MEDCHEM_INGESTION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    entities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: [...MEDCHEM_ENTITY_TYPES] },
          canonicalSmiles: { type: Type.STRING, description: "Valid Daylight Canonical SMILES string if drug or metabolite. Required for structure rendering." },
          pharmacophores: {
            type: Type.ARRAY,
            description: "Discrete pharmacophores and key functional groups present on this molecule. Required for all drugs.",
            items: PharmacophoreSchema,
          },
          source_slide_index: { type: Type.INTEGER },
          clinical_and_sar_summary: { type: Type.STRING },
        },
        required: ["id", "name", "type", "clinical_and_sar_summary", "source_slide_index"],
      },
    },
    relationships: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING },
          relation: { type: Type.STRING, enum: [...MEDCHEM_RELATIONS] },
          target: { type: Type.STRING },
          source_slide_index: { type: Type.INTEGER },
          sar_and_mechanism_context: { type: Type.STRING },
          theme_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["source", "relation", "target", "source_slide_index", "sar_and_mechanism_context"],
      },
    },
    structures: {
      type: Type.ARRAY,
      description: "Enriched 2D structure analysis",
      items: EnrichedStructureSchema,
    },
    question_blocks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source_slide_index: { type: Type.INTEGER },
          block_instructions: { type: Type.STRING },
          local_structures: { type: Type.ARRAY, items: EnrichedStructureSchema },
          questions: { type: Type.ARRAY, items: QuestionSchema },
        },
        required: ["source_slide_index", "local_structures", "questions"],
      },
    },
  },
  required: ["entities", "relationships", "structures", "question_blocks"],
};

export const MEDCHEM_INGESTION_RESPONSE_SCHEMA = MEDCHEM_INGESTION_SCHEMA;

export const SENIOR_CHEMINFORMATICS_ENGINE_SYSTEM_INSTRUCTION = `You are a Senior Cheminformatics Engine and Computational Molecular Architect specializing in structure-activity relationship (SAR) modeling, Daylight SMILES/SMARTS graph parsing, and automated medicinal chemistry knowledge extraction.

Your primary mission is to guarantee 100% topological precision and prevent SMARTS/SMILES array misalignments, invalid substructure queries, and chemical hallucinations.

================================================================================
CORE DIRECTIVE 1: STRICT SMARTS-TO-SMILES GRAPH ALIGNMENT & CANONICAL SMILES
================================================================================
1. MANDATORY CANONICAL SMILES: For every chemical entity or structure identified (in "entities", "structures", and "local_structures"), you MUST provide a mathematically valid Daylight Canonical SMILES string in the "canonicalSmiles" field. This string is strictly required to power RDKit WebAssembly 2D vector rendering. Never omit or output null/undefined for canonicalSmiles.
2. SUBSTRUCTURE EMBEDDING: Every SMARTS pattern specified in a structure's "pharmacophores" array MUST represent a topologically valid, verifiable substructure of that exact molecule's SMILES representation.
3. ZERO PHANTOM MOIETIES: Never assign a SMARTS pattern containing atoms, rings, or functional groups that do not physically exist in the parent chemical structure (e.g., never include a halogen, nitro, or sulfonamide SMARTS for an aliphatic ester).
4. 1-TO-1 ARRAY CONSISTENCY: Maintain strict 1-to-1 semantic alignment between "keyFunctionalGroups" and "pharmacophores". The sequence and medicinal chemistry descriptors must correspond directly.
5. REQUIRED EXACT SMARTS: Every pharmacophore MUST include a valid, highly specific SMARTS pattern string for RDKit 2D canvas highlighting.
   - TOPOLOGY OVER BONDS: Always use flexible bond indicators ('~' for any bond) or omit bond symbols entirely unless a specific bond order is the exact mechanism of action.
   - GENERIC ATOMS: For large carbon scaffolds (like rings), use '[#6]' or lowercase/uppercase 'a'/'A' (any aromatic/aliphatic atom) instead of rigid 'C' or 'c' to prevent aromaticity perception failures.
   - TOPOLOGY-FIRST CYCLIC CORES: When generating SMARTS strings for cyclic cores, use topology-first SMARTS. For example, a 6-6 fused bicyclic ring should be represented as [#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1 to match regardless of saturation or conjugation. Do not hardcode exact double bonds (=) unless it is explicitly required to identify the pharmacophore.
   - CRITICAL SMARTS ACCURACY: Do NOT hallucinate, oversimplify, or swap SMARTS strings. You must ensure the SMARTS string precisely matches ONLY the named functional group and will not accidentally match the drug's core scaffold or other appendages.
   - PREVENT HIGHLIGHT COLLISION: If a molecule has multiple aromatic rings, you MUST include the unique substituent in the SMARTS so the renderer highlights the correct ring (e.g., use 'Fc1ccccc1' for a fluorophenyl group, NOT just 'c1ccccc1'. Use 'Clc1ccccc1' for chlorophenyl).
   - NEVER include stereochemical directional markers ('@' or '@@'), explicit charges ('+' or '-'), or explicit hydrogens ('[H]').
   - SIMPLIFIED/TRUNCATED PATTERNS FOR COMPLEX CORES: You MUST keep SMARTS patterns as simple and truncated as possible. DO NOT attempt to explicitly map massive fused ring systems, steroid backbones, or entire macromolecules atom-by-atom. Instead, target the specific characteristic heteroatoms, a single defining ring, or use generic wildcard patterns (e.g., using \`*\` or simple ring queries). If the structure is too complex, provide the SMILES of just the functional group fragment.
   - For esters, amides, and side chains, specify the exact connectivity (e.g., \`[CX3](=[OX1])[OX2][CX4]\`).
   - If you write a generic or sloppy SMARTS string, the UI will highlight the wrong functional group and fail the student.

================================================================================
CORE DIRECTIVE 2: MEDICINAL CHEMISTRY NOMENCLATURE RIGOR
================================================================================
1. SPECIFIC FUNCTIONAL GROUPS: Always use precise IUPAC / medicinal chemistry terminology for functional groups and pharmacophores (e.g., "1,4-dihydropyridine ring", "2,3-dichlorophenyl group", "sulfonamide moiety", "carboxylate group", "tetrazole ring").
2. BANNED PLACEHOLDERS: ABSOLUTELY NEVER output generic placeholders such as "DRUG Core", "Main Scaffold", "Active Moiety", or "Generic Ring".
3. PHARMACOPHORE ROLES: For every pharmacophore entry, provide an exact pharmacodynamic, pharmacokinetic, or physicochemical role in "purpose" (e.g., "Primary hydrogen bond acceptor engaging catalytic residue Lys123", "Lipophilic anchor occupying hydrophobic subpocket S1").
4. CASUAL SAR EXPLANATION & TOOLTIP SANITIZATION: For each pharmacophore or functional group, provide a casual_sar_explanation. SANITIZE TOOLTIP EXPLANATIONS: The pharmacophore explanation/pop-up text (specifically "casual_sar_explanation", "description", and "purpose") MUST NOT include raw SMILES strings, SMARTS patterns, or atomic notation. It must be written in plain clinical/chemical English. This must be a brief, conversational, and intuitive explanation of how this specific group affects the drug's performance, pharmacokinetics, or binding. Do not use overly dense jargon. Use plain language analogies (e.g., 'The fluorine atom increases lipophilicity, acting like grease so the drug easily crosses cell membranes' or 'This acidic tail mimics the body's natural substrate to trick and block the target enzyme').

================================================================================
CORE DIRECTIVE 3: STRUCTURAL IDENTIFIER & QUESTION SYNCHRONIZATION
================================================================================
1. DOCUMENT LABEL PRESERVATION: For each chemical structure extracted or evaluated, retain its exact printed document label ("I", "II", "III", "IV", "Drug X").
2. SCOPED QUESTION ALIGNMENT: Ensure each question referencing chemical structures links directly and exclusively to the appropriate local structures via "referenced_structures" (e.g., ["I", "II"]).
3. IDENTITY REDACTION: Redact explicit drug trade and generic names inside question stems, replacing them with bracketed labels (e.g., "[Structure I]", "[Drug X]") to require students to deduce properties from chemical structure and SAR alone.
4. SEQUENTIAL QUESTION NUMBERING: Number questions sequentially and cleanly in the title and label (e.g. "Question 1", "Question 2"). ABSOLUTELY NEVER generate or output raw database IDs, timestamps, or numerical hashes (e.g., "Q1792716263554").

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
4. "structural_differences", "pk_pd_profile", "clinical_use_cases": Head-to-head contrast properties comparing the key structures.

================================================================================
HEAD-TO-HEAD DIFFERENTIAL MATRIX & "KEY PHARMACOPHORE & PK/PD CONTRAST" VIGNETTE:
================================================================================
When generating contrast or comparative data for question blocks or candidate drugs (e.g., "structural_differences", "pk_pd_profile", "clinical_use_cases", and the "Key Pharmacophore & PK/PD Contrast" vignette):
1. NO MARKDOWN HEADERS: ABSOLUTELY NEVER generate Markdown headers (such as "## Head-to-Head Differential Matrix", "### Contrast", or any "#" headers). Output pure, structured JSON keys without Markdown headings.
2. EXPLICITLY NAME BOTH DRUGS: When populating the "structural_differences", "pk_pd_profile", and "clinical_use_cases" JSON keys, you MUST explicitly name BOTH drugs being compared (e.g., "Ticagrelor features a cyclopentyl ring with an ether linkage, whereas Clopidogrel is built on a thienopyridine scaffold"). Never provide generic statements that omit either drug's name.
3. STRICT CLINICAL CONTRAST (NEGATIVE CONSTRAINT - MOA FORBIDDEN):
   - DO NOT summarize, describe, or re-explain the Mechanism of Action (MOA). MOA descriptions in this section are strictly forbidden.
   - This section must strictly contrast the therapeutic usage differences. You must focus exclusively on clinical decision-making: specific indications, contraindications, and patient-specific scenarios (e.g., organ impairment adjustments, side-effect profiles) that dictate why a clinician would choose Drug A over Drug B.
4. NEGATIVE CONSTRAINT ON HALF-LIFE: DO NOT write full sentences or conversational phrases in "elimination_half_life.value" (e.g., forbidden: "The half-life is approximately 14 hours in healthy patients"). You MUST strictly enforce a clean numerical value or hyphenated numeric range (e.g., '14' or '5-9'). Units must strictly be one of: "hours", "minutes", "days".

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
   - "cid": Raw numeric PubChem Compound ID (CID) (e.g., 60947, 9871419). You must extract and provide only the raw PubChem CID, canonical SMILES, and the exact pharmacophore SMARTS string. Do not construct or output any URLs.
   - "canonical_smiles": Valid raw Daylight Canonical SMILES string for 2D structure rendering (e.g., "CC(=O)OC1=CC=CC=C1C(=O)O" for Aspirin). Do not construct or output any URLs.
   - "pharmacophore_smarts": Exact pharmacophore SMARTS string representing the core active pharmacophore moiety of the drug. Do not construct or output any URLs.
   - "tradeName": Brand/trade name if known (e.g. "Aggrastat", "Brilinta", "Zetia").
   - "chemicalClass": Chemical scaffold class (e.g. "N-sulfonyl tyrosine-based peptidomimetic", "Triazolopyrimidine", "2-Azetidinone derivative").
   - "pharmacologicalClass": Pharmacological mechanism (e.g. "Glycoprotein IIb/IIIa inhibitor", "P2Y12 receptor antagonist", "NPC1L1 sterol transporter inhibitor").
   - "target_receptor": Exact biological target and binding pocket (e.g. "Glycoprotein IIb/IIIa (αIIbβ3) fibrinogen receptor", "P2Y12 ADP receptor (Allosteric site)", "Niemann-Pick C1-Like 1 (NPC1L1)").
   - "reversibility": Exact receptor binding kinetics: "Reversible" or "Irreversible".
   - "drug_state": Classify the molecule's drug_state strictly as 'Active Drug', 'Prodrug', 'Active Metabolite', or 'Inactive Metabolite'.
   - "route": Route of administration (e.g. "Oral", "IV Infusion", "Subcutaneous").
   - "keyFunctionalGroups": Key functional groups present (e.g. ["Carboxylic acid (-COOH)", "Piperidine 2° basic amine", "Butyl sulfonamide (-SO2-nBu)"]).
   - "pharmacophores": Array of discrete pharmacophore groups (aim for 3 to 5 specific groups per molecule).
     CRITICAL: You MUST use specific medicinal chemistry nomenclature for functional groups and pharmacophores (e.g., '1,4-dihydropyridine ring', 'butyryloxymethyl ester', 'ortho-chlorophenyl group'). ABSOLUTELY DO NOT use generic terms like 'DRUG Core', 'Main Scaffold', or 'Active Moiety'.
     For every pharmacophore identified, you MUST provide its valid, highly specific SMARTS pattern string so the frontend cheminformatics renderer can highlight the exact atoms on the 2D canvas.
     CRITICAL CHEMOINFORMATICS & SMARTS RENDERING RULES FOR RDKIT 2D HIGHLIGHTING:
     1. TOPOLOGY OVER BONDS: Always use flexible bond indicators ('~' for any bond) or omit bond symbols entirely unless a specific bond order is the exact mechanism of action.
     2. GENERIC ATOMS: For large carbon scaffolds (like rings), use '[#6]' or lowercase/uppercase 'a'/'A' (any aromatic/aliphatic atom) instead of rigid 'C' or 'c' to prevent aromaticity perception failures.
     3. CYCLIC CORES: When generating SMARTS strings for cyclic cores, use topology-first SMARTS. For example, a 6-6 fused bicyclic ring should be represented as [#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1 to match regardless of saturation or conjugation. Do not hardcode exact double bonds (=) unless it is explicitly required to identify the pharmacophore.
     4. PREVENT HIGHLIGHT COLLISION: If a molecule has multiple rings, you MUST include the unique substituent in the SMARTS so the renderer highlights the correct ring (e.g., use 'Fc1ccccc1' for a fluorophenyl group, NOT just 'c1ccccc1'. Use 'Clc1ccccc1' for chlorophenyl).
     5. NEVER include stereochemical directional markers ('@' or '@@'), explicit charges ('+' or '-'), or explicit hydrogens ('[H]').
     6. SIMPLIFIED/TRUNCATED PATTERNS FOR COMPLEX MACROMOLECULES & FUSED CORES: You MUST keep SMARTS patterns as simple and truncated as possible. DO NOT attempt to explicitly map massive fused ring systems, steroid backbones, or entire macromolecules atom-by-atom. Instead, target the specific characteristic heteroatoms, a single defining ring, or use generic wildcard patterns (e.g., using \`*\` or simple ring queries). If the structure is too complex, provide the SMILES of just the functional group fragment.
     Each item in "pharmacophores" MUST include:
     * "name": Specific medicinal chemistry nomenclature (e.g. "1,4-Dihydropyridine ring", "Butyryloxymethyl ester", "Ortho-chlorophenyl group"). NEVER use "DRUG Core", "Main Scaffold", or "Active Moiety".
     * "smarts": CRITICAL: Valid topology-first SMARTS pattern for RDKit 2D substructure highlighting that matches this exact functional group. You MUST keep SMARTS patterns as simple and truncated as possible. DO NOT attempt to explicitly map massive fused ring systems, steroid backbones, or entire macromolecules atom-by-atom. Instead, target the specific characteristic heteroatoms, a single defining ring, or use generic wildcard patterns (e.g., using '*' or simple ring queries). If the structure is too complex, provide the SMILES of just the functional group fragment. Always use flexible bond indicators ('~' for any bond) or omit bond symbols entirely unless a specific bond order is the exact mechanism of action. For large carbon scaffolds (like rings), use '[#6]' or 'a'/'A' instead of rigid 'C' or 'c' to prevent aromaticity perception failures. When generating SMARTS strings for cyclic cores, use topology-first SMARTS. For example, a 6-6 fused bicyclic ring should be represented as [#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1 to match regardless of saturation or conjugation. Do not hardcode exact double bonds (=) unless it is explicitly required to identify the pharmacophore. If multiple rings exist, include distinguishing substituents (e.g., 'Fc1ccccc1', 'Clc1ccccc1').
     * "description": A brief note on its purpose, receptor binding interaction, and functional contribution.
     * "id": Unique slug identifier (e.g. "dihydropyridine_ring", "butyryloxymethyl_ester", "ortho_chlorophenyl").
     * "purpose": Rigorous explanation of its molecular role, binding interaction (e.g. ionic salt bridge, RGD mimicry, hydrophobic pocket anchor), and functional contribution.
     * "casual_sar_explanation": Brief, conversational, and intuitive explanation of how this specific group affects the drug's performance, pharmacokinetics, or binding. SANITIZE TOOLTIP EXPLANATIONS: The pharmacophore explanation/pop-up text MUST NOT include raw SMILES strings, SMARTS patterns, or atomic notation. It must be written in plain clinical/chemical English. Do not use overly dense jargon. Use plain language analogies (e.g., 'The fluorine atom increases lipophilicity, acting like grease so the drug easily crosses cell membranes' or 'This acidic tail mimics the body's natural substrate to trick and block the target enzyme').
     * "category": "binding", "pk", "prodrug", "stability", or "solubility".
     * SANITIZE TOOLTIP EXPLANATIONS: The pharmacophore explanation/pop-up text (specifically "casual_sar_explanation", "description", and "purpose") MUST NOT include raw SMILES strings, SMARTS patterns, or atomic notation. It must be written in plain clinical/chemical English.
   - "pkPdHighlights": Object containing "onset", "duration", "halfLife", "elimination", "location_of_metabolism" (state only primary organ and mechanism e.g. "Hepatic via CYP3A4" or "Renal, mostly unchanged"), and optional "bioactivation".
   - "elimination_half_life": Object containing "value" and "unit". CRITICAL NEGATIVE CONSTRAINT: DO NOT write full sentences or prose in "value" (e.g., forbidden: "The half-life is 14 hours in adults"). Provide ONLY the numerical value or hyphenated numeric range (e.g., '14' or '5-9'). "unit" must strictly be one of: "hours", "minutes", "days".
   - "structural_differences": Head-to-head structural differences explicitly naming BOTH drugs. DO NOT use Markdown headers.
   - "pk_pd_profile": Head-to-head PK/PD profile comparison explicitly naming BOTH drugs. DO NOT use Markdown headers.
   - "clinical_use_cases": Head-to-head clinical use cases and therapeutic positioning explicitly naming BOTH drugs. DO NOT use Markdown headers. STRICT CLINICAL CONTRAST (NEGATIVE CONSTRAINT - MOA FORBIDDEN): DO NOT summarize, describe, or re-explain the Mechanism of Action (MOA). MOA descriptions in this section are strictly forbidden. This section must strictly contrast the therapeutic usage differences. You must focus exclusively on clinical decision-making: specific indications, contraindications, and patient-specific scenarios (e.g., organ impairment adjustments, side-effect profiles) that dictate why a clinician would choose Drug A over Drug B.
   - "moa_summary": Keep the MOA summary extremely concise and punchy (1-2 sentences maximum). Do not write giant walls of text. Describe its primary physiological target, how it interacts with that receptor/enzyme, and the resulting pharmacological/clinical effect. Instead of explaining the structural chemistry (SAR), you MUST write a highly accurate Mechanism of Action (MOA) summary for each drug, explaining exactly how it works physiologically to achieve its clinical effect.
   - "mw": Molecular weight in g/mol if explicitly stated on the slide/document.
   - "logP": LogP or XLogP value (lipophilicity) if explicitly stated on the slide/document.
3. CHEMICAL IDENTIFIER PURITY DIRECTIVE:
   You must extract and provide only the raw PubChem CID, canonical SMILES, and the exact pharmacophore SMARTS string. Do not construct or output any URLs.
4. 1-TO-1 ARRAY CONSISTENCY: Maintain strict 1-to-1 semantic alignment between "keyFunctionalGroups" and "pharmacophores".
5. REQUIRED EXACT SMARTS: Every pharmacophore MUST include a valid, highly specific SMARTS pattern string for RDKit 2D canvas highlighting.
   - TOPOLOGY OVER BONDS: Always use flexible bond indicators ('~' for any bond) or omit bond symbols entirely unless a specific bond order is the exact mechanism of action.
   - GENERIC ATOMS: For large carbon scaffolds (like rings), use '[#6]' or lowercase/uppercase 'a'/'A' (any aromatic/aliphatic atom) instead of rigid 'C' or 'c' to prevent aromaticity perception failures.
   - TOPOLOGY-FIRST CYCLIC CORES: When generating SMARTS strings for cyclic cores, use topology-first SMARTS. For example, a 6-6 fused bicyclic ring should be represented as [#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1 to match regardless of saturation or conjugation. Do not hardcode exact double bonds (=) unless it is explicitly required to identify the pharmacophore.
   - CRITICAL SMARTS ACCURACY: Do NOT hallucinate, oversimplify, or swap SMARTS strings. You must ensure the SMARTS string precisely matches ONLY the named functional group and will not accidentally match the drug's core scaffold or other appendages.
   - COMPLEX CORES & FUSED RINGS: You MUST keep SMARTS patterns as simple and truncated as possible. DO NOT attempt to explicitly map massive fused ring systems, steroid backbones, or entire macromolecules atom-by-atom. Instead, target the specific characteristic heteroatoms, a single defining ring, or use generic wildcard patterns (e.g., using \`*\` or simple ring queries). If the structure is too complex, provide the SMILES of just the functional group fragment.
   - For esters, amides, and side chains, specify the exact connectivity (e.g., '[CX3](=[OX1])[OX2][CX4]').
   - If you write a generic or sloppy SMARTS string, the UI will highlight the wrong functional group and fail the student.

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
13. ABSOLUTE CLINICAL GROUND TRUTH (ZERO REDACTION IN GENERATED TEXT):
    DO NOT redact, hide, or obfuscate the actual drug names in your generated text (e.g., MOA, metabolism pipeline, question stems, sub-statements, options). The frontend database requires the absolute clinical truth. Never substitute a drug name with 'Structure I' or 'Structure II' during data generation. Any exam masking is handled dynamically by the frontend UI at render time.
14. SEQUENTIAL QUESTION NUMBERING FIX:
    You must number questions sequentially and cleanly in the title/label (e.g., "Question 1", "Question 2"). Do NOT generate or display raw database IDs, timestamps, or numerical hashes (like "Q1792716263554").

Return valid JSON adhering strictly to the response schema containing "question_blocks".`;

export const MEDCHEM_VIGNETTE_SYSTEM_PROMPT = MEDCHEM_WORKSHEET_SYSTEM_PROMPT;

/**
 * Zod schemas for Head-to-Head Differential Matrix and MedChem Quiz Responses.
 */
export const EliminationHalfLifeZodSchema = z.object({
  value: z.string().regex(/^[\d.-]+$/, "Must be a number or numeric range"),
  unit: z.enum(["hours", "minutes", "days"]),
});

export const HeadToHeadDifferentialMatrixZodSchema = z.object({
  structural_differences: z.string(),
  pk_pd_profile: z.string(),
  clinical_use_cases: z.string(),
  elimination_half_life: EliminationHalfLifeZodSchema,
});

export const PharmacophoreZodSchema = z.object({
  name: z.string(),
  smarts: z.string(),
  description: z.string().optional(),
  id: z.string().optional(),
  purpose: z.string().optional(),
  casual_sar_explanation: z.string(),
  category: z.enum(['binding', 'pk', 'prodrug', 'stability', 'solubility']).optional(),
});

export const LocalStructureZodSchema = z.object({
  id: z.string(),
  document_label: z.string(),
  name: z.string(),
  cid: z.number(),
  canonical_smiles: z.string(),
  pharmacophore_smarts: z.string(),
  canonicalSmiles: z.string().optional(),
  tradeName: z.string().optional(),
  chemicalClass: z.string(),
  pharmacologicalClass: z.string(),
  target_receptor: z.string(),
  reversibility: z.enum(['Reversible', 'Irreversible']),
  drug_state: z.enum(['Active Drug', 'Prodrug', 'Active Metabolite', 'Inactive Metabolite']),
  route: z.string().optional(),
  keyFunctionalGroups: z.array(z.string()).optional(),
  pharmacophores: z.array(PharmacophoreZodSchema),
  pkPdHighlights: z
    .object({
      onset: z.string().optional(),
      duration: z.string().optional(),
      halfLife: z.string().optional(),
      elimination: z.string().optional(),
      location_of_metabolism: z.string().optional(),
      bioactivation: z.string().optional(),
    })
    .optional(),
  elimination_half_life: EliminationHalfLifeZodSchema.optional(),
  structural_differences: z.string().optional(),
  pk_pd_profile: z.string().optional(),
  clinical_use_cases: z.string().optional(),
  unique_differentiator: z.string().optional(),
  moa_summary: z.string(),
  mw: z.number().optional(),
  logP: z.number().optional(),
});

export const QuestionZodSchema = z.object({
  id: z.number(),
  questionNumberLabel: z.string().optional(),
  category: z.string(),
  type: z.enum(['matching', 'sub-statements', 'multiple-choice', 'ranking', 'structural-workbench']),
  questionStem: z.string(),
  blinded_structure_id: z.string().optional(),
  displayed_structure_entity_ids: z.array(z.string()).optional(),
  referenced_structures: z.array(z.string()).optional(),
  hide_drug_name_show_structure_for: z.string().optional(),
  matchingTargets: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        acceptedStructureIds: z.array(z.string()),
        rationale: z.string(),
      })
    )
    .optional(),
  draggable_items: z.array(z.string()).optional(),
  subStatements: z
    .array(
      z.object({
        id: z.string(),
        statement: z.string(),
        isCorrect: z.boolean(),
        rationale: z.string(),
        keyPharmacophore: z.string().optional(),
      })
    )
    .optional(),
  options: z.array(z.string()).optional(),
  correctIndex: z.number().optional(),
  optionExplanations: z.array(z.string()).optional(),
  rankingPrompt: z.string().optional(),
  rankingItems: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        correctRank: z.number(),
        rationale: z.string().optional(),
      })
    )
    .optional(),
  structuralWorkbench: z.any().optional(),
  overallExplanation: z.string(),
  highYieldPearl: z.string(),
  sourceReference: z.string().optional(),
});

export const QuestionBlockZodSchema = z.object({
  block_instructions: z.string().optional(),
  structural_differences: z.string(),
  pk_pd_profile: z.string(),
  clinical_use_cases: z.string(),
  local_structures: z.array(LocalStructureZodSchema),
  questions: z.array(QuestionZodSchema),
});

export const MedChemQuizResponseZodSchema = z.object({
  question_blocks: z.array(QuestionBlockZodSchema),
});

export const MEDCHEM_QUIZ_RESPONSE_SCHEMA_ZOD = MedChemQuizResponseZodSchema;

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
          structural_differences: {
            type: 'STRING',
            description: 'Head-to-head structural differences between the key drugs in this block. Must explicitly name BOTH drugs (e.g., "Ticagrelor features a cyclopentyl ring with an ether linkage, whereas Clopidogrel is built on a thienopyridine scaffold"). DO NOT use Markdown headers.',
          },
          pk_pd_profile: {
            type: 'STRING',
            description: 'Head-to-head pharmacokinetic and pharmacodynamic contrast between the key drugs in this block. Must explicitly name BOTH drugs (e.g., "Ticagrelor has a rapid onset with reversible binding, whereas Clopidogrel requires two-step CYP activation and binds irreversibly"). DO NOT use Markdown headers.',
          },
          clinical_use_cases: {
            type: 'STRING',
            description: 'Head-to-head clinical use cases and therapeutic positioning. Must explicitly name BOTH drugs (e.g., "Ticagrelor is preferred in acute coronary syndromes requiring rapid onset and offset, while Clopidogrel is standard for long-term maintenance"). DO NOT use Markdown headers. STRICT CLINICAL CONTRAST (NEGATIVE CONSTRAINT - MOA FORBIDDEN): DO NOT summarize, describe, or re-explain the Mechanism of Action (MOA). MOA descriptions in this section are strictly forbidden. This section must strictly contrast the therapeutic usage differences. You must focus exclusively on clinical decision-making: specific indications, contraindications, and patient-specific scenarios (e.g., organ impairment adjustments, side-effect profiles) that dictate why a clinician would choose Drug A over Drug B.',
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
                cid: {
                  type: 'INTEGER',
                  description: 'Raw PubChem Compound ID (CID) as a number. You must extract and provide only the raw PubChem CID, canonical SMILES, and the exact pharmacophore SMARTS string. Do not construct or output any URLs.',
                },
                canonical_smiles: {
                  type: 'STRING',
                  description: 'Raw Daylight Canonical SMILES string for 2D structure rendering (e.g., "CC(=O)OC1=CC=CC=C1C(=O)O" for Aspirin). Do not construct or output any URLs.',
                },
                pharmacophore_smarts: {
                  type: 'STRING',
                  description: 'Exact pharmacophore SMARTS string representing the core active pharmacophore moiety of the drug. Do not construct or output any URLs.',
                },
                canonicalSmiles: {
                  type: 'STRING',
                  description: 'Legacy alias for canonical_smiles.',
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
                        description: 'CRITICAL: Valid topology-first SMARTS pattern for RDKit 2D substructure highlighting that matches this exact functional group. You MUST keep SMARTS patterns as simple and truncated as possible. DO NOT attempt to explicitly map massive fused ring systems, steroid backbones, or entire macromolecules atom-by-atom. Instead, target the specific characteristic heteroatoms, a single defining ring, or use generic wildcard patterns (e.g., using "*" or simple ring queries). If the structure is too complex, provide the SMILES of just the functional group fragment. Always use flexible bond indicators ("~" for any bond) or omit bond symbols entirely unless a specific bond order is the exact mechanism of action. For large carbon scaffolds (like rings), use "[#6]" or "a"/"A" instead of rigid "C" or "c" to prevent aromaticity perception failures. When generating SMARTS strings for cyclic cores, use topology-first SMARTS. For example, a 6-6 fused bicyclic ring should be represented as [#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1 to match regardless of saturation or conjugation. Do not hardcode exact double bonds (=) unless it is explicitly required to identify the pharmacophore. PREVENT HIGHLIGHT COLLISION: If multiple rings exist, include distinguishing substituents (e.g., "Fc1ccccc1", "Clc1ccccc1"). NEVER include stereochemical @/@@ markers, explicit charges (+/-), or explicit hydrogens ([H]).',
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
                      casual_sar_explanation: {
                        type: 'STRING',
                        description: "For each pharmacophore or functional group, provide a casual_sar_explanation. SANITIZE TOOLTIP EXPLANATIONS: The pharmacophore explanation/pop-up text (specifically 'casual_sar_explanation', 'description', and 'purpose') MUST NOT include raw SMILES strings, SMARTS patterns, or atomic notation. It must be written in plain clinical/chemical English. This must be a brief, conversational, and intuitive explanation of how this specific group affects the drug's performance, pharmacokinetics, or binding. Do not use overly dense jargon. Use plain language analogies (e.g., 'The fluorine atom increases lipophilicity, acting like grease so the drug easily crosses cell membranes' or 'This acidic tail mimics the body's natural substrate to trick and block the target enzyme').",
                      },
                      category: {
                        type: 'STRING',
                        enum: ['binding', 'pk', 'prodrug', 'stability', 'solubility'],
                        description: 'Pharmacophore category: "binding", "pk", "prodrug", "stability", or "solubility".',
                      },
                    },
                    required: ['name', 'smarts', 'description', 'casual_sar_explanation'],
                  },
                },
                pkPdHighlights: {
                  type: 'OBJECT',
                  properties: {
                    onset: { type: 'STRING', description: 'Onset of action (e.g. "Rapid oral absorption", "Immediate upon IV infusion").' },
                    duration: { type: 'STRING', description: 'Duration of therapeutic effect.' },
                    halfLife: { type: 'STRING', description: 'Elimination half-life (t1/2).' },
                    elimination: { type: 'STRING', description: 'Primary route of elimination / metabolizing enzymes (e.g. "Hepatic CYP3A4", "Renal unchanged").' },
                    location_of_metabolism: { type: 'STRING', description: 'State only the primary organ and mechanism (e.g., "Hepatic via CYP3A4" or "Renal, mostly unchanged").' },
                    bioactivation: { type: 'STRING', description: 'Prodrug bioactivation pathway or active metabolite details (e.g. "Directly active", "CYP2C19 two-step oxidation to thiol metabolite").' },
                  },
                  required: ['onset', 'duration', 'halfLife', 'elimination'],
                },
                elimination_half_life: {
                  type: 'OBJECT',
                  properties: {
                    value: {
                      type: 'STRING',
                      description: 'Extract ONLY the numerical value or hyphenated numeric range for healthy adults (e.g., "14" or "5-9"). DO NOT include full sentences or explanatory words.',
                    },
                    unit: {
                      type: 'STRING',
                      enum: ['hours', 'minutes', 'days'],
                      description: 'Unit of time: "hours", "minutes", or "days".',
                    },
                  },
                  required: ['value', 'unit'],
                  description: 'Elimination half-life object with value and unit. Value must be strictly a number or numeric range (e.g., "14" or "5-9"). DO NOT use full sentences.',
                },
                structural_differences: {
                  type: 'STRING',
                  description: 'Head-to-head structural differences explicitly naming BOTH drugs. DO NOT use Markdown headers.',
                },
                pk_pd_profile: {
                  type: 'STRING',
                  description: 'Head-to-head PK/PD profile contrast explicitly naming BOTH drugs. DO NOT use Markdown headers.',
                },
                clinical_use_cases: {
                  type: 'STRING',
                  description: 'Head-to-head clinical use cases explicitly naming BOTH drugs. DO NOT use Markdown headers. STRICT CLINICAL CONTRAST (NEGATIVE CONSTRAINT - MOA FORBIDDEN): DO NOT summarize, describe, or re-explain the Mechanism of Action (MOA). MOA descriptions in this section are strictly forbidden. This section must strictly contrast the therapeutic usage differences. You must focus exclusively on clinical decision-making: specific indications, contraindications, and patient-specific scenarios (e.g., organ impairment adjustments, side-effect profiles) that dictate why a clinician would choose Drug A over Drug B.',
                },
                moa_summary: {
                  type: 'STRING',
                  description: "Keep the MOA summary extremely concise and punchy (1-2 sentences maximum). Do not write giant walls of text.",
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
                'cid',
                'canonical_smiles',
                'pharmacophore_smarts',
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
                  description: 'The exact sequential question number from the document (e.g., 1, 2, ... 25). Do NOT use database timestamps or numerical hashes.',
                },
                questionNumberLabel: {
                  type: 'STRING',
                  description: 'Exact clean sequential question label, e.g. "Question 1", "Question 2". ABSOLUTELY NEVER generate or output raw database IDs, timestamps, or numerical hashes (like "Q1792716263554").',
                },
                category: {
                  type: 'STRING',
                  description: 'Curriculum category or section heading from the document, e.g. "Classification", "Mechanism & Reversibility", "SAR Analysis".',
                },
                type: {
                  type: 'STRING',
                  enum: ['matching', 'sub-statements', 'multiple-choice', 'ranking', 'structural-workbench'],
                  description: 'Interactive question format: "matching" (drag-and-drop), "sub-statements" (True/False block), or "multiple-choice". CRITICAL CLASSIFICATION RULE: If a question asks to "identify", "match", or apply properties to MULTIPLE structures from the block (e.g., "What is the chemical class of the above active molecules?", "Match each structure to its target"), you MUST classify the question_type as "matching" (drag-and-drop). Do NOT classify it as "multiple_choice".',
                },
                questionStem: {
                  type: 'STRING',
                  description: 'The exact question stem extracted from the document. DO NOT redact, hide, or obfuscate the actual drug names in your generated text. The frontend database requires the absolute clinical truth. Never substitute a drug name with "Structure I" or "Structure II" during data generation.',
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
                  description: 'Verbatim multiple-choice choices copied directly from the worksheet. CRITICAL DIRECTIVE: When extracting options for any question, you MUST transcribe the exact, full text of the options as printed in the document (e.g., "Benzothiadiazine-1,1-dioxide", "Sulfonamide derivative", "Phenoxyacetic acid"). ABSOLUTELY NEVER output generic placeholders like "A", "B", "C", or "D". DO NOT redact, hide, or obfuscate actual drug names in options; the frontend handles exam masking dynamically at render time.',
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

/**
 * Strict JSON Schema for Gemini OpenFDA distillation into board-prep format.
 */
export const MEDCHEM_PAGE_EXTRACTION_SYSTEM_PROMPT = `${SENIOR_CHEMINFORMATICS_ENGINE_SYSTEM_INSTRUCTION}

You are an elite Professor of Medicinal Chemistry, Molecular Pharmacology, and Board Examination Author.
You are transcribing and digitizing a specific PAGE from a course review examination worksheet into a verified, high-fidelity ReviewPage JSON object.

================================================================================
CRITICAL DIRECTIVE 1: EXHAUSTIVE 100% VERBATIM QUESTION CAPTURE (ZERO OMISSION)
================================================================================
1. STRICT ZERO OMISSION: Extract EVERY SINGLE QUESTION that appears on this worksheet page. Do NOT sample. Do NOT summarize. Do NOT omit any question.
2. PRESERVE PRINTED QUESTION LABELS: Use the exact question number or label printed on the page (e.g., "1)", "2)", "3)", "4.1)", "4.2)", "18)", "19)", "Question 1") in "questionNumberLabel".
3. VERBATIM QUESTION STEMS: Transcribe the exact question text as printed into "questionStem". Do NOT rephrase or rewrite question stems.
4. FAITHFUL QUESTION FORMAT RECONSTRUCTION:
   a) "sub-statements": Questions instructing students to evaluate statements as True or False (e.g. "Consider the following chemical structures... and state whether each of the following statements is true or false: a) ... b) ... c) ...").
      - You MUST extract EVERY SINGLE STATEMENT (e.g. all statements 'a' through 'k'). Under NO circumstances should you stop after 2 or 3 statements.
      - For each item in "subStatements":
        * "id": Lowercase letter ("a", "b", "c", etc.)
        * "statement": Exact proposition text as printed
        * "isCorrect": true or false based on authoritative scientific reference
        * "rationale": In-depth medicinal chemistry explanation detailing why this statement is true or false, citing specific functional groups, CYP enzymes, receptor binding pockets, or PK parameters.
   b) "matching": Questions asking students to identify chemical classes, pharmacological targets, or properties for candidate structures (e.g. "What is the chemical class of each of the above agents?", "Which of the above drugs is an irreversible inhibitor?").
      - Populate "matchingTargets":
        * "id": Lowercase identifier ("a", "b", "c", etc.)
        * "label": The target prompt text (e.g., "L-arginine peptidomimetic direct thrombin inhibitor")
        * "acceptedStructureIds": Array of matching Roman numeral IDs (e.g., ["I"] or ["II", "IV"])
        * "rationale": Clear scientific reason for the match
   c) "multiple-choice": Traditional multiple-choice questions (e.g. options A through E).
      - Populate "options", "correctIndex" (0-based integer), and "optionExplanations" (detailed rationale for why each option is correct or incorrect).
   d) "ranking": Questions requiring students to order structures by onset, potency, half-life, or duration.
      - Populate "rankingPrompt" and "rankingItems".
   e) "structural-workbench": Multi-part structural interrogation questions asking students to encircle/identify bonds (e.g. amides), encircle prodrug promoieties, drag & drop functional group nature badges (e.g. ester vs carbamate), or select pharmacologically active 2D chemical structures.
      - Populate "structuralWorkbench" with "step2a_amides", "step2b_moieties", "step2c_nature", and "step2d_activeForm".

================================================================================
CRITICAL DIRECTIVE 2: LOCAL CHEMICAL STRUCTURES & PUBCHEM RECONSTRUCTION
================================================================================
1. EXTRACT ALL PAGE STRUCTURES: For every 2D chemical structure displayed or evaluated on this page, create an entry in "structures".
2. DOCUMENT LABEL PRESERVATION: Retain the exact Roman numeral label ("I", "II", "III", "IV", etc.) in both "id" and "document_label".
3. IF ALREADY INTRODUCED: If a structure on this page was already introduced on a previous page (provided in previous structures context), maintain its assigned Roman numeral and consistency.
4. RIGOROUS CHEMINFORMATICS DATA:
   - "name": Generic nonproprietary drug name (e.g. "Argatroban", "Dabigatran etexilate", "Rivaroxaban", "Warfarin")
   - "tradeName": Brand name (e.g. "Acova", "Pradaxa", "Xarelto", "Coumadin")
   - "chemicalClass": Specific chemical classification (e.g. "Tetrahydroquinoline / pipecolic acid peptidomimetic", "Benzimidazole / amidine prodrug", "Pentasaccharide glycosaminoglycan")
   - "pharmacologicalClass": Mechanistic class (e.g. "Direct thrombin (Factor IIa) inhibitor", "Direct Factor Xa inhibitor", "Indirect antithrombin-dependent Factor Xa inhibitor")
   - "cid": Standard NIH PubChem Compound ID (integer), or 0
   - "canonicalSmiles": Mathematically valid Daylight Canonical SMILES string
   - "target": Specific molecular target & amino acid binding residues (e.g. "Thrombin catalytic site Ser195 and S1 Asp189 pocket")
   - "reversibility": "Reversible" or "Irreversible"
   - "drug_state": "Active Drug" or "Prodrug"
   - "route": "Oral", "IV Infusion", etc.
   - "keyFunctionalGroups": Array of key functional groups (e.g. ["Guanidine basic moiety", "Sulfonamide group", "Carboxylic acid", "Tetrahydroquinoline core"])
   - "pharmacophores": Array of 3 to 5 discrete pharmacophores with topology-first SMARTS and conversational, plain-English "casual_sar_explanation" (no raw SMILES/SMARTS inside tooltip text).
   - "sarNotes": Comprehensive structure-activity relationship analysis.
   - "moa_summary": Concise 1-2 sentence physiological mechanism summary.

================================================================================
CRITICAL DIRECTIVE 3: SCIENTIFIC GROUNDING WITH AUTHORITATIVE REFERENCE
================================================================================
When authoritative lecture slides or monographs (Input 2) are provided:
1. Use them as the definitive ground truth for answer keys (determining whether sub-statements are true/false and which structures match).
2. Cite specific biochemical mechanisms, enzymes (e.g., CYP2C9, CYP3A4, esterases), amino acid residues, and clinical pearls in "overallExplanation" and "highYieldPearl".
3. DO NOT alter the worksheet's printed question text or propositions.

Output MUST strictly conform to the provided JSON schema.`;

export const MEDCHEM_PAGE_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    pageNumber: { type: Type.INTEGER, description: "1-based page number matching worksheet" },
    pageTitle: { type: Type.STRING, description: "Descriptive title for this page (e.g. 'Page 1: Direct Thrombin Inhibitor SAR & Classification')" },
    subtitle: { type: Type.STRING, description: "Subtitle listing structures and question topics" },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sectionTitle: { type: Type.STRING, description: "Section header or instruction" },
          headerNote: { type: Type.STRING, description: "Introductory context or prompt" },
          block_instructions: { type: Type.STRING, description: "Specific overarching instructions if present" },
          structures: {
            type: Type.ARRAY,
            description: "Chemical structures displayed or referenced on this page",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Roman numeral ID e.g. I, II, III" },
                document_label: { type: Type.STRING, description: "Printed label e.g. I, II, III" },
                name: { type: Type.STRING, description: "Generic drug name" },
                tradeName: { type: Type.STRING, description: "Brand name" },
                chemicalClass: { type: Type.STRING, description: "Chemical class" },
                pharmacologicalClass: { type: Type.STRING, description: "Pharmacological class" },
                cid: { type: Type.INTEGER, description: "NIH PubChem CID if known, else 0" },
                canonicalSmiles: { type: Type.STRING, description: "Valid Daylight Canonical SMILES string" },
                target: { type: Type.STRING, description: "Biological target" },
                reversibility: { type: Type.STRING, description: "Reversible or Irreversible" },
                drug_state: { type: Type.STRING, description: "Active Drug or Prodrug" },
                route: { type: Type.STRING, description: "Administration route" },
                keyFunctionalGroups: { type: Type.ARRAY, items: { type: Type.STRING } },
                pharmacophores: {
                  type: Type.ARRAY,
                  items: PharmacophoreSchema,
                },
                pkPdHighlights: {
                  type: Type.OBJECT,
                  properties: {
                    onset: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    halfLife: { type: Type.STRING },
                    elimination: { type: Type.STRING },
                    bioactivation: { type: Type.STRING },
                  },
                },
                sarNotes: { type: Type.STRING, description: "Detailed SAR explanation" },
                moa_summary: { type: Type.STRING, description: "1-2 sentence mechanism of action summary" },
              },
              required: ["id", "name", "chemicalClass", "pharmacologicalClass", "canonicalSmiles", "target", "reversibility", "keyFunctionalGroups", "pharmacophores", "sarNotes", "moa_summary"],
            },
          },
          questions: {
            type: Type.ARRAY,
            description: "All examination questions on this page",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER, description: "Sequential integer ID e.g. 1, 2, 3" },
                questionNumberLabel: { type: Type.STRING, description: "Exact label as printed e.g. '1)', '18)', '4.1)', 'Question 1'" },
                category: { type: Type.STRING, description: "Classification, Mechanism, SAR, PK/PD, etc." },
                questionStem: { type: Type.STRING, description: "Verbatim question text from worksheet" },
                type: { type: Type.STRING, enum: ["multiple-choice", "sub-statements", "matching", "ranking", "structural-workbench"] },
                structuralWorkbench: {
                  type: Type.OBJECT,
                  description: "Rich structural workbench data for multi-step medicinal chemistry analysis (encircling amides, prodrug moieties, assigning group natures, and selecting active forms)",
                  properties: {
                    stemStructure: {
                      type: Type.OBJECT,
                      description: "The parent chemical structure being interrogated",
                      properties: {
                        name: { type: Type.STRING },
                        canonicalSmiles: { type: Type.STRING },
                      },
                    },
                    step2a_amides: {
                      type: Type.OBJECT,
                      properties: {
                        prompt: { type: Type.STRING },
                        halos: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              id: { type: Type.STRING },
                              label: { type: Type.STRING },
                              isCorrect: { type: Type.BOOLEAN },
                              rationale: { type: Type.STRING },
                            },
                            required: ["id", "label", "isCorrect", "rationale"],
                          },
                        },
                      },
                      required: ["prompt", "halos"],
                    },
                    step2b_moieties: {
                      type: Type.OBJECT,
                      properties: {
                        prompt: { type: Type.STRING },
                        halos: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              id: { type: Type.STRING },
                              label: { type: Type.STRING },
                              isCorrect: { type: Type.BOOLEAN },
                              rationale: { type: Type.STRING },
                            },
                            required: ["id", "label", "isCorrect", "rationale"],
                          },
                        },
                      },
                      required: ["prompt", "halos"],
                    },
                    step2c_nature: {
                      type: Type.OBJECT,
                      properties: {
                        prompt: { type: Type.STRING },
                        dropZones: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              id: { type: Type.STRING },
                              label: { type: Type.STRING },
                              expectedBadge: { type: Type.STRING },
                              rationale: { type: Type.STRING },
                            },
                            required: ["id", "label", "expectedBadge", "rationale"],
                          },
                        },
                        availableBadges: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ["prompt", "dropZones", "availableBadges"],
                    },
                    step2d_activeForm: {
                      type: Type.OBJECT,
                      properties: {
                        prompt: { type: Type.STRING },
                        correctCandidateId: { type: Type.STRING },
                        candidates: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              id: { type: Type.STRING },
                              label: { type: Type.STRING },
                              title: { type: Type.STRING },
                              smiles: { type: Type.STRING },
                              rationale: { type: Type.STRING },
                            },
                            required: ["id", "label", "title", "smiles", "rationale"],
                          },
                        },
                      },
                      required: ["prompt", "correctCandidateId", "candidates"],
                    },
                  },
                },
                matchingTargets: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING, description: "Target letter e.g. a, b, c" },
                      label: { type: Type.STRING, description: "Matching prompt text" },
                      acceptedStructureIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Accepted Roman numerals e.g. ['I']" },
                      rationale: { type: Type.STRING, description: "Why this structure matches" },
                    },
                    required: ["id", "label", "acceptedStructureIds", "rationale"],
                  },
                },
                subStatements: {
                  type: Type.ARRAY,
                  description: "True/False propositions (a through k) evaluated for this question",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING, description: "Statement letter e.g. a, b, c... k" },
                      statement: { type: Type.STRING, description: "Exact statement text as printed" },
                      isCorrect: { type: Type.BOOLEAN, description: "True or False" },
                      rationale: { type: Type.STRING, description: "In-depth scientific rationale" },
                    },
                    required: ["id", "statement", "isCorrect", "rationale"],
                  },
                },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                optionExplanations: { type: Type.ARRAY, items: { type: Type.STRING } },
                rankingPrompt: { type: Type.STRING },
                rankingItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      label: { type: Type.STRING },
                      correctRank: { type: Type.INTEGER },
                      rationale: { type: Type.STRING },
                    },
                    required: ["id", "label", "correctRank"],
                  },
                },
                overallExplanation: { type: Type.STRING, description: "Comprehensive medicinal chemistry explanation" },
                highYieldPearl: { type: Type.STRING, description: "Clinical/board exam pearl" },
                sourceReference: { type: Type.STRING, description: "Page and question citation e.g. 'Page 1, Q1'" },
                referenced_structures: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["id", "questionNumberLabel", "category", "questionStem", "type", "overallExplanation", "highYieldPearl", "sourceReference"],
            },
          },
        },
        required: ["structures", "questions"],
      },
    },
  },
  required: ["pageNumber", "pageTitle", "subtitle", "sections"],
};

export const FDA_TRANSFORMATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    route_of_administration: {
      type: Type.STRING,
      description: "Route of administration (e.g., Oral, Intravenous, Subcutaneous, Inhalation).",
    },
    reversibility: {
      type: Type.STRING,
      description: "Enzyme or receptor binding reversibility (e.g., Reversible competitive, Irreversible, Reversible allosteric). If omitted in FDA text, infer from base pharmacological training.",
    },
    elimination_half_life: {
      type: Type.OBJECT,
      properties: {
        value: {
          type: Type.STRING,
          description: "Extract ONLY the time range for healthy adults (e.g., '5-9' or '14'). Strictly exclude data for elderly populations, special populations, or any explanatory text.",
        },
        unit: {
          type: Type.STRING,
          description: "Unit of time (e.g., 'hours', 'minutes', 'days').",
        },
      },
      required: ["value", "unit"],
      description: "Extract ONLY the time range for healthy adults (e.g., '5-9 hours'). Strictly exclude data for elderly populations, special populations, or any explanatory text.",
    },
    metabolism_pathway: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Extract the metabolism pathway as an array of chronological steps. You MUST use the exact format `[Location] {State/Action}` for every single array item. DO NOT output standard sentences or explanations. Example: `[\"[Mouth] {inactive}\", \"[Stomach] {active}\", \"[Liver] {deactivating via CYP3A4}\", \"[Kidneys] {excreted}\"]`. Failure to use brackets and braces will break the UI layout.",
    },
    unique_differentiator: {
      type: Type.STRING,
      description: "Explain the therapeutic difference in clinical use and the decision to prescribe this drug over competitors. You MUST explicitly contrast its half-life, potency, or toxicity profile against its class (e.g., 'Preferred for once-daily dosing due to a longer half-life, but carries a higher risk of hepatotoxicity'). Do not just describe the structure; explain why a pharmacist would choose it.",
    },
    structural_differences: {
      type: Type.STRING,
      description: "Head-to-head structural differences between the drug and its class competitors. Explicitly name BOTH this drug and its primary comparator. DO NOT use Markdown headers.",
    },
    pk_pd_profile: {
      type: Type.STRING,
      description: "Head-to-head PK/PD profile comparison explicitly naming this drug and its primary comparator. DO NOT use Markdown headers.",
    },
    clinical_use_cases: {
      type: Type.STRING,
      description: "Head-to-head clinical use cases and indications explicitly naming this drug and its primary comparator. DO NOT use Markdown headers. STRICT CLINICAL CONTRAST (NEGATIVE CONSTRAINT - MOA FORBIDDEN): DO NOT summarize, describe, or re-explain the Mechanism of Action (MOA). MOA descriptions in this section are strictly forbidden. This section must strictly contrast the therapeutic usage differences. You must focus exclusively on clinical decision-making: specific indications, contraindications, and patient-specific scenarios (e.g., organ impairment adjustments, side-effect profiles) that dictate why a clinician would choose Drug A over Drug B.",
    },
    mechanism_of_action: {
      type: Type.STRING,
      description: "Ultra-concise mechanism of action summary (1-2 sentences maximum).",
    },
    adverse_reactions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Maximum 4 concise, high-yield adverse reaction terms (e.g., 'Myopathy', 'Hepatotoxicity', 'Bleeding').",
    },
  },
  required: [
    "route_of_administration",
    "reversibility",
    "elimination_half_life",
    "metabolism_pathway",
    "unique_differentiator",
    "mechanism_of_action",
    "adverse_reactions",
  ],
};

/**
 * Strict system prompt for LLM Transformation Layer processing raw FDA package insert text.
 */
export const FDA_TRANSFORMATION_SYSTEM_PROMPT = `You are an expert clinical pharmacist. I will provide raw FDA package insert text for a drug. Distill this into highly concise, board-prep style data. Extract the route of administration. Identify if the enzyme binding is reversible or irreversible. For 'metabolism_pathway', you MUST use the exact format \`[Location] {State/Action}\` for every single array item. DO NOT output standard sentences or explanations. Example: \`["[Mouth] {inactive}", "[Stomach] {active}", "[Liver] {deactivating via CYP3A4}", "[Kidneys] {excreted}"]\`. Failure to use brackets and braces will break the UI layout. For 'elimination_half_life', provide an object with 'value' and 'unit'. Extract ONLY the time range for healthy adults (e.g., '5-9' or '14'). CRITICAL NEGATIVE CONSTRAINT: DO NOT write full sentences or prose in 'value' (e.g. forbidden: 'The half-life is 14 hours in adults'). Strictly enforce a numerical value or hyphenated range (e.g., '14' or '5-9'). For 'unique_differentiator', explain the therapeutic difference in clinical use and the decision to prescribe this drug over competitors. You MUST explicitly contrast its half-life, potency, or toxicity profile against its class (e.g., 'Preferred for once-daily dosing due to a longer half-life, but carries a higher risk of hepatotoxicity'). Do not just describe the structure; explain why a pharmacist would choose it. For contrast fields ('structural_differences', 'pk_pd_profile', 'clinical_use_cases'), ABSOLUTELY NEVER use Markdown headers (e.g., do NOT output '## Head-to-Head Differential Matrix'), and explicitly name BOTH drugs being contrasted. Summarize mechanism and adverse effects in ultra-short bullet points.
If the FDA text omits 'reversibility', 'elimination_half_life', or 'metabolism_pathway', rely on your base pharmacological training to accurately fill in those specific fields (e.g., identifying statins as reversible competitive inhibitors, hepatic via CYP3A4, etc.).
Output strictly valid JSON adhering to the schema.`;

/**
 * Builds user prompt for FDA package insert distillation.
 */
export function buildFdaTransformationPrompt(drugName: string, rawFdaText: string): string {
  return `Drug: ${drugName}

Raw FDA Package Insert Text:
${rawFdaText || `(No direct FDA package insert available for ${drugName}. Rely on base pharmacological training to extract concise clinical data)`}

Distill the raw FDA text into the required concise JSON schema.
- For route_of_administration: state only the primary route (e.g., 'Oral', 'Intravenous'). Required.
- For reversibility: state if enzyme/receptor binding is reversible or irreversible. If omitted, infer from base pharmacological training. Required.
- For metabolism_pathway: you MUST use the exact format \`[Location] {State/Action}\` for every single array item. DO NOT output standard sentences or explanations. Example: \`["[Mouth] {inactive}", "[Stomach] {active}", "[Liver] {deactivating via CYP3A4}", "[Kidneys] {excreted}"]\`. Failure to use brackets and braces will break the UI layout. Required.
- For elimination_half_life: provide an object with 'value' and 'unit'. Extract ONLY the time range for healthy adults (e.g., '5-9' or '14'). DO NOT write full sentences in 'value'; strictly provide only a numerical value or hyphenated numeric range (e.g. '14' or '5-9'). Units must be 'hours', 'minutes', or 'days'. Required.
- For unique_differentiator: explain the therapeutic difference in clinical use and the decision to prescribe this drug over competitors. You MUST explicitly contrast its half-life, potency, or toxicity profile against its class (e.g., 'Preferred for once-daily dosing due to a longer half-life, but carries a higher risk of hepatotoxicity'). Do not just describe the structure; explain why a pharmacist would choose it. Required.
- For structural_differences, pk_pd_profile, clinical_use_cases: do NOT use Markdown headers. Explicitly name BOTH drugs being compared.
- Summarize mechanism_of_action and adverse_reactions in concise bullet points.`;
}

