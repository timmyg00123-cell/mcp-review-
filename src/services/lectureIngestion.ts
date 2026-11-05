import { GraphEntity, GraphRelationship, medChemGraphDb } from '../db/medChemGraphDb';
import { getKnownDrugSmiles } from '../utils/knownDrugSmiles';
import { getCorrectedSmarts } from '../utils/smartsDictionary';
import { fetchOpenFdaClinicalData, OpenFdaClinicalData } from './openFdaService';
import {
  enrichEntitiesWithPubChem,
  verifyStructuresBatchPubChem,
  fetchPubChemXLogP,
  isNonCompoundEntity,
  sanitizeStructureLabel,
} from './pubchemService';
import {
  sortStructuresByDocumentLabel,
  parseDocumentLabelRank,
  getStructureDocumentLabel,
} from '../utils/documentLabel';
import { resolvePharmacophoreRegion } from '../utils/pharmacophoreData';
import {
  AntiplateletQuestion,
  ChemicalStructure,
  MatchingTarget,
  PharmacophoreGroup,
  ReviewModule,
  ReviewPage,
  ReviewSection,
  QuestionBlock,
  SubStatement,
} from '../types/reviewModule';
import {
  IngestionSlide,
  ParsePdfResult,
  parsePdf,
  parsePptx,
  parsePdfToSlides,
  parsePptxToSlides,
  readFileAsBase64,
  renderPdfPageToCanvasBase64,
  runEtlIngestion,
  createIngestWorker,
} from './fileParser';

// Re-export parser methods and types for backwards compatibility
export type {
  IngestionSlide,
  ParsePdfResult,
};
export {
  parsePdf,
  parsePptx,
  parsePdfToSlides,
  parsePptxToSlides,
  readFileAsBase64,
  renderPdfPageToCanvasBase64,
  runEtlIngestion,
  createIngestWorker,
};

export interface IngestionProgress {
  stage: 'parsing' | 'extracting' | 'merging' | 'enriching' | 'generating-quiz' | 'complete' | 'error';
  currentBatch: number;
  totalBatches: number;
  currentSlide: number;
  totalSlides: number;
  message: string;
  discoveredEntitiesCount?: number;
  discoveredRelationshipsCount?: number;
  enrichedCount?: number;
  generatedQuestionsCount?: number;
  error?: string;
}

/**
 * Partitions slides into 3-slide overlapping windows.
 * e.g., slides 1-3, 3-5, 5-7 (windowSize = 3, stride = 2).
 */
export function createOverlappingSlideWindows<T>(
  slides: T[],
  windowSize = 3,
  stride = 2
): T[][] {
  if (slides.length <= windowSize) {
    return [slides];
  }

  const windows: T[][] = [];
  for (let i = 0; i < slides.length; i += stride) {
    const chunk = slides.slice(i, i + windowSize);
    if (chunk.length > 0) {
      windows.push(chunk);
    }
    if (i + windowSize >= slides.length) {
      break;
    }
  }

  return windows;
}

interface ExtractionResult {
  entities: GraphEntity[];
  relationships: GraphRelationship[];
  structures: ChemicalStructure[];
  question_blocks: any[];
}

/**
 * Extracts entities, relationships, structures, and questions from a slide window using Gemini Structured Outputs.
 * Single-pass extraction optimizes LLM overhead by 50%.
 */
async function extractKnowledgeFromBatch(
  slideBatch: IngestionSlide[],
  documentTitle: string,
  signal?: AbortSignal
): Promise<ExtractionResult> {
  try {
    const batchImages: string[] = [];
    for (const s of slideBatch) {
      const img = s.inlineData?.data || (s.images?.[0] ? s.images[0].replace(/^data:[^;]+;base64,/, '') : '');
      if (img && !batchImages.includes(img)) {
        batchImages.push(img);
      }
    }

    const leanSlides = slideBatch.map(({ slideNumber, slideIndex, pageNumber, title, text }) => ({
      slideNumber,
      slideIndex,
      pageNumber,
      title,
      text,
    }));

    const response = await fetch('/api/gemini/extract-graph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        slides: leanSlides,
        documentTitle,
        images: batchImages,
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
        errData?.error || errData?.message || `Gemini extraction failed with HTTP ${response.status}`
      );
      errObj.response = { data: errData };
      throw errObj;
    }

    const data = await response.json();

    const rawEntities = data.entities || data.nodes || data.graph?.entities || [];
    const rawRelationships = data.relationships || data.edges || data.graph?.relationships || [];
    const rawStructures = data.structures || [];
    const rawQuestionBlocks = data.question_blocks || [];

    if ((!rawEntities || rawEntities.length === 0) && (!rawRelationships || rawRelationships.length === 0)) {
      console.warn('[extractKnowledgeFromBatch] Warning: Entities or relationships resolved to empty array.');
    }

    return {
      entities: Array.isArray(rawEntities) ? rawEntities : [],
      relationships: Array.isArray(rawRelationships) ? rawRelationships : [],
      structures: Array.isArray(rawStructures) ? rawStructures : [],
      question_blocks: Array.isArray(rawQuestionBlocks) ? rawQuestionBlocks : [],
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Network Request Failed";
    throw new Error(`Extraction failed: ${errorMessage}`);
  }
}

/**
 * Sends a JPG/PNG image directly to Gemini Flash using inlineData alongside the MedChem extraction prompt.
 */
export async function extractKnowledgeFromImage(
  inlineData: { mimeType: string; data: string },
  documentTitle: string
): Promise<ExtractionResult> {
  try {
    const response = await fetch('/api/gemini/extract-graph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inlineData,
        documentTitle,
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
        errData?.error || errData?.message || `Gemini image extraction failed with HTTP ${response.status}`
      );
      errObj.response = { data: errData };
      throw errObj;
    }

    const data = await response.json();

    const rawEntities = data.entities || data.nodes || [];
    const rawRelationships = data.relationships || data.edges || [];
    const rawStructures = data.structures || [];
    const rawQuestionBlocks = data.question_blocks || [];

    return {
      entities: Array.isArray(rawEntities) ? rawEntities : [],
      relationships: Array.isArray(rawRelationships) ? rawRelationships : [],
      structures: Array.isArray(rawStructures) ? rawStructures : [],
      question_blocks: Array.isArray(rawQuestionBlocks) ? rawQuestionBlocks : [],
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Network Request Failed";
    throw new Error(`Extraction failed: ${errorMessage}`);
  }
}

export interface IngestDocumentResult {
  totalSlides: number;
  totalEntitiesDiscovered: number;
  totalRelationshipsDiscovered: number;
  enrichedCount: number;
  entities: GraphEntity[];
  relationships: GraphRelationship[];
  generatedQuestions: AntiplateletQuestion[];
  structures?: ChemicalStructure[];
  slides?: IngestionSlide[];
  question_blocks?: Array<{ pageNumber: number; block: QuestionBlock }>;
}

export function splitTextIntoSlides(fullText: string, defaultTitle: string): IngestionSlide[] {
  if (fullText.includes('\f')) {
    const rawPages = fullText.split('\f').map((p) => p.trim()).filter(Boolean);
    if (rawPages.length > 1) {
      return rawPages.map((text, idx) => ({
        slideNumber: idx + 1,
        slideIndex: idx + 1,
        pageNumber: idx + 1,
        title: `${defaultTitle} — Page ${idx + 1}`,
        text,
      }));
    }
  }

  const pageRegex = /(?:^|\n)(?:={3,}|-{3,}|_{3,})?\s*(?:Page|Slide)\s*(\d+)[:\s-]*(?:={3,}|-{3,}|_{3,})?/gi;
  const matches = Array.from(fullText.matchAll(pageRegex));

  if (matches.length > 1) {
    const slides: IngestionSlide[] = [];
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const pageNum = parseInt(match[1], 10) || (i + 1);
      const startIndex = match.index! + match[0].length;
      const endIndex = i + 1 < matches.length ? matches[i + 1].index! : fullText.length;
      const pageText = fullText.slice(startIndex, endIndex).trim();
      const firstLine = pageText.split('\n')[0]?.trim() || `Page ${pageNum}`;
      slides.push({
        slideNumber: pageNum,
        slideIndex: pageNum,
        pageNumber: pageNum,
        title: firstLine.length < 80 ? firstLine : `Page ${pageNum}`,
        text: pageText,
      });
    }
    return slides;
  }

  return [
    {
      slideNumber: 1,
      slideIndex: 1,
      pageNumber: 1,
      title: defaultTitle,
      text: fullText,
    },
  ];
}

