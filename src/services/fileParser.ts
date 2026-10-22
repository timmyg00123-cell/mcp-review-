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
