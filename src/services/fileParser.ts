import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

// Configure pdfjs worker if in browser with multiple redundant fallbacks
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  try {
    // 1. Prefer local Vite bundled worker URL
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch {
    try {
      // 2. Fallback to unpkg CDN matching library version
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    } catch (err) {
      console.warn('Could not set pdf.worker.min.mjs path:', err);
    }
  }
}

export interface IngestionSlide {
  slideNumber: number;
  slideIndex: number; // Explicit 1-based slide index
  pageNumber: number; // Explicit 1-based page number
  title?: string;
  text: string;
  images?: string[];
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface PageExtractionItem {
  pageNumber: number;
  totalPages: number;
  text: string;
  imageBase64: string; // Pure Base64 JPEG string
  hasImages: boolean;
}

export interface ParsePdfResult {
  slides: IngestionSlide[];
  numPages: number;
  totalChars: number;
  avgCharsPerPage: number;
  isScannedOrImageOnly: boolean;
  renderedCanvasImages?: string[];
}

/**
 * Reads a browser File as a pure base64 string.
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const pureBase64 = res.includes(',') ? res.split(',')[1] : res;
      resolve(pureBase64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Renders a PDF page to an HTML5 canvas and exports as a Base64 JPEG.
 * Viewport scale 0.8 and JPEG quality 0.6 keeps the image footprint small and prevents payload bloat.
 */
export async function renderPdfPageToCanvasBase64(page: any, scale = 0.8): Promise<string> {
  if (typeof document === 'undefined') {
    throw new Error('Canvas rendering is only supported in browser environments.');
  }

  const viewport = page.getViewport({ scale: scale || 0.8 });
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const canvasContext = canvas.getContext('2d');
  if (!canvasContext) {
    throw new Error('Could not acquire 2D canvas context.');
  }

  await page.render({
    canvasContext,
    viewport,
  }).promise;

  const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
  canvas.width = 0;
  canvas.height = 0;
  return dataUrl.replace(/^data:image\/jpeg;base64,/, '');
}

/**
 * Parses a PDF file ArrayBuffer into slides.
 * ALWAYS forces HTML5 canvas rendering for EVERY single page, converting each page
 * to a high-fidelity Base64 JPEG so multimodal Gemini Flash visually inspects all
 * embedded 2D chemical drawings and structures alongside the extracted text.
 */
export async function parsePdf(
  arrayBuffer: ArrayBuffer,
  fileName?: string,
  onLog?: (msg: string) => void
): Promise<ParsePdfResult> {
  const timeoutMs = 30000;
  let loadingTask: any = null;

  try {
    loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      stopAtErrors: false,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `PDF parsing timed out after ${timeoutMs / 1000}s for "${fileName || 'document'}". PDF worker may have stalled.`
            )
          ),
        timeoutMs
      )
    );

    const pdfDoc = await Promise.race([loadingTask.promise, timeoutPromise]);
    const numPages = pdfDoc.numPages;
    const slides: IngestionSlide[] = [];
    const renderedCanvasImages: string[] = [];

    let totalChars = 0;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page = await pdfDoc.getPage(pageNum);

        // 1. Text extraction
        let fullText = '';
        let firstLine = `Page ${pageNum}`;
        try {
          const textContent = await page.getTextContent();
          const textItems = textContent.items
            .map((item: any) => item.str || '')
            .filter(Boolean);
          fullText = textItems.join(' ').replace(/\s+/g, ' ').trim();
          totalChars += fullText.length;
          firstLine = textItems[0] || `Page ${pageNum}`;
        } catch (textErr) {
          console.warn(`Error reading page ${pageNum} text:`, textErr);
        }

        // 2. FORCED HTML5 Canvas rendering for EVERY page (never rely solely on textContent)
        // Renders page to canvas and exports as Base64 JPEG so Gemini Flash can inspect embedded chemical drawings
        let jpegBase64 = '';
        try {
          jpegBase64 = await renderPdfPageToCanvasBase64(page, 0.8);
          renderedCanvasImages.push(jpegBase64);
        } catch (canvasErr) {
          console.warn(`Could not render HTML5 canvas for page ${pageNum}:`, canvasErr);
        }

        const inlineData = jpegBase64
          ? { mimeType: 'image/jpeg', data: jpegBase64 }
          : undefined;

        slides.push({
          slideNumber: pageNum,
          slideIndex: pageNum,
          pageNumber: pageNum,
          title: firstLine.length < 100 ? firstLine : `Page ${pageNum}`,
          text: fullText || `[Page ${pageNum} - Rendered Visual Chemical Diagram / Image]`,
          images: jpegBase64 ? [`data:image/jpeg;base64,${jpegBase64}`] : [],
          inlineData,
        });
      } catch (pageErr) {
        console.warn(`Error processing PDF page ${pageNum}:`, pageErr);
        slides.push({
          slideNumber: pageNum,
          slideIndex: pageNum,
          pageNumber: pageNum,
          title: `Page ${pageNum}`,
          text: `[Page ${pageNum}]`,
          images: [],
        });
      }
    }

    const avgCharsPerPage = totalChars / Math.max(1, numPages);
    console.log(
      `[Ingest] Extracted text length: ${totalChars} characters across ${numPages} slides (avg: ${avgCharsPerPage.toFixed(1)} chars/page); rendered ${renderedCanvasImages.length}/${numPages} visual canvas JPEGs for Gemini Vision.`
    );
    onLog?.(
      `[Ingest] Extracted text length: ${totalChars} chars across ${numPages} slides (avg: ${avgCharsPerPage.toFixed(1)} chars/page); rendered ${renderedCanvasImages.length}/${numPages} visual canvas JPEGs.`
    );

    const isScannedOrImageOnly = totalChars === 0 || avgCharsPerPage < 50;

    return {
      slides,
      numPages,
      totalChars,
      avgCharsPerPage,
      isScannedOrImageOnly,
      renderedCanvasImages,
    };
  } catch (err: any) {
    if (loadingTask && typeof loadingTask.destroy === 'function') {
      try {
        loadingTask.destroy();
      } catch {
        // ignore
      }
    }
    console.error('parsePdf error:', err);
    throw new Error(`Failed to parse PDF "${fileName || 'document'}": ${err?.message || err}`);
  }
}

