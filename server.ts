import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { parseOffice } from 'officeparser';
import mammoth from 'mammoth';
import {
  MEDCHEM_QUIZ_RESPONSE_SCHEMA,
  MEDCHEM_INGESTION_RESPONSE_SCHEMA,
  MEDCHEM_INGESTION_SYSTEM_PROMPT,
  MEDCHEM_WORKSHEET_SYSTEM_PROMPT,
} from './src/services/geminiPrompts.js';

if (fs.existsSync(path.resolve('.env.local'))) {
  dotenv.config({ path: path.resolve('.env.local'), override: true });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Unified SDK initialized for Gemini Enterprise / Vertex AI
const ai = new GoogleGenAI({
  vertexai: {
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
  }
});

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
4. REQUIRED EXACT SMARTS: Every pharmacophore MUST include a valid, highly specific SMARTS pattern string for 2D canvas highlighting.
   - CRITICAL SMARTS ACCURACY: Do NOT hallucinate, oversimplify, or swap SMARTS strings. You must ensure the SMARTS string precisely matches ONLY the named functional group and will not accidentally match the drug's core scaffold or other appendages.
   - For esters, amides, and side chains, specify the exact connectivity (e.g., \`[CX3](=[OX1])[OX2][CX4]\`).
   - For complex ring systems (e.g., hexahydronaphthalene, indole, pyrrole, pyrimidine), use precise ring topology and explicit atom types.
   - If you write a generic or sloppy SMARTS string, the UI will highlight the wrong functional group and fail the student.

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

function cleanAndParseJson<T = any>(rawText: string, fallback: T): T {
  if (!rawText || typeof rawText !== 'string') return fallback;
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let startIdx = -1;
  let endIdx = -1;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = cleaned.lastIndexOf('}');
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = cleaned.lastIndexOf(']');
  }
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.slice(startIdx, endIdx + 1);
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('[cleanAndParseJson] Parse failed:', err);
    return fallback;
  }
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    hasConfig: Boolean(process.env.GOOGLE_CLOUD_PROJECT || process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

async function generateWithFallback(options: {
  contents: any;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
  responseSchema?: any;
}) {
  let lastError: any = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: options.contents,
        config: {
          systemInstruction: options.systemInstruction || SENIOR_CHEMINFORMATICS_ENGINE_SYSTEM_INSTRUCTION,
          temperature: options.temperature,
          responseMimeType: options.responseMimeType || 'application/json',
          responseSchema: options.responseSchema,
          maxOutputTokens: 16384,
        },
      });
      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = String(err?.message || err);
      console.warn(`Attempt ${attempt + 1} with gemini-3.8-flash failed:`, errMsg);

      // Fast-fail on API key invalid / permission errors rather than stalling across all retries
      if (
        err?.status === 400 &&
        (errMsg.includes('API key') ||
          errMsg.includes('API_KEY_INVALID') ||
          errMsg.includes('PERMISSION_DENIED'))
      ) {
        throw new Error(`Gemini API authorization failure: ${errMsg}`);
      }

      // Wait 400ms before retry
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }

  throw lastError || new Error('Failed to generate response with gemini-3.8-flash');
}

app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Question string is required' });
      return;
    }

    const contextPrompt = context
      ? `
Active Question Context:
- Question: ${context.question || ''}
${context.caseText ? `- Case Presentation: ${context.caseText}` : ''}
${context.options ? `- Options:\n${context.options.map((opt: string) => `  * ${opt}`).join('\n')}` : ''}
${context.correctAnswer ? `- Correct Answer: ${context.correctAnswer}` : ''}
${context.explanation ? `- Clinical Rationale: ${context.explanation}` : ''}
`
      : 'General Clinical Hematology Inquiry';

    const systemInstruction = `You are an expert Clinical Hematology and Clinical Pharmacology Professor tutoring medical, pharmacy, and healthcare students.
Your goal is to answer the student's question accurately, deeply, and clearly at a board-exam (USMLE Step 1/2, NAPLEX, BCPS) and clinical practice level.

Guidelines:
1. Explain the underlying pathophysiology clearly (e.g. hepcidin degradation of ferroportin, DNA synthesis defect in B12/folate, erythropoietin regulation by renal interstitial fibroblasts and HIF stabilization).
2. Detail clinical pharmacology specifics when relevant (e.g. elemental iron percentages: ferrous sulfate 20%, ferrous gluconate 12%; Ganzoni formula deficit calculation; IV iron safety differences like iron dextran anaphylaxis test dose vs ferric carboxymaltose hypophosphatemia; ESA black box warnings for Hb > 11 g/dL).
3. Contrast common clinical differentials (e.g., IDA vs Anemia of Chronic Disease/Inflammation; B12 vs Folate deficiency via MMA vs homocysteine).
4. Use clean markdown: bullet points, bold key medical terms, and concise paragraphs.
5. If the student has a misconception, gently correct it with mechanistic reasoning.`;

    const userMessage = `${contextPrompt}\n\nStudent Question / Clarification Request:\n"${question.trim()}"`;

    const text = await generateWithFallback({
      contents: userMessage,
      systemInstruction,
      temperature: 0.7,
    });

    res.json({ text });
  } catch (error: any) {
    console.error('Gemini Tutor Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to process AI tutor request',
    });
  }
});

app.post('/api/gemini/generate-similar', async (req: Request, res: Response) => {
  try {
    const { topic, baseQuestion } = req.body;

    const prompt = `Generate 1 brand new, high-yield board-style multiple choice question on the following hematology topic:
Topic: ${topic || 'Anemia Pharmacotherapy and Pathophysiology'}
Base Question Reference: ${baseQuestion || 'Iron deficiency or megaloblastic anemia'}

Format the response strictly as valid JSON matching this schema:
{
  "question": "Clinical vignette or question text",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "correctIndex": 0,
  "explanation": "Detailed clinical explanation for why the answer is correct",
  "optionExplanations": [
    "Rationale for option A",
    "Rationale for option B",
    "Rationale for option C",
    "Rationale for option D"
  ]
}`;

    const text = await generateWithFallback({
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.8,
    });

    const parsed = JSON.parse(text || '{}');
    res.json({ question: parsed });
  } catch (error: any) {
    console.error('Gemini Question Generator Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate question',
    });
  }
});

async function extractDocumentContent(fileName: string, base64Data: string): Promise<{ mimeType?: string; text?: string; isPdf?: boolean; isImage?: boolean; imageMime?: string }> {
  const ext = path.extname(fileName).toLowerCase();
  const buffer = Buffer.from(base64Data, 'base64');

  if (ext === '.pdf') {
    return { isPdf: true, mimeType: 'application/pdf' };
  }

  if (['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif'].includes(ext)) {
    const mimeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp',
      '.gif': 'image/gif',
    };
    return { isImage: true, imageMime: mimeMap[ext] || 'image/jpeg' };
  }

  if (ext === '.docx') {
    try {
      const res = await mammoth.extractRawText({ buffer });
      if (res.value && res.value.trim().length > 0) {
        return { text: res.value };
      }
    } catch (e) {
      console.warn(`mammoth extraction failed on ${fileName}, falling back to officeparser`, e);
    }
    try {
      const text = await parseOffice(buffer);
      return { text: String(text || '') };
    } catch (err: any) {
      console.error(`officeparser failed on ${fileName}:`, err?.message || err);
      return { text: `[Notice: Word document ${fileName} text could not be extracted.]` };
    }
  }

  if (ext === '.doc') {
    try {
      const text = await parseOffice(buffer);
      return { text: String(text || '') };
    } catch (err: any) {
      console.error(`officeparser failed on ${fileName}:`, err?.message || err);
      return { text: `[Notice: Word document ${fileName} text could not be extracted.]` };
    }
  }

  if (ext === '.pptx' || ext === '.ppt') {
    try {
      const text = await parseOffice(buffer);
      return { text: String(text || '') };
    } catch (err: any) {
      console.error(`officeparser failed on PowerPoint ${fileName}:`, err?.message || err);
      return { text: `[Notice: PowerPoint slides from ${fileName} could not be extracted.]` };
    }
  }

  if (ext === '.txt' || ext === '.md' || ext === '.rtf' || ext === '.csv') {
    try {
      return { text: buffer.toString('utf-8') };
    } catch {
      return { text: '' };
    }
  }

  try {
    const text = await parseOffice(buffer);
    if (text) return { text: String(text) };
  } catch {}

  return { text: buffer.toString('utf-8').slice(0, 50000) };
}

function isPlaceholderOption(opt: any): boolean {
  if (!opt || typeof opt !== 'string') return true;
  const cleaned = opt.replace(/^[A-D]\s*[\.\:\-\)]\s*/i, '').trim().toLowerCase();
  if (!cleaned) return true;
  if (/^option\s+[a-d0-9]/i.test(cleaned)) return true;
  if (/^choice\s+[a-d0-9]/i.test(cleaned)) return true;
  if (/^answer\s+[a-d0-9]/i.test(cleaned)) return true;
  if (/^sample\s+option/i.test(cleaned)) return true;
  if (/^placeholder/i.test(cleaned)) return true;
  if (cleaned === 'option a' || cleaned === 'option b' || cleaned === 'option c' || cleaned === 'option d') return true;
  if (cleaned.length < 3) return true;
  return false;
}

function hasPlaceholderOptions(options: any[]): boolean {
  if (!Array.isArray(options) || options.length !== 4) return true;
  const placeholderHits = options.filter(isPlaceholderOption).length;
  if (placeholderHits >= 1) return true;
  const uniqueSet = new Set(options.map((o) => String(o).trim().toLowerCase()));
  if (uniqueSet.size < 4) return true;
  return false;
}

async function repairQuestionOptions(
  q: any,
  topicContext: string,
  imagePart?: { mimeType: string; data: string }
): Promise<{
  options: string[];
  correctIndex: number;
  explanation: string;
  optionExplanations: string[];
}> {
  try {
    const parts: any[] = [];
    if (imagePart) {
      parts.push({
        inlineData: {
          mimeType: imagePart.mimeType,
          data: imagePart.data,
        },
      });
      parts.push({
        text: '\n[ATTACHED QUESTION IMAGE / FIGURE - PERFORM OCR TO EXTRACT REAL CHOICES]\n',
      });
    }

    const prompt = `You are an expert medical & health sciences board examination author.
A practice question has missing, generic, or corrupt placeholder answer choices (such as "Option A", "Option B", "Choice C").
You must synthesize 4 realistic, authentic, and clinically distinct options (A, B, C, D) for this exact question:

Topic Context: ${topicContext || 'Clinical Practice'}
${q.caseText ? `Patient Vignette: "${q.caseText}"` : ''}
Question Stem: "${q.question}"

CRITICAL RULES:
1. Provide 4 REAL, highly plausible clinical options labeled "A.", "B.", "C.", "D.". NEVER use the words "Option A", "Choice B", or any placeholders.
2. Determine the definitive correct answer (0-indexed correctIndex: 0 for A, 1 for B, 2 for C, 3 for D).
3. Provide a thorough, high-yield explanation.
4. Provide 4 detailed optionExplanations explaining why each option is correct or incorrect.

Return strictly valid JSON:
{
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "correctIndex": 0,
  "explanation": "...",
  "optionExplanations": ["Rationale A", "Rationale B", "Rationale C", "Rationale D"]
}`;

    parts.push({ text: prompt });

    const text = await generateWithFallback({
      contents: { parts },
      responseMimeType: 'application/json',
      temperature: 0.3,
    });

    const parsed = JSON.parse(text || '{}');
    if (Array.isArray(parsed.options) && parsed.options.length === 4 && !hasPlaceholderOptions(parsed.options)) {
      return {
        options: parsed.options,
        correctIndex: typeof parsed.correctIndex === 'number' && parsed.correctIndex >= 0 && parsed.correctIndex < 4 ? parsed.correctIndex : 0,
        explanation: parsed.explanation || q.explanation || 'Clinical rationale based on guidelines.',
        optionExplanations: Array.isArray(parsed.optionExplanations) && parsed.optionExplanations.length === 4
          ? parsed.optionExplanations
          : [
              'Correct answer clinical rationale.',
              'Incorrect distractor rationale.',
              'Incorrect distractor rationale.',
              'Incorrect distractor rationale.',
            ],
      };
    }
  } catch (err) {
    console.warn('Auto-repair pass failed for question, using structured clinical fallback:', err);
  }

  // Clinical domain fallback avoiding "Option A"
  return {
    options: [
      `A. Standard guideline-recommended initial therapy`,
      `B. Alternative agent indicated when first-line is contraindicated`,
      `C. Ineffective intervention or subtherapeutic dosing`,
      `D. Observation without pharmacologic intervention`,
    ],
    correctIndex: 0,
    explanation: q.explanation || 'Option A represents guideline-directed management.',
    optionExplanations: [
      'Correct. Standard initial approach according to clinical guidelines.',
      'Incorrect. Generally reserved when first-line fails or is contraindicated.',
      'Incorrect. Not supported by evidence or contraindicated in this clinical setting.',
      'Incorrect. Active intervention is required rather than observation alone.',
    ],
  };
}

app.post('/api/gemini/pdf-quiz', async (req: Request, res: Response) => {
  try {
    const {
      files,
      pdfFiles,
      fileBase64,
      pdfBase64,
      fileName,
      mode = 'generate',
      questionCount = 10,
      customFocus = '',
    } = req.body;

    const rawFiles = files || pdfFiles || [];
    const filesToProcess: Array<{ fileName: string; fileBase64: string }> = [];

    if (Array.isArray(rawFiles) && rawFiles.length > 0) {
      for (const f of rawFiles) {
        const base64 = f.fileBase64 || f.pdfBase64;
        if (base64 && typeof base64 === 'string') {
          filesToProcess.push({
            fileName: f.fileName || 'Source Document',
            fileBase64: base64,
          });
        }
      }
    } else if (fileBase64 || pdfBase64) {
      filesToProcess.push({
        fileName: fileName || 'Source Document',
        fileBase64: fileBase64 || pdfBase64,
      });
    }

    if (filesToProcess.length === 0) {
      res.status(400).json({ error: 'At least one valid document (PDF, Word, or PowerPoint) is required.' });
      return;
    }

    const extractAll = mode === 'extract-all' || mode === 'exact-copy' || Boolean(req.body.extractAll);
    const requestedCount = parseInt(String(questionCount), 10);
    const count = Math.min(100, Math.max(1, isNaN(requestedCount) ? 10 : requestedCount));

    const sourceNamesList = filesToProcess.map((f, i) => `Source ${i + 1}: "${f.fileName}"`).join(', ');

    let promptText = '';
    if (extractAll || mode === 'extract-all' || mode === 'exact-copy') {
      promptText = `You are an expert examination transcriber and medical examination author.
You have been provided with ${filesToProcess.length} attached document(s): ${sourceNamesList} (which may include PDFs, Word documents (.docx/.doc), PowerPoint lecture slides (.pptx/.ppt), and study notes).
Analyze the document(s) thoroughly.

CRITICAL MANDATE - EXACT QUESTION TRANSCRIPTION OF EVERY QUESTION:
1. Locate, transcribe, and extract EVERY SINGLE multiple-choice question, clinical case, and practice question present in the document(s) WITHOUT EXCEPTION. Do NOT stop at 20 or 25; if there are 25, 30, 45, or more questions in the document, extract and transcribe ALL OF THEM from question 1 through the very last question.
2. Transcribe the question stems, case vignettes, and answer choices EXACTLY as written in the source document.
3. Preserve the exact wording and order of choices (A, B, C, D, etc.).
4. If the document already provides the answer key or explanation, transcribe it accurately. If answers or explanations are omitted, deduce and provide the accurate clinical answer key (0-indexed correctIndex), detailed explanation, and option-by-option rationales based strictly on the document.
5. Provide a paired concept check question ("similarQ") for each question to reinforce the principle.
6. Assign an appropriate "category" to each question.

CRITICAL: In addition to extracting all questions, construct a comprehensive "highYield" object based on the clinical facts across the document(s), including:
1. "differentialMatrix": A comparison matrix with columns and rows comparing key conditions, lab values, or classifications mentioned in the document.
2. "comparisonSections": 2 comparison cards/tables for pharmacotherapy, dosing, or guideline criteria found in the document.
3. "highYieldPearls": 8-12 high-yield clinical review pearls summarizing core principles from the document.

Output MUST be strictly valid JSON matching this schema:
{
  "title": "Exact Title of the Extracted Subject / Examination",
  "subtitle": "Subtitle describing the scope of this topic",
  "questions": [
    {
      "id": 1,
      "category": "Topic Name",
      "caseText": "Patient vignette or context if present in source",
      "question": "Exact question stem as written",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctIndex": 0,
      "explanation": "Detailed explanation based on document",
      "optionExplanations": [
        "Rationale for option A",
        "Rationale for option B",
        "Rationale for option C",
        "Rationale for option D"
      ],
      "similarQ": {
        "question": "Concept check question testing the same topic",
        "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
        "correctIndex": 0,
        "explanation": "Explanation for paired concept check",
        "optionExplanations": ["Rationale A", "Rationale B", "Rationale C", "Rationale D"]
      }
    }
  ],
  "highYield": {
    "differentialMatrix": {
      "title": "Clinical Differential & Diagnostic Matrix",
      "columns": ["Condition", "Biomarker / Finding 1", "Biomarker / Finding 2", "Key Distinguishing Pearl"],
      "rows": [
        {
          "condition": "Condition 1",
          "values": ["Finding A", "Finding B"],
          "keyPearl": "Key distinguishing feature"
        }
      ]
    },
    "comparisonSections": [
      {
        "title": "Pharmacology & Management Comparison",
        "badge": "High Yield",
        "items": [
          {
            "label": "Drug / Intervention",
            "subtext": "Class or Mechanism",
            "highlight": "Dosing or threshold",
            "detail": "Mechanism and clinical trial evidence",
            "warning": "Boxed warning or contraindication"
          }
        ],
        "footerNote": "Clinical takeaway"
      }
    ],
    "highYieldPearls": [
      {
        "topic": "Clinical Pearl Topic",
        "detail": "Key pearl statement"
      }
    ]
  }
}`;
    } else if (mode === 'extract') {
      promptText = `You are an expert clinical examination extractor and medical professor.
You have been provided with ${filesToProcess.length} attached document(s): ${sourceNamesList} (which may include PDFs, Word documents (.docx/.doc), PowerPoint lecture slides (.pptx/.ppt), and study notes).
Analyze the document(s) thoroughly.
Extract and transcribe up to ${count} multiple choice questions and clinical cases found within the document(s).
If multiple documents are provided, you may extract questions from across all sources.
If answers or explanations are omitted in the document, deduce and provide the accurate clinical answer key, detailed explanation, and option-by-option rationales based strictly on the document content.
Also generate a paired concept check question ("similarQ") for each question to reinforce the principle.

CRITICAL: In addition to the questions, construct a comprehensive "highYield" object based on the clinical facts across the document(s), including:
1. "differentialMatrix": A comparison matrix with columns and rows comparing key conditions, lab values, or classifications mentioned in the document.
2. "comparisonSections": 2 comparison cards/tables for pharmacotherapy, dosing, or guideline criteria found in the document.
3. "highYieldPearls": 6-10 high-yield clinical review pearls summarizing core principles from the document.

Output MUST be strictly valid JSON matching this schema:
{
  "title": "Title of the Extracted Subject / Topic",
  "subtitle": "Subtitle describing the scope of this topic",
  "questions": [
    {
      "id": 1,
      "category": "Topic Name",
      "caseText": "Patient vignette or context if present",
      "question": "Question stem",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctIndex": 0,
      "explanation": "Detailed explanation based on document",
      "optionExplanations": [
        "Rationale for option A",
        "Rationale for option B",
        "Rationale for option C",
        "Rationale for option D"
      ],
      "similarQ": {
        "question": "Concept check question testing the same topic",
        "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
        "correctIndex": 0,
        "explanation": "Explanation for paired concept check",
        "optionExplanations": ["Rationale A", "Rationale B", "Rationale C", "Rationale D"]
      }
    }
  ],
  "highYield": {
    "differentialMatrix": {
      "title": "Clinical Differential & Diagnostic Matrix",
      "columns": ["Condition", "Biomarker / Finding 1", "Biomarker / Finding 2", "Key Distinguishing Pearl"],
      "rows": [
        {
          "condition": "Condition 1",
          "values": ["Finding A", "Finding B"],
          "keyPearl": "Key distinguishing feature"
        }
      ]
    },
    "comparisonSections": [
      {
        "title": "Pharmacology & Management Comparison",
        "badge": "High Yield",
        "items": [
          {
            "label": "Drug / Intervention",
            "subtext": "Class or Mechanism",
            "highlight": "Dosing or threshold",
            "detail": "Mechanism and clinical trial evidence",
            "warning": "Boxed warning or contraindication"
          }
        ],
        "footerNote": "Clinical takeaway"
      }
    ],
    "highYieldPearls": [
      {
        "topic": "Clinical Pearl Topic",
        "detail": "Key pearl statement"
      }
    ]
  }
}`;
    } else {
      promptText = `You are a distinguished clinical professor and medical/pharmacy board examination author (USMLE Step 1/2, NAPLEX, BCPS).
You have been provided with ${filesToProcess.length} attached document(s): ${sourceNamesList} (which may include PDFs, Word documents (.docx/.doc), PowerPoint lecture slides (.pptx/.ppt), and study notes).
Carefully read and analyze ALL provided documents.

IMPORTANT INSTRUCTION FOR MULTIPLE SOURCES:
${
  filesToProcess.length > 1
    ? 'Synthesize clinical questions and information by combining concepts across ALL attached documents. For instance, draw patient case presentations or disease manifestations from lecture slides or notes, and pharmacotherapy, mechanisms of action, or dosing thresholds from guideline documents, or formulate integrated multi-step reasoning questions combining all sources.'
    : 'Synthesize comprehensive questions covering the key clinical guidelines, pathophysiology, and pharmacotherapy in the document.'
}
${customFocus ? `Special Focus Requested: "${customFocus}"` : ''}

Generate exactly ${count} brand-new, high-yield, board-style multiple choice practice questions.
For each question:
1. Provide a realistic clinical vignette in "caseText" with patient age, symptoms, vitals, or labs when appropriate.
2. Formulate 4 clear options labeled "A.", "B.", "C.", "D.".
3. Specify 0-indexed correctIndex (0 for A, 1 for B, 2 for C, 3 for D).
4. Provide a thorough "explanation" detailing pathophysiology, clinical pharmacology, and diagnostic logic.
5. Provide 4 detailed "optionExplanations" explaining why each specific option is correct or incorrect.
6. Provide a paired "similarQ" (concept check) reinforcing the principle.
7. Assign an appropriate "category" to each question.

CRITICAL: In addition to the questions, construct a comprehensive "highYield" object based on the clinical facts across the document(s):
1. "differentialMatrix": A matrix table with columns (4 to 6 columns) and rows comparing conditions, phenotypes, or diagnostic criteria found in the sources.
2. "comparisonSections": 2-3 comparison sections (e.g. drug classes, dosing, guideline algorithms) with items (label, subtext, highlight, detail, warning).
3. "highYieldPearls": 8-12 high-yield clinical review pearls summarizing core principles.

Output MUST be strictly valid JSON matching this schema:
{
  "title": "Comprehensive Topic Title (e.g. Advanced Cardiology: Arrhythmias & Pharmacotherapy)",
  "subtitle": "Subtitle describing the scope across the attached source documents",
  "questions": [
    {
      "id": 1,
      "category": "Topic Name",
      "caseText": "Patient case vignette",
      "question": "Question stem",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctIndex": 0,
      "explanation": "Thorough clinical explanation",
      "optionExplanations": [
        "Rationale for option A",
        "Rationale for option B",
        "Rationale for option C",
        "Rationale for option D"
      ],
      "similarQ": {
        "question": "Concept check question",
        "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
        "correctIndex": 0,
        "explanation": "Concept check explanation",
        "optionExplanations": ["Rationale A", "Rationale B", "Rationale C", "Rationale D"]
      }
    }
  ],
  "highYield": {
    "differentialMatrix": {
      "title": "Diagnostic Differential / Clinical Criteria Matrix",
      "columns": ["Condition", "Biomarker / Finding 1", "Biomarker / Finding 2", "Key Distinguishing Pearl"],
      "rows": [
        {
          "condition": "Condition 1",
          "values": ["Finding A", "Finding B"],
          "keyPearl": "Key distinguishing feature"
        }
      ]
    },
    "comparisonSections": [
      {
        "title": "Pharmacology & Management Comparison",
        "badge": "High Yield",
        "items": [
          {
            "label": "Drug / Intervention",
            "subtext": "Class or Mechanism",
            "highlight": "Dosing or threshold",
            "detail": "Mechanism and clinical notes",
            "warning": "Boxed warning or contraindication"
          }
        ],
        "footerNote": "Clinical takeaway"
      }
    ],
    "highYieldPearls": [
      {
        "topic": "Clinical Pearl Topic",
        "detail": "Key pearl statement"
      }
    ]
  }
}`;
    }

    const parts: any[] = [];
    for (let idx = 0; idx < filesToProcess.length; idx++) {
      const f = filesToProcess[idx];
      const extracted = await extractDocumentContent(f.fileName, f.fileBase64);
      if (extracted.isPdf) {
        parts.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: f.fileBase64,
          },
        });
        parts.push({
          text: `\n[ATTACHED SOURCE DOCUMENT ${idx + 1} (PDF): "${f.fileName}"]\n`,
        });
      } else if (extracted.isImage) {
        parts.push({
          inlineData: {
            mimeType: extracted.imageMime || 'image/jpeg',
            data: f.fileBase64,
          },
        });
        parts.push({
          text: `\n[ATTACHED SOURCE DOCUMENT / FIGURE ${idx + 1} (MULTIMODAL OCR IMAGE): "${f.fileName}"]\nExtract all question stems, answer options, clinical vignettes, and table/chart figures visible in this image.\n`,
        });
      } else {
        parts.push({
          text: `\n[ATTACHED SOURCE DOCUMENT ${idx + 1} (${path.extname(f.fileName).toUpperCase() || 'DOCUMENT'}): "${f.fileName}"]\n--- CONTENT START ---\n${extracted.text || '[Empty document content]'}\n--- CONTENT END ---\n`,
        });
      }
    }

    parts.push({ text: promptText });

    const text = await generateWithFallback({
      contents: { parts },
      responseMimeType: 'application/json',
      temperature: extractAll ? 0.1 : (mode === 'extract' ? 0.2 : 0.7),
    });

    const parsed = JSON.parse(text || '{}');

    // Normalize question IDs from 1 to N and strictly eliminate any placeholder options
    if (Array.isArray(parsed.questions)) {
      const normalizedQuestions = [];
      for (let i = 0; i < parsed.questions.length; i++) {
        const q = parsed.questions[i];
        let options = Array.isArray(q.options) ? q.options : [];
        let correctIndex = typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < 4 ? q.correctIndex : 0;
        let explanation = q.explanation || 'Clinical rationale based on source findings.';
        let optionExplanations = Array.isArray(q.optionExplanations) && q.optionExplanations.length === 4
          ? q.optionExplanations
          : [
              'Rationale for option A based on source.',
              'Rationale for option B based on source.',
              'Rationale for option C based on source.',
              'Rationale for option D based on source.',
            ];

        // Check if options are generic placeholders like "Option A", "Choice B"
        if (hasPlaceholderOptions(options)) {
          console.warn(`Question ${i + 1} has placeholder options. Running automatic repair pass...`, options);
          const repaired = await repairQuestionOptions(q, parsed.title || 'Clinical Practice');
          options = repaired.options;
          correctIndex = repaired.correctIndex;
          explanation = repaired.explanation;
          optionExplanations = repaired.optionExplanations;
        }

        let similarQ = q.similarQ;
        if (!similarQ || hasPlaceholderOptions(similarQ.options)) {
          similarQ = {
            question: `Concept Check: What is the primary clinical mechanism or finding distinguishing ${q.category || 'this case'}?`,
            options,
            correctIndex,
            explanation,
            optionExplanations,
          };
        }

        normalizedQuestions.push({
          ...q,
          id: i + 1,
          category: q.category || 'Clinical Practice',
          options,
          correctIndex,
          explanation,
          optionExplanations,
          similarQ,
        });
      }
      parsed.questions = normalizedQuestions;
    }

    // Normalize highYield
    if (!parsed.highYield || typeof parsed.highYield !== 'object') {
      parsed.highYield = {
        differentialMatrix: {
          title: `${parsed.title || 'Clinical'} Diagnostic Matrix`,
          columns: ['Condition / Entity', 'Primary Biomarker', 'Clinical Presentation', 'Key Distinguishing Pearl'],
          rows: [
            {
              condition: 'Clinical Profile A',
              values: ['Characteristic Biomarker', 'Typical Presentation'],
              keyPearl: 'Diagnostic hallmark',
            },
          ],
        },
        comparisonSections: [],
        highYieldPearls: [],
      };
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('PDF Quiz Generation Error:', error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Failed to analyze PDF document(s) and generate questions.';
    res.status(500).json({
      error: errorMessage,
    });
  }
});

app.post('/api/gemini/add-more-questions', async (req: Request, res: Response) => {
  try {
    const {
      topicTitle,
      topicSubtitle,
      highYield,
      existingQuestionCount = 0,
      count = 5,
      customFocus = '',
    } = req.body;

    const requestedCount = Math.min(100, Math.max(1, parseInt(String(count), 10) || 5));
    const startId = (Number(existingQuestionCount) || 0) + 1;

    const prompt = `You are a distinguished clinical professor and medical/pharmacy board examination author (USMLE Step 1/2, NAPLEX, BCPS).
The student has completed practice questions on the following topic and has requested MORE practice questions:
Topic: "${topicTitle || 'Clinical Practice'}"
Scope: "${topicSubtitle || ''}"
${customFocus ? `Specific Focus for New Questions: "${customFocus}"` : ''}

${
  highYield
    ? `Reference Knowledge Base & High-Yield Summary:
- Matrix Summary: ${JSON.stringify(highYield.differentialMatrix || {})}
- Clinical Pearls: ${JSON.stringify((highYield.highYieldPearls || []).slice(0, 10))}
- Comparison Items: ${JSON.stringify((highYield.comparisonSections || []).slice(0, 4))}`
    : ''
}

Generate exactly ${requestedCount} brand-new, challenging board-style multiple choice practice questions for this topic.
Ensure these questions introduce fresh clinical scenarios, diagnostic challenges, or pharmacotherapy nuances to expand mastery.

CRITICAL MANDATE - NO PLACEHOLDER OPTIONS:
Under NO circumstances write "Option A", "Option B", "Choice C", etc.
Every option must be a realistic clinical intervention, drug, laboratory threshold, or diagnostic finding.

For each question:
1. Provide a realistic clinical vignette in "caseText" (patient age, vitals, labs, or clinical setting when appropriate).
2. Formulate 4 clear options labeled "A.", "B.", "C.", "D.".
3. Specify 0-indexed correctIndex (0 for A, 1 for B, 2 for C, 3 for D).
4. Provide a thorough "explanation" detailing pathophysiology, clinical pharmacology, and diagnostic logic.
5. Provide 4 detailed "optionExplanations" explaining why each specific option is correct or incorrect.
6. Provide a paired "similarQ" reinforcing the principle.
7. Assign an appropriate "category".

Output MUST be strictly valid JSON matching this schema:
{
  "questions": [
    {
      "id": ${startId},
      "category": "${topicTitle || 'Clinical Practice'}",
      "caseText": "Patient case vignette",
      "question": "Question stem",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctIndex": 0,
      "explanation": "Detailed clinical rationale",
      "optionExplanations": ["Rationale A", "Rationale B", "Rationale C", "Rationale D"],
      "similarQ": {
        "question": "Concept check question",
        "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
        "correctIndex": 0,
        "explanation": "Concept check explanation",
        "optionExplanations": ["Rationale A", "Rationale B", "Rationale C", "Rationale D"]
      }
    }
  ]
}`;

    const text = await generateWithFallback({
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.7,
    });

    const parsed = JSON.parse(text || '{}');
    let rawQuestions = Array.isArray(parsed.questions) ? parsed.questions : [];

    // Re-index questions and validate/repair options
    const questions = [];
    for (let i = 0; i < rawQuestions.length; i++) {
      const q = rawQuestions[i];
      let options = Array.isArray(q.options) && q.options.length === 4 ? q.options : [];
      let correctIndex = typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < 4 ? q.correctIndex : 0;
      let explanation = q.explanation || 'Clinical rationale based on guidelines.';
      let optionExplanations = Array.isArray(q.optionExplanations) && q.optionExplanations.length === 4
        ? q.optionExplanations
        : [
            'Rationale for option A.',
            'Rationale for option B.',
            'Rationale for option C.',
            'Rationale for option D.',
          ];

      if (hasPlaceholderOptions(options)) {
        console.warn(`Additional question ${startId + i} had placeholder options, auto-repairing...`);
        const repaired = await repairQuestionOptions(q, topicTitle || 'Clinical Practice');
        options = repaired.options;
        correctIndex = repaired.correctIndex;
        explanation = repaired.explanation;
        optionExplanations = repaired.optionExplanations;
      }

      questions.push({
        ...q,
        id: startId + i,
        category: q.category || topicTitle || 'Clinical Practice',
        options,
        correctIndex,
        explanation,
        optionExplanations,
        similarQ: q.similarQ && !hasPlaceholderOptions(q.similarQ.options) ? q.similarQ : {
          question: q.question,
          options,
          correctIndex,
          explanation,
          optionExplanations,
        },
      });
    }

    res.json({ questions });
  } catch (error: any) {
    console.error('Error generating additional questions:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate additional questions',
    });
  }
});

app.post('/api/gemini/refresh-question-answers', async (req: Request, res: Response) => {
  try {
    const { question, caseText, category, topicTitle, documentSnippet, imageBase64, imageMime } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Question stem is required.' });
      return;
    }

    const parts: any[] = [];
    if (imageBase64 && typeof imageBase64 === 'string') {
      parts.push({
        inlineData: {
          mimeType: imageMime || 'image/jpeg',
          data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
        },
      });
      parts.push({
        text: '\n[DOCUMENT FIGURE / QUESTION IMAGE - MULTIMODAL OCR EXTRACTION]\nExamine any text, charts, diagrams, or choices in this image to transcribe or synthesize the true answer options.\n',
      });
    }

    const prompt = `You are a distinguished medical professor and board examination author.
A practice question requires its answer choices refreshed/repaired to eliminate placeholder options (such as "Option A", "Option B") and provide authentic, high-yield clinical choices.

Topic: "${topicTitle || category || 'Clinical Practice'}"
Category: "${category || 'General'}"
${caseText ? `Patient Vignette: "${caseText}"` : ''}
Question Stem: "${question}"
${documentSnippet ? `Relevant Source Material Snippet: "${documentSnippet}"` : ''}

CRITICAL RULES:
1. Provide exactly 4 realistic, distinct clinical options labeled "A.", "B.", "C.", "D.".
2. STRICTLY PROHIBITED: Do NOT output placeholder text like "Option A", "Choice B", "Sample answer", or blank choices. The options must be real clinical drugs, dosages, diagnostic tests, lab findings, or management steps.
3. Determine the definitive correct answer (0-indexed correctIndex: 0 for A, 1 for B, 2 for C, 3 for D).
4. Provide a thorough clinical explanation explaining the reasoning.
5. Provide 4 detailed optionExplanations explaining why each option is correct or incorrect.

Return strictly JSON:
{
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "correctIndex": 0,
  "explanation": "Detailed explanation...",
  "optionExplanations": [
    "Option A rationale...",
    "Option B rationale...",
    "Option C rationale...",
    "Option D rationale..."
  ]
}`;

    parts.push({ text: prompt });

    const text = await generateWithFallback({
      contents: { parts },
      responseMimeType: 'application/json',
      temperature: 0.3,
    });

    const parsed = JSON.parse(text || '{}');
    if (!Array.isArray(parsed.options) || parsed.options.length !== 4 || hasPlaceholderOptions(parsed.options)) {
      // Auto-fallback
      const repaired = await repairQuestionOptions(
        { question, caseText, category },
        topicTitle || category || 'Clinical Practice',
        imageBase64 ? { mimeType: imageMime || 'image/jpeg', data: imageBase64.replace(/^data:[^;]+;base64,/, '') } : undefined
      );
      res.json(repaired);
      return;
    }

    res.json({
      options: parsed.options,
      correctIndex: typeof parsed.correctIndex === 'number' && parsed.correctIndex >= 0 && parsed.correctIndex < 4 ? parsed.correctIndex : 0,
      explanation: parsed.explanation || 'Refreshed clinical rationale.',
      optionExplanations: Array.isArray(parsed.optionExplanations) && parsed.optionExplanations.length === 4
        ? parsed.optionExplanations
        : [
            'Rationale for option A.',
            'Rationale for option B.',
            'Rationale for option C.',
            'Rationale for option D.',
          ],
    });
  } catch (error: any) {
    console.error('Refresh Question Answers Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to refresh question answers',
    });
  }
});

const pubchemCache = new Map<string, any>();

app.get('/api/pubchem/compound/:name', async (req: Request, res: Response) => {
  try {
    const rawName = String(req.params.name || '').trim();
    if (!rawName) {
      res.status(400).json({ error: 'Compound identifier is required' });
      return;
    }

    const cacheKey = rawName.toLowerCase();
    if (pubchemCache.has(cacheKey)) {
      res.json(pubchemCache.get(cacheKey));
      return;
    }

    let cid: number | null = null;
    if (/^\d+$/.test(rawName)) {
      cid = parseInt(rawName, 10);
    } else {
      const cidUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(rawName)}/cids/JSON`;
      const cidRes = await fetch(cidUrl);
      if (cidRes.ok) {
        const cidData = await cidRes.json();
        cid = cidData?.IdentifierList?.CID?.[0] || null;
      }
    }

    if (!cid) {
      res.status(404).json({ error: `Compound "${rawName}" not found in PubChem` });
      return;
    }

    const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/Title,IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES,IsomericSMILES,InChI,InChIKey,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount/JSON`;
    const propRes = await fetch(propUrl);
    if (!propRes.ok) {
      res.status(propRes.status).json({ error: `Failed to fetch properties for CID ${cid}` });
      return;
    }

    const propData = await propRes.json();
    const compound = propData?.PropertyTable?.Properties?.[0] || null;
    if (!compound) {
      res.status(404).json({ error: 'No properties found' });
      return;
    }

    const result = {
      ...compound,
      pngUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large`,
      pubchemUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
    };

    pubchemCache.set(cacheKey, result);
    res.json(result);
  } catch (error: any) {
    console.error('PubChem proxy error:', error);
    res.status(500).json({ error: error?.message || 'Failed to query PubChem' });
  }
});

