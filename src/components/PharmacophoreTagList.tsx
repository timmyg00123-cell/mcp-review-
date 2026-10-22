import React, { useState } from 'react';
import { ChemicalStructure, PharmacophoreGroup } from '../types/reviewModule';
import {
  getPharmacophoresForStructure,
  ColorPaletteItem,
  PHARMACOPHORE_COLOR_PALETTE,
} from '../utils/pharmacophoreData';
import { Sparkles, RotateCcw, Info, Check, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface PharmacophoreTagListProps {
  structure: ChemicalStructure;
  activePharmacophoreIds: Record<string, ColorPaletteItem>;
  hoveredPharmacophoreId: string | null;
  onTogglePharmacophore: (group: PharmacophoreGroup) => void;
  onHoverPharmacophore: (id: string | null) => void;
  onClearAllHighlights: () => void;
  compact?: boolean;
}

export const PharmacophoreTagList: React.FC<PharmacophoreTagListProps> = ({
  structure,
  activePharmacophoreIds,
  hoveredPharmacophoreId,
  onTogglePharmacophore,
  onHoverPharmacophore,
  onClearAllHighlights,
  compact = false,
}) => {
  const [showPurposeGuide, setShowPurposeGuide] = useState(false);
  const pharmacophores = getPharmacophoresForStructure(structure);
  const activeCount = Object.keys(activePharmacophoreIds).length;

  return (
    <div className="space-y-2">
      {/* Header with Title & Active Count / Reset */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Key Pharmacophores &amp; Functional Groups:</span>
        </div>

        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAllHighlights}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Reset all highlighted structure zones"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Clear ({activeCount})</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowPurposeGuide((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/80 transition-colors cursor-pointer"
            title="Toggle comprehensive purpose guide for all functional groups (touch / tablet friendly)"
          >
            <BookOpen className="w-2.5 h-2.5" />
            <span>{showPurposeGuide ? 'Hide Guide' : 'Purpose Guide'}</span>
            {showPurposeGuide ? (
              <ChevronUp className="w-2.5 h-2.5" />
            ) : (
              <ChevronDown className="w-2.5 h-2.5" />
            )}
          </button>
        </div>
      </div>

      {/* Interactive Tag Strip (Tap/Click to pin and inspect; hover previews) */}
      <div className="flex flex-wrap gap-1.5 relative">
        {pharmacophores.map((group, idx) => {
          const activeColor = activePharmacophoreIds[group.id];
          const isPinned = Boolean(activeColor);
          const isHovered = hoveredPharmacophoreId === group.id;

          return (
            <div
              key={group.id}
              className="relative inline-block"
              onMouseEnter={() => {
                onHoverPharmacophore(group.id);
              }}
              onMouseLeave={() => {
                onHoverPharmacophore(null);
              }}
            >
              {/* Tag Button - Strictly stable dimensions with zero layout shift on hover */}
              <button
                type="button"
                title={group.description || group.purpose}
                onClick={() => {
                  onTogglePharmacophore(group);
                  // On touch devices without hover, clicking also activates preview
                  onHoverPharmacophore(group.id);
                }}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors duration-100 cursor-pointer select-none border ${
                  isPinned
                    ? 'shadow-2xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
                style={
                  isPinned
                    ? {
                        backgroundColor: `${activeColor.hex}18`,
                        borderColor: activeColor.hex,
                        color: activeColor.hex,
                        boxShadow: `0 0 0 1px ${activeColor.hex}`,
                      }
                    : undefined
                }
              >
                {/* Indicator pip - static scale, no layout jitter */}
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: isPinned ? activeColor.hex : '#94A3B8',
                  }}
                />
                <span className="truncate">{group.name}</span>

                {isPinned && (
                  <Check className="w-3 h-3 stroke-[3]" style={{ color: activeColor.hex }} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Tablet / Touch Expandable Purpose Guide Card */}
      {showPurposeGuide && (
        <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 space-y-2.5 transition-all">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-blue-600" />
              <span>Medicinal Chemistry Purpose Guide</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Tap any item to highlight on structure
            </span>
          </div>

          <div className="space-y-2">
            {pharmacophores.map((group, idx) => {
              const activeColor = activePharmacophoreIds[group.id];
              const isPinned = Boolean(activeColor);
              const colorHex = activeColor ? activeColor.hex : PHARMACOPHORE_COLOR_PALETTE[idx % PHARMACOPHORE_COLOR_PALETTE.length].hex;

              return (
                <div
                  key={group.id}
                  onClick={() => {
                    onTogglePharmacophore(group);
                    onHoverPharmacophore(group.id);
                  }}
                  className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                    isPinned
                      ? 'bg-white dark:bg-slate-800 border-blue-400 dark:border-blue-500 shadow-2xs'
                      : 'bg-white/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: colorHex }}
                      />
                      <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {group.name}
                      </span>
                      {isPinned && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                      {group.category || 'PHARMACOPHORE'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {group.description || group.purpose}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
