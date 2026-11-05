import React, { useRef, useEffect, useCallback } from 'react';
import { RotateCcw, Check, Sparkles } from 'lucide-react';
import { SmilesCanvas } from './SmilesCanvas';
import { DEFAULT_STRUCTURE_IMAGE_BG } from '../utils/storage';

export interface PastelColorWheelProps {
  value: string;
  onChange: (color: string) => void;
  theme?: 'light' | 'dark';
}

export interface PastelPreset {
  id: string;
  label: string;
  value: string;
  dotBg: string;
  borderColor: string;
}

export const PASTEL_PRESETS: PastelPreset[] = [
  {
    id: 'lavender',
    label: 'Lavender (Default)',
    value: 'hsl(286, 55%, 94%)',
    dotBg: 'hsl(286, 55%, 94%)',
    borderColor: '#c084fc',
  },
  {
    id: 'baby-blue',
    label: 'Baby Blue',
    value: 'hsl(204, 88%, 94%)',
    dotBg: 'hsl(204, 88%, 94%)',
    borderColor: '#60a5fa',
  },
  {
    id: 'light-yellow',
    label: 'Light Yellow',
    value: 'hsl(54, 92%, 88%)',
    dotBg: 'hsl(54, 92%, 88%)',
    borderColor: '#facc15',
  },
  {
    id: 'soft-mint',
    label: 'Soft Mint',
    value: 'hsl(142, 72%, 93%)',
    dotBg: 'hsl(142, 72%, 93%)',
    borderColor: '#4ade80',
  },
  {
    id: 'classic-white',
    label: 'Classic White',
    value: '#ffffff',
    dotBg: '#ffffff',
    borderColor: '#94a3b8',
  },
];

// Helper to check if two color strings match (normalizing whitespace/case)
function isColorEqual(c1: string, c2: string): boolean {
  return c1.replace(/\s+/g, '').toLowerCase() === c2.replace(/\s+/g, '').toLowerCase();
}

export const PastelColorWheel: React.FC<PastelColorWheelProps> = ({
  value,
  onChange,
  theme = 'light',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const wheelSize = 130;
  const radius = wheelSize / 2;

  // Render the circular pastel color wheel onto the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, wheelSize, wheelSize);

    // Draw circular pastel gradient
    const imageData = ctx.createImageData(wheelSize, wheelSize);
    const data = imageData.data;

    for (let y = 0; y < wheelSize; y++) {
      for (let x = 0; x < wheelSize; x++) {
        const dx = x - radius;
        const dy = y - radius;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const index = (y * wheelSize + x) * 4;

        if (dist <= radius) {
          // Angle in degrees [0, 360)
          let angle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (angle < 0) angle += 360;

          // Saturation increases from center (0%) to edge (65%)
          const saturation = Math.min(1, dist / radius) * 0.65;
          // Soft pastel lightness ~94%
          const lightness = 0.94;

          // Convert HSL to RGB
          const rgb = hslToRgb(angle / 360, saturation, lightness);

          data[index] = rgb[0];
          data[index + 1] = rgb[1];
          data[index + 2] = rgb[2];
          data[index + 3] = 255;
        } else {
          // Transparent outside circle
          data[index + 3] = 0;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw soft outer boundary ring
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 1, 0, Math.PI * 2);
    ctx.stroke();
  }, [radius, wheelSize]);

  // Handle color selection from wheel click/drag
  const handleWheelInteraction = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left - radius;
      const y = clientY - rect.top - radius;
      const dist = Math.sqrt(x * x + y * y);

      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      const hue = Math.round(angle);

      // Clamp saturation between 50% and 75% for ideal pastel softness
      const satRatio = Math.min(1, Math.max(0.2, dist / radius));
      const sat = Math.round(50 + satRatio * 25);
      const lightness = 94;

      const newColor = `hsl(${hue}, ${sat}%, ${lightness}%)`;
      onChange(newColor);
    },
    [radius, onChange]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    handleWheelInteraction(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    handleWheelInteraction(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      isDraggingRef.current = true;
      handleWheelInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || e.touches.length === 0) return;
    handleWheelInteraction(e.touches[0].clientX, e.touches[0].clientY);
  };

  const isDefaultSelected = isColorEqual(value, DEFAULT_STRUCTURE_IMAGE_BG);

  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Structure Image Background</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Pastel canvas tint behind 2D chemical structure bonds (Light mode)
          </p>
        </div>

        {!isDefaultSelected && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_STRUCTURE_IMAGE_BG)}
            className="flex items-center gap-1 text-[11px] font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
            title="Reset to Lavender default"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap gap-1.5">
        {PASTEL_PRESETS.map((preset) => {
          const isSelected = isColorEqual(value, preset.value);
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300 shadow-xs ring-1 ring-purple-400'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border shrink-0"
                style={{
                  backgroundColor: preset.dotBg,
                  borderColor: preset.borderColor,
                }}
              />
              <span>{preset.label}</span>
              {isSelected && <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />}
            </button>
          );
        })}
      </div>

      {/* Color Wheel & Live Preview Row */}
      <div className="flex items-center gap-4 bg-slate-50/80 dark:bg-slate-850/50 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
        {/* Interactive Canvas Wheel */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="relative group cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={wheelSize}
              height={wheelSize}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="rounded-full shadow-xs block touch-none"
              title="Click or drag to pick custom pastel tint"
            />
            {/* Color swatch badge */}
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
              style={{ backgroundColor: value }}
              title={`Active tint: ${value}`}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">Custom Pastel Wheel</span>
        </div>

        {/* Live Structure Preview */}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span>Live Sample Preview</span>
            <span className="text-[10px] font-normal text-slate-400">Aspirin</span>
          </div>
          <div
            className="w-full h-24 rounded-lg border border-slate-200/80 dark:border-slate-700 flex items-center justify-center overflow-hidden transition-colors shadow-2xs relative"
            style={{ backgroundColor: value }}
          >
            <SmilesCanvas
              smiles="CC(=O)Oc1ccccc1C(=O)O"
              width={96}
              height={96}
              theme={theme}
              className="w-24 h-24 object-contain"
            />
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 truncate">
            Tint applied inside image frame only
          </div>
        </div>
      </div>
    </div>
  );
};

// Standard HSL [0..1] to RGB [0..255] conversion
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let val = t;
      if (val < 0) val += 1;
      if (val > 1) val -= 1;
      if (val < 1 / 6) return p + (q - p) * 6 * val;
      if (val < 1 / 2) return q;
      if (val < 2 / 3) return p + (q - p) * (2 / 3 - val) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
