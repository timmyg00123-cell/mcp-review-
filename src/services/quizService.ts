import {
  MEDCHEM_VIGNETTE_SYSTEM_PROMPT,
  MEDCHEM_WORKSHEET_SYSTEM_PROMPT,
  MEDCHEM_QUIZ_RESPONSE_SCHEMA,
} from './geminiPrompts';
import {
  getTwoHopMedChemSubgraph,
  formatSubgraphForRag,
  MedChemSubgraph,
} from './graphRetrieval';
import {
  AntiplateletQuestion,
  ChemicalStructure,
  MatchingTarget,
  SubStatement,
  QuestionBlock,
} from '../types/reviewModule';
import { GraphEntity, GraphRelationship, seedDefaultKnowledgeGraph } from '../db/medChemGraphDb';
import { enrichEntityInDexie, isNonCompoundEntity } from './pubchemService';
import {
  sortStructuresByDocumentLabel,
  getStructureDocumentLabel,
  parseDocumentLabelRank,
  cleanSingleParagraphSar,
  filterValidPharmacophores,
} from '../utils/documentLabel';

export interface GenerateMedChemQuizOptions {
  /** The seed drug, enzyme, or concept to retrieve the 2-hop subgraph for */
  seedEntityOrQuery?: string;
  /** Explicit drug ID whose structure will be displayed and/or blinded (optional) */
  targetDrugId?: string;
  /** Optional custom clinical instructions or topic emphasis */
  customInstructions?: string;
  /** Whether the drug name should be blinded for structure deduction */
  blindDrugName?: boolean;
  /** Explicit list of canonical ChemicalStructures with Roman numeral IDs (I, II, III...) */
  structures?: ChemicalStructure[];
  /** Entities directly extracted from lecture slide or uploaded image */
  extractedEntities?: GraphEntity[];
  /** Relationships directly extracted from lecture slide or uploaded image */
  extractedRelationships?: GraphRelationship[];
  /** Raw slide text or document description */
  rawContext?: string;
  /** Multimodal image payload for visual structure deduction */
  inlineData?: {
    mimeType: string;
    data: string; // Base64
  };
  /** Array of multimodal image payloads or Base64 strings for visual structure inspection */
  images?: string[] | { mimeType: string; data: string }[];
  /** Number of questions to generate (default 1) */
  questionCount?: number;
  /** Optional AbortSignal to cancel in-flight quiz generation requests */
  signal?: AbortSignal;
}

/**
 * Generates high-yield worksheet-style examination reviews modeled on the "Review for Antiplatelets" curriculum,
 * supporting drag-and-drop structure matching and True/False SAR statement analysis.
 */