export function synthesizePageFallbackQuestions(
  pageNumber: number,
  pageTitle: string,
  structures: ChemicalStructure[],
  targetDrug?: GraphEntity
): AntiplateletQuestion[] {
  const primaryStructure = structures[0];
  const questions: AntiplateletQuestion[] = [];

  if (structures.length > 0) {
    const matchingTargets: MatchingTarget[] = structures.map((str, idx) => ({
      id: String.fromCharCode(97 + idx),
      label: `${str.name} (${str.chemicalClass || str.pharmacologicalClass || 'Therapeutic Agent'})`,
      acceptedStructureIds: [str.id],
      rationale: `Structure ${str.id} corresponds to ${str.name}, belonging to the ${str.chemicalClass || 'medicinal chemistry'} class.`,
    }));

    matchingTargets.push({
      id: String.fromCharCode(97 + structures.length),
      label: 'Distractor Compound (Inactive / Non-represented in above structures)',
      acceptedStructureIds: [],
      rationale: 'This pharmacological entity is not represented among the displayed chemical structures.',
    });

    questions.push({
      id: Date.now() + pageNumber * 1000 + 1,
      title: 'Structure Identification Challenge',
      questionNumberLabel: `Question 1`,
      category: 'Structure Classification',
      questionStem: `Identify and match the chemical structures shown for ${pageTitle} to their corresponding drug names and pharmacological classes:`,
      type: 'matching',
      matchingTargets,
      structuresDisplayed: structures,
      sourcePageNumber: pageNumber,
      displayed_structure_entity_ids: structures.map((s) => s.id.toLowerCase()),
      overallExplanation: `Review the pharmacophore motifs and key functional groups for the compounds presented on Page ${pageNumber}.`,
      highYieldPearl: `Recognizing unique structural warheads and pharmacophoric backbones enables rapid drug class deduction on board examinations.`,
      sourceReference: `Course Material — ${pageTitle}`,
    });

    if (primaryStructure) {
      const subStatements: SubStatement[] = [
        {
          id: 'a',
          statement: `Structure ${primaryStructure.id} (${primaryStructure.name}) exerts its primary pharmacological action as a ${primaryStructure.pharmacologicalClass || 'selective receptor modulator'}.`,
          isCorrect: true,
          rationale: `Structure ${primaryStructure.id} (${primaryStructure.name}) is classified as a ${primaryStructure.pharmacologicalClass || 'therapeutic agent'}.`,
          keyPharmacophore: primaryStructure.keyFunctionalGroups?.[0] || 'Core pharmacophore',
        },
        {
          id: 'b',
          statement: `The functional groups present on Structure ${primaryStructure.id} confer specific receptor affinity and selectivity.`,
          isCorrect: true,
          rationale: `The chemical substituents optimize binding interactions and pharmacokinetics.`,
          keyPharmacophore: primaryStructure.keyFunctionalGroups?.[1] || 'Binding substituents',
        },
        {
          id: 'c',
          statement: `Structure ${primaryStructure.id} undergoes immediate spontaneous non-enzymatic degradation resulting in complete loss of pharmacodynamic effect.`,
          isCorrect: false,
          rationale: `Structure ${primaryStructure.id} possesses metabolic stability dictated by its chemical scaffold.`,
          keyPharmacophore: 'Metabolic stability',
        },
      ];

      questions.push({
        id: Date.now() + pageNumber * 1000 + 2,
        title: 'Structure-Activity Relationship (SAR) Analysis',
        questionNumberLabel: `Question 2`,
        category: 'SAR Evaluation',
        questionStem: `Considering the chemical structure and pharmacological profile of Structure ${primaryStructure.id} (${primaryStructure.name}), evaluate whether each of the following statements is True or False:`,
        type: 'sub-statements',
        subStatements,
        structuresDisplayed: [primaryStructure],
        sourcePageNumber: pageNumber,
        displayed_structure_entity_ids: [primaryStructure.id.toLowerCase()],
        overallExplanation: `SAR analysis for Structure ${primaryStructure.id} (${primaryStructure.name}).`,
        highYieldPearl: primaryStructure.sarNotes || `Understanding functional group contributions is essential for predicting pharmacological activity.`,
        sourceReference: `Course Material — ${pageTitle}`,
      });
    }
  } else {
    const drugName = targetDrug?.name || targetDrug?.id || pageTitle;
    questions.push({
      id: Date.now() + pageNumber * 1000 + 1,
      title: 'Pharmacological Mechanism Evaluation',
      questionNumberLabel: `Question 1`,
      category: 'Pharmacology Review',
      questionStem: `Regarding the pharmacological principles and mechanism of action discussed on ${pageTitle} (${drugName}), which of the following statements is most accurate?`,
      type: 'multiple-choice',
      options: [
        `Exerts selective pharmacological activity on its target pathway to modulate clinical outcomes.`,
        `Acts non-selectively as a broad systemic enzyme substrate without target receptor specificity.`,
        `Undergoes 100% first-pass excretion without any systemic bioavailability.`,
        `Lacks therapeutic efficacy in all verified clinical indications.`,
      ],
      correctIndex: 0,
      optionExplanations: [
        'Correct. The agent demonstrates selective pharmacological modulation aligned with lecture principles.',
        'Incorrect. Pharmacological agents exhibit target selectivity.',
        'Incorrect. Therapeutic agents are formulated for adequate bioavailability and clinical activity.',
        'Incorrect. Course materials focus on validated therapeutic interventions.',
      ],
      structuresDisplayed: [],
      sourcePageNumber: pageNumber,
      overallExplanation: `Review the foundational pharmacological concepts from ${pageTitle}.`,
      highYieldPearl: `Selective target engagement determines both therapeutic efficacy and the adverse effect profile.`,
      sourceReference: `Course Material — ${pageTitle}`,
    });
  }

  return questions;
}

export function cleanSingleParagraphSar(text?: string | null): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  if (trimmed.includes('\n\n') || trimmed.includes('\r\n\r\n')) {
    const paragraphs = trimmed
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (paragraphs.length > 0) {
      const richest = paragraphs.reduce(
        (best, curr) => (curr.length > best.length ? curr : best),
        paragraphs[0]
      );
      return richest.replace(/\r?\n+/g, ' ').trim();
    }
  }

  return trimmed.replace(/\r?\n+/g, ' ').trim();
}

