import React, { useEffect, useRef, useState } from 'react';
import SmilesDrawer from 'smiles-drawer';
import { PharmacophoreGroup } from '../types/reviewModule';

interface SmilesCanvasProps {
  smiles?: string;
  fallbackImageUrl?: string;
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  className?: string;
  altText?: string;
  highlightSmarts?: string | null;
  hoveredPharmacophore?: PharmacophoreGroup | null;
}

export const SmilesCanvas: React.FC<SmilesCanvasProps> = ({
  smiles,
  fallbackImageUrl,
  width = 280,
  height = 190,
  theme = 'light',
  className = '',
  altText = 'Chemical Structure',
  highlightSmarts = null,
  hoveredPharmacophore = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawSuccess, setDrawSuccess] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<'canvas' | 'pubchem_png'>(
    smiles ? 'canvas' : 'pubchem_png'
  );

  const effectiveSmarts = highlightSmarts || hoveredPharmacophore?.smarts || null;

  useEffect(() => {
    if (!smiles || !canvasRef.current || drawerMode !== 'canvas') {
      setDrawSuccess(false);
      return;
    }

    try {
      const drawer = new SmilesDrawer.Drawer({
        width,
        height,
        bondThickness: 1.5,
        bondLength: 15,
        shortBondLength: 0.85,
        bondSpacing: 0.18 * 15,
        atomVisualization: 'default',
        isomeric: true,
        terminalCarbons: true,
        explicitHydrogens: false,
        overlapSensitivity: 0.42,
        compactDrawing: false,
        fontSizeLarge: 7,
        fontSizeSmall: 5,
        padding: 16,
      });

      SmilesDrawer.parse(
        smiles,
        (tree) => {
          if (canvasRef.current) {
            drawer.draw(tree, canvasRef.current, theme === 'dark' ? 'dark' : 'light');
            setDrawSuccess(true);
          }
        },
        (err) => {
          console.warn('[SmilesCanvas] SMILES parse error, falling back to PNG:', err);
          setDrawSuccess(false);
          setDrawerMode('pubchem_png');
        }
      );
    } catch (e) {
      console.warn('[SmilesCanvas] Draw error:', e);
      setDrawSuccess(false);
      setDrawerMode('pubchem_png');
    }
  }, [smiles, width, height, theme, drawerMode, effectiveSmarts]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 1. Interactive SmilesDrawer Canvas */}
      {drawerMode === 'canvas' && smiles && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={`rounded-lg bg-white dark:bg-slate-900 border shadow-2xs max-w-full transition-all ${
            effectiveSmarts
              ? 'border-blue-500 shadow-blue-500/20 shadow-md ring-2 ring-blue-400/40'
              : 'border-slate-200 dark:border-slate-800'
          }`}
        />
      )}

      {/* 2. Fallback PubChem Cached Image */}
      {(drawerMode === 'pubchem_png' || !drawSuccess) && fallbackImageUrl && (
        <img
          src={fallbackImageUrl}
          alt={altText}
          width={width}
          height={height}
          loading="lazy"
          className={`rounded-lg aspect-square object-contain bg-white dark:bg-slate-900 border shadow-2xs p-2 max-w-full transition-all ${
            effectiveSmarts
              ? 'border-blue-500 shadow-blue-500/20 shadow-md ring-2 ring-blue-400/40'
              : 'border-slate-200 dark:border-slate-800'
          }`}
        />
      )}

      {/* Switch between Canvas and PubChem PNG if both are available */}
      {smiles && fallbackImageUrl && (
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => setDrawerMode(drawerMode === 'canvas' ? 'pubchem_png' : 'canvas')}
            className="hover:text-blue-600 dark:hover:text-blue-400 underline cursor-pointer"
          >
            {drawerMode === 'canvas' ? 'Show PubChem Depiction' : 'Show SmilesDrawer Canvas'}
          </button>
        </div>
      )}
    </div>
  );
};
