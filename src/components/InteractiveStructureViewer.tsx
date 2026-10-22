import React, { useState, useEffect, useRef } from 'react';
import { ChemicalStructure, PharmacophoreGroup } from '../types/reviewModule';
import {
  getPharmacophoresForStructure,
  resolvePharmacophoreRegion,
  PHARMACOPHORE_COLOR_PALETTE,
  ColorPaletteItem,
} from '../utils/pharmacophoreData';

interface InteractiveStructureViewerProps {
  structure: ChemicalStructure;
  activePharmacophoreIds: Record<string, ColorPaletteItem>; // tagId -> ColorPaletteItem
  hoveredPharmacophoreId: string | null;
  onTogglePharmacophore?: (group: PharmacophoreGroup) => void;
  onHoverPharmacophore?: (id: string | null) => void;
  zoomLevel?: number; // 100 - 250
  pan?: { x: number; y: number };
  maxHeightClass?: string;
  className?: string;
  altText?: string;
  isExpanded?: boolean; // Only enable hover-highlighting directly on image zones when expanded!
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16),
    };
  }
  return {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  };
}

export const InteractiveStructureViewer: React.FC<InteractiveStructureViewerProps> = ({
  structure,
  activePharmacophoreIds,
  hoveredPharmacophoreId,
  onTogglePharmacophore,
  onHoverPharmacophore,
  zoomLevel = 100,
  pan = { x: 0, y: 0 },
  maxHeightClass = 'max-h-56',
  className = '',
  altText,
  isExpanded = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const pharmacophores = getPharmacophoresForStructure(structure);
  const hoveredGroup = hoveredPharmacophoreId
    ? pharmacophores.find((g) => g.id === hoveredPharmacophoreId)
    : null;

  // Load and cache base image with CORS-safe proxy support
  useEffect(() => {
    setImageError(false);
    setIsImageLoaded(false);

    const proxyUrl = `/api/structure-image?url=${encodeURIComponent(structure.pngUrl)}`;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      baseImageRef.current = img;
      setIsImageLoaded(true);
    };

    img.onerror = () => {
      // Fallback directly to original pngUrl if proxy had an issue
      if (img.src !== structure.pngUrl) {
        img.src = structure.pngUrl;
      } else {
        setImageError(true);
        setIsImageLoaded(false);
      }
    };

    img.src = proxyUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [structure.pngUrl]);

  // Redraw canvas and recolor chemical lines whenever active/hovered groups change
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = baseImageRef.current;
    if (!canvas || !img || !isImageLoaded) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas dimensions strictly to image dimensions
    const width = img.naturalWidth || 500;
    const height = img.naturalHeight || 500;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    // 1. Draw base clean chemical structure
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    // 2. Identify all active or hovered pharmacophore groups in SELECTION RECENCY ORDER
    const pharmaMap = new Map<string, PharmacophoreGroup>();
    pharmacophores.forEach((g, idx) => {
      const resolved = g.region
        ? g
        : { ...g, region: resolvePharmacophoreRegion(g, idx, pharmacophores.length) };
      pharmaMap.set(g.id, resolved);
    });

    const highlightedGroups: Array<{ group: PharmacophoreGroup; color: ColorPaletteItem }> = [];

    // First add active pinned groups in order of selection (insertion order in activePharmacophoreIds)
    Object.entries(activePharmacophoreIds).forEach(([id, color]) => {
      if (id === hoveredPharmacophoreId) return; // will be appended last for top priority
      const g = pharmaMap.get(id);
      if (g) {
        highlightedGroups.push({ group: g, color });
      }
    });

    // Append hovered group last so its color takes highest precedence over active pins
    if (hoveredPharmacophoreId) {
      const g = pharmaMap.get(hoveredPharmacophoreId);
      if (g) {
        const activeColor = activePharmacophoreIds[hoveredPharmacophoreId];
        highlightedGroups.push({
          group: g,
          color: activeColor || PHARMACOPHORE_COLOR_PALETTE[0],
        });
      }
    }

    if (highlightedGroups.length === 0) return;

    // 3. Strict line & atom recoloring engine (Zero background/ring interior shading)
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // Structure pixel filter: PubChem background is off-white/white (r >= 238, g >= 238, b >= 238 with balanced channels)
      // Structure lines (black bonds) and heteroatoms (N=blue, O=red, S=yellow, Cl=green, F=cyan) are not background
      const isStructurePixel = (r: number, g: number, b: number) => {
        const isBg = r >= 238 && g >= 238 && b >= 238 && Math.abs(r - g) <= 12 && Math.abs(g - b) <= 12;
        return !isBg;
      };

      highlightedGroups.forEach(({ group, color }) => {
        if (!group.region) return;
        const rgb = hexToRgb(color.pinBg || color.hex);

        const x0 = Math.max(0, Math.floor((group.region.x * width) / 100));
        const y0 = Math.max(0, Math.floor((group.region.y * height) / 100));
        const x1 = Math.min(width, Math.ceil(((group.region.x + group.region.width) * width) / 100));
        const y1 = Math.min(height, Math.ceil(((group.region.y + group.region.height) * height) / 100));

        for (let y = y0; y < y1; y++) {
          const rowOffset = y * width;
          for (let x = x0; x < x1; x++) {
            const idx = (rowOffset + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            if (a < 30) continue; // transparent pixel

            // STRICTLY RECOLOR ONLY STRUCTURE LINES AND ATOM LABELS (Zero interior/background tinting)
            if (!isStructurePixel(r, g, b)) {
              continue;
            }

            // Calculate darkness/luminance for smooth anti-aliased edge blending
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const darkness = 1 - luminance / 255;

            if (darkness >= 0.24) {
              // Solid core of bond line or atom symbol
              data[idx] = rgb.r;
              data[idx + 1] = rgb.g;
              data[idx + 2] = rgb.b;
            } else {
              // Smooth anti-aliased edge blending with original pixel
              const t = Math.max(0, Math.min(1, darkness / 0.24));
              data[idx] = Math.round(r * (1 - t) + rgb.r * t);
              data[idx + 1] = Math.round(g * (1 - t) + rgb.g * t);
              data[idx + 2] = Math.round(b * (1 - t) + rgb.b * t);
            }
          }
        }
      });

      ctx.putImageData(imgData, 0, 0);
    } catch {
      // Graceful fallback
    }
  }, [isImageLoaded, activePharmacophoreIds, hoveredPharmacophoreId, pharmacophores]);

  // Compute transform styles
  const isZoomed = zoomLevel > 100 || pan.x !== 0 || pan.y !== 0;
  const transformStyle: React.CSSProperties = isZoomed
    ? {
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel / 100})`,
        transformOrigin: 'center center',
        transition: 'transform 0.1s ease-out',
      }
    : {
        transform: 'none',
      };

  return (
    <div
      className={`relative w-full flex items-center justify-center overflow-hidden select-none bg-white rounded-xl ${className}`}
    >
      <div
        className={`relative inline-flex items-center justify-center max-w-full aspect-square bg-white rounded-lg ${maxHeightClass}`}
        style={transformStyle}
      >
        {/* High-Performance Canvas for Direct Chemical Structure Line Recoloring */}
        {!imageError ? (
          <>
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain block mx-auto aspect-square select-none pointer-events-none bg-white"
            />
            {/* Fallback Image while canvas loads */}
            {!isImageLoaded && (
              <img
                src={`/api/structure-image?url=${encodeURIComponent(structure.pngUrl)}`}
                alt={altText || `${structure.name} 2D chemical structure`}
                width="320"
                height="320"
                loading="lazy"
                crossOrigin="anonymous"
                className="w-full h-full aspect-square object-contain block mx-auto select-none pointer-events-none bg-white absolute inset-0"
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-slate-400">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {structure.name}
            </span>
            <span className="text-[10px] font-mono mt-1">PubChem CID: {structure.cid}</span>
          </div>
        )}

        {/* Interactive Click & Hover Hit Zones (Zero On-Image Popups) */}
        {!imageError &&
          pharmacophores.map((group, idx) => {
            const region =
              group.region || resolvePharmacophoreRegion(group, idx, pharmacophores.length);
            const isHovered = hoveredPharmacophoreId === group.id;
            const activeColor = activePharmacophoreIds[group.id];
            const isHighlighted = Boolean(activeColor) || isHovered;

            return (
              <div
                key={group.id}
                onClick={(e) => {
                  if (!isExpanded) return;
                  e.stopPropagation();
                  if (onTogglePharmacophore) onTogglePharmacophore(group);
                }}
                onMouseEnter={() => {
                  if (!isExpanded) return;
                  if (onHoverPharmacophore) onHoverPharmacophore(group.id);
                }}
                onMouseLeave={() => {
                  if (!isExpanded) return;
                  if (onHoverPharmacophore) onHoverPharmacophore(null);
                }}
                className={`absolute box-border ${
                  isExpanded
                    ? 'cursor-pointer pointer-events-auto'
                    : 'pointer-events-none'
                }`}
                style={{
                  left: `${region.x}%`,
                  top: `${region.y}%`,
                  width: `${region.width}%`,
                  height: `${region.height}%`,
                  zIndex: isHighlighted ? 25 : 5,
                }}
              />
            );
          })}
      </div>
    </div>
  );
};
