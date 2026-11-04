import React, { useEffect, useState, useMemo } from 'react';
import wasmUrl from '@rdkit/rdkit/Code/MinimalLib/dist/RDKit_minimal.wasm?url';
import initRDKitModule, { MainModule, Mol } from '@rdkit/rdkit';
import { PharmacophoreGroup } from '../types/reviewModule';
import { getCorrectedSmarts } from '../utils/smartsDictionary';

declare global {
  interface Window {
    initRDKitModule?: typeof initRDKitModule;
    RDKit?: MainModule;
  }
}

// Ensure initRDKitModule is accessible on window
if (typeof window !== 'undefined' && !window.initRDKitModule) {
  window.initRDKitModule = initRDKitModule;
}

export interface SmilesCanvasProps {
  smiles?: string;
  molBlock?: string;
  fallbackImageUrl?: string;
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  bondStrokeColor?: string;
  className?: string;
  altText?: string;
  activePharmacophores?: Array<{ smarts?: string; color?: string; [key: string]: any }>;
  highlightSmarts?: string | null;
  hoveredPharmacophore?: PharmacophoreGroup | null;
  highlightColor?: string;
  showToggleOption?: boolean;
}

/**
 * Singleton promise to prevent redundant WASM module initializations across multiple instances
 */
let rdkitModulePromise: Promise<MainModule> | null = null;

const getRDKitInstance = async (): Promise<MainModule> => {
  if (typeof window !== 'undefined' && window.RDKit) {
    return window.RDKit;
  }

  if (!rdkitModulePromise) {
    const initPromise =
      typeof window !== 'undefined' && window.initRDKitModule
        ? window.initRDKitModule({ locateFile: () => wasmUrl })
        : initRDKitModule({ locateFile: () => wasmUrl });

    rdkitModulePromise = initPromise.then((instance: MainModule) => {
      if (typeof window !== 'undefined') {
        window.RDKit = instance;
      }
      return instance;
    });
  }

  return rdkitModulePromise;
};

/**
 * Converts a hex color (#2563eb) to a normalized [r, g, b, a] array for RDKit highlights.
 * Default alpha of 0.35 creates a soft translucent pastel halo that preserves bond lines.
 */
function hexToRgba(hex: string, alpha = 0.35): [number, number, number, number] {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return [0.145, 0.388, 0.921, alpha];
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return [r, g, b, alpha];
}

/**
 * Post-processes RDKit WASM SVG to achieve modern soft MedChem aesthetics:
 * - Rounded line caps & line joins for soft organic bond terminals
 * - Customizable soft bond strokes (from prop, CSS variable --structure-bond-stroke, or theme fallback)
 * - Removal of solid background rectangles for clean canvas transparency
 */