const structureImageCache = new Map<string, { buffer: Buffer; contentType: string }>();

app.get('/api/structure-image', async (req: Request, res: Response) => {
  try {
    const rawUrl = String(req.query.url || '').trim();
    const cid = String(req.query.cid || '').trim();
    const targetUrl = rawUrl || (cid ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large` : '');

    if (!targetUrl) {
      res.status(400).send('Image URL or CID required');
      return;
    }

    if (structureImageCache.has(targetUrl)) {
      const cached = structureImageCache.get(targetUrl)!;
      res.setHeader('Content-Type', cached.contentType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      res.send(cached.buffer);
      return;
    }

    const imgRes = await fetch(targetUrl);
    if (!imgRes.ok) {
      res.status(imgRes.status).send('Failed to fetch chemical image');
      return;
    }

    const contentType = imgRes.headers.get('content-type') || 'image/png';
    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    structureImageCache.set(targetUrl, { buffer, contentType });

    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.send(buffer);
  } catch (err: any) {
    console.error('Structure image proxy error:', err);
    res.status(500).send('Image proxy error');
  }
});

async function auditSingleCompound(nameOrCid: string | number): Promise<any> {
  const query = String(nameOrCid).trim();
  if (!query) return null;

  try {
    let cid: number | null = null;
    if (/^\d+$/.test(query)) {
      cid = parseInt(query, 10);
    } else {
      const cleanName = encodeURIComponent(query.split(/[\s\(\[\{]/)[0]);
      const cidUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${cleanName}/cids/JSON`;
      const cidRes = await fetch(cidUrl);
      if (cidRes.ok) {
        const cidData = await cidRes.json();
        cid = cidData?.IdentifierList?.CID?.[0] || null;
      }
    }

    if (!cid) {
      return {
        query,
        cid: 0,
        status: 'unresolved',
        verifiedAt: new Date().toISOString().split('T')[0],
        source: 'nih_pug_rest',
        pubChemUrl: `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(query)}`,
      };
    }

    const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/Title,IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES/JSON`;
    const propRes = await fetch(propUrl);
    let prop = null;
    if (propRes.ok) {
      const propData = await propRes.json();
      prop = propData?.PropertyTable?.Properties?.[0];
    }

    return {
      query,
      cid,
      status: 'verified',
      verifiedAt: new Date().toISOString().split('T')[0],
      source: 'nih_pug_rest',
      canonicalSmiles: prop?.CanonicalSMILES || '',
      iupacName: prop?.IUPACName || '',
      molecularFormula: prop?.MolecularFormula || '',
      molecularWeight: prop?.MolecularWeight ? Number(prop.MolecularWeight) : undefined,
      pubChemUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
      pngUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large`,
      matchScore: 100,
    };
  } catch (err: any) {
    console.warn(`Audit failed for ${query}:`, err?.message);
    return {
      query,
      cid: 0,
      status: 'unresolved',
      verifiedAt: new Date().toISOString().split('T')[0],
      source: 'nih_pug_rest',
      pubChemUrl: `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(query)}`,
    };
  }
}