export async function generateMedChemQuiz(
  options: GenerateMedChemQuizOptions = {}
): Promise<AntiplateletQuestion[]> {
  await seedDefaultKnowledgeGraph();

  // 1. Resolve seed entity
  let seed = (options.seedEntityOrQuery || '').trim().toLowerCase();
  if (!seed && options.extractedEntities && options.extractedEntities.length > 0) {
    const firstDrug =
      options.extractedEntities.find(
        (e) =>
          (e.type === 'DRUG' || e.type === 'METABOLITE') &&
          !isNonCompoundEntity(e.id) &&
          !isNonCompoundEntity(e.name || '')
      ) || options.extractedEntities[0];
    seed = firstDrug.id;
  }
  if (!seed) seed = 'clopidogrel';

  // 2. Retrieve 2-hop MedChem subgraph from IndexedDB (Dexie)
  const subgraph: MedChemSubgraph = await getTwoHopMedChemSubgraph(seed);

  // 3. Determine target drug for question focus
  let targetDrugId = options.targetDrugId?.trim().toLowerCase();
  if (!targetDrugId) {
    const extractedDrug = options.extractedEntities?.find(
      (e) =>
        (e.type === 'DRUG' || e.type === 'METABOLITE') &&
        !isNonCompoundEntity(e.id) &&
        !isNonCompoundEntity(e.name || '')
    );
    if (extractedDrug) {
      targetDrugId = extractedDrug.id;
    } else {
      const subgraphDrug =
        subgraph.entities.find(
          (e) =>
            (e.id === seed || e.type === 'DRUG' || e.type === 'METABOLITE') &&
            !isNonCompoundEntity(e.id) &&
            !isNonCompoundEntity(e.name || '')
        ) || subgraph.entities[0];
      targetDrugId = subgraphDrug ? subgraphDrug.id : seed;
    }
  }

  // Pre-enrich target drug structure in Dexie if not yet cached
  if (targetDrugId) {
    try {
      await enrichEntityInDexie(targetDrugId);
    } catch (enrichErr) {
      console.warn(`Could not pre-enrich structure for ${targetDrugId}:`, enrichErr);
    }
  }

  // 4. Resolve candidate chemical structures with Roman numerals (I, II, III...)
  const romanNumerals = [
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'
  ];

  let candidateStructures: ChemicalStructure[] =
    options.structures && options.structures.length > 0
      ? options.structures
      : (options.extractedEntities || [])
          .filter((e) => (e.type === 'DRUG' || e.type === 'METABOLITE') && !isNonCompoundEntity(e.id) && !isNonCompoundEntity(e.name || ''))
          .map((e, idx): ChemicalStructure => {
            const rawLabel = (e as any).document_label || (e as any).label || romanNumerals[idx] || `${idx + 1}`;
            return {
              id: rawLabel,
              document_label: rawLabel,
              name: e.name || e.id,
              chemicalClass: e.clinical_and_sar_summary || 'Small molecule compound',
              pharmacologicalClass: 'Pharmacological Agent',
              cid: e.chemData?.cid,
              pngUrl:
                e.chemData?.structureImageDataUrl ||
                (e.chemData?.cid
                  ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${e.chemData.cid}/PNG?image_size=large`
                  : ''),
              pubchemUrl: e.chemData?.cid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${e.chemData.cid}` : undefined,
              target: 'Biological Target',
              reversibility: 'Reversible',
              route: 'Oral',
              keyFunctionalGroups: [],
              pkPdHighlights: { onset: 'N/A', duration: 'N/A', halfLife: 'N/A', elimination: 'N/A' },
              sarNotes: e.clinical_and_sar_summary || '',
              pubchemAudit: {
                cid: e.chemData?.cid || 0,
                status: e.chemData?.cid ? 'verified' : 'unresolved',
                verifiedAt: new Date().toISOString(),
                source: 'nih_pug_rest',
                canonicalSmiles: e.chemData?.isomericSmiles,
                pubChemUrl: e.chemData?.cid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${e.chemData.cid}` : '',
              },
            };
          });

  // Fallback if no candidate structures found at all
  if (candidateStructures.length === 0 && targetDrugId) {
    candidateStructures.push({
      id: 'I',
      document_label: 'I',
      name: targetDrugId.charAt(0).toUpperCase() + targetDrugId.slice(1),
      chemicalClass: 'Pharmaceutical agent',
      pharmacologicalClass: 'Target inhibitor',
      pngUrl: '',
      pubchemAudit: {
        cid: 0,
        status: 'unresolved',
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        pubChemUrl: '',
      },
      target: 'Target receptor',
      reversibility: 'Reversible',
      route: 'Oral',
      keyFunctionalGroups: [],
      pkPdHighlights: { onset: 'N/A', duration: 'N/A', halfLife: 'N/A', elimination: 'N/A' },
      sarNotes: 'Pharmacophore and SAR analysis.',
    });
  }

  // 5. Build rich graph context
  let graphContext = formatSubgraphForRag(subgraph);

  if (options.extractedEntities && options.extractedEntities.length > 0) {
    const entityLines = options.extractedEntities.map(
      (e) =>
        `- ${e.name || e.id} [${e.type}]: ${e.clinical_and_sar_summary || 'No summary'}${
          e.chemData?.isomericSmiles ? ` (SMILES: ${e.chemData.isomericSmiles})` : ''
        }${e.chemData?.molecularWeight ? ` (MW: ${e.chemData.molecularWeight})` : ''}`
    );
    graphContext += `\n\n### Directly Extracted Chemical Entities:\n${entityLines.join('\n')}`;
  }

  if (options.extractedRelationships && options.extractedRelationships.length > 0) {
    const relLines = options.extractedRelationships.map(
      (r) =>
        `- (${r.source}) --[${r.relation}]--> (${r.target}): ${r.sar_and_mechanism_context} [${r.theme_keywords?.join(', ')}]`
    );
    graphContext += `\n\n### Directly Extracted Relationships:\n${relLines.join('\n')}`;
  }

  if (options.rawContext) {
    graphContext += `\n\n### Raw Source Slide / Document Context:\n${options.rawContext}`;
  }

  // 6. Format structures list for the Gemini prompt with assigned Roman numerals
  const structuresListPrompt = candidateStructures
    .map(
      (s) =>
        `- Structure ${s.id}: "${s.name}"${s.tradeName ? ` (${s.tradeName})` : ''}${
          s.chemicalClass ? ` [Chemical Class: ${s.chemicalClass}]` : ''
        }${s.pharmacologicalClass ? ` [Pharmacological Class / Target: ${s.pharmacologicalClass}]` : ''}${
          s.reversibility ? ` [Reversibility: ${s.reversibility}]` : ''
        }${s.moa_summary || s.sarNotes ? ` [MOA Summary: ${(s.moa_summary || s.sarNotes).slice(0, 160)}]` : ''}`
    )
    .join('\n');

  // 7. Construct verbatim extraction directive for worksheet digitization
  const userPrompt = `Extract and digitize the exact questions verbatim from the provided document (text and/or image).
DO NOT invent, summarize, or alter the questions. Find the numbered questions (e.g., 1 through 25) in the text/images and copy them exactly as written into the JSON schema.

Document Chemical Structures Reference:
${structuresListPrompt || 'Extract any Roman numeral structures (I, II, III, IV, V, VI, VII, VIII, IX, X) or placeholder structures (Drug X, Drug Y, Drug Z) present in the source.'}

${graphContext ? `Knowledge Graph Grounded Evidence:\n${graphContext}\n` : ''}
${options.customInstructions ? `Additional Worksheet Guidance: ${options.customInstructions}\n` : ''}

CRITICAL EXTRACTION DIRECTIVES:
1. SCOPED QUESTION BLOCKS (ISOLATED LOCAL STRUCTURE BANKS):
   - Group the extracted content into discrete blocks based on the document's structure (e.g., when the document says 'Consider the following structures for questions X-Y').
   - Ensure that the structures referenced in a block are strictly isolated to that block's "local_structures" array so Roman numerals do not collide across different sections of the document.
   - Each question block must contain:
     * "block_instructions": The overarching text (e.g., "Consider the following chemical structures to answer questions 15-16:").
     * "local_structures": The specific structures displayed for this section, with their local document_label (e.g., I, II, III).
     * "questions": The specific questions tied to this block.

2. PHARMACOPHORE SMARTS & CHEMICAL SPECIFICITY:
   - For every pharmacophore identified, you MUST provide its valid SMARTS pattern string so the frontend cheminformatics renderer can highlight the exact atoms on the 2D canvas.
   - You MUST use specific medicinal chemistry nomenclature for functional groups (e.g., '1,4-dihydropyridine ring', 'butyryloxymethyl ester', 'ortho-chlorophenyl group'). ABSOLUTELY DO NOT use generic terms like 'DRUG Core', 'Main Scaffold', or 'Active Moiety'.

3. STRICT TYPE CLASSIFICATION FOR MATCHING QUESTIONS:
   - If a question asks to 'identify', 'match', or apply properties to MULTIPLE structures from the block (e.g., 'What is the chemical class of the above active molecules?', 'Match each structure to its target class'), you MUST classify the "type" as "matching" (drag-and-drop). Do NOT classify it as "multiple_choice".
   - For every "matching" question, populate "matchingTargets" with the target bins printed on the page and "acceptedStructureIds" with the matching Roman numerals.

4. BAN PLACEHOLDER HALLUCINATIONS (VERBATIM OPTIONS ONLY):
   - When extracting options for any question, you MUST transcribe the exact, full text of the options as printed in the document (e.g., 'Benzothiadiazine-1,1-dioxide', 'Sulfonamide derivative').
   - ABSOLUTELY NEVER output generic placeholders like 'A', 'B', 'C', or 'D'.

5. CAPTURE ALL ROMAN NUMERALS (UP TO X) & PLACEHOLDER STRUCTURES:
   - Scan for all Roman numeral structures present in the document (I, II, III, IV, V, VI, VII, VIII, IX, X) as well as named placeholder structures (e.g., Drug X, Drug Y, Drug Z, Compound X, Compound Y).
   - In each block, capture all local candidate molecules into "local_structures" and associate each question with the exact Roman numerals or placeholder names it references.
   - Do NOT impose any arbitrary limit on the number of structures or questions extracted per page. Extract EVERY question and EVERY structure present on the page.

6. LINK QUESTIONS TO REFERENCED STRUCTURES:
   - For every question extracted, analyze the text and determine which chemical structures are being referenced. Populate the "referenced_structures" array with their exact document labels (e.g., ["I", "II", "Drug X"]) matching the block's local_structures.

7. Output valid JSON matching the response schema with the "question_blocks" array.`;

  // 8. Send payload to Gemini backend
  let data: any;
  try {
    const response = await fetch('/api/gemini/graphrag-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: options.signal,
      body: JSON.stringify({
        contents: userPrompt,
        system_instruction: MEDCHEM_WORKSHEET_SYSTEM_PROMPT,
        generationConfig: {
          responseSchema: MEDCHEM_QUIZ_RESPONSE_SCHEMA,
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
        targetDrugId,
        graphContext,
        rawContext: options.rawContext,
        inlineData: options.inlineData,
        images: options.images || (options.inlineData?.data ? [options.inlineData.data] : undefined),
        extractedEntities: options.extractedEntities,
        extractedRelationships: options.extractedRelationships,
        query: `Verbatim worksheet extraction for ${candidateStructures.map((s) => s.name).join(', ')}`,
      }),
    });

    if (!response.ok) {
      let errData: any = {};
      try {
        errData = await response.json();
      } catch {
        // ignore parse error
      }
      const errObj: any = new Error(
        errData?.error || errData?.message || `Gemini quiz generation failed with HTTP ${response.status}`
      );
      errObj.response = { data: errData };
      throw errObj;
    }

    data = await response.json();
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Quiz generation network request failed';
    throw new Error(`Quiz generation failed: ${errorMessage}`);
  }

  const normalizeToRomanOrPlaceholder = (val?: string | null): string | undefined => {
    if (!val) return undefined;
    const trimmed = String(val).trim();
    if (/^(drug|compound)\s+[a-z0-9]+/i.test(trimmed)) {
      return trimmed;
    }
    const cleaned = trimmed.replace(/^structure\s*/i, '').trim().toUpperCase();
    if (/^(X{0,3})(IX|IV|V?I{0,3})$/i.test(cleaned)) {
      return cleaned;
    }
    if (/^[A-Z]$/.test(cleaned)) {
      const charIdx = cleaned.charCodeAt(0) - 65;
      return romanNumerals[charIdx] || cleaned;
    }
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num >= 1 && num <= romanNumerals.length) {
      return romanNumerals[num - 1];
    }
    return trimmed;
  };

  const parseStructureItem = (chemStruct: any, sIdx: number): ChemicalStructure => {
    const docLabel = chemStruct.document_label
      ? String(chemStruct.document_label).trim()
      : normalizeToRomanOrPlaceholder(chemStruct.id) || romanNumerals[sIdx] || `${sIdx + 1}`;
    const normalizedId = docLabel || normalizeToRomanOrPlaceholder(chemStruct.id) || `${sIdx + 1}`;
    const rawName = (chemStruct.name || '').trim();
    const name = rawName || (docLabel ? `Structure ${docLabel}` : `Structure ${normalizedId}`);
    const existing = candidateStructures.find(
      (cs) =>
        (cs.document_label && cs.document_label.toLowerCase() === docLabel.toLowerCase()) ||
        cs.id.toLowerCase() === normalizedId.toLowerCase() ||
        (rawName && cs.name.toLowerCase() === rawName.toLowerCase()) ||
        (chemStruct.cid && cs.cid === chemStruct.cid)
    );

    const enrichedTarget = chemStruct.target_receptor || chemStruct.target;
    const rawMoa =
      chemStruct.moa_summary ||
      chemStruct.sar_rationale ||
      chemStruct.sarNotes ||
      existing?.moa_summary ||
      existing?.sar_rationale ||
      existing?.sarNotes;
    const enrichedMoa = cleanSingleParagraphSar(rawMoa);

    const rawPharmacophores =
      Array.isArray(chemStruct.pharmacophores) && chemStruct.pharmacophores.length > 0
        ? chemStruct.pharmacophores
        : existing?.pharmacophores || [];
    const validPharmacophores = filterValidPharmacophores(rawPharmacophores);
    const mw = chemStruct.mw !== undefined ? Number(chemStruct.mw) : (existing?.mw ?? existing?.pubchemAudit?.molecularWeight);
    const logP = chemStruct.logP !== undefined ? Number(chemStruct.logP) : (existing?.logP ?? existing?.pubchemAudit?.xlogp);
    const drug_state = chemStruct.drug_state || existing?.drug_state || 'Active Drug';

    return {
      id: normalizedId,
      document_label: docLabel,
      name: rawName || existing?.name || name,
      tradeName: chemStruct.tradeName || existing?.tradeName,
      chemicalClass: chemStruct.chemicalClass || existing?.chemicalClass || 'Small molecule compound',
      pharmacologicalClass: chemStruct.pharmacologicalClass || existing?.pharmacologicalClass || 'Pharmacological Agent',
      target_receptor: enrichedTarget || existing?.target_receptor,
      target: enrichedTarget || existing?.target || 'Biological Target',
      reversibility: chemStruct.reversibility || existing?.reversibility || 'Reversible',
      drug_state,
      route: chemStruct.route || existing?.route || 'Oral',
      keyFunctionalGroups: chemStruct.keyFunctionalGroups || existing?.keyFunctionalGroups || [],
      pharmacophores: validPharmacophores,
      pkPdHighlights: chemStruct.pkPdHighlights || existing?.pkPdHighlights || {
        onset: 'Standard',
        duration: 'Standard',
        halfLife: 'Standard',
        elimination: 'Hepatic / Renal',
      },
      moa_summary: enrichedMoa || existing?.moa_summary,
      sar_rationale: enrichedMoa || existing?.sar_rationale,
      sarNotes: enrichedMoa || existing?.sarNotes || '',
      cid: chemStruct.cid || existing?.cid,
      mw,
      logP,
      pngUrl:
        chemStruct.pngUrl ||
        existing?.pngUrl ||
        (chemStruct.cid || existing?.cid
          ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${chemStruct.cid || existing?.cid}/PNG?image_size=large`
          : ''),
      pubchemAudit: {
        ...existing?.pubchemAudit,
        ...chemStruct.pubchemAudit,
        cid: chemStruct.cid || existing?.cid || 0,
        status: (chemStruct.cid || existing?.cid) ? 'verified' : 'unresolved',
        verifiedAt: existing?.pubchemAudit?.verifiedAt || new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: chemStruct.pubchemAudit?.canonicalSmiles || existing?.pubchemAudit?.canonicalSmiles,
        iupacName: chemStruct.pubchemAudit?.iupacName || existing?.pubchemAudit?.iupacName,
        molecularFormula: chemStruct.pubchemAudit?.molecularFormula || existing?.pubchemAudit?.molecularFormula,
        molecularWeight: mw,
        xlogp: logP,
        pubChemUrl: (chemStruct.cid || existing?.cid)
          ? `https://pubchem.ncbi.nlm.nih.gov/compound/${chemStruct.cid || existing?.cid}`
          : '',
      },
    };
  };

  const parseQuestionItem = (
    rawQuestion: any,
    idx: number,
    localStructures: ChemicalStructure[]
  ): AntiplateletQuestion => {
    let qType: 'matching' | 'sub-statements' | 'multiple-choice' =
      rawQuestion.type === 'matching' ||
      rawQuestion.type === 'sub-statements' ||
      rawQuestion.type === 'multiple-choice'
        ? rawQuestion.type
        : rawQuestion.matchingTargets && rawQuestion.matchingTargets.length > 0
        ? 'matching'
        : rawQuestion.subStatements && rawQuestion.subStatements.length > 0
        ? 'sub-statements'
        : 'multiple-choice';

    // Strict Type Classification: If question asks to identify, match, or apply properties to MULTIPLE structures
    const stemLower = (rawQuestion.questionStem || '').toLowerCase();
    const isMultiStructurePrompt =
      stemLower.includes('match') ||
      stemLower.includes('identify the') ||
      stemLower.includes('which of the above') ||
      stemLower.includes('chemical class of the above') ||
      stemLower.includes('target of the above') ||
      (Array.isArray(rawQuestion.matchingTargets) && rawQuestion.matchingTargets.length > 0) ||
      (Array.isArray(rawQuestion.drop_zones) && rawQuestion.drop_zones.length > 0);

    if (qType === 'multiple-choice' && isMultiStructurePrompt && localStructures.length > 1) {
      qType = 'matching';
    }

    const rawTargets = rawQuestion.matchingTargets || rawQuestion.drop_zones;
    const matchingTargets: MatchingTarget[] | undefined =
      qType === 'matching' && Array.isArray(rawTargets) && rawTargets.length > 0
        ? rawTargets.map((t: any, tIdx: number) => ({
            id: t.id || String.fromCharCode(97 + tIdx),
            label: t.label || `Target ${tIdx + 1}`,
            acceptedStructureIds: Array.isArray(t.acceptedStructureIds)
              ? t.acceptedStructureIds.map((id: any) => normalizeToRomanOrPlaceholder(id) || String(id).trim())
              : [],
            rationale: t.rationale || '',
          }))
        : qType === 'matching' && localStructures.length > 0
        ? localStructures.map((s, sIdx) => ({
            id: String.fromCharCode(97 + sIdx),
            label: s.chemicalClass || s.pharmacologicalClass || s.name,
            acceptedStructureIds: [s.id],
            rationale: `Structure ${s.id} corresponds to ${s.name} (${s.chemicalClass || s.pharmacologicalClass}).`,
          }))
        : undefined;

    const draggable_items: string[] | undefined =
      qType === 'matching'
        ? Array.isArray(rawQuestion.draggable_items) && rawQuestion.draggable_items.length > 0
          ? rawQuestion.draggable_items.map((item: any) => normalizeToRomanOrPlaceholder(item) || String(item).trim())
          : localStructures.map((s) => s.id)
        : undefined;

    const subStatements: SubStatement[] | undefined =
      qType === 'sub-statements' && Array.isArray(rawQuestion.subStatements)
        ? rawQuestion.subStatements.map((s: any, sIdx: number) => ({
            id: s.id || String.fromCharCode(97 + sIdx),
            statement: s.statement || '',
            isCorrect: Boolean(s.isCorrect),
            rationale: s.rationale || '',
            keyPharmacophore: s.keyPharmacophore || undefined,
          }))
        : undefined;

    const rawRefs = Array.isArray(rawQuestion.referenced_structures)
      ? rawQuestion.referenced_structures
      : undefined;
    const referenced_structures: string[] | undefined = rawRefs
      ? rawRefs.map((r: any) => normalizeToRomanOrPlaceholder(r) || String(r).trim())
      : undefined;

    // Strict local isolation: match references strictly against this block's localStructures!
    let structuresForThisQuestion: ChemicalStructure[] = localStructures;
    if (referenced_structures && referenced_structures.length > 0) {
      const normalizedRefs = referenced_structures.map((r) => r.toLowerCase());
      const matched = localStructures.filter((s) => {
        const idLower = (s.id || '').toLowerCase();
        const docLabelLower = (s.document_label || '').toLowerCase();
        const nameLower = (s.name || '').toLowerCase();
        return (
          normalizedRefs.includes(idLower) ||
          normalizedRefs.includes(docLabelLower) ||
          normalizedRefs.includes(nameLower)
        );
      });
      if (matched.length > 0) {
        structuresForThisQuestion = matched;
      }
    } else if (qType === 'sub-statements') {
      const referenced = localStructures.find((s) => {
        const stem = (rawQuestion.questionStem || '').toLowerCase();
        const sName = s.name.toLowerCase();
        const sId = s.id.toLowerCase();
        return (
          stem.includes(`structure ${sId}`) ||
          stem.includes(`antiplatelet ${sId}`) ||
          stem.includes(`compound ${sId}`) ||
          stem.includes(sName) ||
          (rawQuestion.hide_drug_name_show_structure_for &&
            String(rawQuestion.hide_drug_name_show_structure_for).toLowerCase() === sId)
        );
      });
      if (referenced) {
        structuresForThisQuestion = [referenced];
      }
    } else if (
      Array.isArray(rawQuestion.displayed_structure_entity_ids) &&
      rawQuestion.displayed_structure_entity_ids.length > 0
    ) {
      const normalizedDisplayed = rawQuestion.displayed_structure_entity_ids.map(
        (id: any) => normalizeToRomanOrPlaceholder(id)?.toLowerCase() || String(id).trim().toLowerCase()
      );
      const matched = localStructures.filter((s) =>
        normalizedDisplayed.includes(s.id.toLowerCase())
      );
      if (matched.length > 0) {
        structuresForThisQuestion = matched;
      }
    }

    const displayedEntities: string[] =
      Array.isArray(rawQuestion.displayed_structure_entity_ids) &&
      rawQuestion.displayed_structure_entity_ids.length > 0
        ? rawQuestion.displayed_structure_entity_ids.map((id: string) => normalizeToRomanOrPlaceholder(id) || id.trim())
        : structuresForThisQuestion.map((s) => s.id);

    const rawBlindTarget =
      rawQuestion.blinded_structure_id ||
      rawQuestion.hide_drug_name_show_structure_for;
    const normalizedBlindTarget = normalizeToRomanOrPlaceholder(rawBlindTarget);

    let questionStem = rawQuestion.questionStem || 'Analyze the chemical structures shown above:';
    if (
      rawQuestion.shared_structure_block_reference &&
      !questionStem.includes(rawQuestion.shared_structure_block_reference)
    ) {
      questionStem = `[${rawQuestion.shared_structure_block_reference}]\n\n${questionStem}`;
    }

    const questionId =
      typeof rawQuestion.id === 'number' && rawQuestion.id > 0
        ? rawQuestion.id
        : Date.now() + idx;

    const questionNumberLabel =
      rawQuestion.questionNumberLabel ||
      (typeof rawQuestion.id === 'number' && rawQuestion.id > 0
        ? `Question ${rawQuestion.id}`
        : `Question ${idx + 1}`);

    return {
      id: questionId,
      title: rawQuestion.title || (qType === 'matching' ? 'Structure Drag & Drop Matching' : qType === 'sub-statements' ? 'True/False SAR Evaluation' : 'Multiple Choice Question'),
      questionNumberLabel,
      category: rawQuestion.category || (qType === 'matching' ? 'Classification' : 'SAR Analysis'),
      questionStem,
      type: qType,
      matchingTargets,
      drop_zones: matchingTargets,
      draggable_items,
      subStatements,
      structuresDisplayed: structuresForThisQuestion,
      options:
        qType === 'multiple-choice'
          ? Array.isArray(rawQuestion.options) &&
            !rawQuestion.options.every((opt: any) => /^[A-D][.)]?$/i.test(String(opt).trim()))
            ? rawQuestion.options
            : undefined
          : undefined,
      correctIndex:
        qType === 'multiple-choice' && typeof rawQuestion.correctIndex === 'number'
          ? rawQuestion.correctIndex
          : undefined,
      optionExplanations:
        qType === 'multiple-choice' && Array.isArray(rawQuestion.optionExplanations)
          ? rawQuestion.optionExplanations
          : undefined,
      overallExplanation: rawQuestion.overallExplanation || '',
      highYieldPearl: rawQuestion.highYieldPearl || '',
      sourceReference: rawQuestion.sourceReference || 'Medicinal Chemistry Knowledge Graph',
      referenced_structures,
      displayed_structure_entity_ids: displayedEntities,
      hide_drug_name_show_structure_for: normalizedBlindTarget,
      sourcePageNumber: rawQuestion.sourcePageNumber || 1,
    };
  };

  let questionBlocks: QuestionBlock[] = [];

  if (Array.isArray(data.question_blocks) && data.question_blocks.length > 0) {
    questionBlocks = data.question_blocks.map((block: any, bIdx: number) => {
      const blockInstructions =
        block.block_instructions ||
        block.instructions ||
        block.headerNote ||
        'Consider the following chemical structures to answer subsequent questions:';

      const rawBlockStructures: any[] = block.local_structures || block.structures || [];
      const localStructures: ChemicalStructure[] = rawBlockStructures.map((s, sIdx) =>
        parseStructureItem(s, sIdx)
      );

      const sortedLocalStructures: ChemicalStructure[] = sortStructuresByDocumentLabel<ChemicalStructure>(localStructures);

      const rawBlockQuestions: any[] = block.questions || [];
      const blockQuestions: AntiplateletQuestion[] = rawBlockQuestions.map((q, qIdx) =>
        parseQuestionItem(
          q,
          qIdx,
          sortedLocalStructures.length > 0 ? sortedLocalStructures : candidateStructures
        )
      );

      return {
        block_instructions: blockInstructions,
        local_structures: sortedLocalStructures,
        questions: blockQuestions,
      };
    });
  } else {
    // Fallback: single block from top-level structures and questions
    const rawStructures = Array.isArray(data.structures) ? data.structures : [];
    const localStructures: ChemicalStructure[] = rawStructures.map((s: any, sIdx: number) => parseStructureItem(s, sIdx));
    const sortedLocalStructures: ChemicalStructure[] = sortStructuresByDocumentLabel<ChemicalStructure>(
      localStructures.length > 0 ? localStructures : candidateStructures
    );

    const rawQuestions: any[] = Array.isArray(data.questions)
      ? data.questions
      : data.question
      ? [data.question]
      : [];

    const blockQuestions: AntiplateletQuestion[] = rawQuestions.map((q, qIdx) =>
      parseQuestionItem(q, qIdx, sortedLocalStructures)
    );

    questionBlocks = [
      {
        block_instructions: 'Consider the following chemical structures to answer subsequent questions:',
        local_structures: sortedLocalStructures,
        questions: blockQuestions,
      },
    ];
  }

  const allQuestions = questionBlocks.flatMap((b) => b.questions);
  const allStructures = questionBlocks.flatMap((b) => b.local_structures);

  const returnObj = allQuestions as AntiplateletQuestion[] & {
    structures?: ChemicalStructure[];
    questions?: AntiplateletQuestion[];
    question_blocks?: QuestionBlock[];
  };
  returnObj.structures = allStructures.length > 0 ? allStructures : candidateStructures;
  returnObj.questions = allQuestions;
  returnObj.question_blocks = questionBlocks;
  return returnObj;
}

export interface MedChemQuizGenerationOutput {
  questions: AntiplateletQuestion[];
  structures: ChemicalStructure[];
  question_blocks: QuestionBlock[];
}

export async function generateMedChemQuizWithParsed(
  options: GenerateMedChemQuizOptions = {}
): Promise<MedChemQuizGenerationOutput> {
  const result = await generateMedChemQuiz(options);
  return {
    questions: (result as any).questions || result,
    structures: (result as any).structures || [],
    question_blocks: (result as any).question_blocks || [],
  };
}

/**
 * Backwards-compatible single question generator.
 */
export async function generateMedChemQuizQuestion(
  options: GenerateMedChemQuizOptions
): Promise<AntiplateletQuestion> {
  const questions = await generateMedChemQuiz(options);
  if (!questions || questions.length === 0) {
    throw new Error('No question was generated');
  }
  return questions[0];
}

// Convenient aliases for interoperability
export const generateQuizQuestion = generateMedChemQuizQuestion;
export const generateGraphRagQuestion = generateMedChemQuizQuestion;
