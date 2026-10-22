import { GraphEntity, GraphRelationship, medChemGraphDb } from '../db/medChemGraphDb';
import {
  enrichEntitiesWithPubChem,
  verifyStructuresBatchPubChem,
  isNonCompoundEntity,
  sanitizeStructureLabel,
} from './pubchemService';
import { generateMedChemQuiz } from './quizService';
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

/**
 * Extracts entities and relationships from a slide window using Gemini Structured Outputs.
 * Validates and normalizes keys (entities || nodes || graph.entities).
 * 
 * Performance Optimization:
 * - Sanitizes slideBatch so slides array contains only text and metadata (stripping inlineData/images).
 * - Collects deduplicated Base64 images in images array (max 1 image per slide).
 * - Reduces network JSON payload size by 65-75% and avoids duplicating image parts on the server.
 */
async function extractKnowledgeFromBatch(
  slideBatch: IngestionSlide[],
  documentTitle: string,
  signal?: AbortSignal
): Promise<{ entities: GraphEntity[]; relationships: GraphRelationship[] }> {
  try {
    // Collect at most 1 clean unique image per slide in the batch
    const batchImages: string[] = [];
    for (const s of slideBatch) {
      const img = s.inlineData?.data || (s.images?.[0] ? s.images[0].replace(/^data:[^;]+;base64,/, '') : '');
      if (img && !batchImages.includes(img)) {
        batchImages.push(img);
      }
    }

    // Sanitize slides payload sent over wire: strip inlineData and images from the slides array
    // to avoid duplicating megabytes of Base64 strings in the JSON POST body
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

    // Validate and normalize Gemini JSON output keys
    const rawEntities =
      data.entities ||
      data.nodes ||
      data.graph?.entities ||
      data.graph?.nodes ||
      data.knowledge_graph?.entities ||
      [];
    const rawRelationships =
      data.relationships ||
      data.edges ||
      data.graph?.relationships ||
      data.graph?.edges ||
      data.knowledge_graph?.relationships ||
      [];

    if ((!rawEntities || rawEntities.length === 0) && (!rawRelationships || rawRelationships.length === 0)) {
      console.warn(
        '[extractKnowledgeFromBatch] Warning: Entities or relationships resolved to empty array. Raw response:',
        data
      );
    }

    return {
      entities: Array.isArray(rawEntities) ? rawEntities : [],
      relationships: Array.isArray(rawRelationships) ? rawRelationships : [],
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
 * Validates and normalizes keys (entities || nodes || graph.entities).
 */
export async function extractKnowledgeFromImage(
  inlineData: { mimeType: string; data: string },
  documentTitle: string
): Promise<{ entities: GraphEntity[]; relationships: GraphRelationship[] }> {
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

    // Validate and normalize Gemini JSON output keys
    const rawEntities =
      data.entities ||
      data.nodes ||
      data.graph?.entities ||
      data.graph?.nodes ||
      data.knowledge_graph?.entities ||
      [];
    const rawRelationships =
      data.relationships ||
      data.edges ||
      data.graph?.relationships ||
      data.graph?.edges ||
      data.knowledge_graph?.relationships ||
      [];

    if ((!rawEntities || rawEntities.length === 0) && (!rawRelationships || rawRelationships.length === 0)) {
      console.warn(
        '[extractKnowledgeFromImage] Warning: Entities or relationships resolved to empty array. Raw response:',
        data
      );
    }

    return {
      entities: Array.isArray(rawEntities) ? rawEntities : [],
      relationships: Array.isArray(rawRelationships) ? rawRelationships : [],
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

/**
 * Splits text document content into discrete IngestionSlide objects when page or slide
 * delimiters are detected (e.g. "Page 1", "Slide 1", "=== Page 2 ===", Form Feed).
 */
export function splitTextIntoSlides(fullText: string, defaultTitle: string): IngestionSlide[] {
  // 1. Check for form feed character (\f)
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

  // 2. Check for explicit Page / Slide headers e.g. "Page 1", "Slide 1", "--- Page 2 ---"
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

  // 3. Fallback: single slide
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

/**
 * Synthesizes deterministic structure-aware worksheet questions for a specific page,
 * ensuring each tab (Page 1, 2, 3, etc.) always contains high-yield matching and SAR analysis.
 */
export function synthesizePageFallbackQuestions(
  pageNumber: number,
  pageTitle: string,
  structures: ChemicalStructure[],
  targetDrug?: GraphEntity
): AntiplateletQuestion[] {
  const primaryStructure = structures[0];
  const questions: AntiplateletQuestion[] = [];

  if (structures.length > 0) {
    // Question 1: Drag & Drop Matching for candidate structures on this page
    const matchingTargets: MatchingTarget[] = structures.map((str, idx) => ({
      id: String.fromCharCode(97 + idx),
      label: `${str.name} (${str.chemicalClass || str.pharmacologicalClass || 'Therapeutic Agent'})`,
      acceptedStructureIds: [str.id],
      rationale: `Structure ${str.id} corresponds to ${str.name}, belonging to the ${str.chemicalClass || 'medicinal chemistry'} class (${str.pharmacologicalClass || 'pharmacological agent'}).`,
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

    // Question 2: True/False SAR evaluation for the primary structure
    if (primaryStructure) {
      const subStatements: SubStatement[] = [
        {
          id: 'a',
          statement: `Structure ${primaryStructure.id} (${primaryStructure.name}) exerts its primary pharmacological action as a ${primaryStructure.pharmacologicalClass || 'selective receptor modulator'}.`,
          isCorrect: true,
          rationale: `Structure ${primaryStructure.id} (${primaryStructure.name}) is classified as a ${primaryStructure.pharmacologicalClass || 'therapeutic agent'} targeting ${primaryStructure.target || 'its therapeutic receptor'}.`,
          keyPharmacophore: primaryStructure.keyFunctionalGroups?.[0] || 'Core pharmacophore',
        },
        {
          id: 'b',
          statement: `The functional groups present on Structure ${primaryStructure.id} confer specific receptor affinity and selectivity.`,
          isCorrect: true,
          rationale: `The chemical substituents (${primaryStructure.keyFunctionalGroups?.join(', ') || 'pharmacophore groups'}) optimize binding interactions and pharmacokinetics.`,
          keyPharmacophore: primaryStructure.keyFunctionalGroups?.[1] || 'Binding substituents',
        },
        {
          id: 'c',
          statement: `Structure ${primaryStructure.id} undergoes immediate spontaneous non-enzymatic degradation resulting in complete loss of pharmacodynamic effect.`,
          isCorrect: false,
          rationale: `Structure ${primaryStructure.id} possesses metabolic stability dictated by its chemical scaffold and is not degraded through spontaneous instability under physiological conditions.`,
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
        overallExplanation: `SAR analysis for Structure ${primaryStructure.id} (${primaryStructure.name}): examine how structural substitutions dictate receptor binding and clinical pharmacology.`,
        highYieldPearl: primaryStructure.sarNotes || `Understanding functional group contributions is essential for predicting pharmacological activity and metabolic fate.`,
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

/**
 * Ensures SAR rationale is strictly a concise single-paragraph text (max 2-3 sentences).
 * Strips any multi-paragraph redundant concatenations (e.g. from repeated chunk merges).
 */
export function cleanSingleParagraphSar(text?: string | null): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  // If text contains multiple paragraphs separated by double newlines or blank lines
  if (trimmed.includes('\n\n') || trimmed.includes('\r\n\r\n')) {
    const paragraphs = trimmed
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (paragraphs.length > 0) {
      // Find the richest, most detailed single paragraph
      const richest = paragraphs.reduce(
        (best, curr) => (curr.length > best.length ? curr : best),
        paragraphs[0]
      );
      return richest.replace(/\r?\n+/g, ' ').trim();
    }
  }

  // Flatten single line breaks into clean prose
  return trimmed.replace(/\r?\n+/g, ' ').trim();
}

/**
 * Filters out generic placeholder names for pharmacophores.
 * Banned: "DRUG Core", "Main Scaffold", "Active Moiety", etc.
 */
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
    return {
      ...p,
      id,
      name,
      purpose,
      description,
      smarts: p.smarts || undefined,
      region: p.region || resolvePharmacophoreRegion(p, idx, valid.length),
    };
  });
}

/**
 * Complete lecture, image, and text ingestion pipeline:
 * 1. Supports PDF, PPTX, JPG, JPEG, PNG, and TXT.
 * 2. Scanned / image-only PDFs (<50 chars/page or 0 chars) render to canvas JPEG and process visually.
 * 3. Logs extracted text length before sending to Gemini: console.log("[Ingest] Extracted text length:", totalChars)
 * 4. Merges extracted entities and directed relationships into Dexie.js IndexedDB.
 * 5. Kicks off background PubChem enrichment for all discovered DRUG and METABOLITE nodes.
 * 6. Immediately invokes the quiz generator (generateMedChemQuiz) with small-subgraph fallback.
 * 7. Returns the generated questions back so the UI renders them immediately upon upload.
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
    let totalSlides = 1;
    let rawContext = '';
    let imageInlineData: { mimeType: string; data: string } | undefined;
    let allSlides: IngestionSlide[] = [];

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

      const { entities, relationships } = await extractKnowledgeFromImage(imageInlineData, fileName);
      entities.forEach((e) => {
        if (isNonCompoundEntity(e.id) || isNonCompoundEntity(e.name || '')) {
          e.type = 'CLINICAL_PARAMETER' as any;
        }
        const pageNum = Number((e as any).source_slide_index) || 1;
        e.sourcePageNumber = pageNum;
        e.sourcePageNumbers = [pageNum];
      });
      relationships.forEach((r) => {
        r.sourcePageNumber = (r as any).source_slide_index || 1;
      });

      allDiscoveredEntities.push(...entities);
      allDiscoveredRelationships.push(...relationships);

      rawContext = `Uploaded multimodal chemical structure image: "${fileName}". Extracted ${entities.length} entities (${entities.map((e) => e.name || e.id).join(', ')}).`;

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
      console.log("[Ingest] Extracted text length:", totalChars);

      if (totalChars === 0) {
        throw new Error(`Text document "${fileName}" is empty. No content to analyze.`);
      }

      const slides = splitTextIntoSlides(fullText, fileName.replace(/\.[^/.]+$/, ''));
      allSlides = slides;
      totalSlides = slides.length;
      rawContext = fullText;

      // Batch text slides in 2-page windows to cut Gemini API round-trips in half without hitting token limits
      const TEXT_BATCH_SIZE = 2;
      const batches: IngestionSlide[][] = [];
      for (let i = 0; i < slides.length; i += TEXT_BATCH_SIZE) {
        batches.push(slides.slice(i, i + TEXT_BATCH_SIZE));
      }

      for (let bIdx = 0; bIdx < batches.length; bIdx++) {
        await new Promise((resolve) => setTimeout(resolve, 4000)); // 4-second delay to respect Google Cloud quotas
        if (signal?.aborted) {
          throw new DOMException('Ingestion aborted by user', 'AbortError');
        }
        const batch = batches[bIdx];
        const startSlide = batch[0].slideNumber;
        const endSlide = batch[batch.length - 1].slideNumber;

        onProgress?.({
          stage: 'extracting',
          currentBatch: bIdx + 1,
          totalBatches: batches.length,
          currentSlide: startSlide,
          totalSlides: slides.length,
          message: `Extracting MedChem Knowledge Graph from page ${startSlide}${startSlide !== endSlide ? `–${endSlide}` : ''}/${slides.length}...`,
          discoveredEntitiesCount: allDiscoveredEntities.length,
          discoveredRelationshipsCount: allDiscoveredRelationships.length,
        });

        try {
          const { entities, relationships } = await extractKnowledgeFromBatch(batch, fileName, signal);
          entities.forEach((e) => {
            if (isNonCompoundEntity(e.id) || isNonCompoundEntity(e.name || '')) {
              e.type = 'CLINICAL_PARAMETER' as any;
            }
            const raw = Number((e as any).source_slide_index);
            const pageNum = raw && raw >= startSlide && raw <= endSlide ? raw : startSlide;
            e.sourcePageNumber = pageNum;
            e.sourcePageNumbers = [pageNum];
          });
          relationships.forEach((r) => {
            const raw = (r as any).source_slide_index;
            r.sourcePageNumber = raw && raw >= startSlide && raw <= endSlide ? raw : startSlide;
          });

          allDiscoveredEntities.push(...entities);
          allDiscoveredRelationships.push(...relationships);

          if (entities.length > 0 || relationships.length > 0) {
            await medChemGraphDb.mergeGraphToDexie(entities, relationships);
            // Yield to browser event loop to prevent UI stuttering during Dexie writes
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
      console.log("[Ingest] Extracted text length:", totalChars);

      const slides = pdfResult.slides;
      totalSlides = slides.length;
      allSlides = slides;
      if (slides[0]?.inlineData) {
        imageInlineData = slides[0].inlineData;
      }

      if (slides.length === 0) {
        throw new Error(`PDF "${fileName}" contains 0 readable pages.`);
      }

      if (pdfResult.isScannedOrImageOnly) {
        // Scanned or image-only PDF: pages have been rendered to canvas Base64 JPEGs
        console.log(
          `[Ingest] Low text density detected (${totalChars} chars across ${pdfResult.numPages} pages). Performing visual OCR with Gemini Flash on rendered canvas slides...`
        );

        const batchErrors: string[] = [];

        for (let i = 0; i < slides.length; i++) {
          if (signal?.aborted) {
            throw new DOMException('Ingestion aborted by user', 'AbortError');
          }
          const slide = slides[i];
          if (!slide.inlineData) {
            console.warn(`[Ingest] Slide ${slide.slideNumber} has no inlineData canvas image, skipping.`);
            continue;
          }

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
            const { entities, relationships } = await extractKnowledgeFromImage(
              slide.inlineData,
              `${fileName} (Page ${slide.slideNumber})`
            );
            entities.forEach((e) => {
              if (isNonCompoundEntity(e.id) || isNonCompoundEntity(e.name || '')) {
                e.type = 'CLINICAL_PARAMETER' as any;
              }
              const pageNum = Number((e as any).source_slide_index) || slide.slideNumber;
              e.sourcePageNumber = pageNum;
              e.sourcePageNumbers = [pageNum];
            });
            relationships.forEach((r) => {
              r.sourcePageNumber = (r as any).source_slide_index || slide.slideNumber;
            });

            allDiscoveredEntities.push(...entities);
            allDiscoveredRelationships.push(...relationships);

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
              // Yield to browser event loop to avoid UI thread freeze
              await new Promise((resolve) => setTimeout(resolve, 0));
            }
          } catch (err: any) {
            console.warn(`Visual extraction error on page ${slide.slideNumber}:`, err);
            const errorMessage =
              err.response?.data?.message ||
              err.response?.data?.error ||
              err.message ||
              "Network Request Failed";
            batchErrors.push(`Page ${slide.slideNumber}: ${errorMessage}`);
          }
        }

        if (allDiscoveredEntities.length === 0 && batchErrors.length > 0) {
          throw new Error(`Knowledge extraction failed on scanned PDF: ${batchErrors.slice(0, 3).join('; ')}`);
        }

        // Attach first rendered slide image to quiz generation payload
        if (slides[0]?.inlineData) {
          imageInlineData = slides[0].inlineData;
        }

        rawContext = slides
          .slice(0, 5)
          .map((s) => `[Page ${s.slideNumber}] ${s.text || 'Rendered visual slide diagram'}`)
          .join('\n\n');
      } else {
        // Standard text-rich PDF
        rawContext = slides
          .slice(0, 5)
          .map((s) => `[Page ${s.slideNumber}] ${s.text}`)
          .join('\n\n');

        // Batch text PDF pages in 2-page windows to cut Gemini API round-trips in half while preserving extraction precision
        const PDF_BATCH_SIZE = 2;
        const batches: IngestionSlide[][] = [];
        for (let i = 0; i < slides.length; i += PDF_BATCH_SIZE) {
          batches.push(slides.slice(i, i + PDF_BATCH_SIZE));
        }
        const batchErrors: string[] = [];

        for (let b = 0; b < batches.length; b++) {
          await new Promise((resolve) => setTimeout(resolve, 4000)); // 4-second delay to respect Google Cloud quotas
          if (signal?.aborted) {
            throw new DOMException('Ingestion aborted by user', 'AbortError');
          }
          const batch = batches[b];
          const startSlide = batch[0].slideNumber;
          const endSlide = batch[batch.length - 1].slideNumber;

          onProgress?.({
            stage: 'extracting',
            currentBatch: b + 1,
            totalBatches: batches.length,
            currentSlide: startSlide,
            totalSlides: slides.length,
            message: `Analyzing slide ${startSlide}${startSlide !== endSlide ? `–${endSlide}` : ''}/${slides.length} with Gemini MedChem Graph extraction...`,
            discoveredEntitiesCount: allDiscoveredEntities.length,
            discoveredRelationshipsCount: allDiscoveredRelationships.length,
          });

          try {
            const { entities, relationships } = await extractKnowledgeFromBatch(batch, fileName, signal);
            entities.forEach((e) => {
              if (isNonCompoundEntity(e.id) || isNonCompoundEntity(e.name || '')) {
                e.type = 'CLINICAL_PARAMETER' as any;
              }
              const raw = Number((e as any).source_slide_index);
              const pageNum = raw && raw >= startSlide && raw <= endSlide ? raw : startSlide;
              e.sourcePageNumber = pageNum;
              e.sourcePageNumbers = [pageNum];
            });
            relationships.forEach((r) => {
              const raw = (r as any).source_slide_index;
              r.sourcePageNumber = raw && raw >= startSlide && raw <= endSlide ? raw : startSlide;
            });

            allDiscoveredEntities.push(...entities);
            allDiscoveredRelationships.push(...relationships);

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
              // Yield to event loop to keep UI thread responsive
              await new Promise((resolve) => setTimeout(resolve, 0));
            }
          } catch (err: any) {
            console.warn(`Extraction error on batch ${b + 1}:`, err);
            const errorMessage =
              err.response?.data?.message ||
              err.response?.data?.error ||
              err.message ||
              "Network Request Failed";
            batchErrors.push(`Batch ${b + 1} (Slide ${startSlide}): ${errorMessage}`);
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
      const totalChars = pptxResult.totalChars;
      console.log("[Ingest] Extracted text length:", totalChars);

      const slides = pptxResult.slides;
      totalSlides = slides.length;
      allSlides = slides;

      if (slides.length === 0) {
        throw new Error(`PPTX "${fileName}" contains 0 readable slides.`);
      }

      rawContext = slides
        .slice(0, 5)
        .map((s) => `[Slide ${s.slideNumber}] ${s.text}`)
        .join('\n\n');

      const batches = createOverlappingSlideWindows(slides, 3, 2);
      const batchErrors: string[] = [];

      for (let b = 0; b < batches.length; b++) {
        await new Promise((resolve) => setTimeout(resolve, 4000)); // 4-second delay to respect Google Cloud quotas
        if (signal?.aborted) {
          throw new DOMException('Ingestion aborted by user', 'AbortError');
        }
        const batch = batches[b];
        const startSlide = batch[0].slideNumber;
        const endSlide = batch[batch.length - 1].slideNumber;

        onProgress?.({
          stage: 'extracting',
          currentBatch: b + 1,
          totalBatches: batches.length,
          currentSlide: startSlide,
          totalSlides: slides.length,
          message: `Analyzing slides ${startSlide}–${endSlide} with Gemini MedChem Graph extraction...`,
          discoveredEntitiesCount: allDiscoveredEntities.length,
          discoveredRelationshipsCount: allDiscoveredRelationships.length,
        });

        try {
          const { entities, relationships } = await extractKnowledgeFromBatch(batch, fileName, signal);
          entities.forEach((e) => {
            if (isNonCompoundEntity(e.id) || isNonCompoundEntity(e.name || '')) {
              e.type = 'CLINICAL_PARAMETER' as any;
            }
            const raw = Number((e as any).source_slide_index);
            const pageNum = raw && raw >= startSlide && raw <= endSlide ? raw : startSlide;
            e.sourcePageNumber = pageNum;
            e.sourcePageNumbers = [pageNum];
          });
          relationships.forEach((r) => {
            const raw = (r as any).source_slide_index;
            r.sourcePageNumber = raw && raw >= startSlide && raw <= endSlide ? raw : startSlide;
          });

          allDiscoveredEntities.push(...entities);
          allDiscoveredRelationships.push(...relationships);

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
            // Yield to browser event loop to avoid UI thread freeze
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        } catch (err: any) {
          console.warn(`Extraction error on PPTX batch ${b + 1}:`, err);
          const errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Network Request Failed";
          batchErrors.push(`Batch ${b + 1}: ${errorMessage}`);
        }
      }

      if (allDiscoveredEntities.length === 0 && batchErrors.length > 0) {
        throw new Error(`Knowledge extraction failed on PPTX: ${batchErrors.slice(0, 3).join('; ')}`);
      }
    }

    // Guard: ensure at least one entity or relationship was discovered
    if (allDiscoveredEntities.length === 0) {
      throw new Error(
        `Discovered 0 chemical entities or pharmacological relationships from "${fileName}". Please ensure the document contains medicinal chemistry or pharmacology content.`
      );
    }

    // Trigger background PubChem enrichment for all discovered DRUG and METABOLITE nodes (excluding non-compounds)
    const drugOrMetaboliteIds = Array.from(
      new Set(
        allDiscoveredEntities
          .filter(
            (e) =>
              (e.type === 'DRUG' || e.type === 'METABOLITE') &&
              !isNonCompoundEntity(e.id) &&
              !isNonCompoundEntity(e.name || '')
          )
          .map((e) => e.id)
      )
    );

    let enrichedCount = 0;
    if (drugOrMetaboliteIds.length > 0) {
      onProgress?.({
        stage: 'enriching',
        currentBatch: 1,
        totalBatches: 1,
        currentSlide: totalSlides,
        totalSlides: totalSlides,
        message: `PubChem Rate-Limited Queue: [0/${drugOrMetaboliteIds.length}] Processing structures...`,
        discoveredEntitiesCount: allDiscoveredEntities.length,
        discoveredRelationshipsCount: allDiscoveredRelationships.length,
      });

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
      } catch (enrichErr) {
        console.warn('[lectureIngestion] PubChem enrichment warning (continuing to quiz generation):', enrichErr);
      }
    }

    // Refresh discovered entities with newly enriched chemical data & CIDs from Dexie in a single bulk transaction
    try {
      const entityIds = allDiscoveredEntities.map((e) => e.id);
      const dbRecs = await medChemGraphDb.entities.bulkGet(entityIds);
      allDiscoveredEntities = allDiscoveredEntities.map((e, idx) => dbRecs[idx] || e);
    } catch (err) {
      console.warn('[lectureIngestion] Bulk get entities warning, falling back to discovered cache:', err);
    }

    // Deduplicate canonical candidate structures so we have Roman numerals I, II, III... ready
    const canonicalCandidateStructures = deduplicateAndCanonicalizeStructures(allDiscoveredEntities, totalSlides);

    const allGeneratedQuestions: AntiplateletQuestion[] = [];
    const allExtractedStructures: ChemicalStructure[] = [];
    const allGeneratedQuestionBlocks: Array<{ pageNumber: number; block: QuestionBlock }> = [];

    // Ensure we iterate through every single page/slide in the document
    const slidesToProcess = allSlides.length > 0 ? allSlides : [{
      slideNumber: 1,
      slideIndex: 1,
      pageNumber: 1,
      title: fileName.replace(/\.[^/.]+$/, ''),
      text: rawContext,
      inlineData: imageInlineData,
    }];

    interface SlideQuizOutcome {
      pageNumber: number;
      questionBlocks: QuestionBlock[];
      extractedStructures: ChemicalStructure[];
      questions: AntiplateletQuestion[];
    }

    const slideResults: SlideQuizOutcome[] = new Array(slidesToProcess.length);
    let completedQuizCount = 0;

    for (let pIdx = 0; pIdx < slidesToProcess.length; pIdx++) {
      await new Promise((resolve) => setTimeout(resolve, 4000)); // 4-second delay to respect Google Cloud quotas
      if (signal?.aborted) {
        throw new DOMException('Ingestion aborted by user', 'AbortError');
      }
      const slide = slidesToProcess[pIdx];
      const currentPageNumber = slide.slideNumber || (pIdx + 1);

      onProgress?.({
        stage: 'generating-quiz',
        currentBatch: completedQuizCount + 1,
        totalBatches: slidesToProcess.length,
        currentSlide: currentPageNumber,
        totalSlides: slidesToProcess.length,
        message: `Synthesizing structure-aware worksheet questions for Page ${currentPageNumber}/${slidesToProcess.length}...`,
        discoveredEntitiesCount: allDiscoveredEntities.length,
        discoveredRelationshipsCount: allDiscoveredRelationships.length,
        enrichedCount,
      });

      // Find entities and relationships anchored to this page
      const pageEntities = allDiscoveredEntities.filter(
        (e) => e.sourcePageNumbers?.includes(currentPageNumber) || e.sourcePageNumber === currentPageNumber
      );
      const pageRelationships = allDiscoveredRelationships.filter(
        (r) => r.sourcePageNumber === currentPageNumber
      );

      // Find candidate structures appearing on this page
      let pageStructures = canonicalCandidateStructures.filter(
        (s) => s.sourcePageNumbers?.includes(currentPageNumber) || s.sourcePageNumber === currentPageNumber
      );
      if (pageStructures.length === 0) {
        pageStructures = canonicalCandidateStructures;
      }

      const targetDrug =
        pageEntities.find(
          (e) =>
            (e.type === 'DRUG' || e.type === 'METABOLITE') &&
            !isNonCompoundEntity(e.id) &&
            !isNonCompoundEntity(e.name || '')
        ) ||
        allDiscoveredEntities.find(
          (e) =>
            (e.type === 'DRUG' || e.type === 'METABOLITE') &&
            !isNonCompoundEntity(e.id) &&
            !isNonCompoundEntity(e.name || '')
        ) ||
        allDiscoveredEntities[0];

      const pageContext = slide.text
        ? `[Page ${currentPageNumber}: ${slide.title || `Slide ${currentPageNumber}`}]\n${slide.text}`
        : `[Page ${currentPageNumber}] Medicinal chemistry slide with chemical structures.`;

      const pageInlineData = slide?.inlineData || imageInlineData;
      const pageImages = slide?.inlineData?.data
        ? [slide.inlineData.data]
        : slide?.images && slide.images.length > 0
        ? slide.images
        : imageInlineData?.data
        ? [imageInlineData.data]
        : undefined;

      const outcomeBlocks: QuestionBlock[] = [];
      const outcomeStructures: ChemicalStructure[] = [];
      const outcomeQuestions: AntiplateletQuestion[] = [];

      try {
        const parsedQuiz = await generateMedChemQuiz({
          seedEntityOrQuery: targetDrug?.id || fileName,
          targetDrugId: targetDrug?.id,
          structures: pageStructures.length > 0 ? pageStructures : canonicalCandidateStructures,
          extractedEntities: pageEntities.length > 0 ? pageEntities : allDiscoveredEntities,
          extractedRelationships: pageRelationships.length > 0 ? pageRelationships : allDiscoveredRelationships,
          rawContext: pageContext,
          inlineData: pageInlineData,
          images: pageImages,
          blindDrugName: true,
          signal,
        });

        // 1. Process and accumulate question blocks from this page
        const pageBlocks: QuestionBlock[] = (parsedQuiz as any).question_blocks || [];
        if (pageBlocks.length > 0) {
          pageBlocks.forEach((block) => {
            block.local_structures.forEach((s) => {
              s.sourcePageNumber = currentPageNumber;
              s.sourcePageNumbers = [currentPageNumber];
              s.moa_summary = cleanSingleParagraphSar(s.moa_summary || s.sar_rationale || s.sarNotes);
              s.sar_rationale = s.moa_summary;
              s.sarNotes = s.moa_summary;
              s.pharmacophores = filterValidPharmacophores(s.pharmacophores);
            });
            block.questions.forEach((q, qIdx) => {
              q.sourcePageNumber = currentPageNumber;
              if (!q.id) {
                q.id = Date.now() + currentPageNumber * 1000 + qIdx + Math.floor(Math.random() * 100);
              }
              if (!q.structuresDisplayed || q.structuresDisplayed.length === 0) {
                q.structuresDisplayed = block.local_structures;
              }
            });
            outcomeBlocks.push(block);
          });
        }

        // 2. Process and accumulate structures from this page
        const pageExtractedStructures: ChemicalStructure[] = (parsedQuiz as any).structures || [];
        if (pageExtractedStructures && pageExtractedStructures.length > 0) {
          pageExtractedStructures.forEach((s) => {
            // Override hallucinated slide numbers: manually inject current page index
            s.sourcePageNumber = currentPageNumber;
            s.sourcePageNumbers = [currentPageNumber];
            s.moa_summary = cleanSingleParagraphSar(s.moa_summary || s.sar_rationale || s.sarNotes);
            s.sar_rationale = s.moa_summary;
            s.sarNotes = s.moa_summary;
            s.pharmacophores = filterValidPharmacophores(s.pharmacophores);
          });
          outcomeStructures.push(...pageExtractedStructures);
        }

        // 3. Process and accumulate questions from this page
        const pageQuestions: AntiplateletQuestion[] = (parsedQuiz as any).questions || parsedQuiz || [];
        if (pageQuestions && pageQuestions.length > 0) {
          pageQuestions.forEach((q, qIdx) => {
            // Override hallucinated slide numbers: manually inject current page index
            q.sourcePageNumber = currentPageNumber;
            if (!q.id) {
              q.id = Date.now() + currentPageNumber * 1000 + qIdx + Math.floor(Math.random() * 100);
            }
            if (!q.structuresDisplayed || q.structuresDisplayed.length === 0) {
              q.structuresDisplayed = pageExtractedStructures.length > 0
                ? pageExtractedStructures
                : pageStructures.length > 0
                ? pageStructures
                : canonicalCandidateStructures;
            }
          });
          outcomeQuestions.push(...pageQuestions);
        } else {
          const fallbackQs = synthesizePageFallbackQuestions(
            currentPageNumber,
            slide.title || `Page ${currentPageNumber}`,
            pageExtractedStructures.length > 0 ? pageExtractedStructures : pageStructures,
            targetDrug
          );
          outcomeQuestions.push(...fallbackQs);
        }
      } catch (pageQuizErr: any) {
        console.warn(`Quiz generation warning for Page ${currentPageNumber}:`, pageQuizErr);
        const fallbackQs = synthesizePageFallbackQuestions(
          currentPageNumber,
          slide.title || `Page ${currentPageNumber}`,
          pageStructures,
          targetDrug
        );
        outcomeQuestions.push(...fallbackQs);
      }

      slideResults[pIdx] = {
        pageNumber: currentPageNumber,
        questionBlocks: outcomeBlocks,
        extractedStructures: outcomeStructures,
        questions: outcomeQuestions,
      };

      completedQuizCount++;
    }

    // Reassemble results in strict chronological page order
    for (const res of slideResults) {
      if (!res) continue;
      for (const block of res.questionBlocks) {
        allGeneratedQuestionBlocks.push({
          pageNumber: res.pageNumber,
          block,
        });
      }
      allExtractedStructures.push(...res.extractedStructures);
      allGeneratedQuestions.push(...res.questions);
    }

    // Merge canonical candidate structures with all extracted structures from quiz passes
    const masterStructures = deduplicateMasterStructures([
      ...canonicalCandidateStructures,
      ...allExtractedStructures,
    ]);

    onProgress?.({
      stage: 'complete',
      currentBatch: slidesToProcess.length,
      totalBatches: slidesToProcess.length,
      currentSlide: slidesToProcess.length,
      totalSlides: slidesToProcess.length,
      message: `Ingestion complete! Discovered ${allDiscoveredEntities.length} entities and ${masterStructures.length} chemical structures across ${slidesToProcess.length} pages, generated ${allGeneratedQuestions.length} questions.`,
      discoveredEntitiesCount: allDiscoveredEntities.length,
      discoveredRelationshipsCount: allDiscoveredRelationships.length,
      enrichedCount,
      generatedQuestionsCount: allGeneratedQuestions.length,
    });

    return {
      totalSlides: slidesToProcess.length,
      totalEntitiesDiscovered: allDiscoveredEntities.length,
      totalRelationshipsDiscovered: allDiscoveredRelationships.length,
      enrichedCount,
      entities: allDiscoveredEntities,
      relationships: allDiscoveredRelationships,
      generatedQuestions: allGeneratedQuestions,
      structures: masterStructures,
      slides: slidesToProcess,
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

/**
 * Consolidates and deduplicates master chemical structures accumulated across all pages.
 * - Groups molecules by PubChem CID, document_label (e.g., 'I', 'II', 'Drug X'), or normalized name.
 * - Prevents structures from later pages from overwriting structures from earlier pages.
 * - Merges multi-page references into sourcePageNumbers, assigning the earliest page index to sourcePageNumber.
 * - Combines richer expert SAR fields (pharmacophores, target_receptor, sar_rationale, etc.).
 * - Strictly sorts the canonical collection by document_label rank (Roman numerals / document order), NEVER alphabetically.
 */
export function deduplicateMasterStructures(structures: ChemicalStructure[]): ChemicalStructure[] {
  if (!structures || structures.length === 0) return [];

  const masterList: ChemicalStructure[] = [];

  for (const struct of structures) {
    if (!struct) continue;

    const rawLabel = getStructureDocumentLabel(struct);
    const structCid = struct.cid || struct.pubchemAudit?.cid;
    const cleanName = (struct.name || '').trim().toLowerCase();

    // Find if this molecule already exists in masterList
    const existingIndex = masterList.findIndex((item) => {
      const itemLabel = getStructureDocumentLabel(item);
      const itemCid = item.cid || item.pubchemAudit?.cid;
      const itemName = (item.name || '').trim().toLowerCase();

      // 1. PubChem CID match
      if (structCid && itemCid && structCid > 0 && itemCid > 0 && structCid === itemCid) {
        return true;
      }
      // 2. Exact document_label match (e.g. 'I' === 'I' or 'Drug X' === 'Drug X')
      if (rawLabel && itemLabel && rawLabel.toUpperCase() === itemLabel.toUpperCase()) {
        return true;
      }
      // 3. Name match (if not a generic placeholder like "structure I")
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
      // First occurrence - add to master collection
      const initialPages = Array.from(new Set(structPages)).sort((a, b) => a - b);
      masterList.push({
        ...struct,
        id: rawLabel || struct.id,
        document_label: rawLabel || struct.document_label || struct.id,
        sourcePageNumber: initialPages[0] || 1,
        sourcePageNumbers: initialPages,
        moa_summary: cleanSingleParagraphSar(struct.moa_summary || struct.sar_rationale || struct.sarNotes),
        sar_rationale: cleanSingleParagraphSar(struct.moa_summary || struct.sar_rationale || struct.sarNotes),
        sarNotes: cleanSingleParagraphSar(struct.moa_summary || struct.sar_rationale || struct.sarNotes),
        pharmacophores: filterValidPharmacophores(struct.pharmacophores),
      });
    } else {
      // Duplicate occurrence across pages - merge without overwriting earlier page data or concatenating SAR
      const existing = masterList[existingIndex];

      // Merge page numbers and retain earliest page
      const mergedPages = Array.from(
        new Set([...(existing.sourcePageNumbers || [existing.sourcePageNumber || 1]), ...structPages])
      ).sort((a, b) => a - b);
      existing.sourcePageNumbers = mergedPages;
      existing.sourcePageNumber = mergedPages[0] || 1;

      // Preserve / set document_label
      if ((!existing.document_label || existing.document_label === '') && rawLabel) {
        existing.document_label = rawLabel;
        existing.id = rawLabel;
      }

      // Preserve / enrich real compound name over placeholder names
      if (
        (!existing.name || existing.name.startsWith('Structure ') || existing.name.startsWith('Compound ')) &&
        struct.name &&
        !struct.name.startsWith('Structure ')
      ) {
        existing.name = struct.name;
      }

      // Merge PubChem CID and structure image
      if (!existing.cid && structCid) {
        existing.cid = structCid;
      }
      if (!existing.pngUrl && struct.pngUrl) {
        existing.pngUrl = struct.pngUrl;
      }
      if (!existing.pubchemUrl && struct.pubchemUrl) {
        existing.pubchemUrl = struct.pubchemUrl;
      }

      // Merge expert-synthesized fields (Role 1: The Chemist)
      if (!existing.target_receptor && struct.target_receptor) {
        existing.target_receptor = struct.target_receptor;
        existing.target = struct.target_receptor;
      }
      if (!existing.target && struct.target) {
        existing.target = struct.target;
      }

      // Update MOA summary / SAR rationale: keep richest/latest single-paragraph extraction, NEVER concatenate
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

      // Filter generic pharmacophores and keep richest/latest without multiplying duplicates
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
      if (struct.reversibility && (!existing.reversibility || existing.reversibility === 'Reversible')) {
        existing.reversibility = struct.reversibility;
      }
      if (struct.route && (!existing.route || existing.route === 'Oral')) {
        existing.route = struct.route;
      }
      if (struct.chemicalClass && (!existing.chemicalClass || existing.chemicalClass === 'Small molecule compound')) {
        existing.chemicalClass = struct.chemicalClass;
      }
      if (
        struct.pharmacologicalClass &&
        (!existing.pharmacologicalClass || existing.pharmacologicalClass === 'Pharmacological Agent')
      ) {
        existing.pharmacologicalClass = struct.pharmacologicalClass;
      }
      if (struct.pkPdHighlights) {
        existing.pkPdHighlights = {
          ...existing.pkPdHighlights,
          ...struct.pkPdHighlights,
        };
      }
      if (struct.tradeName && !existing.tradeName) {
        existing.tradeName = struct.tradeName;
      }
      if (struct.mw !== undefined && existing.mw === undefined) {
        existing.mw = struct.mw;
      }
      if (struct.logP !== undefined && existing.logP === undefined) {
        existing.logP = struct.logP;
      }
      if (struct.drug_state && (!existing.drug_state || existing.drug_state === 'Active Drug')) {
        existing.drug_state = struct.drug_state;
      }
      if (struct.pubchemAudit && (!existing.pubchemAudit || existing.pubchemAudit.status !== 'verified')) {
        existing.pubchemAudit = { ...struct.pubchemAudit };
      }
    }
  }

  // Sort canonical structures strictly by document_label rank (Roman numerals I, II, III...), NEVER alphabetically
  return sortStructuresByDocumentLabel(masterList);
}

/**
 * Canonicalizes and deduplicates chemical structures across all slides.
 * - Filters out non-compound entities (foods, beverages, fluids, generic headings).
 * - Only includes discrete small molecules (DRUG or METABOLITE, or entities with chemData).
 * - Keys compounds by PubChem CID or sanitized generic lowercase name.
 * - Consolidates multiple slide occurrences into a single canonical structure entry,
 *   preserving earliest slide index as sourcePageNumber and recording all occurrences in sourcePageNumbers.
 * - Assigns sequential Roman numerals (I, II, III...) strictly in chronological order of appearance.
 */
export function deduplicateAndCanonicalizeStructures(
  entities: GraphEntity[],
  totalSlidesCount = 1
): ChemicalStructure[] {
  const romanNumerals = [
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
    'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV'
  ];

  // 1. Filter out non-compound entities and non-drug types
  const candidateEntities = entities.filter((e) => {
    if (!e || (!e.id && !e.name)) return false;
    const nameOrId = e.name || e.id;
    if (isNonCompoundEntity(e.id) || isNonCompoundEntity(nameOrId)) return false;
    return e.type === 'DRUG' || e.type === 'METABOLITE' || Boolean(e.chemData);
  });

  // 2. Group by canonical key (CID if known, else sanitized lowercase name)
  interface CanonicalGroup {
    key: string;
    canonicalName: string;
    document_label?: string;
    orderIndex: number;
    type: string;
    cid?: number;
    chemData?: any;
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
        chemData: ent.chemData ? { ...ent.chemData } : undefined,
        clinicalSummary: (ent.clinical_and_sar_summary || '').trim(),
        sourcePageNumbers: new Set(entPages),
        earliestPage: Math.min(...entPages),
        rawEntities: [ent],
      });
    } else {
      // Merge pages
      entPages.forEach((p) => existing.sourcePageNumbers.add(p));
      existing.earliestPage = Math.min(...Array.from(existing.sourcePageNumbers));

      if (!existing.document_label && rawLabel) {
        existing.document_label = rawLabel;
      }

      // Prefer richer/cleaner name
      if (cleanName.length > existing.canonicalName.length && !existing.canonicalName.includes('(')) {
        existing.canonicalName = cleanName;
      }
      // Merge CID / chemData
      if (!existing.cid && cid) {
        existing.cid = cid;
      }
      if (!existing.chemData && ent.chemData) {
        existing.chemData = { ...ent.chemData };
      }
      // Keep only the richest/latest extraction, do NOT concatenate text properties
      const newSummary = cleanSingleParagraphSar((ent.clinical_and_sar_summary || '').trim());
      if (newSummary) {
        if (!existing.clinicalSummary || newSummary.length >= existing.clinicalSummary.length) {
          existing.clinicalSummary = newSummary;
        }
      }
      existing.rawEntities.push(ent);
    }
  }

  // 3. Sort canonical molecules strictly in chronological order of first appearance (earliestPage)
  // Preserve order or sort by document_label, NEVER sort alphabetically
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

  // 4. Assign document labels or sequential Roman numerals (Structure I, Structure II...)
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

    return {
      id: docLabel,
      document_label: docLabel,
      name: group.canonicalName,
      chemicalClass: group.type,
      pharmacologicalClass: group.clinicalSummary.slice(0, 80) || 'Pharmacological Agent',
      cid: cid || undefined,
      pngUrl,
      target: group.rawEntities[0]?.id || group.canonicalName.toLowerCase(),
      reversibility: 'Reversible',
      route: 'Oral',
      keyFunctionalGroups: [],
      pkPdHighlights: {
        onset: 'Standard',
        duration: 'Standard',
        halfLife: 'Standard',
        elimination: 'Hepatic / Renal',
      },
      sarNotes: cleanSingleParagraphSar(group.clinicalSummary || ''),
      sourcePageNumber: earliest,
      sourcePageNumbers: sortedPages,
      mw: group.chemData?.molecularWeight,
      logP: group.chemData?.xlogp,
      pubchemAudit: {
        cid: cid || 0,
        status: cid ? ('verified' as const) : ('unresolved' as const),
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: group.chemData?.canonicalSmiles,
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

/**
 * Universal file processor and quiz generator.
 * Ingests a lecture, PDF, PPTX, image, or text file, saves knowledge graph to Dexie,
 * enriches with PubChem, generates high-yield board questions, and packages as a ReviewModule.
 * Preserves exact slide/page chronological order and groups questions and structures accordingly.
 */
export async function processFileAndGenerateQuestions(
  file: File,
  onProgress?: (progress: IngestionProgress) => void,
  signal?: AbortSignal
): Promise<ProcessFileResult> {
  const result = await ingestLectureDocument(file, onProgress, signal);

  // 1. Deduplicate structures across all slides into canonical registry
  const initialStructures =
    result.structures && result.structures.length > 0
      ? result.structures
      : deduplicateAndCanonicalizeStructures(result.entities, result.totalSlides);

  // 2. Resilient batch verification pass: Fast-path already enriched structures to eliminate redundant PubChem network calls
  const verifiedResults: Array<any> = new Array(initialStructures.length);
  const needsVerificationIndices: number[] = [];
  const structuresToVerify: typeof initialStructures = [];

  for (let i = 0; i < initialStructures.length; i++) {
    const s = initialStructures[i];
    const hasImage = Boolean(s.pngUrl || (s as any).structureImageDataUrl || (s as any).chemData?.structureImageDataUrl);
    if (s.cid && s.cid > 0 && hasImage) {
      // Fast path: already verified during ingestion or cached in Dexie
      verifiedResults[i] = {
        id: s.id,
        name: s.name,
        cid: s.cid,
        canonicalSmiles: s.pubchemAudit?.canonicalSmiles,
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

    // Check if any question has enriched structure data for this molecule (Role 1: The Chemist)
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

    const target_receptor = enrichedData?.target_receptor || s.target_receptor;
    const target = target_receptor || enrichedData?.target || s.target;
    const rawMoa = enrichedData?.moa_summary || enrichedData?.sar_rationale || s.moa_summary || s.sar_rationale;
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
    const pkPdHighlights = enrichedData?.pkPdHighlights || s.pkPdHighlights;
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

    return {
      ...s,
      id: document_label,
      document_label,
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
      chemicalClass,
      pharmacologicalClass,
      mw,
      logP,
      pubchemAudit: {
        ...s.pubchemAudit,
        cid: cid || 0,
        status: cid ? ('verified' as const) : ('unresolved' as const),
        canonicalSmiles: v?.canonicalSmiles || s.pubchemAudit?.canonicalSmiles,
        iupacName: v?.iupacName || s.pubchemAudit?.iupacName,
        molecularFormula: v?.molecularFormula || s.pubchemAudit?.molecularFormula,
        molecularWeight: mw,
        xlogp: logP,
        pubChemUrl: cid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}` : '',
      },
    };
  });

  const structures: ChemicalStructure[] = sortStructuresByDocumentLabel(rawStructures);

  // Helper to attach verified Roman numeral structures to questions
  const populateQuestionStructures = (
    questionList: AntiplateletQuestion[],
    availableStructures: ChemicalStructure[]
  ): AntiplateletQuestion[] => {
    return questionList.map((q) => {
      // 1. Prioritize explicit referenced_structures
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
          return {
            ...q,
            structuresDisplayed: matched,
          };
        }
      }

      if (q.type === 'matching') {
        return {
          ...q,
          structuresDisplayed:
            availableStructures.length > 0 ? availableStructures : structures,
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

  // 3. Group and render questions and structures strictly by their originating slide sequence
  const totalSlides = Math.max(result.totalSlides || 1, result.slides?.length || 1);
  const pages: ReviewPage[] = [];

  if (totalSlides > 1 && result.slides && result.slides.length > 0) {
    // Sort slides 1-based ascending
    const sortedSlides = [...result.slides].sort((a, b) => a.slideNumber - b.slideNumber);

    for (const slide of sortedSlides) {
      const p = slide.slideNumber;
      const slideTitle = slide.title || `Slide ${p}`;

      // Structures appearing on this slide
      let pageStructures = structures.filter(
        (s) => s.sourcePageNumbers?.includes(p) || s.sourcePageNumber === p
      );
      if (pageStructures.length === 0) {
        pageStructures = structures;
      }
      pageStructures = sortStructuresByDocumentLabel(pageStructures);

      // Questions anchored to this slide
      let pageQuestions = result.generatedQuestions.filter(
        (q) => q.sourcePageNumber === p
      );
      if (pageQuestions.length === 0) {
        pageQuestions = synthesizePageFallbackQuestions(p, slideTitle, pageStructures);
      }

      // Check if we have scoped question blocks for this slide
      const slideBlocks = (result.question_blocks || [])
        .filter((item) => item.pageNumber === p)
        .map((item) => item.block);

      let sections: ReviewSection[] = [];

      if (slideBlocks.length > 0) {
        sections = slideBlocks.map((b, bIdx) => {
          const resolvedBlockStructures = b.local_structures.length > 0
            ? b.local_structures.map((ls) => {
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

    // Distribute any questions whose sourcePageNumber didn't match a slide to the first page with structures
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
    // Single page document
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
          ? b.local_structures.map((ls) => {
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