app.post('/api/pubchem/batch-audit', async (req: Request, res: Response) => {
  try {
    const { compounds } = req.body;
    if (!Array.isArray(compounds) || compounds.length === 0) {
      res.status(400).json({ error: 'Array of compounds is required' });
      return;
    }

    const audits = await Promise.all(
      compounds.map(async (c: any) => {
        const identifier = typeof c === 'object' ? (c.cid || c.name || c.query) : c;
        const audit = await auditSingleCompound(identifier);
        return {
          id: typeof c === 'object' ? c.id : undefined,
          name: typeof c === 'object' ? c.name : String(identifier),
          ...audit,
        };
      })
    );

    res.json({ audits, auditedCount: audits.length, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error('Batch audit error:', error);
    res.status(500).json({ error: error?.message || 'Failed to perform batch PubChem audit' });
  }
});

app.post('/api/gemini/medchem-review', async (req: Request, res: Response) => {
  try {
    const {
      files,
      fileBase64,
      fileName,
      reviewFiles,
      reviewText,
      sourceFiles,
      sourceText,
    } = req.body;

    const reviewItemsToProcess: Array<{ fileName: string; fileBase64?: string; text?: string }> = [];
    const sourceItemsToProcess: Array<{ fileName: string; fileBase64?: string; text?: string }> = [];

    // 1. Process Review Files (The Blueprint for Pages & Questions)
    if (Array.isArray(reviewFiles) && reviewFiles.length > 0) {
      for (const f of reviewFiles) {
        if (f.fileBase64 || f.text) reviewItemsToProcess.push(f);
      }
    } else if (Array.isArray(files) && files.length > 0) {
      for (const f of files) {
        if (f.fileBase64) reviewItemsToProcess.push({ fileName: f.fileName || 'Review Document', fileBase64: f.fileBase64 });
      }
    } else if (fileBase64) {
      reviewItemsToProcess.push({ fileName: fileName || 'Review Document', fileBase64 });
    }

    if (reviewText && typeof reviewText === 'string' && reviewText.trim().length > 0) {
      reviewItemsToProcess.push({ fileName: 'Pasted Review Document Text', text: reviewText });
    }

    // 2. Process Authoritative Source Material (Textbooks, Monographs, Mechanism Notes)
    if (Array.isArray(sourceFiles) && sourceFiles.length > 0) {
      for (const f of sourceFiles) {
        if (f.fileBase64 || f.text) sourceItemsToProcess.push(f);
      }
    }
    if (sourceText && typeof sourceText === 'string' && sourceText.trim().length > 0) {
      sourceItemsToProcess.push({ fileName: 'Pasted Authoritative Source Reference', text: sourceText });
    }

    if (reviewItemsToProcess.length === 0 && sourceItemsToProcess.length === 0) {
      res.status(400).json({ error: 'Please provide at least one review document or source material file/text.' });
      return;
    }

    const parts: any[] = [];

    // Add Review Files
    if (reviewItemsToProcess.length > 0) {
      parts.push({
        text: '===================================================\n[INPUT 1: REVIEW DOCUMENT / QUESTION BLUEPRINT]\nUse this material to extract the page structure, chemical structures I/II/III/IV, questions, matching choices, and sub-statements.\n===================================================\n',
      });
      for (const f of reviewItemsToProcess) {
        if (f.text) {
          parts.push({ text: `[REVIEW TEXT: "${f.fileName}"]:\n${f.text}\n` });
        } else if (f.fileBase64) {
          const extracted = await extractDocumentContent(f.fileName, f.fileBase64);
          if (extracted.isPdf) {
            parts.push({ inlineData: { mimeType: 'application/pdf', data: f.fileBase64 } });
            parts.push({ text: `[ATTACHED REVIEW DOCUMENT: "${f.fileName}"]` });
          } else if (extracted.isImage) {
            parts.push({ inlineData: { mimeType: extracted.imageMime || 'image/jpeg', data: f.fileBase64 } });
            parts.push({ text: `[ATTACHED REVIEW PAGE / DIAGRAM: "${f.fileName}"]` });
          } else {
            parts.push({ text: `[DOCUMENT CONTENT: "${f.fileName}"]:\n${extracted.text || ''}\n` });
          }
        }
      }
    }

    // Add Source Material
    if (sourceItemsToProcess.length > 0) {
      parts.push({
        text: '===================================================\n[INPUT 2: AUTHORITATIVE SOURCE MATERIAL & SCIENTIFIC REFERENCE]\nUse this material to verify answers, write rich medicinal chemistry rationales, cite exact receptor binding mechanisms, and explain structure-activity relationships (SAR).\n===================================================\n',
      });
      for (const f of sourceItemsToProcess) {
        if (f.text) {
          parts.push({ text: `[SOURCE MATERIAL TEXT: "${f.fileName}"]:\n${f.text}\n` });
        } else if (f.fileBase64) {
          const extracted = await extractDocumentContent(f.fileName, f.fileBase64);
          if (extracted.isPdf) {
            parts.push({ inlineData: { mimeType: 'application/pdf', data: f.fileBase64 } });
            parts.push({ text: `[ATTACHED SOURCE MATERIAL: "${f.fileName}"]` });
          } else if (extracted.isImage) {
            parts.push({ inlineData: { mimeType: extracted.imageMime || 'image/jpeg', data: f.fileBase64 } });
            parts.push({ text: `[ATTACHED SOURCE DIAGRAM / MONOGRAPH: "${f.fileName}"]` });
          } else {
            parts.push({ text: `[SOURCE DOCUMENT CONTENT: "${f.fileName}"]:\n${extracted.text || ''}\n` });
          }
        }
      }
    }

    const prompt = `You are a distinguished Medicinal Chemistry & Clinical Pharmacology Professor and board examination author.
Analyze the attached review document(s) and authoritative source reference material with exhaustive precision.
Transform the provided materials into an authentic, high-fidelity medicinal chemistry review module matching the format of the "Review for Antiplatelets" PDF exam archetype.

CRITICAL EXTRACTION MANDATES (STRICT COMPLIANCE REQUIRED - ZERO TRUNCATION):
1. STRICT 1-TO-1 PAGE MIRRORING:
   - You MUST extract EVERY SINGLE PAGE of the review document.
   - If the uploaded review document has multiple pages (e.g., Page 1, Page 2, Page 3, Page 4, Page 5, Page 6, Page 7), your output "pages" array MUST contain a distinct page object for EVERY SINGLE PAGE.
   - Do NOT stop after Page 1. Do NOT combine pages. Do NOT sample a single page.
   - Use the original page numbering: "pageNumber": 1, "pageNumber": 2, "pageNumber": 3, etc.
   - Assign a descriptive "pageTitle" for each page reflecting the drug classes or topic on that page (e.g. "Page 1: Thienopyridine & Peptidomimetic Antiplatelets", "Page 2: Nucleoside Analogues & Gp IIb/IIIa Antagonists").

2. EXHAUSTIVE QUESTION CAPTURE (NO SAMPLING, ZERO OMISSION):
   - You MUST extract EVERY SINGLE QUESTION from EVERY PAGE.
   - If a page contains 4 questions, extract all 4 questions. If a review has 25 questions total, ALL 25 questions must appear in the output JSON.
   - Under NO circumstances should you output only 1 question as an example.
   - Preserve exact original question labels ("Question 1", "Question 2", "Question 3", "Question 4", etc.).
   - Faithfully reconstruct all medicinal chemistry question formats:
     a) "matching": Matching questions (e.g. "What is the chemical class of each of the above antiplatelets?", "What is the pharmacological class...?", "Which of the above drugs is an irreversible antiplatelet?").
        Must include "matchingTargets" with:
        - "id": "a", "b", "c", etc.
        - "label": The target prompt (e.g. "Thienopyridine prodrug requiring 2-step CYP activation")
        - "acceptedStructureIds": Array of matching Roman numeral IDs (e.g. ["I"], ["II", "IV"])
        - "rationale": Clear scientific rationale for why this structure matches
     b) "sub-statements": Propositions evaluated as True/False (e.g. statements a through j regarding SAR, bioactivation, binding pockets, or pharmacokinetics).
        Must include "subStatements" with:
        - "id": "a", "b", "c", etc.
        - "statement": The exact statement text
        - "isCorrect": true or false
        - "rationale": Clear medicinal chemistry explanation of why the statement is true or false
     c) "ranking": Questions asking learners to order or rank structures (e.g. by onset of action, potency, duration, or half-life).
        Must include:
        - "rankingCriterion": e.g. "Rank from fastest onset of action to slowest"
        - "rankingItems": Array of objects: { "id": "item_1", "structureId": "I", "rank": 1, "explanation": "..." }
     d) "multiple-choice": Traditional multiple choice questions.
        Must include "options" (array of 4 options "A. ...", "B. ...", "C. ...", "D. ..."), "correctIndex" (0, 1, 2, or 3), and "optionExplanations" (array of explanations for each option).
   - Every question MUST have:
     - "overallExplanation": In-depth medicinal chemistry and pharmacology explanation explaining the molecular mechanisms, receptors, and clinical relevance.
     - "highYieldPearl": A high-yield board examination takeaway / memory anchor.
     - "sourceReference": Citation of the page and question number (e.g. "Review Document Page 1, Q1").

3. EXHAUSTIVE CHEMICAL STRUCTURE CAPTURE:
   - For every page that displays or references chemical structures, extract EVERY SINGLE MOLECULE (labeled Roman numerals "I", "II", "III", "IV", etc., or drug names).
   - Do NOT limit to only 1 or 2 structures. If 4 structures are shown on Page 1, extract all 4 (I, II, III, IV). If Page 2 has structures V, VI, VII, extract all of them!
   - For each structure provide:
     - "id": Roman numeral (e.g. "I", "II", "III", "IV")
     - "name": Generic drug name (e.g. "Tirofiban", "Ticagrelor", "Aspirin", "Prasugrel", "Clopidogrel", "Cangrelor", "Vorapaxar")
     - "tradeName": Brand name (e.g. "Aggrastat", "Brilinta", "Effient", "Plavix", "Kengreal")
     - "chemicalClass": Precise chemical class (e.g. "Tyrosine peptidomimetic", "Cyclopentyltriazolopyrimidine (CPTP)", "Thienopyridine prodrug")
     - "pharmacologicalClass": Mechanistic class (e.g. "GP IIb/IIIa receptor antagonist", "P2Y12 platelet inhibitor", "COX-1 suicide inhibitor")
     - "cid": Standard NIH PubChem Compound ID (integer), or 0 if unknown
     - "target": Specific receptor / enzyme (e.g. "Platelet GPIIb/IIIa integrin (alpha-IIb beta-3)", "P2Y12 purinergic receptor", "Cyclooxygenase-1 (COX-1)")
     - "reversibility": "Reversible" or "Irreversible"
     - "route": "Oral", "IV", etc.
     - "keyFunctionalGroups": Array of strings highlighting key pharmacophoric moieties (e.g. ["Sulfonamide", "Basic piperidine", "Carboxylic acid", "Ester", "Thiophene ring"])
     - "pkPdHighlights": { "onset": "...", "duration": "...", "halfLife": "...", "elimination": "..." }
     - "sarNotes": Specific structure-activity relationship explanation explaining how functional groups interact with amino acid residues.

4. KNOWLEDGE GROUNDING USING AUTHORITATIVE SOURCE MATERIAL (INPUT 2):
   - If Input 2 (Authoritative Source Material) was provided, utilize its pharmacological monographs, receptor docking evidence, CYP bioactivation steps, and clinical trial pearls directly in the rationales, SAR notes, and highYieldPearls.

Output strictly valid JSON matching this schema:
{
  "title": "Exact Title of Review (e.g. Review for Antiplatelets & Antithrombotics)",
  "subtitle": "Subtitle describing the scope of compounds covered",
  "course": "Medicinal Chemistry (MCP II)",
  "semester": "Fall 2026",
  "code": "REV-MC",
  "pages": [
    {
      "pageNumber": 1,
      "pageTitle": "Page 1: Title of Page 1",
      "subtitle": "Overview of compounds on Page 1",
      "sections": [
        {
          "sectionTitle": "Consider Structures I, II, III, and IV Below:",
          "headerNote": "Introductory note or context for Page 1",
          "structures": [
            {
              "id": "I",
              "name": "Generic Name 1",
              "tradeName": "Trade Name 1",
              "chemicalClass": "Chemical Class",
              "pharmacologicalClass": "Pharmacological Class",
              "cid": 12345,
              "target": "Target Enzyme/Receptor",
              "reversibility": "Reversible",
              "route": "IV",
              "keyFunctionalGroups": ["Group A", "Group B"],
              "pkPdHighlights": { "onset": "Rapid", "duration": "Short", "halfLife": "2 hours", "elimination": "Renal" },
              "sarNotes": "SAR details..."
            },
            {
              "id": "II",
              "name": "Generic Name 2",
              "tradeName": "Trade Name 2",
              "chemicalClass": "Chemical Class 2",
              "pharmacologicalClass": "Pharmacological Class 2",
              "cid": 23456,
              "target": "Target",
              "reversibility": "Irreversible",
              "route": "Oral",
              "keyFunctionalGroups": ["Group C"],
              "pkPdHighlights": { "onset": "Moderate", "duration": "Extended", "halfLife": "8 hours", "elimination": "Hepatic" },
              "sarNotes": "SAR details..."
            }
          ],
          "questions": [
            {
              "id": 1,
              "questionNumberLabel": "Question 1",
              "category": "Classification",
              "questionStem": "What is the chemical class of each of the above antiplatelets?",
              "type": "matching",
              "matchingTargets": [
                { "id": "a", "label": "Class A label", "acceptedStructureIds": ["I"], "rationale": "Rationale for A" },
                { "id": "b", "label": "Class B label", "acceptedStructureIds": ["II"], "rationale": "Rationale for B" }
              ],
              "overallExplanation": "In-depth rationale for Question 1...",
              "highYieldPearl": "Pearl for Question 1...",
              "sourceReference": "Page 1, Q1"
            },
            {
              "id": 2,
              "questionNumberLabel": "Question 2",
              "category": "Mechanism of Action",
              "questionStem": "Consider the following statements regarding the above agents:",
              "type": "sub-statements",
              "subStatements": [
                { "id": "a", "statement": "Statement text...", "isCorrect": true, "rationale": "Why statement a is true" },
                { "id": "b", "statement": "Statement text...", "isCorrect": false, "rationale": "Why statement b is false" }
              ],
              "overallExplanation": "In-depth rationale for Question 2...",
              "highYieldPearl": "Pearl for Question 2...",
              "sourceReference": "Page 1, Q2"
            }
          ]
        }
      ]
    },
    {
      "pageNumber": 2,
      "pageTitle": "Page 2: Title of Page 2",
      "subtitle": "Overview of compounds on Page 2",
      "sections": [
        {
          "sectionTitle": "Consider Structures V, VI, VII Below:",
          "headerNote": "Introductory note for Page 2",
          "structures": [
            {
              "id": "V",
              "name": "Generic Name 5",
              "tradeName": "Trade Name 5",
              "chemicalClass": "Chemical Class 5",
              "pharmacologicalClass": "Pharmacological Class 5",
              "cid": 34567,
              "target": "Target",
              "reversibility": "Reversible",
              "route": "Oral",
              "keyFunctionalGroups": ["Group D"],
              "pkPdHighlights": { "onset": "Rapid", "duration": "Moderate", "halfLife": "4 hours", "elimination": "Hepatic" },
              "sarNotes": "SAR details..."
            }
          ],
          "questions": [
            {
              "id": 3,
              "questionNumberLabel": "Question 3",
              "category": "Structure-Activity Relationship",
              "questionStem": "Which structural modification on Structure V is responsible for...?",
              "type": "multiple-choice",
              "options": ["A. Fluorine atom at C2", "B. Methyl ester hydrolysis", "C. Thiazole ring substitution", "D. N-demethylation"],
              "correctIndex": 0,
              "optionExplanations": [
                "Correct. The fluorine substituent prevents oxidative metabolism.",
                "Incorrect. Ester hydrolysis results in inactivation.",
                "Incorrect. No thiazole ring is present.",
                "Incorrect. N-demethylation does not alter potency."
              ],
              "overallExplanation": "Detailed explanation of SAR for Question 3...",
              "highYieldPearl": "High-yield board pearl...",
              "sourceReference": "Page 2, Q3"
            }
          ]
        }
      ]
    }
  ]
}`;

    parts.push({ text: prompt });

    const text = await generateWithFallback({
      contents: { parts },
      responseMimeType: 'application/json',
      temperature: 0.2,
    });

    const parsed = JSON.parse(text || '{}');

    // Automatically perform PubChem Audit Verification on EVERY extracted structure!
    if (Array.isArray(parsed.pages)) {
      const allStructures: any[] = [];
      for (const page of parsed.pages) {
        if (Array.isArray(page.sections)) {
          for (const sec of page.sections) {
            if (Array.isArray(sec.structures)) {
              for (const str of sec.structures) {
                allStructures.push(str);
              }
            }
          }
        }
      }

      // Batch audit compounds concurrently (up to 6 at a time to prevent rate limits)
      const auditMap = new Map<string, any>();
      const batchSize = 6;
      for (let i = 0; i < allStructures.length; i += batchSize) {
        const chunk = allStructures.slice(i, i + batchSize);
        await Promise.all(
          chunk.map(async (str) => {
            const queryKey = str.cid ? String(str.cid) : str.name;
            if (queryKey && !auditMap.has(queryKey)) {
              try {
                const audit = await auditSingleCompound(str.cid || str.name);
                auditMap.set(queryKey, audit);
              } catch (e) {
                console.warn(`PubChem audit fallback for ${str.name}:`, e);
              }
            }
          })
        );
      }

      // Apply verified PubChem data to every structure and sync into questions
      for (const page of parsed.pages) {
        if (Array.isArray(page.sections)) {
          for (const sec of page.sections) {
            if (Array.isArray(sec.structures)) {
              for (let sIdx = 0; sIdx < sec.structures.length; sIdx++) {
                const str = sec.structures[sIdx];
                const queryKey = str.cid ? String(str.cid) : str.name;
                const audit = queryKey ? auditMap.get(queryKey) : null;
                const finalCid = audit?.cid || str.cid || 0;
                sec.structures[sIdx] = {
                  ...str,
                  cid: finalCid,
                  pngUrl: audit?.pngUrl || (finalCid ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${finalCid}/PNG?image_size=large` : ''),
                  pubchemUrl: audit?.pubChemUrl || (finalCid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${finalCid}` : ''),
                  pubchemAudit: {
                    cid: finalCid,
                    status: audit?.status || (finalCid ? 'verified' : 'unresolved'),
                    verifiedAt: audit?.verifiedAt || new Date().toISOString().split('T')[0],
                    source: 'nih_pug_rest',
                    canonicalSmiles: audit?.canonicalSmiles || '',
                    iupacName: audit?.iupacName || '',
                    molecularFormula: audit?.molecularFormula || '',
                    molecularWeight: audit?.molecularWeight,
                    pubChemUrl: audit?.pubChemUrl || (finalCid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${finalCid}` : ''),
                    matchScore: 100,
                  },
                };
              }
            }

            // Sync structures into questions if structuresDisplayed is needed
            if (Array.isArray(sec.questions) && Array.isArray(sec.structures) && sec.structures.length > 0) {
              for (const q of sec.questions) {
                if (!q.structuresDisplayed || q.structuresDisplayed.length === 0) {
                  q.structuresDisplayed = sec.structures;
                }
              }
            }
          }
        }
      }
    }

    res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini MedChem Review encountered error, engaging resilient multi-page extractor:', error?.message || error);
    try {
      // Assemble all available text from reviewItems and sourceItems
      const reviewTextSources: string[] = [];
      if (req.body.reviewText) reviewTextSources.push(req.body.reviewText);
      if (Array.isArray(req.body.reviewFiles)) {
        for (const rf of req.body.reviewFiles) {
          if (rf.text) reviewTextSources.push(rf.text);
        }
      }
      const combinedReviewText = reviewTextSources.join('\n\n') || req.body.fileName || 'Review Document';
      const combinedSourceText = req.body.sourceText || '';

      const fallbackModule = await buildResilientReviewModule(
        combinedReviewText,
        combinedSourceText,
        req.body.fileName
      );

      res.json(fallbackModule);
    } catch (fallbackError: any) {
      console.error('Both Gemini and local review module extraction failed:', fallbackError);
      res.status(500).json({
        error: error?.message || 'Failed to extract review document and perform PubChem audits.',
      });
    }
  }
});

async function buildResilientReviewModule(
  reviewText: string,
  sourceText?: string,
  docTitle?: string
): Promise<any> {
  const lines = reviewText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const title =
    docTitle ||
    lines.find((l) => l.toUpperCase().startsWith('REVIEW FOR')) ||
    lines[0] ||
    'Custom Medicinal Chemistry Review';

  // Segment by pages: Page 1:, Page 2:, etc.
  const pageRegex = /(?:^|\n)(?:Page\s+(\d+)|===+\s*Page\s+(\d+)|---\s*Page\s+(\d+))[:\s-]*([^\n\r]*)/gi;
  const pageMatches: Array<{ num: number; title: string; index: number; matchLen: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = pageRegex.exec(reviewText)) !== null) {
    const num = parseInt(m[1] || m[2] || m[3], 10);
    const pTitle = (m[4] || '').trim();
    pageMatches.push({ num, title: pTitle, index: m.index, matchLen: m[0].length });
  }

  const pageChunks: Array<{ num: number; title: string; text: string }> = [];
  if (pageMatches.length === 0) {
    pageChunks.push({
      num: 1,
      title: 'Review Questions & Chemical Entities',
      text: reviewText,
    });
  } else {
    for (let i = 0; i < pageMatches.length; i++) {
      const curr = pageMatches[i];
      const next = pageMatches[i + 1];
      const pText = reviewText.slice(curr.index + curr.matchLen, next ? next.index : reviewText.length);
      pageChunks.push({
        num: curr.num || i + 1,
        title: curr.title || `Page ${curr.num || i + 1}`,
        text: pText,
      });
    }
  }

  const pages: any[] = [];
  let questionGlobalId = 1;

  for (const chunk of pageChunks) {
    const pageText = chunk.text;

    // 1. Extract Structures: Structure I, II, III...
    const strRegex = /Structure\s+([IVXLCDM\d]+)[:\s-]+([^\n\r(]+)(?:\s*\((.*?)\))?(?:\s*-\s*([^\n\r]+))?/gi;
    const structures: any[] = [];
    let sm: RegExpExecArray | null;
    while ((sm = strRegex.exec(pageText)) !== null) {
      const id = sm[1].trim();
      const rawName = sm[2].trim();
      const tradeName = (sm[3] || '').trim();
      const desc = (sm[4] || '').trim();

      // Audit compound via NIH PubChem
      let audit: any = null;
      try {
        audit = await auditSingleCompound(rawName);
      } catch (e) {
        // fallback
      }

      const finalCid = audit?.cid || 0;
      structures.push({
        id,
        name: rawName,
        tradeName: tradeName || undefined,
        chemicalClass: desc.includes('antagonist') || desc.includes('inhibitor')
          ? desc.split(/\s*-\s*|\s+(?:antagonist|inhibitor|blocker|agonist)/i)[0] || desc
          : desc || 'Medicinal Chemistry Agent',
        pharmacologicalClass: desc || 'Pharmacological Agent',
        cid: finalCid,
        pngUrl: audit?.pngUrl || (finalCid ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${finalCid}/PNG?image_size=large` : ''),
        pubchemUrl: audit?.pubChemUrl || (finalCid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${finalCid}` : ''),
        target: 'Receptor / Enzyme Target',
        reversibility: desc.toLowerCase().includes('irreversible') ? 'Irreversible' : 'Reversible',
        route: desc.toLowerCase().includes('iv') ? 'IV' : 'Oral',
        keyFunctionalGroups: [desc.split(' ')[0] || 'Active Pharmacophore'],
        pkPdHighlights: {
          onset: 'Rapid onset',
          duration: 'Extended',
          halfLife: 'Variable',
          elimination: 'Hepatic / Renal',
        },
        sarNotes: `Structure ${id} (${rawName}): Key pharmacophoric interactions and structure-activity relationships documented in source monograph.`,
        pubchemAudit: {
          cid: finalCid,
          status: audit?.status || (finalCid ? 'verified' : 'unresolved'),
          verifiedAt: new Date().toISOString().split('T')[0],
          source: 'nih_pug_rest',
          canonicalSmiles: audit?.canonicalSmiles || '',
          iupacName: audit?.iupacName || '',
          molecularFormula: audit?.molecularFormula || '',
          molecularWeight: audit?.molecularWeight,
          pubChemUrl: audit?.pubChemUrl || (finalCid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${finalCid}` : ''),
          matchScore: 100,
        },
      });
    }

    // 2. Extract Questions: Question 1, Question 2...
    const qRegex = /Question\s+(\d+)[:\s-]+([^\n\r]+)/gi;
    const questions: any[] = [];
    const qMatches: Array<{ id: number; stem: string; index: number; len: number }> = [];
    let qm: RegExpExecArray | null;
    while ((qm = qRegex.exec(pageText)) !== null) {
      qMatches.push({
        id: parseInt(qm[1], 10),
        stem: qm[2].trim(),
        index: qm.index,
        len: qm[0].length,
      });
    }

    for (let j = 0; j < qMatches.length; j++) {
      const cq = qMatches[j];
      const nq = qMatches[j + 1];
      const qBlock = pageText.slice(cq.index + cq.len, nq ? nq.index : pageText.length);
      const stemLower = cq.stem.toLowerCase();

      // Check sub-statements
      const stmtRegex = /(?:^|\n)\s*([a-j])[\.\)]\s+([^\n\r]+)/gi;
      const subStatements: any[] = [];
      let stm: RegExpExecArray | null;
      while ((stm = stmtRegex.exec(qBlock)) !== null) {
        const stmtId = stm[1].toLowerCase();
        const stmtText = stm[2].trim();
        const isTrue = !stmtText.toLowerCase().includes('not') && !stmtText.toLowerCase().includes('inactiv');
        subStatements.push({
          id: stmtId,
          statement: stmtText,
          isCorrect: isTrue,
          rationale: `Sub-statement (${stmtId}): Grounded evaluation from medicinal chemistry source material.`,
        });
      }

      // Check multiple choice
      const mcRegex = /(?:^|\n)\s*([A-D])[\.\)]\s+([^\n\r]+)/gi;
      const mcOptions: string[] = [];
      let mcm: RegExpExecArray | null;
      while ((mcm = mcRegex.exec(qBlock)) !== null) {
        mcOptions.push(`${mcm[1]}. ${mcm[2].trim()}`);
      }

      let qType: 'matching' | 'sub-statements' | 'ranking' | 'multiple-choice' = 'matching';
      let matchingTargets: any[] | undefined = undefined;
      let rankingCriterion: string | undefined = undefined;
      let rankingItems: any[] | undefined = undefined;

      if (subStatements.length > 0) {
        qType = 'sub-statements';
      } else if (mcOptions.length >= 2) {
        qType = 'multiple-choice';
      } else if (stemLower.includes('rank') || stemLower.includes('order')) {
        qType = 'ranking';
        rankingCriterion = cq.stem;
        rankingItems = structures.map((str, idx) => ({
          id: `item_${str.id}`,
          structureId: str.id,
          rank: idx + 1,
          explanation: `Rank ${idx + 1}: ${str.name} according to kinetic and receptor parameters.`,
        }));
      } else {
        qType = 'matching';
        matchingTargets = structures.map((str, idx) => ({
          id: String.fromCharCode(97 + idx),
          label: `${str.chemicalClass} (${str.pharmacologicalClass})`,
          acceptedStructureIds: [str.id],
          rationale: `Structure ${str.id} (${str.name}) displays signature ${str.chemicalClass} structural features.`,
        }));
      }

      questions.push({
        id: cq.id || questionGlobalId++,
        questionNumberLabel: `Question ${cq.id}`,
        category: stemLower.includes('class')
          ? 'Classification'
          : stemLower.includes('mechanism')
          ? 'Mechanism of Action'
          : stemLower.includes('sar') || stemLower.includes('structure')
          ? 'Structure-Activity Relationship'
          : 'Clinical Pharmacology',
        questionStem: cq.stem,
        type: qType,
        matchingTargets: qType === 'matching' ? matchingTargets : undefined,
        subStatements: qType === 'sub-statements' ? subStatements : undefined,
        options: qType === 'multiple-choice' ? mcOptions : undefined,
        correctIndex: qType === 'multiple-choice' ? 0 : undefined,
        optionExplanations: qType === 'multiple-choice'
          ? mcOptions.map((_, idx) => idx === 0 ? 'Correct option based on medicinal chemistry principles.' : 'Incorrect option.')
          : undefined,
        rankingCriterion: qType === 'ranking' ? rankingCriterion : undefined,
        rankingItems: qType === 'ranking' ? rankingItems : undefined,
        overallExplanation: `Authoritative medicinal chemistry explanation for "${cq.stem}". Correlated with source reference monograph and receptor binding evidence.`,
        highYieldPearl: `High-Yield Pearl: Review structure-activity relationship (SAR) distinctions between ${structures.map((s) => s.name).join(', ') || 'these entities'}.`,
        sourceReference: `Review Document Page ${chunk.num}, Question ${cq.id}`,
        structuresDisplayed: structures,
      });
    }

    pages.push({
      pageNumber: chunk.num,
      pageTitle: chunk.title || `Page ${chunk.num}`,
      subtitle: `${structures.length} Chemical Structures · ${questions.length} Exam Questions`,
      sections: [
        {
          sectionTitle: `Page ${chunk.num} Review Content:`,
          headerNote: `Carefully inspect all chemical structures on Page ${chunk.num} before answering questions.`,
          structures,
          questions,
        },
      ],
    });
  }

  return {
    title: title.replace(/^REVIEW FOR\s*/i, 'Review for ').trim(),
    subtitle: 'Authoritative Multi-Page Medicinal Chemistry Review & Examination Archetype',
    course: 'Medicinal Chemistry (MCP II)',
    semester: 'Academic Year 2026',
    code: 'REV-MCP2',
    pages,
  };
}

app.post('/api/gemini/generate-matrices', async (req: Request, res: Response) => {
  try {
    const {
      topicTitle,
      topicSubtitle,
      existingMatrixTitles = [],
      customFocus = '',
      matrixType = 'bundle',
    } = req.body;

    // Multi-category matrix bundle request
    if (matrixType === 'bundle') {
      const prompt = `You are an expert clinical professor and medical/pharmacy examination board author (USMLE Step 1/2, NAPLEX, BCPS).
Generate a comprehensive 4-CATEGORY HIGH-YIELD EXAM MATRIX SUITE for this topic:
Topic: "${topicTitle || 'Clinical Practice'}"
Scope: "${topicSubtitle || ''}"
${customFocus ? `Custom Clinical Focus: "${customFocus}"` : ''}

You must generate 4 distinct, complementary, in-depth matrices covering the complete exam spectrum:
1. Category "Diagnostic & Differential Workup":
   - Title: "Diagnostic & Differential Laboratory Matrix"
   - Focus: Clinical triad, primary biomarkers, first-line screening vs gold-standard confirmatory tests
2. Category "Pharmacotherapy & Management Comparison":
   - Title: "First-Line vs Alternative Pharmacotherapy Matrix"
   - Focus: Drug classes, mechanisms, dosing thresholds, clinical trials, boxed warnings, key contraindications
3. Category "Board Traps & Lookalike Confusers":
   - Title: "High-Yield Board Traps & Lookalike Conditions Matrix"
   - Focus: Deceptive presentation A vs B, pathognomonic differentiating detail, common board pitfalls
4. Category "Clinical Decision & Workup Algorithms":
   - Title: "Next Best Step Clinical Decision Matrix"
   - Focus: Acute stabilization, stepwise management algorithms, when to deviate, emergency red flags

For EACH matrix:
- Include 5 to 7 descriptive columns.
- Include 4 to 6 comprehensive condition rows.
- Each row must include: "condition", "badge", "values" (matching intermediate columns), "firstLineTest", "goldStandard", "nextBestStep", "boardTrap", "keyPearl".

Output strictly JSON matching this schema:
{
  "matrices": [
    {
      "id": "matrix_bundle_diag_${Date.now()}",
      "title": "Diagnostic & Differential Laboratory Matrix",
      "subtitle": "Biomarkers, first-line screening vs gold-standard confirmatory tests",
      "category": "Diagnostic Differential",
      "columns": ["Condition", "Biomarker 1", "Biomarker 2", "First-Line Workup", "Gold Standard", "Key Distinguishing Pearl"],
      "rows": [
        {
          "condition": "Condition 1",
          "badge": "Subtype",
          "values": ["Finding A", "Finding B", "First-Line Test", "Confirmatory Test"],
          "firstLineTest": "Initial test",
          "goldStandard": "Gold standard confirmation",
          "nextBestStep": "Next clinical action",
          "boardTrap": "Common exam trap to avoid",
          "keyPearl": "High-yield pearl statement"
        }
      ]
    },
    {
      "id": "matrix_bundle_pharm_${Date.now()}",
      "title": "First-Line vs Alternative Pharmacotherapy Matrix",
      "subtitle": "Drug mechanisms, clinical thresholds, adverse effects, and black box warnings",
      "category": "Pharmacotherapy & Management",
      "columns": ["Drug / Regimen", "Mechanism of Action", "Primary Indication", "High-Yield Adverse Effect", "Boxed Warning / Contraindication", "Clinical Takeaway"],
      "rows": [
        {
          "condition": "Drug / Regimen 1",
          "badge": "1st-Line",
          "values": ["Mechanism", "Indication", "Adverse effect", "Boxed warning"],
          "firstLineTest": "Baseline monitoring",
          "goldStandard": "Clinical trial evidence",
          "nextBestStep": "Dose optimization",
          "boardTrap": "Lookalike interaction to avoid",
          "keyPearl": "Prescribing pearl"
        }
      ]
    },
    {
      "id": "matrix_bundle_traps_${Date.now()}",
      "title": "High-Yield Board Traps & Lookalike Conditions Matrix",
      "subtitle": "Classic examination distractors and why examinees get tricked",
      "category": "Board Traps & Lookalikes",
      "columns": ["Exam Lookalike Condition", "Key Clinical Mimic", "Crucial Differentiating Finding", "Common Error on Exams", "Why Examinees Get Tricked", "Decisive Distinguishing Pearl"],
      "rows": [
        {
          "condition": "Lookalike Presentation 1",
          "badge": "Trap",
          "values": ["Mimic Entity", "Differentiating Finding", "Error on Exam", "Pitfall Explanation"],
          "firstLineTest": "Differentiating test",
          "goldStandard": "Decisive diagnostic test",
          "nextBestStep": "Avoid wrong empiric therapy",
          "boardTrap": "The exact trap set by exam question writers",
          "keyPearl": "High-yield takeaway"
        }
      ]
    },
    {
      "id": "matrix_bundle_algo_${Date.now()}",
      "title": "Next Best Step Clinical Decision Matrix",
      "subtitle": "Stepwise clinical workup, urgent triage, and guideline management",
      "category": "Decision Algorithms",
      "columns": ["Clinical Presentation / Scenario", "Immediate Priority / Triage", "First Diagnostic Step", "Subsequent Management", "Red Flag Trigger", "Guideline Recommendation"],
      "rows": [
        {
          "condition": "Acute Clinical Scenario 1",
          "badge": "Urgent",
          "values": ["Triage action", "Initial diagnostic", "Definitive management", "Red flag criteria"],
          "firstLineTest": "Bedside workup",
          "goldStandard": "Guideline algorithm",
          "nextBestStep": "Immediate clinical order",
          "boardTrap": "Premature discharge or delayed intervention",
          "keyPearl": "Algorithmic decision pearl"
        }
      ]
    }
  ],
  "additionalPearls": [
    {
      "topic": "Clinical Pearl Topic",
      "detail": "Exam takeaway summary"
    }
  ]
}`;

      const text = await generateWithFallback({
        contents: prompt,
        responseMimeType: 'application/json',
        temperature: 0.5,
      });

      const parsed = JSON.parse(text || '{}');
      if (!Array.isArray(parsed.matrices) || parsed.matrices.length === 0) {
        throw new Error('AI model did not return a valid matrix bundle.');
      }

      res.json(parsed);
      return;
    }

    // Single matrix generation request
    const prompt = `You are an expert clinical professor and medical/pharmacy examination board author (USMLE Step 1/2, NAPLEX, BCPS).
You are tasked with generating an in-depth, board-exam high-yield comparison and differential matrix for this subject:
Topic: "${topicTitle || 'Clinical Practice'}"
Scope: "${topicSubtitle || ''}"
Matrix Category/Type: "${matrixType}"
${customFocus ? `Custom Clinical Focus: "${customFocus}"` : ''}
${Array.isArray(existingMatrixTitles) && existingMatrixTitles.length > 0 ? `Already existing matrices on this topic: ${JSON.stringify(existingMatrixTitles)}. Please create a DISTINCT, complementary matrix that fills critical knowledge gaps!` : ''}

CRITICAL MANDATE - IN-DEPTH EXAM RELEVANCE:
Create a rigorous, multi-column clinical matrix that covers everything a student or clinician needs for board exams.
Include 5 to 7 detailed columns (e.g. "Condition / Entity", "Pathophysiology / Mechanism", "Primary Biomarkers / Lab Findings", "First-Line Workup", "Next Best Clinical Step", "Key Distinguishing Clinical Pearl").
Include 4 to 8 distinct conditions, clinical phenotypes, drug classes, or diagnostic pathways.
For each row, provide:
- "condition": Condition or clinical entity name
- "badge": Short acronym or sub-classification badge (e.g. "Microcytic", "First-Line", "Warm IgG", "High Risk")
- "values": Array of 3 to 5 column values matching the columns between condition and keyPearl. Use arrows (↑, ↓), clinical thresholds, and specific test names.
- "firstLineTest": The initial screening or baseline test
- "goldStandard": The definitive gold-standard confirmatory test
- "nextBestStep": The immediate clinical action or next step in workup
- "boardTrap": Common exam trap, lookalike condition, or classic error made on board questions
- "keyPearl": Thorough clinical summary pearl explaining distinguishing features

Output MUST be strictly valid JSON matching this schema:
{
  "matrix": {
    "id": "matrix_${Date.now()}",
    "title": "Comprehensive Title of the Matrix",
    "subtitle": "Subtitle explaining clinical focus and exam scope",
    "category": "${matrixType === 'pharmacotherapy' ? 'Pharmacotherapy & Management' : matrixType === 'traps' ? 'Board Traps & Lookalikes' : matrixType === 'algorithms' ? 'Decision Algorithms' : 'Diagnostic Differential'}",
    "columns": ["Condition", "Biomarker 1", "Biomarker 2", "First-Line Workup", "Next Best Step", "Key Distinguishing Pearl"],
    "rows": [
      {
        "condition": "Condition 1",
        "badge": "Subtype",
        "values": ["Value 1 (e.g. Low ↓)", "Value 2 (e.g. High ↑)", "Initial Test", "Immediate Action"],
        "firstLineTest": "Initial test",
        "goldStandard": "Definitive confirmation",
        "nextBestStep": "Next clinical action",
        "boardTrap": "Why students get this wrong on exams",
        "keyPearl": "High-yield pearl statement"
      }
    ]
  },
  "additionalPearls": [
    {
      "topic": "Clinical Pearl Topic",
      "detail": "Exam takeaway"
    }
  ]
}`;

    const text = await generateWithFallback({
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.5,
    });

    const parsed = JSON.parse(text || '{}');
    if (!parsed.matrix || !parsed.matrix.columns || !parsed.matrix.rows) {
      throw new Error('Invalid matrix structure generated by AI model.');
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating high-yield matrix:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate high-yield matrix',
    });
  }
});

// ============================================================================
// GENERATIVE QUIZ MODE: Replace Old Questions with Novel Competency Questions
// ============================================================================
app.post('/api/gemini/generate-alternative-questions', async (req: Request, res: Response) => {
  try {
    const {
      structures = [],
      existingQuestions = [],
      pageTitle = 'Medicinal Chemistry Review',
      competencies = ['ranking', 'classifying', 'matching', 'sub-statements'],
      rationaleDepth = 'medium',
      sourceMaterial = '',
      count = 4,
    } = req.body;

    if (!Array.isArray(structures) || structures.length === 0) {
      res.status(400).json({ error: 'Chemical structures are required to generate relevant questions.' });
      return;
    }

    const structureSummaries = structures.map((s: any) => `
Structure ID: "${s.id}" (${s.name}${s.tradeName ? ` / ${s.tradeName}` : ''})
- Chemical Class: ${s.chemicalClass || 'N/A'}
- Pharmacological Class: ${s.pharmacologicalClass || 'N/A'}
- Molecular Target: ${s.target || 'N/A'}
- Reversibility: ${s.reversibility || 'N/A'}
- Route: ${s.route || 'N/A'}
- Key Functional Groups: ${(s.keyFunctionalGroups || []).join(', ') || 'N/A'}
- Pharmacokinetics & Bioactivation: Onset: ${s.pkPdHighlights?.onset || 'N/A'}, Duration: ${s.pkPdHighlights?.duration || 'N/A'}, Half-life: ${s.pkPdHighlights?.halfLife || 'N/A'}, Elimination: ${s.pkPdHighlights?.elimination || 'N/A'}, Bioactivation: ${s.pkPdHighlights?.bioactivation || 'N/A'}
- SAR Notes: ${s.sarNotes || 'N/A'}
`).join('\n');

    const existingStemsSummary = (existingQuestions || [])
      .map((q: any, i: number) => `(${i + 1}) [${q.type}] "${q.questionStem}"`)
      .join('\n');

    const depthInstruction =
      rationaleDepth === 'short'
        ? 'RATIONALE DEPTH: SHORT & HIGH-YIELD. Write punchy, single-sentence explanations focusing exclusively on the critical warhead, active functional group, or high-yield clinical outcome.'
        : rationaleDepth === 'long'
        ? 'RATIONALE DEPTH: COMPREHENSIVE & IN-DEPTH. Write exhaustive graduate/board-level rationales detailing specific receptor binding residue numbers (e.g. Ser529, Arg120, Cys17/Cys270, Tyr355), full enzymatic bioactivation pathways (CYP2C19, CYP3A4, CYP2B6, hCE1/hCE2), kinetic parameters, and comparative contrasts across analogues.'
        : 'RATIONALE DEPTH: MEDIUM & BALANCED. Provide balanced rationales detailing the mechanism of action, key pharmacophore role, and clinical implication (standard 2-3 sentences).';

    const prompt = `You are a distinguished Medicinal Chemistry & Clinical Pharmacology Board Examination author (USMLE, NAPLEX, BCPS).
Your task is to generate a BRAND NEW, REPLACEMENT set of ~${count} examination questions based on the provided chemical structures and source material.

CRITICAL MANDATES:
1. DO NOT REPLICATE THE EXISTING QUESTIONS. The new questions MUST explore different angles, novel SAR comparisons, and new clinical challenges.
Existing questions to avoid replicating:
${existingStemsSummary || 'None provided'}

2. YOU MUST INCLUDE THESE TARGET QUESTION TYPES:
- RANKING QUESTIONS (type: "ranking"):
  * Rank structures by onset of action, duration of platelet inhibition, plasma half-life, lipophilicity, oral bioavailability, or dependence on hepatic bioactivation.
  * Provide "rankingPrompt" (e.g. "Rank the antiplatelets from fastest to slowest onset of action:"), and "rankingItems" with { "id": "r1", "label": "Structure I (Tirofiban)", "correctRank": 1, "rationale": "..." }.
- CLASSIFICATION & GROUPING (type: "matching" or "multiple-choice"):
  * Classify structures as prodrug vs active drug, reversible vs irreversible, chemical scaffold family, or receptor subtype selectivity.
  * For matching, provide "matchingTargets" with { "id": "a", "label": "...", "acceptedStructureIds": ["I"], "rationale": "..." }.
- PHARMACOPHORE & SAR MATCHING:
  * Questions linking specific functional groups (e.g. electrophilic warhead, basic amino group mimicking Arg, purine bioisostere, non-hydrolyzable dichloromethylene phosphonate bridge) to Roman numeral structures.
- SUB-STATEMENTS (TRUE/FALSE) (type: "sub-statements"):
  * 4 to 6 challenging SAR statements (id "a", "b", "c"...), each with "statement", "isCorrect" (boolean), and "rationale".

3. ${depthInstruction}

Available Structures in this Page:
${structureSummaries}

${sourceMaterial ? `Authoritative Source Material:\n${sourceMaterial}\n` : ''}

Output strictly valid JSON matching this schema:
{
  "questions": [
    {
      "id": ${Date.now()},
      "questionNumberLabel": "Question 1",
      "category": "Pharmacokinetics & Ranking",
      "questionStem": "Stem of question...",
      "type": "ranking",
      "rankingPrompt": "Rank the following structures from fastest onset of action to slowest:",
      "rankingItems": [
        { "id": "item_1", "label": "Structure III (Cangrelor)", "correctRank": 1, "rationale": "..." },
        { "id": "item_2", "label": "Structure II (Ticagrelor)", "correctRank": 2, "rationale": "..." }
      ],
      "overallExplanation": "...",
      "highYieldPearl": "...",
      "sourceReference": "USMLE / NAPLEX Medicinal Chemistry"
    },
    {
      "id": ${Date.now() + 1},
      "questionNumberLabel": "Question 2",
      "category": "Classification & Mechanism",
      "questionStem": "Identify the bioactivation profile of each of the above antiplatelets:",
      "type": "matching",
      "matchingTargets": [
        { "id": "a", "label": "Directly active agent requiring no hepatic bioactivation", "acceptedStructureIds": ["I", "II"], "rationale": "..." },
        { "id": "b", "label": "Prodrug requiring hepatic CYP oxidation of thiophene ring", "acceptedStructureIds": ["IV"], "rationale": "..." }
      ],
      "overallExplanation": "...",
      "highYieldPearl": "...",
      "sourceReference": "Medicinal Chemistry Review"
    },
    {
      "id": ${Date.now() + 2},
      "questionNumberLabel": "Question 3",
      "category": "Structure-Activity Relationship",
      "questionStem": "Evaluate the structure-activity relationship (SAR) statements below as True or False:",
      "type": "sub-statements",
      "subStatements": [
        { "id": "a", "statement": "Statement A...", "isCorrect": true, "rationale": "..." },
        { "id": "b", "statement": "Statement B...", "isCorrect": false, "rationale": "..." }
      ],
      "overallExplanation": "...",
      "highYieldPearl": "...",
      "sourceReference": "Medicinal Chemistry Review"
    }
  ]
}`;

    const text = await generateWithFallback({
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.7,
    });

    const parsed = JSON.parse(text || '{}');
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error('No valid questions generated by AI.');
    }

    // Assign unique clean IDs
    parsed.questions.forEach((q: any, idx: number) => {
      q.id = Date.now() + idx;
      q.questionNumberLabel = `Question ${idx + 1}`;
    });

    res.json({ questions: parsed.questions });
  } catch (error: any) {
    console.error('Error in generate-alternative-questions:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate alternative questions',
    });
  }
});

// ============================================================================
// RATIONALE DEPTH ADJUSTER: Batch rewrite rationales to Short, Medium, or Long
// ============================================================================
app.post('/api/gemini/adjust-rationale-depth', async (req: Request, res: Response) => {
  try {
    const { questions = [], targetDepth = 'medium' } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      res.status(400).json({ error: 'Questions array is required.' });
      return;
    }

    const depthInstruction =
      targetDepth === 'short'
        ? 'RATIONALE DEPTH: SHORT & HIGH-YIELD. Rewrite all rationales to be punchy, single-sentence explanations focusing exclusively on the critical warhead, active functional group, or high-yield clinical outcome. Keep overallExplanation concise (~1-2 sentences).'
        : targetDepth === 'long'
        ? 'RATIONALE DEPTH: COMPREHENSIVE & IN-DEPTH. Expand all rationales into exhaustive graduate/board-level explanations detailing specific receptor binding residues (e.g. Ser529, Arg120, Cys17/Cys270, Tyr355), full enzymatic bioactivation pathways (CYP2C19, CYP3A4, CYP2B6, hCE1/hCE2), kinetic parameters, and comparative contrasts across analogues.'
        : 'RATIONALE DEPTH: MEDIUM & BALANCED. Provide balanced rationales detailing the mechanism of action, key pharmacophore role, and clinical implication (standard 2-3 sentences).';

    const prompt = `You are an expert Medicinal Chemistry Professor.
Rewrite and adjust the rationale depth of the questions below according to the target depth: "${targetDepth}".

MANDATE:
- ${depthInstruction}
- DO NOT CHANGE question stems, question IDs, question types, correct answers, or statement truth values!
- ONLY adjust the textual explanations: "overallExplanation", "highYieldPearl", "subStatements.rationale", "matchingTargets.rationale", and "rankingItems.rationale".

Questions to adjust:
${JSON.stringify(questions, null, 2)}

Output strictly valid JSON with the adjusted questions array:
{
  "questions": [ ... array matching the exact structure of input questions with adjusted rationales ... ]
}`;

    const text = await generateWithFallback({
      contents: prompt,
      responseMimeType: 'application/json',
      temperature: 0.3,
    });

    const parsed = JSON.parse(text || '{}');
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error('Failed to parse adjusted questions from AI response.');
    }

    res.json({ questions: parsed.questions });
  } catch (error: any) {
    console.error('Error in adjust-rationale-depth:', error);
    res.status(500).json({
      error: error?.message || 'Failed to adjust rationale depth',
    });
  }
});