export function filterValidPharmacophores(pharmacophores?: PharmacophoreGroup[] | null): PharmacophoreGroup[] {
  if (!Array.isArray(pharmacophores)) return [];
  const bannedKeywords = ['drug core', 'main scaffold', 'active moiety', 'generic core', 'core scaffold'];
  const valid = pharmacophores.filter((p) => {
    if (!p) return false;
    const nameLower = (p.name || '').trim().toLowerCase();
    const idLower = (p.id || '').trim().toLowerCase();
    return !bannedKeywords.some((banned) => nameLower.includes(banned) || idLower.includes(banned));
  });

  return valid.map((p, idx) => {
    const name = p.name || `Pharmacophore ${idx + 1}`;
    const id = p.id || `pg_${idx}_${name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
    const purpose = p.purpose || p.description || `Functional group in structure contributing to pharmacological activity and receptor interaction.`;
    const description = p.description || p.purpose || purpose;
    const correctedSmarts = getCorrectedSmarts(name, p.smarts || '') || undefined;
    return {
      ...p,
      id,
      name,
      purpose,
      description,
      smarts: correctedSmarts,
      region: p.region || resolvePharmacophoreRegion(p, idx, valid.length),
    };
  });
}

/**
 * Complete lecture, image, and text ingestion pipeline.
 * Utilizes a unified single-pass LLM pipeline to extract entities, relationships,
 * structures, and interactive questions concurrently.
 */
export async function ingestLectureDocument(
  file: File,
  onProgress?: (progress: IngestionProgress) => void,
  signal?: AbortSignal
): Promise<IngestDocumentResult> {
  try {
    const fileName = file.name || 'uploaded_source';
    const lower = fileName.toLowerCase();
    const isPdf = lower.endsWith('.pdf') || file.type === 'application/pdf';
    const isPptx = lower.endsWith('.pptx') || file.type.includes('presentationml');
    const isJpg = lower.endsWith('.jpg') || lower.endsWith('.jpeg') || file.type === 'image/jpeg';
    const isPng = lower.endsWith('.png') || file.type === 'image/png';
    const isImage = isJpg || isPng || file.type.startsWith('image/');
    const isText = lower.endsWith('.txt') || lower.endsWith('.md') || file.type === 'text/plain';

    if (!isPdf && !isPptx && !isImage && !isText) {
      throw new Error('Unsupported format. Please upload a .pdf, .pptx, .jpg, .jpeg, .png, or .txt file.');
    }

    let allDiscoveredEntities: GraphEntity[] = [];
    const allDiscoveredRelationships: GraphRelationship[] = [];
    const allExtractedStructures: ChemicalStructure[] = [];
    const allGeneratedQuestions: AntiplateletQuestion[] = [];
    const allGeneratedQuestionBlocks: Array<{ pageNumber: number; block: QuestionBlock }> = [];

    let totalSlides = 1;
    let rawContext = '';
    let imageInlineData: { mimeType: string; data: string } | undefined;
    let allSlides: IngestionSlide[] = [];

    const handleExtractionResult = (
      entities: GraphEntity[],
      relationships: GraphRelationship[],
      structures: ChemicalStructure[],
      question_blocks: any[],
      startSlide: number,
      endSlide: number
    ) => {
      // Build cross-lookup map for SMILES across structures, local_structures, and entities
      const smilesMap = new Map<string, string>();
      structures.forEach((s) => {
        const sSmiles =
          s.canonicalSmiles ||
          s.smiles ||
          s.pubchemAudit?.canonicalSmiles ||
          (s as any).chemData?.canonicalSmiles ||
          getKnownDrugSmiles(s.name) ||
          getKnownDrugSmiles(s.id);
        if (sSmiles) {
          if (s.id) smilesMap.set(s.id.toLowerCase(), sSmiles);
          if (s.name) smilesMap.set(s.name.toLowerCase(), sSmiles);
          if (s.document_label) smilesMap.set(s.document_label.toLowerCase(), sSmiles);
        }
      });
      if (question_blocks && Array.isArray(question_blocks)) {
        question_blocks.forEach((qb) => {
          if (Array.isArray(qb.local_structures)) {
            qb.local_structures.forEach((ls: any) => {
              const lsSmiles =
                ls.canonicalSmiles ||
                ls.smiles ||
                ls.pubchemAudit?.canonicalSmiles ||
                (ls as any).chemData?.canonicalSmiles ||
                getKnownDrugSmiles(ls.name) ||
                getKnownDrugSmiles(ls.id);
              if (lsSmiles) {
                if (ls.id) smilesMap.set(ls.id.toLowerCase(), lsSmiles);
                if (ls.name) smilesMap.set(ls.name.toLowerCase(), lsSmiles);
                if (ls.document_label) smilesMap.set(ls.document_label.toLowerCase(), lsSmiles);
              }
            });
          }
        });
      }

      entities.forEach((e) => {
        if (isNonCompoundEntity(e.id) || isNonCompoundEntity(e.name || '')) {
          e.type = 'CLINICAL_PARAMETER' as any;
        }
        const raw = Number((e as any).source_slide_index);
        const pageNum = raw && raw >= startSlide && raw <= endSlide ? raw : startSlide;
        e.sourcePageNumber = pageNum;
        e.sourcePageNumbers = [pageNum];
        const normId = e.id.toLowerCase();
        const cleanName = (e.name || '').toLowerCase();
        const eSmiles =
          e.canonicalSmiles ||
          e.smiles ||
          e.chemData?.canonicalSmiles ||
          e.chemData?.isomericSmiles ||
          e.pubchemAudit?.canonicalSmiles ||
          smilesMap.get(normId) ||
          smilesMap.get(cleanName) ||
          getKnownDrugSmiles(e.name) ||
          getKnownDrugSmiles(e.id);
        if (eSmiles) {
          e.canonicalSmiles = eSmiles;
          e.smiles = eSmiles;
          smilesMap.set(normId, eSmiles);
          if (cleanName) smilesMap.set(cleanName, eSmiles);
        }
      });

      relationships.forEach((r) => {
        const raw = Number((r as any).source_slide_index);
        r.sourcePageNumber = raw && raw >= startSlide && raw <= endSlide ? raw : startSlide;
      });

      structures.forEach((s) => {
        const raw = Number((s as any).source_slide_index);
        const pageNum = raw && raw >= startSlide && raw <= endSlide ? raw : startSlide;
        s.sourcePageNumber = pageNum;
        s.sourcePageNumbers = [pageNum];
        s.moa_summary = cleanSingleParagraphSar(s.moa_summary || s.sar_rationale || s.sarNotes);
        s.sar_rationale = s.moa_summary;
        s.sarNotes = s.moa_summary;
        s.pharmacophores = filterValidPharmacophores(s.pharmacophores);
        const normId = s.id ? s.id.toLowerCase() : '';
        const cleanName = s.name ? s.name.toLowerCase() : '';
        const sSmiles =
          s.canonicalSmiles ||
          s.smiles ||
          s.pubchemAudit?.canonicalSmiles ||
          (s as any).chemData?.canonicalSmiles ||
          smilesMap.get(normId) ||
          smilesMap.get(cleanName) ||
          getKnownDrugSmiles(s.name) ||
          getKnownDrugSmiles(s.id);
        if (sSmiles) {
          s.canonicalSmiles = sSmiles;
          s.smiles = sSmiles;
          if (s.pubchemAudit) {
            s.pubchemAudit.canonicalSmiles = sSmiles;
          }
        }
      });

      // Explode pharmacophores into distinct PHARMACOPHORE entity nodes and HAS_PHARMACOPHORE relationships
      const explodedPharmaEntities: GraphEntity[] = [];
      const explodedPharmaRels: GraphRelationship[] = [];

      const processPharmacophoreSource = (
        parentId: string,
        parentName: string,
        pharmacophores: any[] | undefined,
        pageNum: number
      ) => {
        if (!Array.isArray(pharmacophores)) return;
        const normParentId = parentId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
        for (const p of pharmacophores) {
          if (!p || !p.name) continue;
          const pClean = String(p.id || p.name).trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
          const pharmaNodeId = `pharma_${normParentId}_${pClean}`;
          const pharmaSummary = (p.purpose || p.description || `Pharmacophore group "${p.name}" conferring target binding and SAR profile.`).trim();
          const pharmaObj = {
            ...p,
            smarts: getCorrectedSmarts(p.name, p.smarts || '') || undefined,
          };

          explodedPharmaEntities.push({
            id: pharmaNodeId,
            name: p.name,
            type: 'PHARMACOPHORE' as any,
            clinical_and_sar_summary: pharmaSummary,
            pharmacophores: [pharmaObj],
            sar_rationale: p.purpose || p.description,
            casual_sar_explanation: p.casual_sar_explanation,
            sourcePageNumber: pageNum,
            sourcePageNumbers: [pageNum],
            updatedAt: new Date().toISOString(),
          });

          explodedPharmaRels.push({
            source: normParentId,
            relation: 'HAS_PHARMACOPHORE',
            target: pharmaNodeId,
            sar_and_mechanism_context: p.purpose || p.description || `Drug ${parentName || normParentId} displays ${p.name}.`,
            theme_keywords: ['pharmacophore', 'sar', p.category || 'binding'],
            sourcePageNumber: pageNum,
            updatedAt: new Date().toISOString(),
          });
        }
      };

      structures.forEach((s) => {
        processPharmacophoreSource(s.id, s.name, s.pharmacophores, s.sourcePageNumber || startSlide);
      });
      entities.forEach((e) => {
        if (Array.isArray(e.pharmacophores) && e.pharmacophores.length > 0) {
          processPharmacophoreSource(e.id, e.name || e.id, e.pharmacophores, e.sourcePageNumber || startSlide);
        }
      });
      if (question_blocks && Array.isArray(question_blocks)) {
        question_blocks.forEach((qb) => {
          if (Array.isArray(qb.local_structures)) {
            qb.local_structures.forEach((ls: any) => {
              processPharmacophoreSource(ls.id, ls.name, ls.pharmacophores, ls.sourcePageNumber || startSlide);
            });
          }
        });
      }

      allDiscoveredEntities.push(...entities, ...explodedPharmaEntities);
      allDiscoveredRelationships.push(...relationships, ...explodedPharmaRels);
      allExtractedStructures.push(...structures);

      if (question_blocks && question_blocks.length > 0) {
        question_blocks.forEach((qb) => {
          const raw = Number(qb.source_slide_index);
          const pageNum = raw && raw >= startSlide && raw <= endSlide ? raw : startSlide;
          
          if (qb.local_structures && Array.isArray(qb.local_structures)) {
             qb.local_structures.forEach((ls: any) => {
                ls.sourcePageNumber = pageNum;
                ls.sourcePageNumbers = [pageNum];
                ls.moa_summary = cleanSingleParagraphSar(ls.moa_summary || ls.sar_rationale || ls.sarNotes);
                ls.sar_rationale = ls.moa_summary;
                ls.sarNotes = ls.moa_summary;
                ls.pharmacophores = filterValidPharmacophores(ls.pharmacophores);
                const normId = ls.id ? ls.id.toLowerCase() : '';
                const cleanName = ls.name ? ls.name.toLowerCase() : '';
                const lsSmiles =
                  ls.canonicalSmiles ||
                  ls.smiles ||
                  ls.pubchemAudit?.canonicalSmiles ||
                  (ls as any).chemData?.canonicalSmiles ||
                  smilesMap.get(normId) ||
                  smilesMap.get(cleanName) ||
                  getKnownDrugSmiles(ls.name) ||
                  getKnownDrugSmiles(ls.id);
                if (lsSmiles) {
                  ls.canonicalSmiles = lsSmiles;
                  ls.smiles = lsSmiles;
                  if (ls.pubchemAudit) {
                    ls.pubchemAudit.canonicalSmiles = lsSmiles;
                  }
                }
             });
          }

          allGeneratedQuestionBlocks.push({
            pageNumber: pageNum,
            block: qb
          });

          if (qb.questions && Array.isArray(qb.questions)) {
             qb.questions.forEach((q: any, qIdx: number) => {
                q.sourcePageNumber = pageNum;
                if (!q.id || (typeof q.id === 'number' && q.id > 1000000)) {
                   q.id = qIdx + 1;
                }
                const rawLabel = String(q.questionNumberLabel || q.title || '').trim();
                if (!rawLabel || /^Q?\d{6,}$/i.test(rawLabel) || /^Question \d{6,}$/i.test(rawLabel)) {
                   q.questionNumberLabel = `Question ${qIdx + 1}`;
                } else if (!q.questionNumberLabel) {
                   q.questionNumberLabel = `Question ${qIdx + 1}`;
                }
                if (!q.title || /^Q?\d{6,}$/i.test(String(q.title).trim()) || /^Question \d{6,}$/i.test(String(q.title).trim())) {
                   q.title = `Question ${qIdx + 1}`;
                }
                if (!q.structuresDisplayed || q.structuresDisplayed.length === 0) {
                   q.structuresDisplayed = qb.local_structures || [];
                }
                allGeneratedQuestions.push(q);
             });
          }
        });
      }
    };

    if (isImage) {
      onProgress?.({
        stage: 'parsing',
        currentBatch: 1,
        totalBatches: 1,
        currentSlide: 1,
        totalSlides: 1,
        message: `Reading image "${fileName}" into Base64 for multimodal extraction...`,
      });

      const base64Data = await readFileAsBase64(file);
      const mimeType = file.type || (isPng ? 'image/png' : 'image/jpeg');
      imageInlineData = { mimeType, data: base64Data };

      allSlides = [
        {
          slideNumber: 1,
          slideIndex: 1,
          pageNumber: 1,
          title: fileName.replace(/\.[^/.]+$/, ''),
          text: `Multimodal Chemical Structure Image: ${fileName}`,
          inlineData: imageInlineData,
        },
      ];

      onProgress?.({
        stage: 'extracting',
        currentBatch: 1,
        totalBatches: 1,
        currentSlide: 1,
        totalSlides: 1,
        message: `Analyzing chemical structures in "${fileName}" with Gemini Flash multimodal extraction...`,
        discoveredEntitiesCount: 0,
        discoveredRelationshipsCount: 0,
      });

      const { entities, relationships, structures, question_blocks } = await extractKnowledgeFromImage(imageInlineData, fileName);
      handleExtractionResult(entities, relationships, structures, question_blocks, 1, 1);
      
      rawContext = `Uploaded multimodal chemical structure image: "${fileName}". Extracted ${entities.length} entities.`;

      if (entities.length > 0 || relationships.length > 0) {
        onProgress?.({
          stage: 'merging',
          currentBatch: 1,
          totalBatches: 1,
          currentSlide: 1,
          totalSlides: 1,
          message: `Merging ${entities.length} entities and ${relationships.length} relationships into Dexie IndexedDB...`,
          discoveredEntitiesCount: allDiscoveredEntities.length,
          discoveredRelationshipsCount: allDiscoveredRelationships.length,
        });
        await medChemGraphDb.mergeGraphToDexie(entities, relationships);
      }
    } else if (isText) {
      onProgress?.({
        stage: 'parsing',
        currentBatch: 1,
        totalBatches: 1,
        currentSlide: 1,
        totalSlides: 1,
        message: `Reading text document "${fileName}"...`,
      });

      const fullText = await file.text();
      const totalChars = fullText.trim().length;
      if (totalChars === 0) throw new Error(`Text document "${fileName}" is empty. No content to analyze.`);

      const slides = splitTextIntoSlides(fullText, fileName.replace(/\.[^/.]+$/, ''));
      allSlides = slides;
      totalSlides = slides.length;
      rawContext = fullText;

      const TEXT_BATCH_SIZE = 2;
      const batches: IngestionSlide[][] = [];
      for (let i = 0; i < slides.length; i += TEXT_BATCH_SIZE) {
        batches.push(slides.slice(i, i + TEXT_BATCH_SIZE));
      }

      for (let bIdx = 0; bIdx < batches.length; bIdx++) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        if (signal?.aborted) throw new DOMException('Ingestion aborted by user', 'AbortError');
        
        const batch = batches[bIdx];
        const startSlide = batch[0].slideNumber;
        const endSlide = batch[batch.length - 1].slideNumber;

        onProgress?.({
          stage: 'extracting',
          currentBatch: bIdx + 1,
          totalBatches: batches.length,
          currentSlide: startSlide,
          totalSlides: slides.length,
          message: `Extracting MedChem Knowledge Graph and Quiz from page ${startSlide}${startSlide !== endSlide ? `–${endSlide}` : ''}/${slides.length}...`,
          discoveredEntitiesCount: allDiscoveredEntities.length,
          discoveredRelationshipsCount: allDiscoveredRelationships.length,
        });

        try {
          const { entities, relationships, structures, question_blocks } = await extractKnowledgeFromBatch(batch, fileName, signal);
          handleExtractionResult(entities, relationships, structures, question_blocks, startSlide, endSlide);

          if (entities.length > 0 || relationships.length > 0) {
            await medChemGraphDb.mergeGraphToDexie(entities, relationships);
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        } catch (slideErr) {
          console.warn(`Extraction error on text batch ${bIdx + 1}:`, slideErr);
        }
      }
    } else if (isPdf) {
      onProgress?.({
        stage: 'parsing',
        currentBatch: 0,
        totalBatches: 0,
        currentSlide: 0,
        totalSlides: 0,
        message: `Parsing PDF "${fileName}" and inspecting text density...`,
      });

      const arrayBuffer = await file.arrayBuffer();
      const pdfResult: ParsePdfResult = await parsePdf(arrayBuffer, fileName, (msg) => {
        onProgress?.({
          stage: 'parsing',
          currentBatch: 0,
          totalBatches: 0,
          currentSlide: 0,
          totalSlides: 0,
          message: msg,
        });
      });

      const totalChars = pdfResult.totalChars;
      const slides = pdfResult.slides;
      totalSlides = slides.length;
      allSlides = slides;
      
      if (slides[0]?.inlineData) imageInlineData = slides[0].inlineData;
      if (slides.length === 0) throw new Error(`PDF "${fileName}" contains 0 readable pages.`);

      if (pdfResult.isScannedOrImageOnly) {
        const batchErrors: string[] = [];

        for (let i = 0; i < slides.length; i++) {
          if (signal?.aborted) throw new DOMException('Ingestion aborted by user', 'AbortError');
          const slide = slides[i];
          if (!slide.inlineData) continue;

          onProgress?.({
            stage: 'extracting',
            currentBatch: i + 1,
            totalBatches: slides.length,
            currentSlide: slide.slideNumber,
            totalSlides: slides.length,
            message: `Analyzing scanned slide ${slide.slideNumber}/${slides.length} visually with Gemini Flash...`,
            discoveredEntitiesCount: allDiscoveredEntities.length,
            discoveredRelationshipsCount: allDiscoveredRelationships.length,
          });

          try {
            const { entities, relationships, structures, question_blocks } = await extractKnowledgeFromImage(
              slide.inlineData,
              `${fileName} (Page ${slide.slideNumber})`
            );
            handleExtractionResult(entities, relationships, structures, question_blocks, slide.slideNumber, slide.slideNumber);

            if (entities.length > 0 || relationships.length > 0) {
              onProgress?.({
                stage: 'merging',
                currentBatch: i + 1,
                totalBatches: slides.length,
                currentSlide: slide.slideNumber,
                totalSlides: slides.length,
                message: `Saved ${entities.length} entities and ${relationships.length} relationships from page ${slide.slideNumber} to Dexie...`,
                discoveredEntitiesCount: allDiscoveredEntities.length,
                discoveredRelationshipsCount: allDiscoveredRelationships.length,
              });
              await medChemGraphDb.mergeGraphToDexie(entities, relationships);
              await new Promise((resolve) => setTimeout(resolve, 0));
            }
          } catch (err: any) {
            batchErrors.push(`Page ${slide.slideNumber}: ${err.message || "Network Request Failed"}`);
          }
        }

        if (allDiscoveredEntities.length === 0 && batchErrors.length > 0) {
          throw new Error(`Knowledge extraction failed on scanned PDF: ${batchErrors.slice(0, 3).join('; ')}`);
        }

        if (slides[0]?.inlineData) imageInlineData = slides[0].inlineData;
        rawContext = slides.slice(0, 5).map((s) => `[Page ${s.slideNumber}] ${s.text || 'Rendered visual slide diagram'}`).join('\n\n');
      } else {
        rawContext = slides.slice(0, 5).map((s) => `[Page ${s.slideNumber}] ${s.text}`).join('\n\n');

        const PDF_BATCH_SIZE = 2;
        const batches: IngestionSlide[][] = [];
        for (let i = 0; i < slides.length; i += PDF_BATCH_SIZE) {
          batches.push(slides.slice(i, i + PDF_BATCH_SIZE));
        }
        const batchErrors: string[] = [];

        for (let b = 0; b < batches.length; b++) {
          await new Promise((resolve) => setTimeout(resolve, 4000));
          if (signal?.aborted) throw new DOMException('Ingestion aborted by user', 'AbortError');
          
          const batch = batches[b];
          const startSlide = batch[0].slideNumber;
          const endSlide = batch[batch.length - 1].slideNumber;

          onProgress?.({
            stage: 'extracting',
            currentBatch: b + 1,
            totalBatches: batches.length,
            currentSlide: startSlide,
            totalSlides: slides.length,
            message: `Analyzing slide ${startSlide}${startSlide !== endSlide ? `–${endSlide}` : ''}/${slides.length} with Gemini MedChem Graph & Quiz extraction...`,
            discoveredEntitiesCount: allDiscoveredEntities.length,
            discoveredRelationshipsCount: allDiscoveredRelationships.length,
          });

          try {
            const { entities, relationships, structures, question_blocks } = await extractKnowledgeFromBatch(batch, fileName, signal);
            handleExtractionResult(entities, relationships, structures, question_blocks, startSlide, endSlide);

            if (entities.length > 0 || relationships.length > 0) {
              onProgress?.({
                stage: 'merging',
                currentBatch: b + 1,
                totalBatches: batches.length,
                currentSlide: endSlide,
                totalSlides: slides.length,
                message: `Saving ${entities.length} entities and ${relationships.length} relationships to Dexie IndexedDB...`,
                discoveredEntitiesCount: allDiscoveredEntities.length,
                discoveredRelationshipsCount: allDiscoveredRelationships.length,
              });

              await medChemGraphDb.mergeGraphToDexie(entities, relationships);
              await new Promise((resolve) => setTimeout(resolve, 0));
            }
          } catch (err: any) {
            batchErrors.push(`Batch ${b + 1} (Slide ${startSlide}): ${err.message || "Network Request Failed"}`);
          }
        }

        if (allDiscoveredEntities.length === 0 && batchErrors.length > 0) {
          throw new Error(`Knowledge extraction failed across all PDF batches: ${batchErrors.slice(0, 3).join('; ')}`);
        }
      }
    } else {
      // PPTX slides
      onProgress?.({
        stage: 'parsing',
        currentBatch: 0,
        totalBatches: 0,
        currentSlide: 0,
        totalSlides: 0,
        message: `Parsing PPTX "${fileName}"...`,
      });

      const arrayBuffer = await file.arrayBuffer();
      const pptxResult = await parsePptx(arrayBuffer, fileName);
      const slides = pptxResult.slides;
      totalSlides = slides.length;
      allSlides = slides;

      if (slides.length === 0) throw new Error(`PPTX "${fileName}" contains 0 readable slides.`);

      rawContext = slides.slice(0, 5).map((s) => `[Slide ${s.slideNumber}] ${s.text}`).join('\n\n');

      const batches = createOverlappingSlideWindows(slides, 3, 2);
      const batchErrors: string[] = [];

      for (let b = 0; b < batches.length; b++) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        if (signal?.aborted) throw new DOMException('Ingestion aborted by user', 'AbortError');
        
        const batch = batches[b];
        const startSlide = batch[0].slideNumber;
        const endSlide = batch[batch.length - 1].slideNumber;

        onProgress?.({
          stage: 'extracting',
          currentBatch: b + 1,
          totalBatches: batches.length,
          currentSlide: startSlide,
          totalSlides: slides.length,
          message: `Analyzing slides ${startSlide}–${endSlide} with Gemini MedChem Graph & Quiz extraction...`,
          discoveredEntitiesCount: allDiscoveredEntities.length,
          discoveredRelationshipsCount: allDiscoveredRelationships.length,
        });

        try {
          const { entities, relationships, structures, question_blocks } = await extractKnowledgeFromBatch(batch, fileName, signal);
          handleExtractionResult(entities, relationships, structures, question_blocks, startSlide, endSlide);

          if (entities.length > 0 || relationships.length > 0) {
            onProgress?.({
              stage: 'merging',
              currentBatch: b + 1,
              totalBatches: batches.length,
              currentSlide: endSlide,
              totalSlides: slides.length,
              message: `Saving ${entities.length} entities and ${relationships.length} relationships to Dexie IndexedDB...`,
              discoveredEntitiesCount: allDiscoveredEntities.length,
              discoveredRelationshipsCount: allDiscoveredRelationships.length,
            });

            await medChemGraphDb.mergeGraphToDexie(entities, relationships);
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        } catch (err: any) {
          batchErrors.push(`Batch ${b + 1}: ${err.message || "Network Request Failed"}`);
        }
      }

      if (allDiscoveredEntities.length === 0 && batchErrors.length > 0) {
        throw new Error(`Knowledge extraction failed on PPTX: ${batchErrors.slice(0, 3).join('; ')}`);
      }
    }

    if (allDiscoveredEntities.length === 0) {
      throw new Error(
        `Discovered 0 chemical entities or pharmacological relationships from "${fileName}". Please ensure the document contains medicinal chemistry or pharmacology content.`
      );
    }

    // Trigger background PubChem enrichment
    const entityPayloadMap = new Map<string, { id: string; name?: string; cid?: number; canonicalSmiles?: string; pubchemMolBlock?: string }>();
    allDiscoveredEntities
      .filter(
        (e) =>
          (e.type === 'DRUG' || e.type === 'METABOLITE') &&
          !isNonCompoundEntity(e.id) &&
          !isNonCompoundEntity(e.name || '')
      )
      .forEach((e) => {
        const normId = e.id.trim().toLowerCase();
        if (!entityPayloadMap.has(normId)) {
          const rawSmiles = e.canonicalSmiles || e.smiles || e.chemData?.canonicalSmiles || e.pubchemAudit?.canonicalSmiles;
          const resolvedSmiles = rawSmiles || getKnownDrugSmiles(e.name) || getKnownDrugSmiles(normId);
          const rawMolBlock = e.pubchemMolBlock || e.chemData?.pubchemMolBlock;
          entityPayloadMap.set(normId, {
            id: normId,
            name: e.name || e.id,
            cid: e.cid || e.chemData?.cid || e.pubchemAudit?.cid,
            canonicalSmiles: resolvedSmiles,
            pubchemMolBlock: rawMolBlock,
          });
        }
      });
    const entityPayload = Array.from(entityPayloadMap.values());
    const drugOrMetaboliteIds = entityPayload.map((e) => e.id);

    let enrichedCount = 0;
    if (entityPayload.length > 0) {
      onProgress?.({
        stage: 'enriching',
        currentBatch: 1,
        totalBatches: 1,
        currentSlide: totalSlides,
        totalSlides: totalSlides,
        message: `PubChem Rate-Limited Queue: [0/${entityPayload.length}] Processing structures...`,
        discoveredEntitiesCount: allDiscoveredEntities.length,
        discoveredRelationshipsCount: allDiscoveredRelationships.length,
      });

      try {
        const enrichResult = await runEtlIngestion(
          entityPayload,
          (completed, total, currentName) => {
            onProgress?.({
              stage: 'enriching',
              currentBatch: 1,
              totalBatches: 1,
              currentSlide: totalSlides,
              totalSlides: totalSlides,
              message: `PubChem Rate-Limited Queue: [${completed}/${total}] Processing ${currentName || 'compound'}...`,
              discoveredEntitiesCount: allDiscoveredEntities.length,
              discoveredRelationshipsCount: allDiscoveredRelationships.length,
              enrichedCount: completed,
            });
          },
          signal
        );
        enrichedCount = enrichResult.enrichedCount;
      } catch (enrichErr) {
        console.warn('[lectureIngestion] Web Worker PubChem enrichment failed, falling back to sequential enrich:', enrichErr);
        try {
          const enrichResult = await enrichEntitiesWithPubChem(
            drugOrMetaboliteIds,
            (completed, total, currentName) => {
              onProgress?.({
                stage: 'enriching',
                currentBatch: 1,
                totalBatches: 1,
                currentSlide: totalSlides,
                totalSlides: totalSlides,
                message: `PubChem Rate-Limited Queue: [${completed}/${total}] Processing ${currentName}...`,
                discoveredEntitiesCount: allDiscoveredEntities.length,
                discoveredRelationshipsCount: allDiscoveredRelationships.length,
                enrichedCount: completed,
              });
            },
            signal
          );
          enrichedCount = enrichResult.enrichedCount;
        } catch (fbErr) {
          console.warn('[lectureIngestion] Sequential PubChem enrichment fallback warning:', fbErr);
        }
      }
    }

    try {
      const entityIds = allDiscoveredEntities.map((e) => e.id);
      const dbRecs = await medChemGraphDb.entities.bulkGet(entityIds);
      allDiscoveredEntities = allDiscoveredEntities.map((e, idx) => dbRecs[idx] || e);
    } catch (err) {
      console.warn('[lectureIngestion] Bulk get entities warning, falling back to discovered cache:', err);
    }

    const canonicalCandidateStructures = deduplicateAndCanonicalizeStructures(allDiscoveredEntities, totalSlides);

 // STRICT FIX: Only rely on the rich structures directly extracted by the LLM. 
    // Do NOT aggressively scrape graph entities unless the LLM failed completely.
    let masterStructures: ChemicalStructure[] = [];
    
    if (allExtractedStructures.length > 0) {
      masterStructures = deduplicateMasterStructures(allExtractedStructures);
    } else {
      const fallbackStructures = deduplicateAndCanonicalizeStructures(allDiscoveredEntities, totalSlides);
      masterStructures = deduplicateMasterStructures(fallbackStructures);
    }

    // Ensure fallback questions exist if Gemini generated nothing
    if (allGeneratedQuestions.length === 0) {
       const fallbackQs = synthesizePageFallbackQuestions(1, fileName, masterStructures);
       allGeneratedQuestions.push(...fallbackQs);
    }

    onProgress?.({
      stage: 'complete',
      currentBatch: totalSlides,
      totalBatches: totalSlides,
      currentSlide: totalSlides,
      totalSlides: totalSlides,
      message: `Ingestion complete! Discovered ${allDiscoveredEntities.length} entities and ${masterStructures.length} chemical structures, generated ${allGeneratedQuestions.length} questions.`,
      discoveredEntitiesCount: allDiscoveredEntities.length,
      discoveredRelationshipsCount: allDiscoveredRelationships.length,
      enrichedCount,
      generatedQuestionsCount: allGeneratedQuestions.length,
    });

    return {
      totalSlides,
      totalEntitiesDiscovered: allDiscoveredEntities.length,
      totalRelationshipsDiscovered: allDiscoveredRelationships.length,
      enrichedCount,
      entities: allDiscoveredEntities,
      relationships: allDiscoveredRelationships,
      generatedQuestions: allGeneratedQuestions,
      structures: masterStructures,
      slides: allSlides,
      question_blocks: allGeneratedQuestionBlocks,
    };
  } catch (err: any) {
    const errorMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err?.message ||
      String(err);
    console.error('[ingestLectureDocument] Failure:', err);
    onProgress?.({
      stage: 'error',
      currentBatch: 0,
      totalBatches: 0,
      currentSlide: 0,
      totalSlides: 0,
      message: `Ingestion failed: ${errorMsg}`,
      error: errorMsg,
    });
    throw new Error(errorMsg);
  }
}

export function deduplicateMasterStructures(structures: ChemicalStructure[]): ChemicalStructure[] {
  if (!structures || structures.length === 0) return [];

  const masterList: ChemicalStructure[] = [];

  for (const struct of structures) {
    if (!struct) continue;

    const rawLabel = getStructureDocumentLabel(struct);
    const structCid = struct.cid || struct.pubchemAudit?.cid;
    const cleanName = (struct.name || '').trim().toLowerCase();

    const existingIndex = masterList.findIndex((item) => {
      const itemLabel = getStructureDocumentLabel(item);
      const itemCid = item.cid || item.pubchemAudit?.cid;
      const itemName = (item.name || '').trim().toLowerCase();

      if (structCid && itemCid && structCid > 0 && itemCid > 0 && structCid === itemCid) return true;
      if (rawLabel && itemLabel && rawLabel.toUpperCase() === itemLabel.toUpperCase()) return true;
      if (
        cleanName &&
        itemName &&
        cleanName === itemName &&
        !cleanName.startsWith('structure') &&
        !cleanName.startsWith('compound') &&
        !cleanName.startsWith('drug')
      ) {
        return true;
      }
      return false;
    });

    const structPages: number[] =
      Array.isArray(struct.sourcePageNumbers) && struct.sourcePageNumbers.length > 0
        ? struct.sourcePageNumbers
        : struct.sourcePageNumber
        ? [struct.sourcePageNumber]
        : [1];

    if (existingIndex === -1) {
      const initialPages = Array.from(new Set(structPages)).sort((a, b) => a - b);
      const resolvedSmiles =
        struct.canonicalSmiles ||
        struct.smiles ||
        struct.pubchemAudit?.canonicalSmiles ||
        getKnownDrugSmiles(struct.name) ||
        getKnownDrugSmiles(struct.id);
      masterList.push({
        ...struct,
        id: rawLabel || struct.id,
        document_label: rawLabel || struct.document_label || struct.id,
        canonicalSmiles: resolvedSmiles,
        smiles: resolvedSmiles,
        sourcePageNumber: initialPages[0] || 1,
        sourcePageNumbers: initialPages,
        moa_summary: cleanSingleParagraphSar(struct.moa_summary || struct.sar_rationale || struct.sarNotes),
        sar_rationale: cleanSingleParagraphSar(struct.moa_summary || struct.sar_rationale || struct.sarNotes),
        sarNotes: cleanSingleParagraphSar(struct.moa_summary || struct.sar_rationale || struct.sarNotes),
        pharmacophores: filterValidPharmacophores(struct.pharmacophores),
      });
    } else {
      const existing = masterList[existingIndex];

      const mergedPages = Array.from(
        new Set([...(existing.sourcePageNumbers || [existing.sourcePageNumber || 1]), ...structPages])
      ).sort((a, b) => a - b);
      existing.sourcePageNumbers = mergedPages;
      existing.sourcePageNumber = mergedPages[0] || 1;

      if ((!existing.document_label || existing.document_label === '') && rawLabel) {
        existing.document_label = rawLabel;
        existing.id = rawLabel;
      }

      if (
        (!existing.name || existing.name.startsWith('Structure ') || existing.name.startsWith('Compound ')) &&
        struct.name &&
        !struct.name.startsWith('Structure ')
      ) {
        existing.name = struct.name;
      }

      if (!existing.cid && structCid) existing.cid = structCid;
      if (!existing.pngUrl && struct.pngUrl) existing.pngUrl = struct.pngUrl;
      if (!existing.pubchemUrl && struct.pubchemUrl) existing.pubchemUrl = struct.pubchemUrl;

      if (!existing.target_receptor && struct.target_receptor) {
        existing.target_receptor = struct.target_receptor;
        existing.target = struct.target_receptor;
      }
      if (!existing.target && struct.target) existing.target = struct.target;

      const incomingMoa = cleanSingleParagraphSar(struct.moa_summary || struct.sar_rationale || struct.sarNotes);
      if (incomingMoa) {
        if (!existing.moa_summary || incomingMoa.length >= (existing.moa_summary || existing.sar_rationale || '').length) {
          existing.moa_summary = incomingMoa;
          existing.sar_rationale = incomingMoa;
          existing.sarNotes = incomingMoa;
        }
      }
      existing.moa_summary = cleanSingleParagraphSar(existing.moa_summary || existing.sar_rationale);
      existing.sar_rationale = existing.moa_summary;
      existing.sarNotes = existing.moa_summary;

      const validStructPharmacophores = filterValidPharmacophores(struct.pharmacophores);
      if (validStructPharmacophores.length > 0) {
        if (!existing.pharmacophores || existing.pharmacophores.length === 0 || validStructPharmacophores.length >= existing.pharmacophores.length) {
          existing.pharmacophores = validStructPharmacophores;
        } else {
          for (const p of validStructPharmacophores) {
            const pKey = (p.name || p.id || '').trim().toLowerCase();
            if (!existing.pharmacophores.some((ep) => (ep.name || ep.id || '').trim().toLowerCase() === pKey)) {
              existing.pharmacophores.push(p);
            }
          }
        }
      }
      existing.pharmacophores = filterValidPharmacophores(existing.pharmacophores);
      
      if (Array.isArray(struct.keyFunctionalGroups) && struct.keyFunctionalGroups.length > 0) {
        if (!existing.keyFunctionalGroups || existing.keyFunctionalGroups.length === 0) {
          existing.keyFunctionalGroups = [...struct.keyFunctionalGroups];
        } else {
          struct.keyFunctionalGroups.forEach((fg) => {
            if (!existing.keyFunctionalGroups!.includes(fg)) {
              existing.keyFunctionalGroups!.push(fg);
            }
          });
        }
      }
      if (struct.reversibility && (!existing.reversibility || existing.reversibility === 'Reversible')) existing.reversibility = struct.reversibility;
      if (struct.route && (!existing.route || existing.route === 'Oral')) existing.route = struct.route;
      if (struct.chemicalClass && (!existing.chemicalClass || existing.chemicalClass === 'Small molecule compound')) existing.chemicalClass = struct.chemicalClass;
      if (struct.pharmacologicalClass && (!existing.pharmacologicalClass || existing.pharmacologicalClass === 'Pharmacological Agent')) {
        existing.pharmacologicalClass = struct.pharmacologicalClass;
      }
      if (struct.pkPdHighlights) {
        existing.pkPdHighlights = { ...existing.pkPdHighlights, ...struct.pkPdHighlights };
      }
      if (struct.tradeName && !existing.tradeName) existing.tradeName = struct.tradeName;
      if (struct.mw !== undefined && existing.mw === undefined) existing.mw = struct.mw;
      if (struct.logP !== undefined && existing.logP === undefined) existing.logP = struct.logP;
      if (struct.drug_state && (!existing.drug_state || existing.drug_state === 'Active Drug')) existing.drug_state = struct.drug_state;
      if (struct.pubchemAudit && (!existing.pubchemAudit || existing.pubchemAudit.status !== 'verified')) {
        existing.pubchemAudit = { ...struct.pubchemAudit };
      }
      if (!existing.canonicalSmiles || existing.canonicalSmiles === '') {
        existing.canonicalSmiles =
          struct.canonicalSmiles ||
          struct.smiles ||
          struct.pubchemAudit?.canonicalSmiles ||
          getKnownDrugSmiles(existing.name) ||
          getKnownDrugSmiles(existing.id);
        existing.smiles = existing.canonicalSmiles;
      }
      if (!existing.pubchemMolBlock && struct.pubchemMolBlock) {
        existing.pubchemMolBlock = struct.pubchemMolBlock;
      }
    }
  }

  return sortStructuresByDocumentLabel(masterList);
}

export function deduplicateAndCanonicalizeStructures(
  entities: GraphEntity[],
  totalSlidesCount = 1
): ChemicalStructure[] {
  const romanNumerals = [
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
    'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV'
  ];

  const candidateEntities = entities.filter((e) => {
    if (!e || (!e.id && !e.name)) return false;
    const nameOrId = e.name || e.id;
    if (isNonCompoundEntity(e.id) || isNonCompoundEntity(nameOrId)) return false;
    return e.type === 'DRUG' || e.type === 'METABOLITE' || Boolean(e.chemData);
  });

  interface CanonicalGroup {
    key: string;
    canonicalName: string;
    document_label?: string;
    orderIndex: number;
    type: string;
    cid?: number;
    canonicalSmiles?: string;
    pubchemMolBlock?: string;
    chemData?: any;
    clinicalData?: OpenFdaClinicalData;
    clinicalSummary: string;
    sourcePageNumbers: Set<number>;
    earliestPage: number;
    rawEntities: GraphEntity[];
  }

  const groupsMap = new Map<string, CanonicalGroup>();

  for (const ent of candidateEntities) {
    const cleanName = sanitizeStructureLabel(ent.name || ent.id);
    const cid = ent.cid || ent.chemData?.cid;
    const key = cid && cid > 0 ? `cid:${cid}` : `name:${cleanName.toLowerCase()}`;
    const rawLabel = (ent as any).document_label || (ent as any).label;
    const entSmiles = ent.canonicalSmiles || ent.smiles || ent.chemData?.canonicalSmiles || ent.chemData?.isomericSmiles || ent.pubchemAudit?.canonicalSmiles;
    const entMolBlock = ent.pubchemMolBlock || ent.chemData?.pubchemMolBlock;

    const entPage = ent.sourcePageNumber || (ent as any).source_slide_index || 1;
    const entPages: number[] =
      ent.sourcePageNumbers && ent.sourcePageNumbers.length > 0
        ? ent.sourcePageNumbers
        : [entPage];

    const existing = groupsMap.get(key);
    if (!existing) {
      groupsMap.set(key, {
        key,
        canonicalName: cleanName || ent.name || ent.id,
        document_label: rawLabel,
        orderIndex: candidateEntities.indexOf(ent),
        type: ent.type || 'DRUG',
        cid: cid || undefined,
        canonicalSmiles: entSmiles,
        pubchemMolBlock: entMolBlock,
        chemData: ent.chemData ? { ...ent.chemData } : undefined,
        clinicalData: ent.clinicalData,
        clinicalSummary: (ent.clinical_and_sar_summary || '').trim(),
        sourcePageNumbers: new Set(entPages),
        earliestPage: Math.min(...entPages),
        rawEntities: [ent],
      });
    } else {
      entPages.forEach((p) => existing.sourcePageNumbers.add(p));
      existing.earliestPage = Math.min(...Array.from(existing.sourcePageNumbers));

      if (!existing.document_label && rawLabel) {
        existing.document_label = rawLabel;
      }

      if (cleanName.length > existing.canonicalName.length && !existing.canonicalName.includes('(')) {
        existing.canonicalName = cleanName;
      }
      if (!existing.cid && cid) existing.cid = cid;
      if (!existing.canonicalSmiles && entSmiles) existing.canonicalSmiles = entSmiles;
      if (!existing.pubchemMolBlock && entMolBlock) existing.pubchemMolBlock = entMolBlock;
      if (!existing.chemData && ent.chemData) existing.chemData = { ...ent.chemData };
      if (!existing.clinicalData && ent.clinicalData) existing.clinicalData = ent.clinicalData;
      
      const newSummary = cleanSingleParagraphSar((ent.clinical_and_sar_summary || '').trim());
      if (newSummary) {
        if (!existing.clinicalSummary || newSummary.length >= existing.clinicalSummary.length) {
          existing.clinicalSummary = newSummary;
        }
      }
      existing.rawEntities.push(ent);
    }
  }

  const sortedGroups = Array.from(groupsMap.values()).sort((a, b) => {
    if (a.earliestPage !== b.earliestPage) {
      return a.earliestPage - b.earliestPage;
    }
    const rankA = parseDocumentLabelRank(a.document_label);
    const rankB = parseDocumentLabelRank(b.document_label);
    if (rankA !== 9999 || rankB !== 9999) {
      if (rankA !== rankB) {
        return rankA - rankB;
      }
    }
    return a.orderIndex - b.orderIndex;
  });

  return sortedGroups.map((group, idx) => {
    const docLabel = group.document_label || romanNumerals[idx] || String(idx + 1);
    const sortedPages = Array.from(group.sourcePageNumbers).sort((a, b) => a - b);
    const earliest = sortedPages[0] || group.earliestPage || 1;

    const cid = group.cid || group.chemData?.cid;
    const pngUrl =
      group.chemData?.structureImageDataUrl ||
      (cid
        ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large`
        : '');

    const resolvedSmiles =
      group.canonicalSmiles ||
      group.chemData?.canonicalSmiles ||
      group.chemData?.isomericSmiles ||
      group.rawEntities.find((e: any) => e.canonicalSmiles || e.smiles)?.canonicalSmiles ||
      group.rawEntities.find((e: any) => e.canonicalSmiles || e.smiles)?.smiles ||
      getKnownDrugSmiles(group.canonicalName) ||
      getKnownDrugSmiles(group.key);

    const resolvedMolBlock =
      group.pubchemMolBlock ||
      group.chemData?.pubchemMolBlock ||
      group.rawEntities.find((e: any) => e.pubchemMolBlock || e.chemData?.pubchemMolBlock)?.pubchemMolBlock ||
      group.rawEntities.find((e: any) => e.pubchemMolBlock || e.chemData?.pubchemMolBlock)?.chemData?.pubchemMolBlock;

    const clinicalData =
      group.clinicalData ||
      group.rawEntities.find((e: any) => e.clinicalData)?.clinicalData;

    const rawMoa =
      clinicalData?.mechanism ||
      group.rawEntities.find((e: any) => e.moa_summary)?.moa_summary ||
      cleanSingleParagraphSar(group.clinicalSummary || '');

    const moa_summary = cleanSingleParagraphSar(rawMoa);

    return {
      id: docLabel,
      document_label: docLabel,
      name: group.canonicalName,
      chemicalClass: group.type,
      pharmacologicalClass: group.clinicalSummary.slice(0, 80) || 'Pharmacological Agent',
      canonicalSmiles: resolvedSmiles,
      smiles: resolvedSmiles,
      pubchemMolBlock: resolvedMolBlock,
      cid: cid || undefined,
      pngUrl,
      target: group.rawEntities[0]?.id || group.canonicalName.toLowerCase(),
      reversibility: 'Reversible',
      route: 'Oral',
      keyFunctionalGroups: [],
      pkPdHighlights: {
        onset: 'Standard',
        duration: 'Standard',
        halfLife: clinicalData?.halfLife || 'Standard',
        elimination: clinicalData?.metabolism || 'Hepatic / Renal',
      },
      sarNotes: cleanSingleParagraphSar(group.clinicalSummary || ''),
      moa_summary,
      sar_rationale: moa_summary,
      majorToxicityOrLimitation:
        clinicalData?.adverseReactions ||
        clinicalData?.contraindicationsText ||
        group.rawEntities.find((e: any) => e.majorToxicityOrLimitation)?.majorToxicityOrLimitation ||
        undefined,
      clinicalData,
      sourcePageNumber: earliest,
      sourcePageNumbers: sortedPages,
      mw: group.chemData?.molecularWeight,
      logP: group.chemData?.xlogp,
      pubchemAudit: {
        cid: cid || 0,
        status: cid ? ('verified' as const) : (resolvedSmiles ? ('verified' as const) : ('unresolved' as const)),
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: resolvedSmiles || group.chemData?.canonicalSmiles,
        pubchemMolBlock: resolvedMolBlock,
        iupacName: group.chemData?.iupacName,
        molecularWeight: group.chemData?.molecularWeight,
        xlogp: group.chemData?.xlogp,
        pubChemUrl: cid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}` : '',
      },
    };
  });
}

export interface ProcessFileResult extends IngestDocumentResult {
  reviewModule: ReviewModule;
}

export async function processFileAndGenerateQuestions(
  file: File,
  onProgress?: (progress: IngestionProgress) => void,
  signal?: AbortSignal
): Promise<ProcessFileResult> {
  const result = await ingestLectureDocument(file, onProgress, signal);

  const initialStructures =
    result.structures && result.structures.length > 0
      ? result.structures
      : deduplicateAndCanonicalizeStructures(result.entities, result.totalSlides);

  const verifiedResults: Array<any> = new Array(initialStructures.length);
  const needsVerificationIndices: number[] = [];
  const structuresToVerify: typeof initialStructures = [];

  for (let i = 0; i < initialStructures.length; i++) {
    const s = initialStructures[i];
    const hasImage = Boolean(s.pngUrl || (s as any).structureImageDataUrl || (s as any).chemData?.structureImageDataUrl);
    if (s.cid && s.cid > 0 && hasImage) {
      verifiedResults[i] = {
        id: s.id,
        name: s.name,
        cid: s.cid,
        canonicalSmiles: s.canonicalSmiles || s.smiles || s.pubchemAudit?.canonicalSmiles,
        pubchemMolBlock: s.pubchemMolBlock || (s as any).chemData?.pubchemMolBlock,
        molecularWeight: s.mw ?? s.pubchemAudit?.molecularWeight,
        xlogp: s.logP ?? s.pubchemAudit?.xlogp,
        structureImageDataUrl: (s as any).structureImageDataUrl || (s as any).chemData?.structureImageDataUrl || s.pngUrl || null,
        isPlaceholder: false,
      };
    } else {
      needsVerificationIndices.push(i);
      structuresToVerify.push(s);
    }
  }

  if (structuresToVerify.length > 0) {
    const fetchedResults = await verifyStructuresBatchPubChem(structuresToVerify, undefined, signal);
    needsVerificationIndices.forEach((origIdx, subIdx) => {
      verifiedResults[origIdx] = fetchedResults[subIdx];
    });
  }

  const rawStructures: ChemicalStructure[] = initialStructures.map((s, idx) => {
    const v = verifiedResults[idx];
    const cid = v?.cid || s.cid;
    const pngUrl =
      v?.structureImageDataUrl ||
      s.pngUrl ||
      (cid ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large` : '');

    let enrichedData: ChemicalStructure | undefined;
    for (const q of result.generatedQuestions) {
      const found = q.structuresDisplayed?.find(
        (sd) =>
          sd.id.toLowerCase() === s.id.toLowerCase() ||
          sd.name.toLowerCase() === s.name.toLowerCase() ||
          (sd.cid && sd.cid === cid)
      );
      if (found && (found.pharmacophores?.length || found.target_receptor || found.sar_rationale)) {
        enrichedData = found;
        break;
      }
    }

    const clinicalData = v?.clinicalData || enrichedData?.clinicalData || s.clinicalData;
    const target_receptor = enrichedData?.target_receptor || s.target_receptor;
    const target = target_receptor || enrichedData?.target || s.target;
    const rawMoa =
      clinicalData?.mechanism ||
      enrichedData?.moa_summary ||
      enrichedData?.sar_rationale ||
      s.moa_summary ||
      s.sar_rationale;
    const moa_summary = cleanSingleParagraphSar(rawMoa);
    const sar_rationale = moa_summary;
    const sarNotes = cleanSingleParagraphSar(moa_summary || enrichedData?.sarNotes || s.sarNotes);
    const rawPharmacophores =
      enrichedData?.pharmacophores && enrichedData.pharmacophores.length > 0
        ? enrichedData.pharmacophores
        : s.pharmacophores;
    const pharmacophores = filterValidPharmacophores(rawPharmacophores);
    const reversibility = enrichedData?.reversibility || s.reversibility;
    const route = enrichedData?.route || s.route;
    const keyFunctionalGroups =
      enrichedData?.keyFunctionalGroups && enrichedData.keyFunctionalGroups.length > 0
        ? enrichedData.keyFunctionalGroups
        : s.keyFunctionalGroups;
    const pkPdHighlights = {
      onset: enrichedData?.pkPdHighlights?.onset || s.pkPdHighlights?.onset || 'Standard',
      duration: enrichedData?.pkPdHighlights?.duration || s.pkPdHighlights?.duration || 'Standard',
      halfLife: clinicalData?.halfLife || enrichedData?.pkPdHighlights?.halfLife || s.pkPdHighlights?.halfLife || 'Standard',
      elimination: clinicalData?.metabolism || enrichedData?.pkPdHighlights?.elimination || s.pkPdHighlights?.elimination || 'Hepatic / Renal',
      bioactivation: enrichedData?.pkPdHighlights?.bioactivation || s.pkPdHighlights?.bioactivation,
    };
    const chemicalClass =
      enrichedData?.chemicalClass &&
      enrichedData.chemicalClass !== 'DRUG' &&
      enrichedData.chemicalClass !== 'Small molecule compound'
        ? enrichedData.chemicalClass
        : s.chemicalClass;
    const pharmacologicalClass =
      enrichedData?.pharmacologicalClass &&
      enrichedData.pharmacologicalClass !== 'Pharmacological Agent'
        ? enrichedData.pharmacologicalClass
        : s.pharmacologicalClass;

    const document_label = enrichedData?.document_label || s.document_label || s.id;
    const mw = v?.molecularWeight ?? enrichedData?.mw ?? s.pubchemAudit?.molecularWeight ?? s.mw;
    const logP = v?.xlogp ?? enrichedData?.logP ?? s.pubchemAudit?.xlogp ?? s.logP;
    const drug_state = enrichedData?.drug_state || s.drug_state;
    const resolvedSmiles =
      v?.canonicalSmiles ||
      enrichedData?.canonicalSmiles ||
      enrichedData?.smiles ||
      s.canonicalSmiles ||
      s.smiles ||
      s.pubchemAudit?.canonicalSmiles ||
      (s as any).chemData?.canonicalSmiles;

    const resolvedMolBlock =
      v?.pubchemMolBlock ||
      enrichedData?.pubchemMolBlock ||
      s.pubchemMolBlock ||
      (s as any).chemData?.pubchemMolBlock;

    return {
      ...s,
      id: document_label,
      document_label,
      canonicalSmiles: resolvedSmiles,
      smiles: resolvedSmiles,
      pubchemMolBlock: resolvedMolBlock,
      cid: cid || undefined,
      pngUrl,
      target,
      target_receptor,
      reversibility,
      drug_state,
      route,
      keyFunctionalGroups,
      pharmacophores,
      pkPdHighlights,
      moa_summary,
      sarNotes,
      sar_rationale,
      majorToxicityOrLimitation:
        clinicalData?.adverseReactions ||
        clinicalData?.contraindicationsText ||
        enrichedData?.majorToxicityOrLimitation ||
        s.majorToxicityOrLimitation,
      clinicalData,
      chemicalClass,
      pharmacologicalClass,
      mw,
      logP,
      properties: {
        ...(s.properties || {}),
        logP,
        mw,
      },
      pubchemAudit: {
        ...s.pubchemAudit,
        cid: cid || 0,
        status: cid ? ('verified' as const) : (resolvedSmiles ? ('verified' as const) : ('unresolved' as const)),
        canonicalSmiles: resolvedSmiles || v?.canonicalSmiles || s.pubchemAudit?.canonicalSmiles,
        pubchemMolBlock: resolvedMolBlock,
        iupacName: v?.iupacName || s.pubchemAudit?.iupacName,
        molecularFormula: v?.molecularFormula || s.pubchemAudit?.molecularFormula,
        molecularWeight: mw,
        xlogp: logP,
        pubChemUrl: cid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}` : '',
      },
    };
  });

  // Programmatic LogP Hydration: Fetch XLogP directly from PubChem API if missing, assign to drug, and persist to Dexie
  for (const struct of rawStructures) {
    const structCid = struct.cid || struct.pubchemAudit?.cid;
    if (structCid && (struct.logP === undefined || struct.logP === null)) {
      try {
        const logPResponse = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${structCid}/property/XLogP/JSON`);
        if (logPResponse.ok) {
          const data = await logPResponse.json();
          const fetchedXLogP = data?.PropertyTable?.Properties?.[0]?.XLogP;
          if (fetchedXLogP !== undefined && fetchedXLogP !== null) {
            struct.logP = Number(fetchedXLogP);
            struct.properties = { ...(struct.properties || {}), logP: struct.logP };
            if (struct.pubchemAudit) {
              struct.pubchemAudit.xlogp = struct.logP;
            }
          }
        }
      } catch (err) {
        console.warn(`[lectureIngestion] Programmatic LogP fetch error for CID ${structCid}:`, err);
      }
    } else if (struct.logP !== undefined) {
      struct.properties = { ...(struct.properties || {}), logP: struct.logP };
    }

    // Persist to Dexie entities table
    const entityId = (struct.name || struct.id || '').trim().toLowerCase();
    if (entityId && struct.logP !== undefined) {
      try {
        const existing = await medChemGraphDb.entities.get(entityId);
        if (existing) {
          await medChemGraphDb.entities.update(entityId, {
            logP: struct.logP,
            properties: {
              ...(existing.properties || {}),
              logP: struct.logP,
              mw: struct.mw,
            },
            pubchemAudit: {
              ...(existing.pubchemAudit || {}),
              xlogp: struct.logP,
            },
          });
        }
      } catch (dexErr) {
        // graceful
      }
    }
  }

  const structures: ChemicalStructure[] = sortStructuresByDocumentLabel(rawStructures);

  const populateQuestionStructures = (
    questionList: AntiplateletQuestion[],
    availableStructures: ChemicalStructure[]
  ): AntiplateletQuestion[] => {
    return questionList.map((q) => {
      if (Array.isArray(q.referenced_structures) && q.referenced_structures.length > 0) {
        const refs = q.referenced_structures.map((r) => r.trim().toLowerCase());
        const pool = availableStructures.length > 0 ? availableStructures : structures;
        const matched = pool.filter((s) => {
          const idLower = (s.id || '').trim().toLowerCase();
          const docLabelLower = (s.document_label || '').trim().toLowerCase();
          const nameLower = (s.name || '').trim().toLowerCase();
          return refs.includes(idLower) || refs.includes(docLabelLower) || refs.includes(nameLower);
        });
        if (matched.length > 0) {
          return { ...q, structuresDisplayed: matched };
        }
      }

      if (q.type === 'matching') {
        return {
          ...q,
          structuresDisplayed: availableStructures.length > 0 ? availableStructures : structures,
        };
      }
      if (q.type === 'sub-statements') {
        const targetStr =
          structures.find((s) => {
            const stem = (q.questionStem || '').toLowerCase();
            return (
              stem.includes(`structure ${s.id.toLowerCase()}`) ||
              stem.includes(`antiplatelet ${s.id.toLowerCase()}`) ||
              stem.includes(`compound ${s.id.toLowerCase()}`) ||
              stem.includes(s.name.toLowerCase()) ||
              (q.displayed_structure_entity_ids &&
                q.displayed_structure_entity_ids.includes(s.id.toLowerCase()))
            );
          }) ||
          availableStructures[0] ||
          structures[0];

        return {
          ...q,
          structuresDisplayed: targetStr ? [targetStr] : q.structuresDisplayed,
        };
      }
      return {
        ...q,
        structuresDisplayed:
          q.structuresDisplayed && q.structuresDisplayed.length > 0
            ? q.structuresDisplayed
            : availableStructures.length > 0
            ? availableStructures
            : structures,
      };
    });
  };

  const totalSlides = Math.max(result.totalSlides || 1, result.slides?.length || 1);
  const pages: ReviewPage[] = [];

  if (totalSlides > 1 && result.slides && result.slides.length > 0) {
    const sortedSlides = [...result.slides].sort((a, b) => a.slideNumber - b.slideNumber);

    for (const slide of sortedSlides) {
      const p = slide.slideNumber;
      const slideTitle = slide.title || `Slide ${p}`;

      let pageStructures = structures.filter(
        (s) => s.sourcePageNumbers?.includes(p) || s.sourcePageNumber === p
      );
      if (pageStructures.length === 0) pageStructures = structures;
      pageStructures = sortStructuresByDocumentLabel(pageStructures);

      let pageQuestions = result.generatedQuestions.filter((q) => q.sourcePageNumber === p);
      if (pageQuestions.length === 0) {
        pageQuestions = synthesizePageFallbackQuestions(p, slideTitle, pageStructures);
      }

      const slideBlocks = (result.question_blocks || [])
        .filter((item) => item.pageNumber === p)
        .map((item) => item.block);

      let sections: ReviewSection[] = [];

      if (slideBlocks.length > 0) {
        sections = slideBlocks.map((b, bIdx) => {
          const resolvedBlockStructures = b.local_structures.length > 0
            ? b.local_structures.map((ls: any) => {
                const match = structures.find(
                  (s) =>
                    s.id.toLowerCase() === ls.id.toLowerCase() ||
                    (s.document_label && ls.document_label && s.document_label.toLowerCase() === ls.document_label.toLowerCase()) ||
                    s.name.toLowerCase() === ls.name.toLowerCase()
                );
                return match ? { ...ls, ...match } : ls;
              })
            : pageStructures;
          const blockStructures = sortStructuresByDocumentLabel(resolvedBlockStructures);
          const blockQuestions = b.questions.length > 0 ? b.questions : pageQuestions;
          const resolvedQuestions = populateQuestionStructures(blockQuestions, blockStructures);

          return {
            sectionTitle:
              slideBlocks.length > 1
                ? `Part ${String.fromCharCode(65 + bIdx)}: ${b.block_instructions ? b.block_instructions.slice(0, 60) : `Section ${bIdx + 1}`}`
                : `Slide ${p} Practice Questions`,
            headerNote:
              b.block_instructions ||
              slide.text?.slice(0, 200) ||
              'Analyze each 2D structure carefully to answer the clinical pharmacology questions.',
            block_instructions: b.block_instructions,
            structures: blockStructures,
            local_structures: blockStructures,
            questions: resolvedQuestions,
          };
        });
      } else {
        const resolvedQuestions = populateQuestionStructures(pageQuestions, pageStructures);
        sections = [
          {
            sectionTitle: `Slide ${p} Practice Questions`,
            headerNote:
              slide.text?.slice(0, 200) ||
              'Analyze each 2D structure carefully to answer the clinical pharmacology questions.',
            block_instructions: undefined,
            structures: pageStructures,
            local_structures: pageStructures,
            questions: resolvedQuestions,
          },
        ];
      }

      const totalPageQuestions = sections.flatMap((s) => s.questions).length;
      const totalPageStructures = sections.flatMap((s) => s.local_structures || s.structures || []).length;

      pages.push({
        pageNumber: p,
        pageTitle: slideTitle,
        subtitle: `Slide ${p} Questions & Structures (${totalPageQuestions} Questions, ${totalPageStructures} Drug Structures)`,
        sections,
      });
    }

    const allAssignedIds = new Set(pages.flatMap((pg) => pg.sections.flatMap((s) => s.questions.map((q) => q.id))));
    const unassigned = result.generatedQuestions.filter((q) => !allAssignedIds.has(q.id));
    if (unassigned.length > 0) {
      const targetPage = pages.find((pg) => pg.sections.some((s) => (s.structures?.length || 0) > 0)) || pages[0];
      if (targetPage && targetPage.sections[0]) {
        const targetBlockStructures = targetPage.sections[0].local_structures || targetPage.sections[0].structures || structures;
        const resolvedUnassigned = populateQuestionStructures(unassigned, targetBlockStructures);
        targetPage.sections[0].questions.push(...resolvedUnassigned);
      }
    }
  } else {
    let pageQuestions = result.generatedQuestions;
    if (pageQuestions.length === 0) {
      pageQuestions = synthesizePageFallbackQuestions(
        1,
        `${file.name.replace(/\.[^/.]+$/, '')} — Practice Quiz`,
        structures
      );
    }

    const blocks = (result.question_blocks || []).map((item) => item.block);
    let sections: ReviewSection[] = [];

    if (blocks.length > 0) {
      sections = blocks.map((b, bIdx) => {
        const resolvedBlockStructures = b.local_structures.length > 0
          ? b.local_structures.map((ls: any) => {
              const match = structures.find(
                (s) =>
                  s.id.toLowerCase() === ls.id.toLowerCase() ||
                  (s.document_label && ls.document_label && s.document_label.toLowerCase() === ls.document_label.toLowerCase()) ||
                  s.name.toLowerCase() === ls.name.toLowerCase()
              );
              return match ? { ...ls, ...match } : ls;
            })
          : structures;
        const blockStructures = sortStructuresByDocumentLabel(resolvedBlockStructures);
        const resolvedQuestions = populateQuestionStructures(b.questions, blockStructures);

        return {
          sectionTitle:
            blocks.length > 1
              ? `Part ${String.fromCharCode(65 + bIdx)}: ${b.block_instructions ? b.block_instructions.slice(0, 60) : `Section ${bIdx + 1}`}`
              : 'Case-Based Questions',
          headerNote:
            b.block_instructions ||
            'Analyze each 2D structure carefully to answer the clinical pharmacology questions.',
          block_instructions: b.block_instructions,
          structures: blockStructures,
          local_structures: blockStructures,
          questions: resolvedQuestions,
        };
      });
    } else {
      const resolvedQuestions = populateQuestionStructures(pageQuestions, structures);
      sections = [
        {
          sectionTitle: 'Case-Based Questions',
          headerNote: 'Analyze each 2D structure carefully to answer the clinical pharmacology questions.',
          structures,
          local_structures: structures,
          questions: resolvedQuestions,
        },
      ];
    }

    const totalQuestions = sections.flatMap((s) => s.questions).length;

    pages.push({
      pageNumber: 1,
      pageTitle: `${file.name.replace(/\.[^/.]+$/, '')} — Practice Quiz`,
      subtitle: `Case Questions & Chemical Structures (${totalQuestions} Questions)`,
      sections,
    });
  }

  const reviewModule: ReviewModule = {
    id: `module_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: file.name.replace(/\.[^/.]+$/, ''),
    subtitle: `Generated from course materials (${result.totalEntitiesDiscovered} entities, ${result.totalRelationshipsDiscovered} relationships)`,
    course: 'Medicinal Chemistry & Pharmacology',
    semester: 'Academic Year 2026',
    code: 'MCP',
    isBuiltIn: false,
    createdAt: new Date().toISOString().split('T')[0],
    pages,
  };

  return {
    ...result,
    reviewModule,
  };
}