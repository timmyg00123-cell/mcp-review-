import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getBinaryCifUrl,
  isMolstarSupported,
  loadMolstarPluginScript,
  loadMolstarBundle,
  getCachedCoordinateUrl,
  cacheCoordinateBlob,
  clearCoordinateCache,
  _resetMolstarLoaderStateForTesting,
} from '../src/services/molstarLoader.js';

test('getBinaryCifUrl formats standard RCSB binary CIF endpoint', () => {
  assert.equal(getBinaryCifUrl('4NTJ'), 'https://models.rcsb.org/4ntj.bcif');
  assert.equal(getBinaryCifUrl(' 1o86 '), 'https://models.rcsb.org/1o86.bcif');
  assert.equal(getBinaryCifUrl('6W01'), 'https://models.rcsb.org/6w01.bcif');
  assert.equal(getBinaryCifUrl(''), '');
});

test('isMolstarSupported detects WebGL availability environment', () => {
  // In standard Node test runner without mocked DOM/canvas, returns boolean (false)
  const supported = isMolstarSupported();
  assert.equal(typeof supported, 'boolean');

  // Test with mocked window and canvas returning WebGL2
  const originalWindow = (globalThis as any).window;
  const originalDocument = (globalThis as any).document;

  try {
    (globalThis as any).document = {
      createElement: (tag: string) => {
        if (tag === 'canvas') {
          return {
            getContext: (type: string) => (type === 'webgl2' ? {} : null),
          };
        }
        return {};
      },
    };
    (globalThis as any).window = {};

    assert.equal(isMolstarSupported(), true, 'Should detect WebGL2 support');

    // Test with canvas returning no context
    (globalThis as any).document = {
      createElement: (tag: string) => {
        if (tag === 'canvas') {
          return {
            getContext: () => null,
          };
        }
        return {};
      },
    };
    assert.equal(isMolstarSupported(), false, 'Should return false when WebGL is unavailable');
  } finally {
    (globalThis as any).window = originalWindow;
    (globalThis as any).document = originalDocument;
  }
});

test('isMolstarSupported requests permissive context attributes and disposes context via WEBGL_lose_context', () => {
  const originalWindow = (globalThis as any).window;
  const originalDocument = (globalThis as any).document;

  try {
    let loseContextCalls = 0;
    let requestedType: string | null = null;
    let requestedAttributes: any = null;

    const mockLoseContextExt = {
      loseContext: () => {
        loseContextCalls++;
      },
    };

    const mockGl = {
      getExtension: (name: string) => {
        if (name === 'WEBGL_lose_context') {
          return mockLoseContextExt;
        }
        return null;
      },
    };

    (globalThis as any).window = {};
    (globalThis as any).document = {
      createElement: (tag: string) => {
        if (tag === 'canvas') {
          return {
            getContext: (type: string, attrs: any) => {
              requestedType = type;
              requestedAttributes = attrs;
              return mockGl;
            },
          };
        }
        return {};
      },
    };

    const supported = isMolstarSupported();
    assert.equal(supported, true);
    assert.equal(loseContextCalls, 1, 'loseContext() should be called exactly once');
    assert.deepEqual(
      requestedAttributes,
      {
        failIfMajorPerformanceCaveat: false,
        powerPreference: 'default',
      },
      'getContext should be called with permissive attributes'
    );

    // Also verify when getExtension is missing or returns null, it still returns true and does not throw
    loseContextCalls = 0;
    const mockGlNoExt = {};
    (globalThis as any).document = {
      createElement: (tag: string) => {
        if (tag === 'canvas') {
          return {
            getContext: () => mockGlNoExt,
          };
        }
        return {};
      },
    };

    assert.equal(isMolstarSupported(), true, 'Should return true when getExtension is not defined');
    assert.equal(loseContextCalls, 0);

    const mockGlNullExt = {
      getExtension: () => null,
    };
    (globalThis as any).document = {
      createElement: (tag: string) => {
        if (tag === 'canvas') {
          return {
            getContext: () => mockGlNullExt,
          };
        }
        return {};
      },
    };

    assert.equal(isMolstarSupported(), true, 'Should return true when getExtension returns null');
  } finally {
    (globalThis as any).window = originalWindow;
    (globalThis as any).document = originalDocument;
  }
});

test('getCachedCoordinateUrl returns binary CIF URL and handles in-memory cache', async () => {
  clearCoordinateCache();
  const defaultUrl = await getCachedCoordinateUrl('4NTJ');
  assert.equal(defaultUrl, 'https://models.rcsb.org/4ntj.bcif');

  // Test caching simulated blob URL
  const fakeBlob = { size: 100, type: 'application/octet-stream' } as unknown as Blob;
  const originalCreateObjectURL = (globalThis as any).URL?.createObjectURL;

  try {
    if (!(globalThis as any).URL) {
      (globalThis as any).URL = {};
    }
    (globalThis as any).URL.createObjectURL = () => 'blob:https://localhost/test-uuid-4ntj';

    const cachedUrl = cacheCoordinateBlob('4NTJ', fakeBlob);
    assert.equal(cachedUrl, 'blob:https://localhost/test-uuid-4ntj');

    const retrievedUrl = await getCachedCoordinateUrl('4NTJ');
    assert.equal(retrievedUrl, 'blob:https://localhost/test-uuid-4ntj');

    clearCoordinateCache();
    const afterClear = await getCachedCoordinateUrl('4NTJ');
    assert.equal(afterClear, 'https://models.rcsb.org/4ntj.bcif');
  } finally {
    if (originalCreateObjectURL) {
      (globalThis as any).URL.createObjectURL = originalCreateObjectURL;
    }
  }
});

