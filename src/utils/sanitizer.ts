import DOMPurify from 'dompurify';

/**
 * Sanitizes untrusted HTML or SVG content using DOMPurify.
 */
export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return '';
  return DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true, svg: true, svgFilters: true },
    ADD_TAGS: ['use'],
    ADD_ATTR: ['target'],
  });
}

/**
 * Sanitizes RDKit SVG output while explicitly whitelisting all required
 * SVG tags, inline styles, classes, and cheminformatics attributes for dynamic CSS targeting.
 */
export function sanitizeRDKitSVG(rawSvg: string): string {
  if (!rawSvg) return '';
  return DOMPurify.sanitize(rawSvg, {
    USE_PROFILES: { svg: true },
    ADD_ATTR: [
      'style',
      'class',
      'fill',
      'stroke',
      'stroke-width',
      'd',
      'transform',
      'data-atom-id',
    ],
  });
}

/**
 * Renders sanitized HTML or SVG content directly into the provided DOM element.
 * Utilizes the native browser Sanitizer API (Element.prototype.setHTML) if available,
 * and securely falls back to DOMPurify.sanitize(rawHtml).
 */
export function renderSanitizedContent(el: HTMLElement | null, rawHtml: string): void {
  if (!el) return;
  if (!rawHtml) {
    el.replaceChildren();
    return;
  }

  // Modern Native Sanitizer API (W3C Sanitizer API)
  if ('setHTML' in el && typeof (el as any).setHTML === 'function') {
    try {
      (el as any).setHTML(rawHtml);
      return;
    } catch {
      // Fallback to DOMPurify if setHTML throws (e.g. experimental flag or unsupported element)
    }
  }

  // Strict DOMPurify fallback
  el.innerHTML = sanitizeHtml(rawHtml);
}
