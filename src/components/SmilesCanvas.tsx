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
  cid?: number | string;
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

const SIMPLE_SPECTATOR_ION_RE =
  /^(\[Na\+\]|\[K\+\]|\[Li\+\]|\[Ca\+2\]|\[Mg\+2\]|\[Cl-\]|Cl|\[Br-\]|Br|\[I-\]|O|\[NH4\+\])$/;

const COORDINATION_METAL_RE = /\[(Fe|Co|Pt|Zn|Cu|Mn|Gd|Bi|Ru|Au|Ag)[^\]]*\]/;

/**
 * Strips simple spectator counterions and water of hydration from disconnected SMILES
 * without destroying multi-ligand inorganic coordination complexes (e.g. Sodium nitroprusside).
 */
export function stripSimpleCounterions(smiles: string): string {
  const trimmed = (smiles || '').trim();
  if (!trimmed.includes('.')) return trimmed;

  const parts = trimmed
    .split('.')
    .map((p) => p.trim())
    .filter(Boolean);
  const remaining = parts.filter((p) => !SIMPLE_SPECTATOR_ION_RE.test(p));

  if (remaining.length === 0) return trimmed;
  if (remaining.length === 1) return remaining[0];

  if (remaining.some((p) => COORDINATION_METAL_RE.test(p))) {
    return remaining.join('.');
  }

  return remaining.reduce((a, b) => (a.length >= b.length ? a : b));
}