test('loadMolstarPluginScript resolves existing window.PDBeMolstarPlugin if already available', async () => {
  _resetMolstarLoaderStateForTesting();
  const originalWindow = (globalThis as any).window;

  try {
    const mockPluginInstance = { version: '3.12.0', create: () => ({}) };
    (globalThis as any).window = {
      PDBeMolstarPlugin: mockPluginInstance,
    };

    const plugin = await loadMolstarPluginScript();
    assert.equal(plugin, mockPluginInstance);
  } finally {
    (globalThis as any).window = originalWindow;
    _resetMolstarLoaderStateForTesting();
  }
});

test('loadMolstarPluginScript injects script tag and resolves when loaded', async () => {
  _resetMolstarLoaderStateForTesting();
  const originalWindow = (globalThis as any).window;
  const originalDocument = (globalThis as any).document;

  try {
    const createdElements: Array<any> = [];
    const mockWindow: any = {};

    const mockDocument = {
      head: {
        appendChild: (el: any) => {
          createdElements.push(el);
          if (el.tagName === 'SCRIPT') {
            // Simulate successful asynchronous script load
            setTimeout(() => {
              mockWindow.PDBeMolstarPlugin = { name: 'PDBeMolstarPluginLoaded' };
              if (el.onload) el.onload(new Event('load'));
            }, 10);
          }
        },
      },
      createElement: (tag: string) => {
        return {
          tagName: tag.toUpperCase(),
          setAttribute: function (k: string, v: string) {
            (this as any)[k] = v;
          },
        };
      },
    };

    (globalThis as any).window = mockWindow;
    (globalThis as any).document = mockDocument;

    const pluginPromise = loadMolstarBundle({ timeoutMs: 1000 });
    const plugin = await pluginPromise;

    assert.ok(plugin);
    assert.equal(plugin.name, 'PDBeMolstarPluginLoaded');

    const scriptEl = createdElements.find((el) => el.tagName === 'SCRIPT');
    const linkEl = createdElements.find((el) => el.tagName === 'LINK');

    assert.ok(scriptEl, 'Script element was appended');
    assert.ok(linkEl, 'Link element was appended');
    assert.ok(scriptEl.src.includes('pdbe-molstar-plugin.js'));
    assert.ok(linkEl.href.includes('pdbe-molstar.css'));
  } finally {
    (globalThis as any).window = originalWindow;
    (globalThis as any).document = originalDocument;
    _resetMolstarLoaderStateForTesting();
  }
});

test('loadMolstarPluginScript falls back to secondary CDN if primary fails', async () => {
  _resetMolstarLoaderStateForTesting();
  const originalWindow = (globalThis as any).window;
  const originalDocument = (globalThis as any).document;

  try {
    const scriptAttempts: string[] = [];
    const mockWindow: any = {};

    const mockDocument = {
      head: {
        appendChild: (el: any) => {
          if (el.tagName === 'SCRIPT') {
            scriptAttempts.push(el.src);
            setTimeout(() => {
              if (scriptAttempts.length === 1) {
                // Primary CDN fails
                if (el.onerror) el.onerror(new Error('CDN 1 failed'));
              } else {
                // Secondary CDN succeeds
                mockWindow.PDBeMolstarPlugin = { name: 'FallbackPluginLoaded' };
                if (el.onload) el.onload(new Event('load'));
              }
            }, 10);
          }
        },
      },
      createElement: (tag: string) => {
        return {
          tagName: tag.toUpperCase(),
          setAttribute: function (k: string, v: string) {
            (this as any)[k] = v;
          },
        };
      },
    };

    (globalThis as any).window = mockWindow;
    (globalThis as any).document = mockDocument;

    const plugin = await loadMolstarPluginScript({ timeoutMs: 2000 });
    assert.equal(plugin.name, 'FallbackPluginLoaded');
    assert.equal(scriptAttempts.length, 2, 'Should have attempted primary then fallback CDN');
    assert.ok(scriptAttempts[0].includes('jsdelivr'));
    assert.ok(scriptAttempts[1].includes('unpkg'));
  } finally {
    (globalThis as any).window = originalWindow;
    (globalThis as any).document = originalDocument;
    _resetMolstarLoaderStateForTesting();
  }
});

test('loadMolstarPluginScript rejects upon timeout', async () => {
  _resetMolstarLoaderStateForTesting();
  const originalWindow = (globalThis as any).window;
  const originalDocument = (globalThis as any).document;

  try {
    const mockDocument = {
      head: {
        appendChild: () => {
          // Never fires onload or onerror
        },
      },
      createElement: (tag: string) => ({
        tagName: tag.toUpperCase(),
        setAttribute: () => {},
      }),
    };

    (globalThis as any).window = {};
    (globalThis as any).document = mockDocument;

    await assert.rejects(
      async () => {
        await loadMolstarPluginScript({ timeoutMs: 50 });
      },
      {
        message: /timed out/i,
      }
    );
  } finally {
    (globalThis as any).window = originalWindow;
    (globalThis as any).document = originalDocument;
    _resetMolstarLoaderStateForTesting();
  }
});