/**
 * Backwards compatible alias.
 */
export async function parsePdfToSlides(
  arrayBuffer: ArrayBuffer,
  fileName?: string
): Promise<IngestionSlide[]> {
  const result = await parsePdf(arrayBuffer, fileName);
  return result.slides;
}

/**
 * Splits a PDF, image, or text file into individual PageExtractionItem items for per-page high-fidelity processing.
 * For PDFs, renders high-resolution HTML5 canvas JPEGs (scale 1.35) and extracts verbatim text for each page.
 */
export async function splitDocumentIntoPageItems(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<PageExtractionItem[]> {
  const fileName = file.name || 'document';
  const lowerName = fileName.toLowerCase();

  // 1. PDF File handling
  if (lowerName.endsWith('.pdf') || file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      stopAtErrors: false,
    });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const pageItems: PageExtractionItem[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      onProgress?.(pageNum, numPages);
      try {
        const page = await pdfDoc.getPage(pageNum);

        // Extract page text
        let fullText = '';
        try {
          const textContent = await page.getTextContent();
          const textItems = textContent.items
            .map((item: any) => item.str || '')
            .filter(Boolean);
          fullText = textItems.join(' ').replace(/\s+/g, ' ').trim();
        } catch (textErr) {
          console.warn(`[splitDocumentIntoPageItems] Error reading text on page ${pageNum}:`, textErr);
        }

        // Render high-res canvas (scale 1.35 gives crystal clarity for chemical structures and question lettering)
        let jpegBase64 = '';
        try {
          jpegBase64 = await renderPdfPageToCanvasBase64(page, 1.35);
        } catch (canvasErr) {
          console.warn(`[splitDocumentIntoPageItems] Canvas render failed for page ${pageNum}:`, canvasErr);
        }

        pageItems.push({
          pageNumber: pageNum,
          totalPages: numPages,
          text: fullText,
          imageBase64: jpegBase64,
          hasImages: Boolean(jpegBase64),
        });
      } catch (pageErr) {
        console.warn(`[splitDocumentIntoPageItems] Failed to process page ${pageNum}:`, pageErr);
        pageItems.push({
          pageNumber: pageNum,
          totalPages: numPages,
          text: `[Page ${pageNum}]`,
          imageBase64: '',
          hasImages: false,
        });
      }
    }
    return pageItems;
  }

  // 2. Direct Image Files (PNG, JPG, WebP)
  if (file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(fileName)) {
    const base64 = await readFileAsBase64(file);
    return [
      {
        pageNumber: 1,
        totalPages: 1,
        text: '',
        imageBase64: base64,
        hasImages: true,
      },
    ];
  }

  // 3. Text / Markdown / Other fallback
  const text = await file.text();
  return [
    {
      pageNumber: 1,
      totalPages: 1,
      text: text.trim(),
      imageBase64: '',
      hasImages: false,
    },
  ];
}