function postProcessSvg(rawSvg: string, theme: 'light' | 'dark' = 'light', bondStrokeColor?: string): string {
  if (!rawSvg) return '';
  let cleanSvg = rawSvg.replace(/^<\?xml[^>]*\?>/i, '').trim();

  // Strip XML comments
  cleanSvg = cleanSvg.replace(/<!--[\s\S]*?-->/g, '');

  // Remove harsh solid background rectangles to ensure canvas transparency
  cleanSvg = cleanSvg.replace(
    /<rect[^>]*style=['"][^'"]*fill:\s*(#ffffff|#fff|white|rgb\(255,\s*255,\s*255\))[^'"]*['"][^>]*>[\s\S]*?<\/rect>/gi,
    ''
  );
  cleanSvg = cleanSvg.replace(
    /<rect[^>]*style=['"][^'"]*fill:\s*(#ffffff|#fff|white|rgb\(255,\s*255,\s*255\))[^'"]*['"][^>]*\/>/gi,
    ''
  );
  cleanSvg = cleanSvg.replace(
    /<rect[^>]*fill=['"](#ffffff|#fff|white|rgb\(255,\s*255,\s*255\))['"][^>]*>[\s\S]*?<\/rect>/gi,
    ''
  );
  cleanSvg = cleanSvg.replace(
    /<rect[^>]*fill=['"](#ffffff|#fff|white|rgb\(255,\s*255,\s*255\))['"][^>]*\/?>/gi,
    ''
  );

  // Inject rounded line-caps and rounded line-joins into paths and lines for soft organic joints
  cleanSvg = cleanSvg.replace(/<path\s/gi, '<path stroke-linecap="round" stroke-linejoin="round" ');
  cleanSvg = cleanSvg.replace(/<line\s/gi, '<line stroke-linecap="round" stroke-linejoin="round" ');

  // Resolve bond stroke color:
  // 1. Direct prop passed (e.g. for live preview or explicit override)
  // 2. Read from CSS custom property --structure-bond-stroke
  // 3. Fallback based on theme
  const isDark = theme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  let resolvedStroke = bondStrokeColor?.trim();
  if (!resolvedStroke && typeof document !== 'undefined') {
    const cssVar = getComputedStyle(document.documentElement).getPropertyValue('--structure-bond-stroke').trim();
    if (cssVar) resolvedStroke = cssVar;
  }
  if (!resolvedStroke) {
    resolvedStroke = isDark ? '#e2e8f0' : '#475569';
  }

  // Soften bond strokes: replace default RDKit strokes/fills while keeping heteroatom colors intact
  cleanSvg = cleanSvg
    .replace(/stroke:\s*(#000000|#000\b|black|rgb\(0,\s*0,\s*0\)|#475569|#e2e8f0|#cbd5e1)/gi, `stroke: ${resolvedStroke}`)
    .replace(/stroke="*(#000000|#000\b|black|#475569|#e2e8f0|#cbd5e1)"*/gi, `stroke="${resolvedStroke}"`)
    .replace(/fill:\s*(#000000|#000\b|black|rgb\(0,\s*0,\s*0\)|#475569|#e2e8f0|#cbd5e1)/gi, `fill: ${resolvedStroke}`)
    .replace(/fill="*(#000000|#000\b|black|#475569|#e2e8f0|#cbd5e1)"*/gi, `fill="${resolvedStroke}"`);

  return cleanSvg;
}

export const SmilesCanvas: React.FC<SmilesCanvasProps> = ({
  smiles,
  molBlock,
  fallbackImageUrl,
  width = 280,
  height = 190,
  theme = 'light',
  bondStrokeColor,
  className = '',
  altText = 'Chemical Structure',
  activePharmacophores: activePharmacophoresProp,
  highlightSmarts = null,
  hoveredPharmacophore = null,
  highlightColor = '#2563eb',
  showToggleOption = false,
}) => {
  const [rdkit, setRdkit] = useState<MainModule | null>(() => {
    return typeof window !== 'undefined' && window.RDKit ? window.RDKit : null;
  });
  const [isWasmLoading, setIsWasmLoading] = useState<boolean>(!rdkit);
  const [svg, setSvg] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  // Consolidate all active highlights into an array of { smarts?: string; color: string; name?: string; id?: string }
  const activePharmacophores: { smarts?: string; color: string; name?: string; id?: string }[] = useMemo(() => {
    if (activePharmacophoresProp && activePharmacophoresProp.length > 0) {
      return activePharmacophoresProp
        .filter((item) => item && ((typeof item.smarts === 'string' && item.smarts.trim()) || item.name))
        .map((item, idx) => ({
          smarts: item.smarts?.trim(),
          color: item.color || ['#2563eb', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'][idx % 6],
          name: item.name || item.label,
          id: item.id,
        }));
    }

    const list: { smarts?: string; color: string; name?: string; id?: string }[] = [];

    if (highlightSmarts && highlightSmarts.trim()) {
      list.push({ smarts: highlightSmarts.trim(), color: highlightColor });
    }

    // Append hovered pharmacophore if provided and not already present
    if (hoveredPharmacophore) {
      const hSmarts = hoveredPharmacophore.smarts?.trim();
      const alreadyPresent = list.some(
        (item) => (hSmarts && item.smarts === hSmarts) || (item.id && item.id === hoveredPharmacophore.id)
      );
      if (!alreadyPresent) {
        list.push({
          smarts: hSmarts,
          color: highlightColor || '#60a5fa',
          name: hoveredPharmacophore.name,
          id: hoveredPharmacophore.id,
        });
      }
    }

    return list;
  }, [activePharmacophoresProp, highlightSmarts, hoveredPharmacophore, highlightColor]);

  // Serialized key to avoid redundant useEffect executions when array reference changes but content does not
  const activePharmacophoresKey = useMemo(
    () => JSON.stringify(activePharmacophores),
    [activePharmacophores]
  );

  // 1. Asynchronously initialize the RDKit WASM module
  useEffect(() => {
    let isMounted = true;

    if (rdkit) {
      setIsWasmLoading(false);
      return;
    }

    setIsWasmLoading(true);
    getRDKitInstance()
      .then((instance) => {
        if (isMounted) {
          setRdkit(instance);
          setIsWasmLoading(false);
        }
      })
      .catch((err) => {
        console.error('[SmilesCanvas] Failed to initialize RDKit module:', err);
        if (isMounted) {
          setHasError(true);
          setIsWasmLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [rdkit]);

  // 2. Render molecule and perform simultaneous multi-color SMARTS substructure highlighting
  useEffect(() => {
    if (!rdkit || (!smiles && !molBlock)) {
      setSvg('');
      return;
    }

    let mol: Mol | null = null;

    try {
      // Prioritize 2D PubChem MOL block if available to preserve PubChem coordinates & orientation
      if (molBlock && molBlock.trim()) {
        try {
          mol = rdkit.get_mol(molBlock.trim());
          if (mol && mol.is_valid()) {
            mol.remove_hs(); // Strips the explicit hydrogens to clean up the UI
            if (typeof (mol as any).remove_hs_in_place === 'function') {
              (mol as any).remove_hs_in_place();
            }
          }
        } catch (molErr) {
          console.warn('[SmilesCanvas] Failed to parse molBlock, falling back to SMILES:', molErr);
          mol = null;
        }
      }

      // Fallback to clean SMILES if molBlock is missing or invalid
      if (!mol || !mol.is_valid()) {
        if (!smiles) {
          throw new Error('No valid molBlock or SMILES provided');
        }

        const cleanSmiles = smiles.includes('.')
          ? smiles.split('.').reduce((a, b) => (a.length > b.length ? a : b)).trim()
          : smiles.trim();

        if (!cleanSmiles) {
          throw new Error('Empty SMILES string');
        }

        // Parse base molecule from SMILES
        mol = rdkit.get_mol(cleanSmiles);
      }

      if (!mol || !mol.is_valid()) {
        throw new Error(`Invalid molecule representation (molBlock or SMILES)`);
      }

      let rawSvg = '';

      const atomColors: Record<number, number[]> = {};
      const bondColors: Record<number, number[]> = {};
      const allAtoms = new Set<number>();
      const allBonds = new Set<number>();

      // Composite Reducer: Iterate and merge highlights across all active groups
      activePharmacophores.forEach((pharma) => {
        if (!mol) return;
        const candidateSmarts =
          getCorrectedSmarts(pharma.name || pharma.id, pharma.smarts || '') ||
          pharma.smarts ||
          '';

        if (!candidateSmarts.trim()) return;

        let qmol: Mol | null = null;
        try {
          qmol = rdkit.get_qmol(candidateSmarts.trim());

          // Fallback: if exact SMARTS parsing failed, attempt relaxed query
          if (!qmol || !qmol.is_valid()) {
            if (candidateSmarts.includes(':')) {
              try {
                qmol?.delete();
                qmol = rdkit.get_qmol(candidateSmarts.replace(/:/g, '~'));
              } catch {}
            }
          }

          if (qmol && qmol.is_valid()) {
            let matches: Array<{ atoms?: number[]; bonds?: number[] }> = [];

            // 1. Try multi-substructure matches to capture all instances (e.g. symmetrical rings or multiple fluorines)
            if (typeof (mol as any).get_substruct_matches === 'function') {
              try {
                const multiStr = (mol as any).get_substruct_matches(qmol);
                const parsed = JSON.parse(multiStr || '[]');
                if (Array.isArray(parsed) && parsed.length > 0) {
                  matches = parsed;
                }
              } catch {}
            }

            // 2. Fallback to single substructure match if multi-match was empty
            if (matches.length === 0) {
              const singleStr = mol.get_substruct_match(qmol);
              const singleObj = JSON.parse(singleStr || '{}');
              if (singleObj.atoms || singleObj.bonds) {
                matches = [singleObj];
              }
            }

            const rgba = hexToRgba(pharma.color || '#2563eb', 0.35);

            matches.forEach((matchObj) => {
              if (matchObj.atoms) {
                matchObj.atoms.forEach((idx: number) => {
                  allAtoms.add(idx);
                  atomColors[idx] = rgba;
                });
              }
              if (matchObj.bonds) {
                matchObj.bonds.forEach((idx: number) => {
                  allBonds.add(idx);
                  bondColors[idx] = rgba;
                });
              }
            });
          }
        } catch (smartsErr) {
          console.warn(`[SmilesCanvas] Substructure matching issue with pattern "${candidateSmarts}":`, smartsErr);
        } finally {
          if (qmol) {
            try {
              qmol.delete();
            } catch {}
          }
        }
      });

      // Refined Soft Modern MedChem drawing configuration
      const details = {
        width,
        height,
        bondLineWidth: 1.30,
        multipleBondOffset: 0.24,
        padding: 0.05,
        clearBackground: true,
        scaleBondWidth: false,
        addAtomIndices: false,
        addBondIndices: false,
        additionalAtomLabelPadding: 0.15,
        highlightRadius: 0.32,
        atoms: Array.from(allAtoms),
        bonds: Array.from(allBonds),
        highlightAtomColors: atomColors,
        highlightBondColors: bondColors,
        backgroundColour: [0, 0, 0, 0], // Guarantees transparent backdrop
      };

      if (allAtoms.size > 0 || allBonds.size > 0) {
        rawSvg = mol.get_svg_with_highlights(JSON.stringify(details));
      } else {
        try {
          rawSvg = mol.get_svg_with_highlights(JSON.stringify(details));
        } catch {
          rawSvg = mol.get_svg(width, height);
        }
      }

      if (rawSvg) {
        const cleanSvg = postProcessSvg(rawSvg, theme, bondStrokeColor);
        setSvg(cleanSvg);
        setHasError(false);
      } else {
        setHasError(true);
      }
    } catch (err) {
      console.warn('[SmilesCanvas] Render error:', err);
      setHasError(true);
    } finally {
      // Memory Management: Manual deletion of base molecule WASM object
      mol?.delete();
    }
  }, [rdkit, smiles, molBlock, activePharmacophoresKey, width, height, theme, bondStrokeColor]);

  const [imgLoadError, setImgLoadError] = useState(false);

  useEffect(() => {
    setImgLoadError(false);
  }, [fallbackImageUrl]);

  const isValidFallback =
    typeof fallbackImageUrl === 'string' &&
    fallbackImageUrl.trim().length > 0 &&
    fallbackImageUrl !== 'undefined' &&
    fallbackImageUrl !== 'null';

  const showSvg = !!svg && !hasError;
  const isGenerating = isWasmLoading || (!showSvg && !hasError && Boolean(smiles || molBlock));
  const showFallback = (!showSvg || hasError) && !isGenerating && isValidFallback && !imgLoadError;

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-lg overflow-hidden border shadow-2xs max-w-full transition-all ${
        activePharmacophores.length > 0
          ? 'border-blue-400/80 shadow-blue-500/15 shadow-md ring-1 ring-blue-400/30'
          : 'border-slate-200 dark:border-slate-800'
      } ${className}`}
      style={{
        minWidth: width ? Math.min(width, 120) : 120,
        minHeight: height ? Math.min(height, 100) : 100,
      }}
    >
      {activePharmacophores.length === 1 && (
        <div
          className="absolute top-1.5 right-1.5 text-white text-[10px] font-medium px-2 py-0.5 rounded-md shadow-xs z-10 pointer-events-none flex items-center gap-1.5 backdrop-blur-xs transition-all animate-in fade-in duration-150"
          style={{ backgroundColor: activePharmacophores[0].color || '#2563eb' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />
          <span className="truncate max-w-[170px] font-sans font-semibold">
            {activePharmacophores[0].name || `SMARTS: ${activePharmacophores[0].smarts}`}
          </span>
        </div>
      )}
      {activePharmacophores.length > 1 && (
        <div className="absolute top-1 right-1 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm z-10 flex items-center gap-1.5 pointer-events-none">
          <span className="font-semibold">{activePharmacophores.length} groups</span>
          <div className="flex items-center -space-x-1">
            {activePharmacophores.slice(0, 4).map((h, i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full border border-white"
                style={{ backgroundColor: h.color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* WASM Initializing or SVG Generating State (Loading Skeleton) */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center gap-2 p-4 text-slate-400 animate-pulse w-full h-full">
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-[11px] font-medium tracking-tight">
            {isWasmLoading ? 'Initializing Chem Engine...' : 'Rendering structure...'}
          </span>
        </div>
      )}

      {/* Render Trusted RDKit WASM SVG with Accessibility attributes & dynamic CSS styling preserved */}
      {!isGenerating && showSvg && (
        <div
          role="img"
          aria-label={smiles ? `${altText}: ${smiles}` : altText}
          className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto select-none"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}

      {/* Fallback Image strictly validated and guarded against load errors */}
      {!isGenerating && showFallback && (
        <img
          src={fallbackImageUrl}
          alt={altText}
          width={width}
          height={height}
          loading="lazy"
          onError={() => setImgLoadError(true)}
          className="rounded-lg aspect-square object-contain bg-white dark:bg-slate-900 p-2 max-w-full transition-all"
        />
      )}

      {/* Fallback Placeholder when both fail */}
      {!isGenerating && !showSvg && !showFallback && (
        <div className="flex flex-col items-center justify-center p-4 text-slate-400 text-xs w-full h-full">
          <span>Structure unavailable</span>
        </div>
      )}
    </div>
  );
};

export default SmilesCanvas;
