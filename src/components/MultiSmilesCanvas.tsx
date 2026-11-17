import React from 'react';
import { Dna, Layers } from 'lucide-react';
import type { TopDrugStructureRecord, MultiComponentPart } from '../data/topDrugsSmilesData.js';
import { SmilesCanvas } from './SmilesCanvas.js';
import { BiologicMechanismModel, hasDedicatedBiologicModel } from './BiologicMechanismModel.js';
import {
  getBlindedComponentLabel,
  resolveStructureRenderMode,
  formatComponentDescription,
} from '../utils/multiStructureHelpers.js';

export {
  getBlindedComponentLabel,
  resolveStructureRenderMode,
  formatComponentDescription,
};

export interface MultiSmilesCanvasProps {
  structureRecord?: TopDrugStructureRecord;
  smiles?: string; // Fallback single smiles if structureRecord is absent
  molBlock?: string;
  fallbackImageUrl?: string;
  cid?: number | string;
  compoundName?: string;
  isFlipped?: boolean;
  canvasHeight?: number;
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  bondStrokeColor?: string;
  className?: string;
  activePharmacophores?: Array<{ smarts?: string; color?: string; [key: string]: any }>;
  highlightSmarts?: string | null;
  hoveredPharmacophore?: any;
  highlightColor?: string;
  showToggleOption?: boolean;
}

/**
 * MultiSmilesCanvas Component
 *
 * Renders chemical structures across three distinct modalities:
 * 1. 'single-molecule': Standard vector SmilesCanvas with front-of-card blinding.
 * 2. 'multi-component': Side-by-side flex row of component canvases with '+' badges,
 *    strictly blinding component names to 'Component A', 'Component B' when !isFlipped,
 *    and revealing real names + clinical roles on flip.
 * 3. 'biologic': High-yield macromolecule schematic card with Lucide icons (Dna, Layers),
 *    revealing comprehensive architectural descriptions on flip instead of rendering a benzene fallback ring.
 */
export const MultiSmilesCanvas: React.FC<MultiSmilesCanvasProps> = ({
  structureRecord,
  smiles,
  molBlock,
  fallbackImageUrl,
  cid,
  compoundName,
  isFlipped = false,
  canvasHeight,
  width,
  height,
  theme = 'light',
  bondStrokeColor,
  className = '',
  activePharmacophores,
  highlightSmarts,
  hoveredPharmacophore,
  highlightColor,
  showToggleOption,
}) => {
  const renderMode = resolveStructureRenderMode(structureRecord);
  const effectiveHeight = canvasHeight ?? height ?? 190;

  // Modality 1: Multi-Component Combination Drug
  if (renderMode === 'multi-component' && structureRecord?.components && structureRecord.components.length > 0) {
    const components = structureRecord.components;
    const adjustedHeight = Math.max(110, Math.round(effectiveHeight * 0.85));
    const componentCount = components.length;
    const componentWidth = width ? Math.min(width, componentCount >= 3 ? 200 : 230) : (componentCount >= 3 ? 200 : 230);

    return (
      <div className={`flex flex-col items-center justify-center w-full ${className}`}>
        <div className="flex flex-row items-center justify-center gap-2 md:gap-4 flex-wrap w-full">
          {components.map((comp: MultiComponentPart, idx: number) => {
            const blindedLabel = getBlindedComponentLabel(idx);
            const componentAltText = isFlipped ? comp.componentName : blindedLabel;

            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center bg-slate-900/60 dark:bg-slate-900/80 border border-slate-800 rounded-lg p-2 max-w-full">
                  <SmilesCanvas
                    smiles={comp.smiles}
                    altText={componentAltText}
                    width={componentWidth}
                    height={adjustedHeight}
                    theme={theme}
                    bondStrokeColor={bondStrokeColor}
                    className="bg-transparent"
                  />
                  <div className="mt-2 text-center">
                    {!isFlipped ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {blindedLabel}
                      </span>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-cyan-400">{comp.componentName}</span>
                        {comp.role && <span className="text-[11px] text-slate-400 block">{comp.role}</span>}
                      </div>
                    )}
                  </div>
                </div>
                {idx < components.length - 1 && (
                  <div className="text-slate-400 font-bold text-xl px-1 select-none" aria-hidden="true">
                    +
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // Modality 2: Biologic / Macromolecule
  if (renderMode === 'biologic' && structureRecord) {
    const resolvedBioName = structureRecord.genericName || compoundName || '';
    if (hasDedicatedBiologicModel(resolvedBioName)) {
      return (
        <BiologicMechanismModel
          structureRecord={structureRecord}
          compoundName={compoundName}
          isFlipped={isFlipped}
          height={effectiveHeight}
          className={className}
        />
      );
    }

    return (
      <div
        className={`bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-xl p-4 sm:p-6 text-center flex flex-col items-center justify-center w-full shadow-md ${className}`}
        style={{ minHeight: effectiveHeight }}
      >
        <Dna className="w-12 h-12 mx-auto text-indigo-400 mb-2 animate-pulse" aria-hidden="true" />
        {!isFlipped ? (
          <div className="flex flex-col items-center justify-center space-y-1">
            <span className="inline-block text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              Therapeutic Biologic / Macromolecule
            </span>
            <h4 className="text-sm font-bold text-slate-200 mt-2">
              Complex Multi-Subunit Protein / Peptide
            </h4>
            <p className="text-xs text-indigo-300/80 mt-1">Structure Revealed on Flip</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 max-w-md">
            <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/50">
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Macromolecule Architecture</span>
            </div>
            {(structureRecord.genericName || compoundName) && (
              <h4 className="text-base font-bold text-cyan-300">
                {structureRecord.genericName || compoundName}
              </h4>
            )}
            {structureRecord.biologicDescription && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-center">
                {structureRecord.biologicDescription}
              </p>
            )}
            {structureRecord.molecularWeight && (
              <div className="text-[11px] text-indigo-300/70 font-mono mt-1">
                Molecular Weight: ~{structureRecord.molecularWeight.toLocaleString()} Da
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Modality 3: Standard Single Molecule
  const effectiveSmiles = structureRecord?.smiles || smiles || 'c1ccccc1';
  const effectiveAltText = isFlipped
    ? structureRecord?.genericName || compoundName || 'Chemical Structure'
    : 'Chemical Structure (Blinded)';

  return (
    <div className={`relative flex items-center justify-center w-full ${className}`}>
      <SmilesCanvas
        smiles={effectiveSmiles}
        molBlock={molBlock}
        fallbackImageUrl={fallbackImageUrl}
        cid={structureRecord?.cid || cid}
        width={width}
        height={effectiveHeight}
        theme={theme}
        bondStrokeColor={bondStrokeColor}
        className="w-full h-full"
        altText={effectiveAltText}
        activePharmacophores={isFlipped ? activePharmacophores : undefined}
        highlightSmarts={isFlipped ? highlightSmarts : undefined}
        hoveredPharmacophore={isFlipped ? hoveredPharmacophore : undefined}
        highlightColor={highlightColor}
        showToggleOption={showToggleOption}
      />
    </div>
  );
};

export default MultiSmilesCanvas;