/**
 * Parses a PPTX file ArrayBuffer into an array of IngestionSlides,
 * extracting slide XML text (<a:t>) and embedded images from ppt/media/.
 */
export async function parsePptx(
  arrayBuffer: ArrayBuffer,
  fileName?: string
): Promise<{ slides: IngestionSlide[]; totalChars: number }> {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const slides: IngestionSlide[] = [];

  // 1. Extract embedded media images (ppt/media/*)
  const mediaMap = new Map<string, string>();
  const mediaFileNames = Object.keys(zip.files).filter((path) =>
    path.startsWith('ppt/media/')
  );

  for (const mediaPath of mediaFileNames) {
    try {
      const file = zip.files[mediaPath];
      if (file && !file.dir) {
        const lower = mediaPath.toLowerCase();
        let mime = 'image/png';
        if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) mime = 'image/jpeg';
        else if (lower.endsWith('.webp')) mime = 'image/webp';
        else if (lower.endsWith('.svg')) mime = 'image/svg+xml';

        const base64 = await file.async('base64');
        const dataUrl = `data:${mime};base64,${base64}`;
        mediaMap.set(mediaPath.replace('ppt/media/', ''), dataUrl);
      }
    } catch (err) {
      console.warn(`Could not extract media file ${mediaPath}:`, err);
    }
  }

  // 2. Discover slide XML files (ppt/slides/slide*.xml)
  const slidePaths = Object.keys(zip.files).filter((path) =>
    /^ppt\/slides\/slide\d+\.xml$/i.test(path)
  );

  slidePaths.sort((a, b) => {
    const numA = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
    const numB = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
    return numA - numB;
  });

  let totalChars = 0;

  for (let i = 0; i < slidePaths.length; i++) {
    const slidePath = slidePaths[i];
    const slideNum = parseInt(slidePath.match(/slide(\d+)\.xml/i)?.[1] || `${i + 1}`, 10);
    const xmlText = await zip.files[slidePath].async('string');

    let slideExtractedText = '';
    const textPieces: string[] = [];

    if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
      const textNodes = xmlDoc.getElementsByTagName('a:t');
      for (let j = 0; j < textNodes.length; j++) {
        const t = textNodes[j].textContent;
        if (t && t.trim()) textPieces.push(t.trim());
      }
    } else {
      const matches = xmlText.match(/<a:t[^>]*>(.*?)<\/a:t>/gi) || [];
      for (const m of matches) {
        const clean = m.replace(/<\/?a:t[^>]*>/gi, '').trim();
        if (clean) textPieces.push(clean);
      }
    }

    slideExtractedText = textPieces.join(' ').replace(/\s+/g, ' ').trim();
    totalChars += slideExtractedText.length;
    const title = textPieces[0] || `Slide ${slideNum}`;

    const slideImages: string[] = [];
    if (mediaMap.size > 0 && i < mediaMap.size) {
      const mediaList = Array.from(mediaMap.values());
      if (mediaList[i]) slideImages.push(mediaList[i]);
    }

    slides.push({
      slideNumber: slideNum,
      slideIndex: slideNum,
      pageNumber: slideNum,
      title: title.length < 80 ? title : `Slide ${slideNum}`,
      text: slideExtractedText || `[Slide ${slideNum} - Diagrams/Images]`,
      images: slideImages,
    });
  }

  console.log(`[Ingest] Extracted text length: ${totalChars} characters across ${slides.length} PPTX slides`);

  return { slides, totalChars };
}

