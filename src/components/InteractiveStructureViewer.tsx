import React, { useMemo } from 'react';
import { ChemicalStructure, PharmacophoreGroup } from '../types/reviewModule';
import {
  getPharmacophoresForStructure,
  resolvePharmacophoreRegion,
  ColorPaletteItem,
} from '../utils/pharmacophoreData';
import { SmilesCanvas } from './SmilesCanvas';

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
  const pharmacophores = useMemo(
    () => getPharmacophoresForStructure(structure),
    [structure]
  );

  const activePharmacophoresList = useMemo(() => {
    const list: Array<{ smarts?: string; color: string; name?: string; id?: string }> = [];

    // Pinned active groups
    Object.entries(activePharmacophoreIds).forEach(([id, color]) => {
      if (id === hoveredPharmacophoreId) return;
      const g = pharmacophores.find((p) => p.id === id);
      if (g) {
        list.push({
          id: g.id,
          name: g.name,
          smarts: g.smarts,
          color: color.hex || color.pinBg,
        });
      }
    });

    // Hovered group (highest priority)
    if (hoveredPharmacophoreId) {
      const g = pharmacophores.find((p) => p.id === hoveredPharmacophoreId);
      if (g) {
        const activeColor = activePharmacophoreIds[hoveredPharmacophoreId];
        list.push({
          id: g.id,
          name: g.name,
          smarts: g.smarts,
          color: activeColor ? (activeColor.hex || activeColor.pinBg) : '#3b82f6',
        });
      }
    }

    return list;
  }, [activePharmacophoreIds, hoveredPharmacophoreId, pharmacophores]);

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
      className={`relative w-full flex items-center justify-center overflow-hidden select-none bg-transparent rounded-xl ${className}`}
    >
      <div
        className={`relative inline-flex items-center justify-center max-w-full aspect-square bg-transparent rounded-lg ${maxHeightClass}`}
        style={transformStyle}
      >
        <SmilesCanvas
          smiles={structure.smiles || structure.canonicalSmiles || structure.canonical_smiles}
          fallbackImageUrl={structure.pngUrl}
          altText={altText || `${structure.name} 2D chemical structure`}
          width={450}
          height={320}
          activePharmacophores={activePharmacophoresList}
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* Interactive Click & Hover Hit Zones when expanded */}
        {isExpanded &&
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
                  e.stopPropagation();
                  if (onTogglePharmacophore) onTogglePharmacophore(group);
                }}
                onMouseEnter={() => {
                  if (onHoverPharmacophore) onHoverPharmacophore(group.id);
                }}
                onMouseLeave={() => {
                  if (onHoverPharmacophore) onHoverPharmacophore(null);
                }}
                className="absolute box-border cursor-pointer pointer-events-auto"
                style={{
                  left: `${region.x}%`,
                  top: `${region.y}%`,
                  width: `${region.width}%`,
                  height: `${region.height}%`,
                  zIndex: isHighlighted ? 25 : 5,
                }}
                title={group.name}
              />
            );
          })}
      </div>
    </div>
  );
};