function findSubstructMatchesForSmarts(
  rdkit: MainModule,
  mol: Mol,
  rawQuery: string
): Array<{ atoms?: number[]; bonds?: number[] }> {
  const query = (rawQuery || '').trim();
  if (!query) return [];

  const runSingleQuery = (smartsStr: string): Array<{ atoms?: number[]; bonds?: number[] }> => {
    let qmol: Mol | null = null;
    try {
      qmol = rdkit.get_qmol(smartsStr);
      if ((!qmol || !qmol.is_valid()) && smartsStr.includes(':')) {
        qmol?.delete();
        qmol = rdkit.get_qmol(smartsStr.replace(/:/g, '~'));
      }
      if (!qmol || !qmol.is_valid()) return [];

      let found: Array<{ atoms?: number[]; bonds?: number[] }> = [];
      if (typeof (mol as any).get_substruct_matches === 'function') {
        try {
          const multiStr = (mol as any).get_substruct_matches(qmol);
          const parsed = JSON.parse(multiStr || '[]');
          if (Array.isArray(parsed) && parsed.length > 0) {
            found = parsed.filter((m) => (m.atoms && m.atoms.length > 0) || (m.bonds && m.bonds.length > 0));
          }
        } catch {}
      }

      if (found.length === 0) {
        const singleStr = mol.get_substruct_match(qmol);
        const singleObj = JSON.parse(singleStr || '{}');
        if ((singleObj.atoms && singleObj.atoms.length > 0) || (singleObj.bonds && singleObj.bonds.length > 0)) {
          found = [singleObj];
        }
      }

      if (found.length === 0 && (smartsStr.includes('=') || smartsStr.includes(':'))) {
        let relaxedQmol: Mol | null = null;
        try {
          const relaxedSmarts = smartsStr.replace(/[:=]/g, '~');
          relaxedQmol = rdkit.get_qmol(relaxedSmarts);
          if (relaxedQmol && relaxedQmol.is_valid()) {
            const relaxedStr = mol.get_substruct_match(relaxedQmol);
            const relaxedObj = JSON.parse(relaxedStr || '{}');
            if ((relaxedObj.atoms && relaxedObj.atoms.length > 0) || (relaxedObj.bonds && relaxedObj.bonds.length > 0)) {
              found = [relaxedObj];
            }
          }
        } catch {} finally {
          relaxedQmol?.delete();
        }
      }

      return found;
    } catch {
      return [];
    } finally {
      try {
        qmol?.delete();
      } catch {}
    }
  };

  const direct = runSingleQuery(query);
  if (direct.length > 0) return direct;

  // Acyclic molecule fallback when ring-scaffold wildcard '[*;R]' finds 0 ring atoms
  if (query === '[*;R]') {
    return runSingleQuery('[*]');
  }

  return [];
}

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

  // Remove all background rectangles to ensure 100% canvas transparency
  // RDKit MinimalLib only generates <rect> for the canvas background (fill: #ffffff, #00000000, etc.)
  cleanSvg = cleanSvg.replace(/<rect[\s\S]*?<\/rect>/gi, '');
  cleanSvg = cleanSvg.replace(/<rect[^>]*\/>/gi, '');

  // Inject rounded line-caps and rounded line-joins into paths and lines for soft organic joints
  cleanSvg = cleanSvg.replace(/<path\s/gi, '<path stroke-linecap="round" stroke-linejoin="round" ');
  cleanSvg = cleanSvg.replace(/<line\s/gi, '<line stroke-linecap="round" stroke-linejoin="round" ');

  // Sanitize inline style stroke-linecap and stroke-linejoin so inline butt/miter does not override presentation attributes
  cleanSvg = cleanSvg
    .replace(/stroke-linecap:\s*butt/gi, 'stroke-linecap:round')
    .replace(/stroke-linejoin:\s*miter/gi, 'stroke-linejoin:round');

  // Resolve bond stroke color:
  // 1. Direct prop passed (e.g. for live preview or explicit override)
  // 2. CSS custom property fallback var(--structure-bond-stroke, ...) so all SVGs dynamically update on theme/setting change without remounting
  const isDark = theme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  const fallbackColor = isDark ? '#e2e8f0' : '#475569';
  const resolvedStroke = bondStrokeColor?.trim() || `var(--structure-bond-stroke, ${fallbackColor})`;

  // Soften bond strokes: replace default RDKit strokes/fills while keeping heteroatom colors intact
  cleanSvg = cleanSvg
    .replace(/stroke:\s*(#000000(?![0-9a-fA-F])|#000\b|black|rgb\(0,\s*0,\s*0\)|#475569|#e2e8f0|#cbd5e1)/gi, `stroke: ${resolvedStroke}`)
    .replace(/stroke=['"]*(#000000(?![0-9a-fA-F])|#000\b|black|#475569|#e2e8f0|#cbd5e1)['"]*/gi, `stroke="${resolvedStroke}"`)
    .replace(/fill:\s*(#000000(?![0-9a-fA-F])|#000\b|black|rgb\(0,\s*0,\s*0\)|#475569|#e2e8f0|#cbd5e1)/gi, `fill: ${resolvedStroke}`)
    .replace(/fill=['"]*(#000000(?![0-9a-fA-F])|#000\b|black|#475569|#e2e8f0|#cbd5e1)['"]*/gi, `fill="${resolvedStroke}"`);

  return cleanSvg;
}

export const SmilesCanvas: React.FC<SmilesCanvasProps> = ({
  smiles,
  molBlock,
  fallbackImageUrl,
  cid,
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
            const strippedMolBlock = mol.remove_hs(); // Strips explicit hydrogens to clean up the UI
            if (typeof (mol as any).remove_hs_in_place === 'function') {
              (mol as any).remove_hs_in_place();
            } else if (typeof strippedMolBlock === 'string' && strippedMolBlock.trim()) {
              mol.delete();
              mol = rdkit.get_mol(strippedMolBlock);
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

        const cleanSmiles = stripSimpleCounterions(smiles);

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
        const rawFallbackSmarts = (pharma.smarts || '').trim();
        const correctedSmarts = getCorrectedSmarts(pharma.name || pharma.id, rawFallbackSmarts).trim();
        const primarySmarts = correctedSmarts || rawFallbackSmarts;

        if (!primarySmarts) return;

        let matches = findSubstructMatchesForSmarts(rdkit, mol, primarySmarts);
        if (matches.length === 0 && rawFallbackSmarts && rawFallbackSmarts !== primarySmarts) {
          matches = findSubstructMatchesForSmarts(rdkit, mol, rawFallbackSmarts);
        }

        if (matches.length > 0) {
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

  const effectiveFallbackUrl = useMemo(() => {
    if (
      typeof fallbackImageUrl === 'string' &&
      fallbackImageUrl.trim().length > 0 &&
      fallbackImageUrl !== 'undefined' &&
      fallbackImageUrl !== 'null'
    ) {
      return fallbackImageUrl.trim();
    }
    if (cid) {
      const num = Number(cid);
      if (!isNaN(num) && num > 0) {
        return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${num}/PNG?image_size=large`;
      }
    }
    return undefined;
  }, [fallbackImageUrl, cid]);

  const [imgLoadError, setImgLoadError] = useState(false);

  useEffect(() => {
    setImgLoadError(false);
  }, [effectiveFallbackUrl]);

  const isValidFallback = Boolean(effectiveFallbackUrl);

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
      {!isGenerating && showFallback && effectiveFallbackUrl && (
        <img
          src={effectiveFallbackUrl}
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