/**
 * Backwards compatible alias.
 */
export async function parsePptxToSlides(
  arrayBuffer: ArrayBuffer,
  fileName?: string
): Promise<IngestionSlide[]> {
  const result = await parsePptx(arrayBuffer, fileName);
  return result.slides;
}

export interface EtlIngestionResult {
  enrichedCount: number;
  totalScanned: number;
  results: Array<{ id: string; success: boolean; chemData?: any }>;
}

/**
 * Instantiates the background ETL Web Worker using Vite's native module URL syntax.
 */
export function createIngestWorker(): Worker {
  return new Worker(new URL('./ingestWorker.ts', import.meta.url), { type: 'module' });
}

/**
 * Runs the PubChem fetching and Dexie persistence pipeline in a dedicated Web Worker thread.
 * Listens for { type: 'PROGRESS', current, total } postMessage updates to notify the UI spinner.
 */
export function runEtlIngestion(
  entityIdsOrPayload:
    | string[]
    | Array<{ id: string; name?: string; cid?: number; canonicalSmiles?: string; smiles?: string; [key: string]: any }>
    | { entityIds?: string[]; entities?: any[]; structures?: any[] },
  onProgress?: (current: number, total: number, name?: string) => void,
  signal?: AbortSignal
): Promise<EtlIngestionResult> {
  return new Promise((resolve, reject) => {
    let worker: Worker | null = null;
    try {
      worker = new Worker(new URL('./ingestWorker.ts', import.meta.url), { type: 'module' });
    } catch (err) {
      return reject(new Error(`Failed to instantiate ingestWorker: ${err}`));
    }

    const cleanup = () => {
      if (worker) {
        worker.terminate();
        worker = null;
      }
    };

    if (signal) {
      if (signal.aborted) {
        cleanup();
        return reject(new DOMException('ETL Ingestion aborted by user', 'AbortError'));
      }
      signal.addEventListener('abort', () => {
        cleanup();
        reject(new DOMException('ETL Ingestion aborted by user', 'AbortError'));
      });
    }

    worker.onmessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (data.type === 'PROGRESS') {
        onProgress?.(data.current, data.total, data.name || data.message);
      } else if (data.type === 'COMPLETE') {
        const payload = data.payload || { enrichedCount: 0, totalScanned: 0, results: [] };
        cleanup();
        resolve(payload);
      } else if (data.type === 'ERROR') {
        cleanup();
        reject(new Error(data.error || 'Worker ETL ingestion failed'));
      }
    };

    worker.onerror = (err) => {
      cleanup();
      reject(new Error(`Web Worker error: ${err.message}`));
    };

    const payload = Array.isArray(entityIdsOrPayload)
      ? typeof entityIdsOrPayload[0] === 'object'
        ? { entities: entityIdsOrPayload }
        : { entityIds: entityIdsOrPayload }
      : entityIdsOrPayload;

    worker.postMessage({
      type: 'START_INGEST',
      payload,
    });
  });
}

