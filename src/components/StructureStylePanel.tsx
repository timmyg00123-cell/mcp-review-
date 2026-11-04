import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Sun, Moon, RotateCcw, Check, Lock, Unlock, Palette, Sliders, Eye } from 'lucide-react';
import { SmilesCanvas } from './SmilesCanvas';
import {
  DEFAULT_STRUCTURE_IMAGE_BG,
  DEFAULT_STRUCTURE_IMAGE_DARK_BG,
  DEFAULT_STRUCTURE_LOCK_OBSIDIAN,
  DEFAULT_BOND_LIGHT_COLOR,
  DEFAULT_BOND_DARK_COLOR,
} from '../utils/storage';

export interface StructureStylePanelProps {
  theme: 'light' | 'dark';
  structureImageBg: string;
  onUpdateStructureImageBg: (color: string) => void;
  structureImageDarkBg: string;
  onUpdateStructureImageDarkBg: (color: string) => void;
  lockObsidian: boolean;
  onToggleLockObsidian: (locked: boolean) => void;
  bondLightColor: string;
  onUpdateBondLightColor: (color: string) => void;
  bondDarkColor: string;
  onUpdateBondDarkColor: (color: string) => void;
}

interface ColorPreset {
  id: string;
  label: string;
  value: string;
  dotBg: string;
  border: string;
}

const LIGHT_BG_PRESETS: ColorPreset[] = [
  { id: 'lavender', label: 'Lavender (Default)', value: 'hsl(286, 55%, 94%)', dotBg: 'hsl(286, 55%, 94%)', border: '#c084fc' },
  { id: 'baby-blue', label: 'Baby Blue', value: 'hsl(204, 88%, 94%)', dotBg: 'hsl(204, 88%, 94%)', border: '#60a5fa' },
  { id: 'light-yellow', label: 'Light Yellow', value: 'hsl(54, 92%, 88%)', dotBg: 'hsl(54, 92%, 88%)', border: '#facc15' },
  { id: 'soft-mint', label: 'Soft Mint', value: 'hsl(142, 72%, 93%)', dotBg: 'hsl(142, 72%, 93%)', border: '#4ade80' },
  { id: 'classic-white', label: 'Classic White', value: '#ffffff', dotBg: '#ffffff', border: '#94a3b8' },
];

const LIGHT_BOND_PRESETS: ColorPreset[] = [
  { id: 'slate-600', label: 'Slate-600 (Default)', value: '#475569', dotBg: '#475569', border: '#94a3b8' },
  { id: 'charcoal', label: 'Charcoal', value: '#334155', dotBg: '#334155', border: '#64748b' },
  { id: 'navy', label: 'Deep Navy', value: '#1e3a5f', dotBg: '#1e3a5f', border: '#3b82f6' },
  { id: 'forest', label: 'Forest Green', value: '#14532d', dotBg: '#14532d', border: '#22c55e' },
  { id: 'indigo', label: 'Royal Indigo', value: '#3730a3', dotBg: '#3730a3', border: '#6366f1' },
  { id: 'obsidian', label: 'Deep Obsidian', value: '#0f172a', dotBg: '#0f172a', border: '#475569' },
];

const DARK_BG_PRESETS: ColorPreset[] = [
  { id: 'slate-navy', label: 'Deep Slate-Navy (Default)', value: 'hsl(222, 47%, 14%)', dotBg: 'hsl(222, 47%, 14%)', border: '#3b82f6' },
  { id: 'obsidian', label: 'Obsidian Slate', value: '#0f172a', dotBg: '#0f172a', border: '#64748b' },
  { id: 'amethyst', label: 'Dark Amethyst', value: 'hsl(275, 45%, 12%)', dotBg: 'hsl(275, 45%, 12%)', border: '#a855f7' },
  { id: 'midnight-teal', label: 'Midnight Teal', value: 'hsl(180, 45%, 11%)', dotBg: 'hsl(180, 45%, 11%)', border: '#14b8a6' },
  { id: 'pitch-black', label: 'Pitch Black', value: '#000000', dotBg: '#000000', border: '#475569' },
];