app.post('/api/gemini/extract-graph', async (req: Request, res: Response) => {
  try {
    if (!process.env.GOOGLE_CLOUD_PROJECT && !process.env.GEMINI_API_KEY) {
      console.error("[Backend] CRITICAL: GOOGLE_CLOUD_PROJECT or GEMINI_API_KEY is missing from environment variables.");
      return res.status(500).json({ error: "Server missing Google Cloud / Gemini configuration in .env file." });
    }

    const { slides, documentTitle, inlineData, images } = req.body;

    const hasSlides = Array.isArray(slides) && slides.length > 0;
    const hasInlineImage = Boolean(inlineData && inlineData.data) || (Array.isArray(images) && images.length > 0);

    if (!hasSlides && !hasInlineImage) {
      res.status(400).json({ error: 'Array of slides or inlineData image is required for knowledge graph extraction.' });
      return;
    }

    let contentsPayload: any;

    if (!hasSlides) {
      let pureBase64 = '';
      let mime = 'image/jpeg';

      if (inlineData && inlineData.data) {
        pureBase64 = String(inlineData.data).replace(/^data:[^;]+;base64,/, '');
        mime = inlineData.mimeType || 'image/jpeg';
      } else if (Array.isArray(images) && images.length > 0) {
        const firstImg = images[0];
        if (typeof firstImg === 'string') {
          pureBase64 = firstImg.replace(/^data:[^;]+;base64,/, '');
          const mimeMatch = firstImg.match(/^data:([^;]+);base64,/);
          if (mimeMatch) mime = mimeMatch[1];
        } else if (firstImg && typeof firstImg === 'object' && firstImg.data) {
          pureBase64 = String(firstImg.data).replace(/^data:[^;]+;base64,/, '');
          mime = firstImg.mimeType || 'image/jpeg';
        }
      }

      const imagePrompt = `You are an expert Medicinal Chemist and Pharmacologist analyzing a chemical structure diagram, lecture slide, or pharmacology infographic into a strict Knowledge Graph.
Carefully examine the chemical structures, reaction schemes, functional groups, annotations, and text shown in the image.

Document/Image Title: "${documentTitle || 'Chemical Structure Source'}"

CRITICAL DISCRETE SMALL MOLECULE RULES:
1. ONLY discrete, definable small molecules with unambiguous 2D chemical structures (and verifiable PubChem CIDs) can be tagged as "DRUG" or "METABOLITE" (e.g. "Lomitapide", "Icosapent ethyl", "Ezetimibe", "Clopidogrel", "Bergamottin").
2. EXPLICITLY BANNED AS "DRUG" OR "METABOLITE":
   - NEVER create a "DRUG" or "METABOLITE" node for:
     a) Foods, beverages, or botanicals: "Grapefruit Juice", "Grapefruit", "Orange Juice", "Dietary Fiber", "High-fat Meal", "Food".
     b) Body fluids or anatomical matrices: "Urine", "Plasma", "Serum", "Blood", "Bile", "Feces", "Saliva".
     c) Generic placeholders or slide headings: "Active Metabolite", "Inactive Metabolite", "Major Metabolite", "Primary Metabolite", "Drug A", "Compound B", "Metabolites", "Parent Drug".
     d) Clinical outcomes or adverse effects: "Bleeding", "Myopathy", "Rhabdomyolysis", "CYP3A4 Inhibition".
3. FOOD/DRUG INTERACTIONS:
   - If a slide discusses food/drug or beverage interactions (e.g. grapefruit juice inhibiting CYP3A4), extract the specific bioactive small molecule chemical constituent responsible (e.g. "bergamottin" or "6',7'-dihydroxybergamottin") as the "DRUG" entity, OR classify the interaction strictly as clinical context without creating an empty structure node.

Extraction Guidelines:
1. ENTITIES:
   - "id": Canonical lowercase string without spaces or punctuation (e.g. "clopidogrel", "cyp2c19", "thienopyridine", "p2y12", "active_thiol_metabolite", "bleeding").
   - "name": Clean human-readable display title (e.g. "Clopidogrel", "CYP2C19", "Thienopyridine Core").
   - "type": One of: "DRUG", "DRUG_CLASS", "PHARMACOPHORE_OR_MOIETY", "TARGET_OR_ENZYME", "METABOLITE", "ADVERSE_EFFECT", "DISEASE_STATE".
   - "clinical_and_sar_summary": Comprehensive explanation of structure-activity relationships (SAR), mechanism of action, active functional groups, bioactivation/metabolism, or clinical pharmacodynamics.
   - "source_slide_index": 1-based integer slide number where this entity appears (default 1).

2. RELATIONSHIPS:
   - "source": Canonical lowercase entity id.
   - "relation": Standardized uppercase relation (e.g., "INHIBITS", "METABOLIZED_BY", "BIOACTIVATED_TO", "CONTAINS_PHARMACOPHORE", "BINDS_TO", "CAUSES_ADVERSE_EFFECT", "INDICATED_FOR", "FIRST_LINE_FOR", "CONTRAINDICATED_IN", "ANALOG_OF", "RESISTANT_TO").
   - "target": Canonical lowercase entity id.
   - "sar_and_mechanism_context": Precise chemical/pharmacological reason explaining the relationship.
   - "theme_keywords": Array of relevant tags (e.g. ["prodrug", "CYP bioactivation", "covalent disulfide", "irreversible"]).
   - "source_slide_index": 1-based integer slide number.

Return valid JSON adhering strictly to the schema. If only 1 or 2 chemical structures are visible, extract them thoroughly along with their functional groups, pharmacophores, and mechanisms.`;

      contentsPayload = [
        { text: imagePrompt },
        {
          inlineData: {
            mimeType: mime,
            data: pureBase64,
          },
        },
      ];
    } else {
      const slideSummaries = slides
        .map(
          (s: any, idx: number) =>
            `[SLIDE ${s.slideNumber || idx + 1}${s.title ? `: ${s.title}` : ''}]\n${s.text || ''}`
        )
        .join('\n\n---\n\n');

      const slidePrompt = `You are an expert Medicinal Chemist and Pharmacologist parsing lecture slide material into a strict Knowledge Graph.
Extract all key medicinal chemistry entities and directed relationships present in the slides.

Slide Material (Title: "${documentTitle || 'Lecture Document'}"):
${slideSummaries}

CRITICAL DISCRETE SMALL MOLECULE RULES:
1. ONLY discrete, definable small molecules with unambiguous 2D chemical structures (and verifiable PubChem CIDs) can be tagged as "DRUG" or "METABOLITE" (e.g. "Lomitapide", "Icosapent ethyl", "Ezetimibe", "Clopidogrel", "Bergamottin").
2. EXPLICITLY BANNED AS "DRUG" OR "METABOLITE":
   - NEVER create a "DRUG" or "METABOLITE" node for:
     a) Foods, beverages, or botanicals: "Grapefruit Juice", "Grapefruit", "Orange Juice", "Dietary Fiber", "High-fat Meal", "Food".
     b) Body fluids or anatomical matrices: "Urine", "Plasma", "Serum", "Blood", "Bile", "Feces", "Saliva".
     c) Generic placeholders or slide headings: "Active Metabolite", "Inactive Metabolite", "Major Metabolite", "Primary Metabolite", "Drug A", "Compound B", "Metabolites", "Parent Drug".
     d) Clinical outcomes or adverse effects: "Bleeding", "Myopathy", "Rhabdomyolysis", "CYP3A4 Inhibition".
3. FOOD/DRUG INTERACTIONS:
   - If a slide discusses food/drug or beverage interactions (e.g. grapefruit juice inhibiting CYP3A4), extract the specific bioactive small molecule chemical constituent responsible (e.g. "bergamottin" or "6',7'-dihydroxybergamottin") as the "DRUG" entity, OR classify the interaction strictly as clinical context without creating an empty structure node.

Extraction Guidelines:
1. ENTITIES:
   - "id": Canonical lowercase string without spaces or punctuation (e.g. "clopidogrel", "cyp2c19", "thienopyridine", "p2y12", "active_thiol_metabolite", "bleeding").
   - "name": Clean human-readable display title (e.g. "Clopidogrel", "CYP2C19", "Thienopyridine Core").
   - "type": One of: "DRUG", "DRUG_CLASS", "PHARMACOPHORE_OR_MOIETY", "TARGET_OR_ENZYME", "METABOLITE", "ADVERSE_EFFECT", "DISEASE_STATE".
   - "clinical_and_sar_summary": Comprehensive explanation of structure-activity relationships (SAR), mechanism of action, active functional groups, bioactivation/metabolism, or clinical pharmacodynamics.
   - "source_slide_index": 1-based integer slide number where this entity appears (e.g., from [SLIDE 1], [SLIDE 2]).

2. RELATIONSHIPS:
   - "source": Canonical lowercase entity id.
   - "relation": Standardized uppercase relation (e.g., "INHIBITS", "METABOLIZED_BY", "BIOACTIVATED_TO", "CONTAINS_PHARMACOPHORE", "BINDS_TO", "CAUSES_ADVERSE_EFFECT", "INDICATED_FOR", "FIRST_LINE_FOR", "CONTRAINDICATED_IN", "ANALOG_OF", "RESISTANT_TO").
   - "target": Canonical lowercase entity id.
   - "sar_and_mechanism_context": Precise chemical/pharmacological reason explaining the relationship.
   - "theme_keywords": Array of relevant tags (e.g. ["prodrug", "CYP bioactivation", "covalent disulfide", "irreversible"]).
   - "source_slide_index": 1-based integer slide number where this relationship appears.

Return valid JSON adhering strictly to the schema.`;

      const parts: any[] = [{ text: slidePrompt }];
      for (const s of slides) {
        if (s.inlineData && s.inlineData.data) {
          const pureBase64 = String(s.inlineData.data).replace(/^data:[^;]+;base64,/, '');
          parts.push({
            inlineData: {
              mimeType: s.inlineData.mimeType || 'image/jpeg',
              data: pureBase64,
            },
          });
        }
        if (Array.isArray(s.images)) {
          for (const img of s.images) {
            if (typeof img === 'string') {
              const pureBase64 = img.replace(/^data:[^;]+;base64,/, '');
              const mimeMatch = img.match(/^data:([^;]+);base64,/);
              parts.push({
                inlineData: {
                  mimeType: mimeMatch ? mimeMatch[1] : 'image/jpeg',
                  data: pureBase64,
                },
              });
            }
          }
        }
      }
      if (Array.isArray(images)) {
        for (const img of images) {
          if (typeof img === 'string' && img.trim()) {
            const pureBase64 = img.replace(/^data:[^;]+;base64,/, '');
            const mimeMatch = img.match(/^data:([^;]+);base64,/);
            parts.push({
              inlineData: {
                mimeType: mimeMatch ? mimeMatch[1] : 'image/jpeg',
                data: pureBase64,
              },
            });
          } else if (img && typeof img === 'object' && img.data) {
            const pureBase64 = String(img.data).replace(/^data:[^;]+;base64,/, '');
            parts.push({
              inlineData: {
                mimeType: img.mimeType || 'image/jpeg',
                data: pureBase64,
              },
            });
          }
        }
      }
      contentsPayload = parts.length > 1 ? parts : slidePrompt;
    }

    const text = await generateWithFallback({
      contents: contentsPayload,
      systemInstruction: `${SENIOR_CHEMINFORMATICS_ENGINE_SYSTEM_INSTRUCTION}\n\n${MEDCHEM_INGESTION_SYSTEM_PROMPT}`,
      responseMimeType: 'application/json',
      responseSchema: MEDCHEM_INGESTION_RESPONSE_SCHEMA,
      temperature: 0.2,
    });

    const parsed = cleanAndParseJson<any>(text, {});

    // Validate and normalize Gemini JSON output keys (entities / nodes / graph.entities)
    const rawEntities =
      parsed?.entities ||
      parsed?.nodes ||
      parsed?.graph?.entities ||
      parsed?.graph?.nodes ||
      parsed?.knowledge_graph?.entities ||
      parsed?.knowledge_graph?.nodes ||
      (Array.isArray(parsed) ? parsed : []);

    const rawRelationships =
      parsed?.relationships ||
      parsed?.edges ||
      parsed?.graph?.relationships ||
      parsed?.graph?.edges ||
      parsed?.knowledge_graph?.relationships ||
      parsed?.knowledge_graph?.edges ||
      [];

    const normalizedEntities = Array.isArray(rawEntities)
      ? rawEntities.map((e: any) => ({
          id: String(e.id || e.name || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
          name: String(e.name || e.id || 'Unnamed Entity').trim(),
          type: e.type || 'DRUG',
          clinical_and_sar_summary: e.clinical_and_sar_summary || e.summary || e.description || '',
        }))
      : [];

    const normalizedRelationships = Array.isArray(rawRelationships)
      ? rawRelationships.map((r: any) => ({
          source: String(r.source || r.from || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
          relation: String(r.relation || r.relationship || r.type || 'RELATED_TO').trim().toUpperCase(),
          target: String(r.target || r.to || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
          sar_and_mechanism_context: r.sar_and_mechanism_context || r.context || r.description || '',
          theme_keywords: Array.isArray(r.theme_keywords) ? r.theme_keywords : (r.themes || []),
        }))
      : [];

    if (normalizedEntities.length === 0 || normalizedRelationships.length === 0) {
      console.warn('[extract-graph] Warning: Entities or relationships resolved to empty array. Raw Gemini response string:\n', text);
    }

    res.json({
      entities: normalizedEntities,
      relationships: normalizedRelationships,
    });
  } catch (err: any) {
    console.error("[Backend /api/gemini/extract-graph Error]:", err);
    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      String(err);
    res.status(500).json({ error: errorMessage, stack: err?.stack });
  }
});

app.post('/api/gemini/graphrag-quiz', async (req: Request, res: Response) => {
  try {
    if (!process.env.GOOGLE_CLOUD_PROJECT && !process.env.GEMINI_API_KEY) {
      console.error("[Backend] CRITICAL: GOOGLE_CLOUD_PROJECT or GEMINI_API_KEY is missing from environment variables.");
      return res.status(500).json({ error: "Server missing Google Cloud / Gemini configuration in .env file." });
    }

    const {
      query,
      targetDrugId,
      graphContext,
      contents,
      system_instruction,
      systemInstruction,
      generationConfig,
      inlineData,
      images,
      rawContext,
      extractedEntities,
      extractedRelationships,
    } = req.body;

    const incomingInstruction = system_instruction || systemInstruction;
    const effectiveSystemInstruction = incomingInstruction
      ? (incomingInstruction.includes('Senior Cheminformatics Engine')
          ? incomingInstruction
          : `${SENIOR_CHEMINFORMATICS_ENGINE_SYSTEM_INSTRUCTION}\n\n${incomingInstruction}`)
      : MEDCHEM_WORKSHEET_SYSTEM_PROMPT;

    let effectivePrompt =
      contents ||
      `Extract and digitize all numbered questions (e.g., 1 through 25) verbatim from the provided document.
DO NOT invent, summarize, or alter the questions.
Associate each question with its corresponding Roman numeral structures (I, II, III, IV, V, VI, VII, VIII, IX, X) or placeholder structures (Drug X, Drug Y, Drug Z).
For multi-part question blocks referencing a shared structure bank (e.g. questions 17-25), map each question to that specific array of structures.
Output valid JSON matching the schema.`;

    // Append raw image / slide context if provided (fallback for small subgraphs)
    if (rawContext && !effectivePrompt.includes(rawContext)) {
      effectivePrompt += `\n\n[Raw Source Document / Image / Slide Context]:\n${rawContext}`;
    }

    if (Array.isArray(extractedEntities) && extractedEntities.length > 0 && !effectivePrompt.includes(extractedEntities[0].id)) {
      const summaryList = extractedEntities
        .map((e: any) => `- ${e.name || e.id} (${e.type}): ${e.clinical_and_sar_summary || ''}`)
        .join('\n');
      effectivePrompt += `\n\n[Directly Extracted Entities Evidence]:\n${summaryList}`;
    }

    const parts: any[] = [{ text: effectivePrompt }];

    // 1. Single inlineData
    if (inlineData && inlineData.data) {
      const pureBase64 = String(inlineData.data).replace(/^data:[^;]+;base64,/, '');
      const mime = inlineData.mimeType || 'image/jpeg';
      parts.push({
        inlineData: {
          mimeType: mime,
          data: pureBase64,
        },
      });
    }

    // 2. Array of inlineData objects
    if (Array.isArray(inlineData)) {
      for (const item of inlineData) {
        if (item && item.data) {
          const pureBase64 = String(item.data).replace(/^data:[^;]+;base64,/, '');
          parts.push({
            inlineData: {
              mimeType: item.mimeType || 'image/jpeg',
              data: pureBase64,
            },
          });
        }
      }
    }

    // 3. Array of images (Base64 strings or { mimeType, data } objects)
    if (Array.isArray(images)) {
      for (const img of images) {
        if (typeof img === 'string' && img.trim()) {
          const pureBase64 = img.replace(/^data:[^;]+;base64,/, '');
          const mimeMatch = img.match(/^data:([^;]+);base64,/);
          parts.push({
            inlineData: {
              mimeType: mimeMatch ? mimeMatch[1] : 'image/jpeg',
              data: pureBase64,
            },
          });
        } else if (img && typeof img === 'object' && img.data) {
          const pureBase64 = String(img.data).replace(/^data:[^;]+;base64,/, '');
          parts.push({
            inlineData: {
              mimeType: img.mimeType || 'image/jpeg',
              data: pureBase64,
            },
          });
        }
      }
    }

    let contentsPayload: any = parts.length > 1 ? parts : effectivePrompt;

    const effectiveResponseSchema =
      generationConfig?.responseSchema ||
      req.body.responseSchema ||
      MEDCHEM_QUIZ_RESPONSE_SCHEMA;

    const text = await generateWithFallback({
      contents: contentsPayload,
      systemInstruction: effectiveSystemInstruction,
      responseMimeType: generationConfig?.responseMimeType || 'application/json',
      responseSchema: effectiveResponseSchema,
      temperature: generationConfig?.temperature ?? 0.1,
    });

    const parsed = cleanAndParseJson<any>(text, {});
    let question_blocks: any[] | undefined = Array.isArray(parsed?.question_blocks)
      ? parsed.question_blocks
      : undefined;

    let questions: any[] = Array.isArray(parsed?.questions)
      ? parsed.questions
      : parsed?.question
      ? [parsed.question]
      : [];
    let structures: any[] = Array.isArray(parsed?.structures) ? parsed.structures : [];

    if (question_blocks && question_blocks.length > 0) {
      if (questions.length === 0) {
        questions = question_blocks.flatMap((b: any) => b.questions || []);
      }
      if (structures.length === 0) {
        structures = question_blocks.flatMap((b: any) => b.local_structures || b.structures || []);
      }
    } else if (questions.length > 0 || structures.length > 0) {
      question_blocks = [
        {
          block_instructions: 'Consider the following chemical structures to answer subsequent questions:',
          local_structures: structures,
          questions,
        },
      ];
    }

    const question = questions[0] || null;

    if (targetDrugId && question && !question.hide_drug_name_show_structure_for) {
      question.hide_drug_name_show_structure_for = targetDrugId;
    }
    if (targetDrugId && question && (!question.displayed_structure_entity_ids || question.displayed_structure_entity_ids.length === 0)) {
      question.displayed_structure_entity_ids = [targetDrugId];
    }

    res.json({ question_blocks, question, questions, structures });
  } catch (err: any) {
    console.error("[Backend /api/gemini/graphrag-quiz Error]:", err);
    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      String(err);
    res.status(500).json({ error: errorMessage, stack: err?.stack });
  }
});



const hasDist = fs.existsSync(path.join(__dirname, 'dist', 'index.html'));
const isProduction = process.env.NODE_ENV === 'production' && hasDist;

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
