/**
 * Mol* (MolStar) Service Loader & Binary mmCIF Caching Engine
 *
 * Provides dynamic bundle injection, WebGL capability detection,
 * Binary mmCIF (.bcif) URL generation, and coordinate caching.
 */

export interface MolstarLoaderOptions {
  timeoutMs?: number;
  forceReload?: boolean;
  primaryJsUrl?: string;
  primaryCssUrl?: string;
  fallbackJsUrl?: string;
  fallbackCssUrl?: string;
}

export const DEFAULT_MOLSTAR_CDN = {
  primaryJs: 'https://cdn.jsdelivr.net/npm/pdbe-molstar@3.12.0/build/pdbe-molstar-plugin.js',
  primaryCss: 'https://cdn.jsdelivr.net/npm/pdbe-molstar@3.12.0/build/pdbe-molstar.css',
  fallbackJs: 'https://unpkg.com/pdbe-molstar@3.12.0/build/pdbe-molstar-plugin.js',
  fallbackCss: 'https://unpkg.com/pdbe-molstar@3.12.0/build/pdbe-molstar.css',
};

const inMemoryCoordinateCache = new Map<string, string>();
let activeLoaderPromise: Promise<any> | null = null;

/**
 * Returns the standard RCSB Binary mmCIF (.bcif) coordinate streaming endpoint.
 * Binary CIF is compressed and pre-indexed, dramatically smaller (~150-250KB vs 3MB ASCII PDB).
 */
export function getBinaryCifUrl(pdbId: string): string {
  if (!pdbId || typeof pdbId !== 'string') return '';
  const normalized = pdbId.trim().toLowerCase();
  if (!normalized) return '';
  return `https://models.rcsb.org/${normalized}.bcif`;
}

/**
 * Checks whether the current browser runtime supports WebGL or WebGL2 canvas contexts.
 */
export function isMolstarSupported(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Asynchronously returns a cached coordinate URL (e.g. blob URL) or falls back to binary CIF URL.
 */
export async function getCachedCoordinateUrl(pdbId: string): Promise<string> {
  if (!pdbId) return '';
  const normalized = pdbId.trim().toLowerCase();
  const cached = inMemoryCoordinateCache.get(normalized);
  if (cached) {
    return cached;
  }
  return getBinaryCifUrl(normalized);
}

/**
 * Caches a raw coordinate Blob in memory and creates a local object URL.
 */
export function cacheCoordinateBlob(pdbId: string, blob: Blob): string {
  if (!pdbId) return '';
  const normalized = pdbId.trim().toLowerCase();
  if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    const blobUrl = URL.createObjectURL(blob);
    inMemoryCoordinateCache.set(normalized, blobUrl);
    return blobUrl;
  }
  return getBinaryCifUrl(normalized);
}

/**
 * Clears the in-memory coordinate URL cache and revokes any active object URLs.
 */
export function clearCoordinateCache(): void {
  if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
    for (const url of inMemoryCoordinateCache.values()) {
      if (url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore revocation cleanup errors
        }
      }
    }
  }
  inMemoryCoordinateCache.clear();
}

/**
 * Resets the loader's memoized promise state (primarily for test isolation).
 */
export function _resetMolstarLoaderStateForTesting(): void {
  activeLoaderPromise = null;
}

/**
 * Injects a stylesheet link element if it does not already exist.
 */
function ensureStyleSheetInjected(cssUrl: string): void {
  if (typeof document === 'undefined') return;
  if (typeof document.querySelector === 'function') {
    const existingLink = document.querySelector(`link[href="${cssUrl}"]`);
    if (existingLink) return;
  }

  if (typeof document.createElement === 'function') {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', cssUrl);
    if (document.head && typeof document.head.appendChild === 'function') {
      document.head.appendChild(link);
    } else if (typeof document.appendChild === 'function') {
      document.appendChild(link);
    }
  }
}

/**
 * Dynamically injects and initializes the Mol* / PDBeMolstar plugin script and styles.
 * Supports memoized deduplication, CDN fallback (primary -> secondary), and timeout handling.
 */
export function loadMolstarPluginScript(options: MolstarLoaderOptions = {}): Promise<any> {
  const {
    timeoutMs = 15000,
    forceReload = false,
    primaryJsUrl = DEFAULT_MOLSTAR_CDN.primaryJs,
    primaryCssUrl = DEFAULT_MOLSTAR_CDN.primaryCss,
    fallbackJsUrl = DEFAULT_MOLSTAR_CDN.fallbackJs,
    fallbackCssUrl = DEFAULT_MOLSTAR_CDN.fallbackCss,
  } = options;

  // If already loaded on window, immediately resolve
  if (typeof window !== 'undefined') {
    const existingGlobal = (window as any).PDBeMolstarPlugin || (window as any).molstar;
    if (!forceReload && existingGlobal) {
      return Promise.resolve(existingGlobal);
    }
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(new Error('Mol* plugin loader requires a browser DOM environment'));
  }

  if (!forceReload && activeLoaderPromise) {
    return activeLoaderPromise;
  }

  activeLoaderPromise = new Promise((resolve, reject) => {
    let timer: any = null;
    let isSettled = false;

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    timer = setTimeout(() => {
      if (isSettled) return;
      isSettled = true;
      cleanup();
      activeLoaderPromise = null;
      reject(new Error(`Loading Mol* plugin timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    // Inject CSS
    ensureStyleSheetInjected(primaryCssUrl);

    // Helper to attempt loading a script URL
    const attemptLoadScript = (scriptUrl: string, onFail: () => void) => {
      const script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', scriptUrl);
      script.setAttribute('async', 'true');

      script.onload = () => {
        if (isSettled) return;
        isSettled = true;
        cleanup();
        const loadedPlugin = (window as any).PDBeMolstarPlugin || (window as any).molstar;
        resolve(loadedPlugin || { loaded: true });
      };

      script.onerror = () => {
        if (isSettled) return;
        if (script.parentNode && typeof script.parentNode.removeChild === 'function') {
          script.parentNode.removeChild(script);
        }
        onFail();
      };

      if (document.head && typeof document.head.appendChild === 'function') {
        document.head.appendChild(script);
      } else if (typeof document.appendChild === 'function') {
        document.appendChild(script);
      }
    };

    // Try primary script, fall back to secondary on failure
    attemptLoadScript(primaryJsUrl, () => {
      if (fallbackJsUrl && fallbackJsUrl !== primaryJsUrl) {
        ensureStyleSheetInjected(fallbackCssUrl);
        attemptLoadScript(fallbackJsUrl, () => {
          if (isSettled) return;
          isSettled = true;
          cleanup();
          activeLoaderPromise = null;
          reject(new Error(`Failed to load Mol* plugin from both primary (${primaryJsUrl}) and fallback (${fallbackJsUrl}) CDNs.`));
        });
      } else {
        if (isSettled) return;
        isSettled = true;
        cleanup();
        activeLoaderPromise = null;
        reject(new Error(`Failed to load Mol* plugin from CDN: ${primaryJsUrl}`));
      }
    });
  });

  return activeLoaderPromise;
}

/**
 * Convenient alias for loadMolstarPluginScript.
 */
export const loadMolstarBundle = loadMolstarPluginScript;