const DARK_BOND_PRESETS: ColorPreset[] = [
  { id: 'slate-200', label: 'Slate-200 (Default)', value: '#e2e8f0', dotBg: '#e2e8f0', border: '#cbd5e1' },
  { id: 'crisp-white', label: 'Crisp White', value: '#ffffff', dotBg: '#ffffff', border: '#e2e8f0' },
  { id: 'soft-cyan', label: 'Soft Cyan', value: '#a5f3fc', dotBg: '#a5f3fc', border: '#38bdf8' },
  { id: 'mint-glow', label: 'Mint Glow', value: '#a7f3d0', dotBg: '#a7f3d0', border: '#34d399' },
  { id: 'lavender-glow', label: 'Pastel Lavender', value: '#e9d5ff', dotBg: '#e9d5ff', border: '#c084fc' },
  { id: 'warm-gold', label: 'Warm Gold', value: '#fef08a', dotBg: '#fef08a', border: '#facc15' },
];

function isColorEqual(c1: string, c2: string): boolean {
  return c1.replace(/\s+/g, '').toLowerCase() === c2.replace(/\s+/g, '').toLowerCase();
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tNorm = t;
      if (tNorm < 0) tNorm += 1;
      if (tNorm > 1) tNorm -= 1;
      if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
      if (tNorm < 1 / 2) return q;
      if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
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

function parseColorToHsl(colorStr: string, mode: 'light' | 'dark'): { h: number; s: number; l: number } {
  const defaultLightness = mode === 'light' ? 38 : 88;
  const hslMatch = colorStr.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i);
  if (hslMatch) {
    return {
      h: parseInt(hslMatch[1], 10),
      s: parseInt(hslMatch[2], 10),
      l: parseInt(hslMatch[3], 10),
    };
  }

  // Handle Hex colors (#475569, #e2e8f0, #ffffff, etc.)
  const hex = colorStr.replace('#', '').trim();
  if (hex.length === 3 || hex.length === 6) {
    let fullHex = hex;
    if (hex.length === 3) {
      fullHex = hex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(fullHex, 16);
    if (!isNaN(num)) {
      const r = ((num >> 16) & 255) / 255;
      const g = ((num >> 8) & 255) / 255;
      const b = (num & 255) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
      };
    }
  }

  return { h: 215, s: mode === 'light' ? 20 : 15, l: defaultLightness };
}

export const StructureStylePanel: React.FC<StructureStylePanelProps> = ({
  theme,
  structureImageBg,
  onUpdateStructureImageBg,
  structureImageDarkBg,
  onUpdateStructureImageDarkBg,
  lockObsidian,
  onToggleLockObsidian,
  bondLightColor,
  onUpdateBondLightColor,
  bondDarkColor,
  onUpdateBondDarkColor,
}) => {
  const [activeTab, setActiveTab] = useState<'light' | 'dark'>(() => theme);

  // Background Wheel refs & state
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isBgDraggingRef = useRef<boolean>(false);

  // Bond Wheel refs & state
  const bondCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isBondDraggingRef = useRef<boolean>(false);

  const wheelSize = 110;
  const radius = wheelSize / 2;

  // Derive current bond HSL components for the active tab
  const activeBondColor = activeTab === 'light' ? bondLightColor : bondDarkColor;
  const activeBondHsl = useMemo(() => {
    return parseColorToHsl(activeBondColor, activeTab);
  }, [activeBondColor, activeTab]);

  const [bondSaturation, setBondSaturation] = useState<number>(activeBondHsl.s);

  // Sync internal slider value whenever activeBondHsl changes
  useEffect(() => {
    setBondSaturation(activeBondHsl.s);
  }, [activeBondHsl.s]);

  // Draw Background Color Wheel (Soft pastel lightness for light tab, deep rich dark lightness for dark tab)
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, wheelSize, wheelSize);
    const imageData = ctx.createImageData(wheelSize, wheelSize);
    const data = imageData.data;

    const lightness = activeTab === 'light' ? 0.94 : 0.14;
    const maxSat = activeTab === 'light' ? 0.65 : 0.55;

    for (let y = 0; y < wheelSize; y++) {
      for (let x = 0; x < wheelSize; x++) {
        const dx = x - radius;
        const dy = y - radius;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const index = (y * wheelSize + x) * 4;

        if (dist <= radius) {
          let angle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (angle < 0) angle += 360;

          const sat = Math.min(1, dist / radius) * maxSat;
          const rgb = hslToRgb(angle / 360, sat, lightness);

          data[index] = rgb[0];
          data[index + 1] = rgb[1];
          data[index + 2] = rgb[2];
          data[index + 3] = 255;
        } else {
          data[index + 3] = 0;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    ctx.strokeStyle = activeTab === 'light' ? 'rgba(148, 163, 184, 0.4)' : 'rgba(71, 85, 105, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 1, 0, Math.PI * 2);
    ctx.stroke();
  }, [activeTab, radius, wheelSize]);

  // Draw Bond Stroke Color Wheel (Full spectrum hue wheel)
  useEffect(() => {
    const canvas = bondCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, wheelSize, wheelSize);
    const imageData = ctx.createImageData(wheelSize, wheelSize);
    const data = imageData.data;

    const baseLightness = activeTab === 'light' ? 0.38 : 0.88;

    for (let y = 0; y < wheelSize; y++) {
      for (let x = 0; x < wheelSize; x++) {
        const dx = x - radius;
        const dy = y - radius;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const index = (y * wheelSize + x) * 4;

        if (dist <= radius) {
          let angle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (angle < 0) angle += 360;

          const sat = Math.min(1, dist / radius);
          const rgb = hslToRgb(angle / 360, sat, baseLightness);

          data[index] = rgb[0];
          data[index + 1] = rgb[1];
          data[index + 2] = rgb[2];
          data[index + 3] = 255;
        } else {
          data[index + 3] = 0;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    ctx.strokeStyle = activeTab === 'light' ? 'rgba(148, 163, 184, 0.4)' : 'rgba(71, 85, 105, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 1, 0, Math.PI * 2);
    ctx.stroke();
  }, [activeTab, radius, wheelSize]);

  // Handle Background Wheel Interaction
  const handleBgWheelInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (activeTab === 'dark' && lockObsidian) return;
      const canvas = bgCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left - radius;
      const y = clientY - rect.top - radius;
      const dist = Math.sqrt(x * x + y * y);

      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      const hue = Math.round(angle);

      if (activeTab === 'light') {
        const satRatio = Math.min(1, Math.max(0.2, dist / radius));
        const sat = Math.round(50 + satRatio * 25);
        const lightness = 94;
        const newColor = `hsl(${hue}, ${sat}%, ${lightness}%)`;
        onUpdateStructureImageBg(newColor);
      } else {
        const satRatio = Math.min(1, Math.max(0.15, dist / radius));
        const sat = Math.round(35 + satRatio * 25);
        const lightness = 14;
        const newColor = `hsl(${hue}, ${sat}%, ${lightness}%)`;
        onUpdateStructureImageDarkBg(newColor);
      }
    },
    [activeTab, lockObsidian, radius, onUpdateStructureImageBg, onUpdateStructureImageDarkBg]
  );

  // Handle Bond Stroke Wheel Interaction
  const handleBondWheelInteraction = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = bondCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left - radius;
      const y = clientY - rect.top - radius;

      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      const hue = Math.round(angle);

      // If saturation is currently 0 (e.g. user selected monochrome preset), bumping saturation to 70%
      // ensures that clicking/dragging the hue wheel is visually active and responsive rather than staying stuck on gray/white
      const effectiveSat = bondSaturation === 0 ? 70 : bondSaturation;
      if (bondSaturation === 0) {
        setBondSaturation(70);
      }

      const lightness = activeTab === 'light' ? 38 : 88;
      const newColor = `hsl(${hue}, ${effectiveSat}%, ${lightness}%)`;

      if (activeTab === 'light') {
        onUpdateBondLightColor(newColor);
      } else {
        onUpdateBondDarkColor(newColor);
      }
    },
    [activeTab, bondSaturation, radius, onUpdateBondLightColor, onUpdateBondDarkColor]
  );

  // Handle Saturation Slider Change
  const handleSaturationChange = (newSat: number) => {
    setBondSaturation(newSat);
    const lightness = activeTab === 'light' ? 38 : 88;
    const newColor = `hsl(${activeBondHsl.h}, ${newSat}%, ${lightness}%)`;

    if (activeTab === 'light') {
      onUpdateBondLightColor(newColor);
    } else {
      onUpdateBondDarkColor(newColor);
    }
  };

  // Reset Handlers
  const handleResetLight = () => {
    onUpdateStructureImageBg(DEFAULT_STRUCTURE_IMAGE_BG);
    onUpdateBondLightColor(DEFAULT_BOND_LIGHT_COLOR);
  };

  const handleResetDark = () => {
    onUpdateStructureImageDarkBg(DEFAULT_STRUCTURE_IMAGE_DARK_BG);
    onToggleLockObsidian(DEFAULT_STRUCTURE_LOCK_OBSIDIAN);
    onUpdateBondDarkColor(DEFAULT_BOND_DARK_COLOR);
  };

  // Preview effective background color
  const livePreviewBg =
    activeTab === 'light'
      ? structureImageBg
      : lockObsidian
        ? '#0f172a'
        : structureImageDarkBg;

  const livePreviewBondStroke = activeTab === 'light' ? bondLightColor : bondDarkColor;

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('light')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'light'
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Light Mode</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dark')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'dark'
              ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
          <span>Dark Mode</span>
        </button>

        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={activeTab === 'light' ? handleResetLight : handleResetDark}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Reset ${activeTab === 'light' ? 'Light' : 'Dark'} Mode styling to factory defaults`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset {activeTab === 'light' ? 'Light' : 'Dark'} Defaults</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls + Live Sample Preview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column: Background Controls (col-span-6) */}
        <div className="md:col-span-6 space-y-3 bg-slate-50/70 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-500" />
              Canvas Background
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
              {activeTab === 'light'
                ? structureImageBg
                : lockObsidian
                  ? '#0f172a (Locked)'
                  : structureImageDarkBg}
            </span>
          </div>

          {/* Obsidian Lock Toggle (Dark Mode Tab only) */}
          {activeTab === 'dark' && (
            <div className="p-2.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5">
              <button
                type="button"
                onClick={() => onToggleLockObsidian(!lockObsidian)}
                className={`mt-0.5 p-1 rounded transition-colors ${
                  lockObsidian
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {lockObsidian ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>
              <div className="flex-1 text-xs">
                <label
                  onClick={() => onToggleLockObsidian(!lockObsidian)}
                  className="font-medium text-slate-800 dark:text-slate-200 cursor-pointer block select-none"
                >
                  Lock canvas to deep obsidian slate (<code className="text-[11px]">#0f172a</code>)
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {lockObsidian
                    ? 'Canvas locked to Obsidian. Unlock to enable custom dark background tint.'
                    : 'Default OFF: Your custom dark background tint renders directly on the canvas.'}
                </p>
              </div>
            </div>
          )}

          {/* Background Wheel and Presets */}
          <div className={`flex items-start gap-4 ${activeTab === 'dark' && lockObsidian ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="relative shrink-0 flex flex-col items-center">
              <canvas
                ref={bgCanvasRef}
                width={wheelSize}
                height={wheelSize}
                onMouseDown={(e) => {
                  isBgDraggingRef.current = true;
                  handleBgWheelInteraction(e.clientX, e.clientY);
                }}
                onMouseMove={(e) => {
                  if (isBgDraggingRef.current) handleBgWheelInteraction(e.clientX, e.clientY);
                }}
                onMouseUp={() => {
                  isBgDraggingRef.current = false;
                }}
                onTouchStart={(e) => {
                  if (e.touches.length > 0) {
                    isBgDraggingRef.current = true;
                    handleBgWheelInteraction(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchMove={(e) => {
                  if (isBgDraggingRef.current && e.touches.length > 0) {
                    handleBgWheelInteraction(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                className="cursor-crosshair rounded-full shadow-xs touch-none border border-slate-200/50 dark:border-slate-700/50"
              />
              <span className="text-[10px] text-slate-400 mt-1">Wheel Tint</span>
            </div>

            {/* Presets */}
            <div className="flex-1 space-y-1.5">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Presets</span>
              <div className="flex flex-wrap gap-1.5">
                {(activeTab === 'light' ? LIGHT_BG_PRESETS : DARK_BG_PRESETS).map((preset) => {
                  const isCurrent = isColorEqual(
                    activeTab === 'light' ? structureImageBg : structureImageDarkBg,
                    preset.value
                  );
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        if (activeTab === 'light') {
                          onUpdateStructureImageBg(preset.value);
                        } else {
                          onUpdateStructureImageDarkBg(preset.value);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border transition-all ${
                        isCurrent
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border"
                        style={{ backgroundColor: preset.dotBg, borderColor: preset.border }}
                      />
                      <span className="truncate max-w-[85px]">{preset.label.split(' ')[0]}</span>
                      {isCurrent && <Check className="w-3 h-3 ml-auto text-blue-600 dark:text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bond Stroke Controls (col-span-6) */}
        <div className="md:col-span-6 space-y-3 bg-slate-50/70 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              Bond Lines (Hue & Saturation)
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
              {activeBondColor}
            </span>
          </div>

          <div className="flex items-start gap-4">
            {/* Bond Hue Wheel */}
            <div className="relative shrink-0 flex flex-col items-center">
              <canvas
                ref={bondCanvasRef}
                width={wheelSize}
                height={wheelSize}
                onMouseDown={(e) => {
                  isBondDraggingRef.current = true;
                  handleBondWheelInteraction(e.clientX, e.clientY);
                }}
                onMouseMove={(e) => {
                  if (isBondDraggingRef.current) handleBondWheelInteraction(e.clientX, e.clientY);
                }}
                onMouseUp={() => {
                  isBondDraggingRef.current = false;
                }}
                onTouchStart={(e) => {
                  if (e.touches.length > 0) {
                    isBondDraggingRef.current = true;
                    handleBondWheelInteraction(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchMove={(e) => {
                  if (isBondDraggingRef.current && e.touches.length > 0) {
                    handleBondWheelInteraction(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                className="cursor-crosshair rounded-full shadow-xs touch-none border border-slate-200/50 dark:border-slate-700/50"
              />
              <span className="text-[10px] text-slate-400 mt-1">Bond Hue</span>
            </div>

            {/* Saturation Slider + Presets */}
            <div className="flex-1 space-y-2.5">
              {/* Saturation Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span>Saturation Intensity</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{bondSaturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bondSaturation}
                  onChange={(e) => handleSaturationChange(parseInt(e.target.value, 10))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600 shadow-inner"
                  style={{
                    background: `linear-gradient(to right, hsl(${activeBondHsl.h}, 0%, ${activeTab === 'light' ? 38 : 88}%), hsl(${activeBondHsl.h}, 100%, ${activeTab === 'light' ? 38 : 88}%))`
                  }}
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0% (Monochrome)</span>
                  <span>100% (Vivid)</span>
                </div>
              </div>

              {/* Bond Presets */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Presets</span>
                <div className="flex flex-wrap gap-1.5">
                  {(activeTab === 'light' ? LIGHT_BOND_PRESETS : DARK_BOND_PRESETS).map((preset) => {
                    const isCurrent = isColorEqual(activeBondColor, preset.value);
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          if (activeTab === 'light') {
                            onUpdateBondLightColor(preset.value);
                          } else {
                            onUpdateBondDarkColor(preset.value);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border transition-all ${
                          isCurrent
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0 border"
                          style={{ backgroundColor: preset.dotBg, borderColor: preset.border }}
                        />
                        <span className="truncate max-w-[85px]">{preset.label.split(' ')[0]}</span>
                        {isCurrent && <Check className="w-3 h-3 ml-auto text-blue-600 dark:text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Sample Preview Section */}
      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex flex-col sm:flex-row items-center gap-4">
        <div
          className="w-24 h-24 rounded-lg flex items-center justify-center border border-slate-200/80 dark:border-slate-800/80 shadow-inner overflow-hidden shrink-0 transition-colors"
          style={{ backgroundColor: livePreviewBg }}
        >
          <SmilesCanvas
            smiles="CC(=O)Oc1ccccc1C(=O)O"
            width={90}
            height={90}
            theme={activeTab}
            bondStrokeColor={livePreviewBondStroke}
            altText="Aspirin Structure Preview"
          />
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Eye className="w-3.5 h-3.5 text-blue-500" />
            <span>Live Aspirin Preview ({activeTab === 'light' ? 'Light' : 'Dark'} Mode)</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Real-time rendering of your active canvas background and molecular bond strokes. Red oxygen heteroatoms and pharmacophore halos remain crisp and diagnostic.
          </p>
          <div className="flex flex-wrap gap-3 text-[11px] font-mono text-slate-400 dark:text-slate-500 pt-0.5">
            <span>Canvas Bg: <span className="text-slate-700 dark:text-slate-300">{livePreviewBg}</span></span>
            <span>Bond Stroke: <span className="text-slate-700 dark:text-slate-300">{livePreviewBondStroke}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
