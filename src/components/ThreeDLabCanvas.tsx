import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Maximize2,
  Minimize2,
  HelpCircle,
  RotateCcw,
  ExternalLink,
  Download,
  Layers,
  Dna,
  Atom,
  Sparkles,
  Compass,
  Info,
  Loader2,
  AlertCircle,
  Tag,
  Target,
  Pill,
} from 'lucide-react';
import {
  fetchPdbCoordinates,
  identifyLigandResidue,
  type DetectedLigandInfo,
} from '../services/structure3dService';
import type {
  PharmacophorePkPdGroup,
  KeyPocketResidueContact,
  TargetMedChemProfile,
} from '../types/structure3d';
import {
  findMedChemProfile,
  resolvePocketResidueColor,
} from '../data/canonicalPharmacophorePkData';
import {
  loadMolstarPluginScript,
  getBinaryCifUrl,
  getCachedCoordinateUrl,
  isMolstarSupported,
} from '../services/molstarLoader';
import { TwoDPocketFallbackView } from './TwoDPocketFallbackView';

export interface ThreeDLabCanvasProps {
  pdbId: string;
  preferredLigandCode?: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenTutorial: () => void;
  targetName?: string;
  geneSymbol?: string;
  activePharmacophoreGroup?: PharmacophorePkPdGroup | null;
  onSelectPharmacophoreGroup?: (group: PharmacophorePkPdGroup | null) => void;
  onSelectPocketResidue?: (residue: KeyPocketResidueContact | null) => void;
  isPkDrawerOpen?: boolean;
  onTogglePkDrawer?: () => void;
  initial2DFallback?: boolean;
  initialLoadError?: string | null;
}

declare global {
  interface Window {
    PDBeMolstarPlugin?: any;
    molstar?: any;
  }
}

/**
 * High-performance color constants for Mol* representation styling.
 * cyanCarbon (#06b6d4) for high-contrast drug sticks,
 * magentaCarbon (#ec4899) for active pharmacophore accent highlighting.
 */
export const MOLSTAR_THEME_COLORS = {
  cyanCarbon: { r: 6, g: 182, b: 212 },
  magentaCarbon: { r: 236, g: 72, b: 153 },
  emeraldPocket: { r: 16, g: 185, b: 129 },
  amberHBond: { r: 245, g: 158, b: 11 },
  slateRibbon: { r: 100, g: 116, b: 139 }, // slate-500 #64748b muted receptor scaffold
  slateBg: { r: 2, g: 6, b: 23 }, // slate-950 #020617
};

function hexToRgbColor(hex?: string, fallback = MOLSTAR_THEME_COLORS.magentaCarbon) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#') || hex.length < 7) {
    return fallback;
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) {
    return fallback;
  }
  return { r, g, b };
}

/**
 * Mol* (MolStar) WebGL Molecular Graphics Canvas with Binary mmCIF (.bcif) Streaming,
 * Classic Pocket Sticks, Translucent Cavity Surface, GPU-Instanced Labels & Pharmacophore Engine.
 */
export const ThreeDLabCanvas: React.FC<ThreeDLabCanvasProps> = ({
  pdbId,
  preferredLigandCode,
  isFullscreen,
  onToggleFullscreen,
  onOpenTutorial,
  targetName,
  geneSymbol,
  activePharmacophoreGroup,
  onSelectPharmacophoreGroup,
  onSelectPocketResidue,
  isPkDrawerOpen,
  onTogglePkDrawer,
  initial2DFallback = false,
  initialLoadError = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  // Scene toggles & mode state
  const [is2DFallbackActive, setIs2DFallbackActive] = useState<boolean>(initial2DFallback);
  const [detectedLigand, setDetectedLigand] = useState<DetectedLigandInfo | null>(null);
  const [showPocket, setShowPocket] = useState<boolean>(true);
  const [showPocketSurface, setShowPocketSurface] = useState<boolean>(false);
  const [showRibbon, setShowRibbon] = useState<boolean>(true);
  const [showHBonds, setShowHBonds] = useState<boolean>(true);
  const [showAtomLabels, setShowAtomLabels] = useState<boolean>(false);
  const [subPocketColorMode, setSubPocketColorMode] = useState<boolean>(true);
  const [clickedAtomInfo, setClickedAtomInfo] = useState<{
    atom: string;
    resn: string;
    resi: number;
    chain: string;
    elem: string;
  } | null>(null);

  // Loading & error state
  const [isLoading, setIsLoading] = useState<boolean>(!initialLoadError);
  const [loadError, setLoadError] = useState<string | null>(initialLoadError);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const cleanPdbId = pdbId ? pdbId.trim().toUpperCase() : '';

  // Canonical medicinal chemistry profile for pharmacophore groups & key pocket residues
  const medChemProfile: TargetMedChemProfile | undefined =
    (geneSymbol ? findMedChemProfile(geneSymbol) : undefined) ||
    (cleanPdbId ? findMedChemProfile(cleanPdbId) : undefined);

  // --------------------------------------------------------------------------
  // Scene Rendering Function via Mol* Visual Engine
  // --------------------------------------------------------------------------
  const renderScene = useCallback(
    (
      viewer: any,
      ligand: DetectedLigandInfo | null,
      pocketActive: boolean,
      pocketSurfaceActive: boolean,
      ribbonActive: boolean,
      hbondsActive: boolean,
      atomLabelsActive: boolean = false,
      pharmacophoreGroup: PharmacophorePkPdGroup | null = null,
      subPocketZonesActive: boolean = subPocketColorMode
    ) => {
      if (!viewer) return;

      try {
        // Reset or update selections
        if (typeof viewer.visual?.clearHighlight === 'function') {
          viewer.visual.clearHighlight();
        }

        // 1. Suppress global HETATM clutter (lipids, detergents, glycans, duplicate chains)
        // while keeping polymer cartoon controlled by ribbonActive
        if (typeof viewer.visual?.visibility === 'function') {
          viewer.visual.visibility({
            polymer: ribbonActive,
            het: false,
            water: false,
            carbs: false,
            nonStandard: false,
          });
        }

        // Apply Mol* high-level visual representations if legacy update API is present
        if (typeof viewer.visual?.update === 'function') {
          viewer.visual.update({
            // Protein backbone cartoon ribbon (using { hetflag: false } polymer selector)
            cartoon: ribbonActive,
            // Pocket surrounding residues within 5Å as sticks
            pocket: pocketActive,
            pocketDistance: 5.0,
            // Translucent pocket cavity molecular surface (opacity ~0.35)
            surface: pocketSurfaceActive,
            surfaceOpacity: 0.35,
            // Non-covalent polar contacts / H-bonds
            interactions: hbondsActive,
            // GPU-instanced text glyph labels (zero canvas texture allocations, zero CPU lag)
            atomLabels: atomLabelsActive,
          });
        }

        const singleLigandQuery = ligand
          ? {
              chem_comp_id: ligand.resn,
              label_comp_id: ligand.resn,
              ...(ligand.chain ? { auth_asym_id: ligand.chain } : {}),
              ...(ligand.resi ? { auth_seq_id: ligand.resi } : {}),
            }
          : null;

        // 2. Single-Ligand Isolation, True CPK Heteroatoms (color: null + type_symbol: 'C'),
        //    and Color-Matched Binding Sub-Pocket Residues
        if (typeof viewer.visual?.select === 'function') {
          const selectData: any[] = [];

          // A. Single bound drug ligand instance in ball-and-stick
          if (ligand && singleLigandQuery) {
            // Base representation with color: null so N, O, S, P, F, Cl keep native CPK element colors
            selectData.push({
              ...singleLigandQuery,
              representation: 'ball-and-stick',
              color: null,
              focus: !pharmacophoreGroup,
            });

            // Carbon skeleton color: base cyanCarbon
            selectData.push({
              ...singleLigandQuery,
              type_symbol: 'C',
              representation: 'ball-and-stick',
              representationColor: MOLSTAR_THEME_COLORS.cyanCarbon,
              color: null,
            });

            // When Sub-Pocket Zone mode is active, color each pharmacophore moiety's carbons
            // to match its corresponding binding sub-pocket zone
            if (subPocketZonesActive && medChemProfile?.pharmacophoreGroups?.length) {
              for (const group of medChemProfile.pharmacophoreGroups) {
                const groupRgb = hexToRgbColor(group.colorAccent, MOLSTAR_THEME_COLORS.cyanCarbon);
                selectData.push({
                  ...singleLigandQuery,
                  atoms: group.atomNames,
                  label_atom_id: group.atomNames,
                  type_symbol: 'C',
                  representation: 'ball-and-stick',
                  representationColor: groupRgb,
                  color: null,
                });
              }
            }

            // Active-site catalytic metal ions (e.g. Zn2+ in ACE 1O86) within 5Å of the single ligand
            if (ligand.catalyticMetals?.length) {
              for (const metal of ligand.catalyticMetals) {
                selectData.push({
                  chem_comp_id: metal.resn,
                  label_comp_id: metal.resn,
                  auth_asym_id: metal.chain,
                  auth_seq_id: metal.resi,
                  representation: 'ball-and-stick',
                  color: null,
                });
              }
            }
          }

          // B. Key binding sub-pocket residues with CPK heteroatoms + sub-pocket carbon colors
          if (pocketActive && medChemProfile?.keyPocketResidues?.length) {
            for (const residue of medChemProfile.keyPocketResidues) {
              const targetChain = residue.chain || ligand?.chain || 'A';
              const isPairedWithActiveGroup = Boolean(
                pharmacophoreGroup && residue.pharmacophoreGroupId === pharmacophoreGroup.id
              );
              const resRgb = subPocketZonesActive
                ? hexToRgbColor(
                    resolvePocketResidueColor(residue, medChemProfile),
                    MOLSTAR_THEME_COLORS.emeraldPocket
                  )
                : MOLSTAR_THEME_COLORS.emeraldPocket;

              const residueQuery = {
                struct_asym_id: targetChain,
                auth_asym_id: targetChain,
                residue_number: residue.resi,
                auth_seq_id: residue.resi,
              };

              // Base side-chain sticks with color: null so N (blue), O (red), S (yellow) stay CPK
              selectData.push({
                ...residueQuery,
                representation: 'ball-and-stick',
                color: null,
                focus: isPairedWithActiveGroup,
              });

              // Carbon-only overpaint matching the sub-pocket zone or emeraldPocket
              selectData.push({
                ...residueQuery,
                type_symbol: 'C',
                representation: 'ball-and-stick',
                representationColor: resRgb,
                color: resRgb,
              });

              // Optional translucent sub-pocket cavity surface
              if (pocketSurfaceActive) {
                selectData.push({
                  ...residueQuery,
                  representation: 'gaussian-surface',
                  representationColor: resRgb,
                  representationOpacity: 0.28,
                  color: null,
                });
              }
            }
          }

          // C. Active pharmacophore group accent highlighting
          if (pharmacophoreGroup && ligand && singleLigandQuery) {
            const accentRgb = hexToRgbColor(
              pharmacophoreGroup.colorAccent || '#ec4899',
              MOLSTAR_THEME_COLORS.magentaCarbon
            );

            selectData.push({
              ...singleLigandQuery,
              atoms: pharmacophoreGroup.atomNames,
              label_atom_id: pharmacophoreGroup.atomNames,
              type_symbol: 'C',
              representation: 'ball-and-stick',
              representationColor: accentRgb,
              color: accentRgb,
              focus: true,
            });
          }

          if (selectData.length > 0) {
            viewer.visual.select({
              data: selectData,
              nonSelectedColor: MOLSTAR_THEME_COLORS.slateRibbon,
              nonSelectedOpacity: ligand && pocketActive ? 0.28 : 0.85,
            });
          }
        }

        // 3. Trigger Mol* native 5Å pocket surroundings & 3D dashed non-covalent interactions
        if (
          ligand &&
          singleLigandQuery &&
          (hbondsActive || pocketActive) &&
          typeof viewer.visual?.interactivityFocus === 'function'
        ) {
          viewer.visual.interactivityFocus({
            data: [singleLigandQuery],
          });
        }

        // 4. Attach custom 3D hover tooltips for the single ligand and sub-pocket residues
        if (typeof viewer.visual?.tooltips === 'function') {
          const tooltipItems: any[] = [];
          if (ligand && singleLigandQuery) {
            tooltipItems.push({
              ...singleLigandQuery,
              tooltip: `Bound Drug Ligand: ${ligand.resn} (Chain ${ligand.chain || 'A'})`,
            });
          }
          if (medChemProfile?.keyPocketResidues?.length) {
            for (const residue of medChemProfile.keyPocketResidues) {
              const targetChain = residue.chain || ligand?.chain || 'A';
              tooltipItems.push({
                struct_asym_id: targetChain,
                auth_asym_id: targetChain,
                residue_number: residue.resi,
                auth_seq_id: residue.resi,
                tooltip: `${residue.label} • ${residue.subPocketName || residue.interactionType} (${residue.interactionType})`,
              });
            }
          }
          if (tooltipItems.length > 0) {
            viewer.visual.tooltips({ data: tooltipItems });
          }
        }

        // 5. Highlight active pharmacophore group if highlight API is available
        if (pharmacophoreGroup && ligand && singleLigandQuery && typeof viewer.visual?.highlight === 'function') {
          const accentRgb = hexToRgbColor(
            pharmacophoreGroup.colorAccent || '#ec4899',
            MOLSTAR_THEME_COLORS.magentaCarbon
          );

          viewer.visual.highlight({
            data: [
              {
                ...singleLigandQuery,
                atoms: pharmacophoreGroup.atomNames,
                label_atom_id: pharmacophoreGroup.atomNames,
                color: accentRgb, // magentaCarbon accent
                focus: true,
              },
            ],
          });
        }

        // 6. Focus camera on the single ligand + sub-pocket or active pharmacophore + paired pocket residues
        if (ligand && singleLigandQuery && typeof viewer.visual?.focus === 'function') {
          if (pharmacophoreGroup) {
            const focusTargets: any[] = [
              {
                ...singleLigandQuery,
                atoms: pharmacophoreGroup.atomNames,
                label_atom_id: pharmacophoreGroup.atomNames,
              },
            ];
            if (medChemProfile?.keyPocketResidues?.length) {
              for (const residue of medChemProfile.keyPocketResidues) {
                if (residue.pharmacophoreGroupId === pharmacophoreGroup.id) {
                  const targetChain = residue.chain || ligand.chain || 'A';
                  focusTargets.push({
                    struct_asym_id: targetChain,
                    auth_asym_id: targetChain,
                    residue_number: residue.resi,
                    auth_seq_id: residue.resi,
                  });
                }
              }
            }
            viewer.visual.focus(focusTargets);
          } else {
            viewer.visual.focus([singleLigandQuery]);
          }
        }
      } catch (err) {
        console.warn('Mol* scene styling notification:', err);
      }
    },
    [medChemProfile, subPocketColorMode]
  );

  // --------------------------------------------------------------------------
  // Scroll Zoom Sensitivity Dampener (~60% reduction, factor 0.04)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (!viewerRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      const zoomFactor = 1.0 - Math.sign(e.deltaY) * 0.04;
      try {
        if (viewerRef.current.plugin?.canvas3d?.camera?.zoom) {
          viewerRef.current.plugin.canvas3d.camera.zoom(zoomFactor);
          viewerRef.current.plugin.canvas3d.requestDraw?.();
        } else if (typeof viewerRef.current.zoom === 'function') {
          viewerRef.current.zoom(zoomFactor);
        }
      } catch (_) {}
    };

    container.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      container.removeEventListener('wheel', handleWheel, { capture: true } as any);
    };
  }, []);

  // --------------------------------------------------------------------------
  // Synchronize Active Pharmacophore Group or Scene Changes
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (viewerRef.current && detectedLigand) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        showPocket,
        showPocketSurface,
        showRibbon,
        showHBonds,
        showAtomLabels,
        activePharmacophoreGroup,
        subPocketColorMode
      );
    }
  }, [
    activePharmacophoreGroup,
    detectedLigand,
    showPocket,
    showPocketSurface,
    showRibbon,
    showHBonds,
    showAtomLabels,
    subPocketColorMode,
    renderScene,
  ]);

  // --------------------------------------------------------------------------
  // One-Click Scene Action Handlers
  // --------------------------------------------------------------------------
  const handleIsolateLigand = () => {
    setShowPocket(false);
    setShowPocketSurface(false);
    setShowRibbon(false);
    setShowHBonds(false);

    if (viewerRef.current) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        false,
        false,
        false,
        false,
        showAtomLabels,
        activePharmacophoreGroup,
        subPocketColorMode
      );
      if (typeof viewerRef.current.visual?.reset === 'function') {
        viewerRef.current.visual.reset({ camera: true });
      } else if (viewerRef.current.plugin?.canvas3d?.requestCameraReset) {
        viewerRef.current.plugin.canvas3d.requestCameraReset();
      }
    }
  };

  const handleToggleSubPocketColorMode = () => {
    const nextMode = !subPocketColorMode;
    setSubPocketColorMode(nextMode);
    if (viewerRef.current) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        showPocket,
        showPocketSurface,
        showRibbon,
        showHBonds,
        showAtomLabels,
        activePharmacophoreGroup,
        nextMode
      );
    }
  };

  const handleTogglePocket = () => {
    const nextPocket = !showPocket;
    setShowPocket(nextPocket);
    if (viewerRef.current) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        nextPocket,
        showPocketSurface,
        showRibbon,
        showHBonds,
        showAtomLabels,
        activePharmacophoreGroup,
        subPocketColorMode
      );
    }
  };

  const handleTogglePocketSurface = () => {
    const nextSurface = !showPocketSurface;
    setShowPocketSurface(nextSurface);
    if (viewerRef.current) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        showPocket,
        nextSurface,
        showRibbon,
        showHBonds,
        showAtomLabels,
        activePharmacophoreGroup,
        subPocketColorMode
      );
    }
  };

  const handleToggleRibbon = () => {
    const nextRibbon = !showRibbon;
    setShowRibbon(nextRibbon);
    if (viewerRef.current) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        showPocket,
        showPocketSurface,
        nextRibbon,
        showHBonds,
        showAtomLabels,
        activePharmacophoreGroup,
        subPocketColorMode
      );
    }
  };

  const handleToggleHBonds = () => {
    const nextHBonds = !showHBonds;
    setShowHBonds(nextHBonds);
    if (viewerRef.current) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        showPocket,
        showPocketSurface,
        showRibbon,
        nextHBonds,
        showAtomLabels,
        activePharmacophoreGroup,
        subPocketColorMode
      );
    }
  };

  const handleToggleAtomLabels = () => {
    const nextAtomLabels = !showAtomLabels;
    setShowAtomLabels(nextAtomLabels);
    if (viewerRef.current) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        showPocket,
        showPocketSurface,
        showRibbon,
        showHBonds,
        nextAtomLabels,
        activePharmacophoreGroup,
        subPocketColorMode
      );
    }
  };

  const handleRecenterCamera = () => {
    if (viewerRef.current) {
      if (typeof viewerRef.current.visual?.reset === 'function') {
        viewerRef.current.visual.reset({ camera: true });
      } else if (viewerRef.current.plugin?.canvas3d?.requestCameraReset) {
        viewerRef.current.plugin.canvas3d.requestCameraReset();
      } else if (typeof viewerRef.current.zoomTo === 'function') {
        viewerRef.current.zoomTo();
      }
    }
  };

  const handleZoomIn = () => {
    if (viewerRef.current) {
      if (viewerRef.current.plugin?.canvas3d?.camera?.zoom) {
        viewerRef.current.plugin.canvas3d.camera.zoom(1.15);
        viewerRef.current.plugin.canvas3d.requestDraw?.();
      } else if (typeof viewerRef.current.zoom === 'function') {
        viewerRef.current.zoom(1.15);
      }
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      if (viewerRef.current.plugin?.canvas3d?.camera?.zoom) {
        viewerRef.current.plugin.canvas3d.camera.zoom(0.85);
        viewerRef.current.plugin.canvas3d.requestDraw?.();
      } else if (typeof viewerRef.current.zoom === 'function') {
        viewerRef.current.zoom(0.85);
      }
    }
  };

  const handleChipClick = (group: PharmacophorePkPdGroup) => {
    const isCurrentlyActive = activePharmacophoreGroup?.id === group.id;
    if (isCurrentlyActive) {
      onSelectPharmacophoreGroup?.(null);
    } else {
      onSelectPharmacophoreGroup?.(group);
      if (!isPkDrawerOpen && onTogglePkDrawer) {
        onTogglePkDrawer();
      }
    }
  };

  // --------------------------------------------------------------------------
  // Mol* WebGL Initialization & Binary mmCIF (.bcif) Streaming
  // --------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const loadMolstarAndInit = async () => {
      if (!cleanPdbId) {
        setIsLoading(false);
        setLoadError('No PDB ID specified.');
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      // Verify WebGL support in client runtime
      if (!isMolstarSupported()) {
        if (typeof window !== 'undefined') {
          setLoadError('WebGL is not supported or graphics acceleration is disabled in your current browser environment.');
          setIsLoading(false);
          return;
        }
      }

      try {
        // 1. Identify primary small-molecule ligand from coordinates (non-fatal if text coordinates fail)
        let ligand: any = null;
        try {
          const pdbData = await fetchPdbCoordinates(cleanPdbId);
          if (!isMounted) return;

          ligand = identifyLigandResidue(pdbData, preferredLigandCode);
          setDetectedLigand(ligand);
        } catch (coordErr) {
          console.warn(`[ThreeDLabCanvas] Non-fatal: Could not pre-fetch text PDB coordinates for ${cleanPdbId}, proceeding with Mol* binary mmCIF stream:`, coordErr);
        }

        // Initial representation toggles: when a ligand is present, default pocket sticks & 3D H-bonds ON
        const hasLigand = Boolean(ligand);
        const initialRibbon = true;
        const initialPocket = hasLigand;
        const initialPocketSurface = false;
        const initialHBonds = hasLigand;

        setShowRibbon(initialRibbon);
        setShowPocket(initialPocket);
        setShowPocketSurface(initialPocketSurface);
        setShowHBonds(initialHBonds);

        // 2. Resolve Binary mmCIF (.bcif) coordinate URL with cached fallback
        const bcifUrl = getBinaryCifUrl(cleanPdbId);
        const coordinateUrl = (await getCachedCoordinateUrl(cleanPdbId)) || bcifUrl;

        // 3. Dynamically inject and load Mol* / PDBeMolstar plugin
        await loadMolstarPluginScript();
        if (!isMounted || !containerRef.current) return;

        containerRef.current.innerHTML = '';

        // Instantiate Mol* viewer
        const MolstarPluginClass =
          (window as any).PDBeMolstarPlugin || (window as any).molstar?.PDBeMolstarPlugin;

        let viewer: any = null;
        if (typeof MolstarPluginClass === 'function') {
          viewer = new MolstarPluginClass();
        } else if (typeof (window as any).molstar?.createViewer === 'function') {
          viewer = (window as any).molstar.createViewer(containerRef.current);
        } else {
          viewer = {
            visual: {
              select: () => {},
              highlight: () => {},
              clearSelection: () => {},
              clearHighlight: () => {},
              reset: () => {},
              update: () => {},
              visibility: () => {},
              focus: () => {},
              interactivityFocus: () => {},
              tooltips: () => {},
            },
            plugin: {
              canvas3d: {
                camera: { zoom: () => {} },
                requestCameraReset: () => {},
                requestResize: () => {},
              },
            },
          };
        }

        viewerRef.current = viewer;

        // Configure Mol* viewport: suppress default het/water/carbs clutter so only our pinned ligand renders
        const molstarOptions = {
          moleculeId: cleanPdbId.toLowerCase(),
          customData: {
            url: coordinateUrl,
            format: 'bcif',
            binary: true,
          },
          bgColor: MOLSTAR_THEME_COLORS.slateBg,
          hideControls: true,
          hideCanvasControls: [
            'selection',
            'animation',
            'controlToggle',
            'controlInfo',
          ],
          hideStructure: ['het', 'water', 'carbs', 'nonStandard'],
          loadMaps: false,
          visualStyle: 'cartoon',
          lighting: 'matte',
          alphafoldView: false,
        };

        if (typeof viewer.render === 'function') {
          await viewer.render(containerRef.current, molstarOptions);
          if (isMounted) {
            renderScene(
              viewer,
              ligand,
              initialPocket,
              initialPocketSurface,
              initialRibbon,
              initialHBonds,
              showAtomLabels,
              activePharmacophoreGroup,
              subPocketColorMode
            );
          }
        }

        // Subscribe to atom click events for camera recentering & pocket contact inspection
        if (viewer.events?.loadComplete?.subscribe) {
          viewer.events.loadComplete.subscribe(() => {
            if (!isMounted) return;
            renderScene(
              viewer,
              ligand,
              initialPocket,
              initialPocketSurface,
              initialRibbon,
              initialHBonds,
              showAtomLabels,
              activePharmacophoreGroup,
              subPocketColorMode
            );
          });
        }

        // Subscribe to interactive selection / click events
        if (viewer.plugin?.behaviors?.interaction?.click?.subscribe) {
          viewer.plugin.behaviors.interaction.click.subscribe((event: any) => {
            if (!isMounted || !event?.current) return;
            const item = event.current;
            const atomName = item.atom || item.name || 'C';
            const resName = item.resn || item.comp_id || 'LIG';
            const resSeq = item.resi || item.seq_id || 1;
            const chainId = item.chain || item.asym_id || 'A';
            const elem = item.elem || atomName.charAt(0);

            setClickedAtomInfo({
              atom: atomName,
              resn: resName,
              resi: resSeq,
              chain: chainId,
              elem,
            });

            if (onSelectPocketResidue && medChemProfile) {
              const matchedContact = medChemProfile.keyPocketResidues.find(
                (r) => r.resi === resSeq && (!r.resn || r.resn === resName)
              );
              if (matchedContact) {
                onSelectPocketResidue(matchedContact);
              }
            }
          });
        }

        renderScene(
          viewer,
          ligand,
          initialPocket,
          initialPocketSurface,
          initialRibbon,
          initialHBonds,
          showAtomLabels,
          activePharmacophoreGroup,
          subPocketColorMode
        );

        setIsLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        console.error(`Error initializing Mol* for PDB ${cleanPdbId}:`, err);
        setLoadError(err?.message || `Failed to stream coordinates for PDB ${cleanPdbId}`);
        setIsLoading(false);
      }
    };

    loadMolstarAndInit();

    return () => {
      isMounted = false;
      if (viewerRef.current) {
        try {
          if (typeof viewerRef.current.clear === 'function') {
            viewerRef.current.clear();
          } else if (typeof viewerRef.current.destroy === 'function') {
            viewerRef.current.destroy();
          }
        } catch (_) {}
      }
    };
  }, [cleanPdbId, preferredLigandCode, reloadTrigger, renderScene]);

  // --------------------------------------------------------------------------
  // Resize handler for Fullscreen toggles & Drawer expansion
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleResize = () => {
      if (viewerRef.current) {
        try {
          if (viewerRef.current.plugin?.canvas3d?.requestResize) {
            viewerRef.current.plugin.canvas3d.requestResize();
          } else if (typeof viewerRef.current.resize === 'function') {
            viewerRef.current.resize();
          }
        } catch (_) {}
      }
    };

    const timer = setTimeout(handleResize, 150);
    window.addEventListener('resize', handleResize);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      observer = new ResizeObserver(() => {
        handleResize();
      });
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      observer?.disconnect();
    };
  }, [isFullscreen]);

  return (
    <div
      className={`flex flex-col w-full h-full bg-slate-950 text-white relative overflow-hidden select-none ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* ================================================================= */}
      {/* TOP HEADER: Structure Info, Badges, Links & Prominent Actions     */}
      {/* ================================================================= */}
      <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 z-20">
        {/* Left: Structure Identity & Apo Fallback Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 font-mono font-bold rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/60 shadow-xs">
            {cleanPdbId}
          </span>
          <span className="font-semibold text-slate-200 truncate max-w-[180px] sm:max-w-[260px]">
            {targetName || 'Co-crystal Complex'}
          </span>
          {geneSymbol && (
            <span className="text-[10px] font-mono text-slate-400">
              [{geneSymbol}]
            </span>
          )}
          {!detectedLigand && !isLoading && !loadError && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Apo Protein (No bound ligand)
            </span>
          )}
          {detectedLigand && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
              Ligand: {detectedLigand.resn} ({detectedLigand.atomCount} atoms
              {detectedLigand.chain ? ` • Chain ${detectedLigand.chain}` : ''}
              {detectedLigand.instanceCount && detectedLigand.instanceCount > 1
                ? ` • 1 of ${detectedLigand.instanceCount} isolated`
                : ''}
              )
            </span>
          )}
        </div>

        {/* Right: Actions, Links, Fullscreen & Tutorial */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reload Canvas */}
          <button
            type="button"
            onClick={() => setReloadTrigger((prev) => prev + 1)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Reload 3D Structure"
            aria-label="Reload 3D Structure"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* RCSB Portal Link */}
          <a
            href={`https://www.rcsb.org/structure/${cleanPdbId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium text-[11px]"
            title="View on RCSB PDB Portal (opens in new tab)"
          >
            <span>RCSB</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* CIF Download Link */}
          <a
            href={`https://files.rcsb.org/download/${cleanPdbId}.cif`}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors font-medium text-[11px]"
            title="Download mmCIF Coordinate File (opens in new tab)"
          >
            <Download className="w-3 h-3" />
            <span>CIF</span>
          </a>

          {/* Tutorial & Guide Button */}
          <button
            type="button"
            onClick={onOpenTutorial}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 transition-colors font-semibold text-[11px] cursor-pointer shadow-xs"
            title="Open 3D Lab Pedagogical Tutorial & Guide"
            aria-label="Open 3D Lab Pedagogical Tutorial & Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tutorial &amp; Guide</span>
          </button>

          {/* High-Contrast Fullscreen Button */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 font-bold text-[11px] transition-all cursor-pointer shadow-sm hover:shadow-cyan-900/40"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-cyan-300" />
                <span>Exit Full Screen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-cyan-300" />
                <span>Full Screen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SCENE CONTROLS TOOLBAR: One-Click Mol* Toggles & 2D/3D Mode       */}
      {/* ================================================================= */}
      <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0 z-20">
        <div className="flex flex-wrap items-center gap-1.5">
          {is2DFallbackActive ? (
            <div className="flex items-center gap-2 text-xs text-slate-400 py-0.5">
              <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-cyan-950/80 text-cyan-300 border border-cyan-800/80">
                2D Pocket Schematic Active
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Interactive contact map &amp; SAR analysis mode
              </span>
            </div>
          ) : (
            <>
              {/* Isolate Ligand (Action) */}
              <button
                type="button"
                onClick={handleIsolateLigand}
                disabled={!detectedLigand}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  detectedLigand
                    ? 'bg-slate-800 hover:bg-cyan-950 hover:border-cyan-500 border border-slate-700 text-cyan-200'
                    : 'opacity-40 cursor-not-allowed bg-slate-800/50 border border-slate-800 text-slate-500'
                }`}
                title="Isolate Ligand: Hides protein and pocket, focuses exclusively on ligand"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Isolate Ligand</span>
              </button>

              {/* Sub-Pocket Zones (Color-Matched Ligand & Pocket Pairs) */}
              <button
                type="button"
                onClick={handleToggleSubPocketColorMode}
                disabled={!detectedLigand}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
                  !detectedLigand
                    ? 'opacity-40 cursor-not-allowed bg-slate-800/50 border-slate-800 text-slate-500'
                    : subPocketColorMode
                    ? 'bg-fuchsia-950/80 border-fuchsia-500 text-fuchsia-200 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title="Sub-Pocket Zones: Color-match ligand pharmacophore carbons with their partner binding sub-pocket residues while preserving CPK heteroatom colors"
                aria-pressed={subPocketColorMode}
              >
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>Sub-Pocket Zones</span>
              </button>

              {/* Pocket Sticks (5Å) (Classic Surrounding Residues) */}
              <button
                type="button"
                onClick={handleTogglePocket}
                disabled={!detectedLigand}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
                  !detectedLigand
                    ? 'opacity-40 cursor-not-allowed bg-slate-800/50 border-slate-800 text-slate-500'
                    : showPocket
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title="Binding Pocket (5Å): Toggle classic pocket residue sticks within 5Å of ligand"
                aria-pressed={showPocket}
              >
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pocket Sticks (5Å)</span>
              </button>

              {/* Pocket Surface (Translucent Receptor Cavity) */}
              <button
                type="button"
                onClick={handleTogglePocketSurface}
                disabled={!detectedLigand}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
                  !detectedLigand
                    ? 'opacity-40 cursor-not-allowed bg-slate-800/50 border-slate-800 text-slate-500'
                    : showPocketSurface
                    ? 'bg-teal-950/80 border-teal-400 text-teal-200 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title="Pocket Surface: Toggle translucent receptor cavity surface (opacity ~0.35) around drug"
                aria-pressed={showPocketSurface}
              >
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                <span>Pocket Surface</span>
              </button>

              {/* Toggle Protein Ribbon (Additive Toggle) */}
              <button
                type="button"
                onClick={handleToggleRibbon}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
                  showRibbon
                    ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title="Toggle Protein Ribbon: Show or hide secondary structure cartoon"
                aria-pressed={showRibbon}
              >
                <Dna className="w-3.5 h-3.5 text-purple-400" />
                <span>Toggle Protein Ribbon</span>
              </button>

              {/* Hydrogen Bonds / Non-Covalent Interactions */}
              <button
                type="button"
                onClick={handleToggleHBonds}
                disabled={!detectedLigand}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
                  !detectedLigand
                    ? 'opacity-40 cursor-not-allowed bg-slate-800/50 border-slate-800 text-slate-500'
                    : showHBonds
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title="Hydrogen Bonds: Compute and display non-covalent contacts <= 3.2Å"
                aria-pressed={showHBonds}
              >
                <Atom className="w-3.5 h-3.5 text-amber-400" />
                <span>Hydrogen Bonds</span>
              </button>

              {/* Atom Labels (Mol* GPU-Instanced Text Labels) */}
              <button
                type="button"
                onClick={handleToggleAtomLabels}
                disabled={!detectedLigand}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
                  !detectedLigand
                    ? 'opacity-40 cursor-not-allowed bg-slate-800/50 border-slate-800 text-slate-500'
                    : showAtomLabels
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title="Atom Labels: Display atom names using GPU-instanced glyphs (zero canvas freeze)"
                aria-pressed={showAtomLabels}
              >
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Atom Labels</span>
              </button>
            </>
          )}
        </div>

        {/* Recenter Camera (Action) & 2D/3D Mode Switcher */}
        <div className="flex items-center gap-1.5">
          {/* Mode Toggle Button: 2D Pocket View <-> Switch to 3D Mol* */}
          <button
            type="button"
            onClick={() => {
              if (is2DFallbackActive) {
                setIs2DFallbackActive(false);
                setReloadTrigger((prev) => prev + 1);
              } else {
                setIs2DFallbackActive(true);
              }
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
              is2DFallbackActive
                ? 'bg-cyan-950/90 hover:bg-cyan-900 border-cyan-400 text-cyan-200 shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
            title={
              is2DFallbackActive
                ? 'Switch to 3D Mol* WebGL Viewer'
                : 'Switch to 2D Binding Pocket Schematic'
            }
            aria-label={
              is2DFallbackActive
                ? 'Switch to 3D Mol*'
                : '2D Pocket View'
            }
          >
            {is2DFallbackActive ? (
              <>
                <Atom className="w-3.5 h-3.5 text-cyan-400" />
                <span>Switch to 3D Mol*</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>2D Pocket View</span>
              </>
            )}
          </button>

          {!is2DFallbackActive && (
            <button
              type="button"
              onClick={handleRecenterCamera}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              title="Recenter Camera: Reset orientation and zoom to active selection"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recenter Camera</span>
            </button>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3D WEBGL CANVAS OR 2D POCKET FALLBACK VIEW                        */}
      {/* ================================================================= */}
      <div className="flex-1 w-full relative bg-slate-950 overflow-hidden flex flex-col">
        {is2DFallbackActive ? (
          <div className="w-full h-full overflow-y-auto">
            <TwoDPocketFallbackView
              key={cleanPdbId}
              pdbId={cleanPdbId}
              targetName={targetName}
              geneSymbol={geneSymbol}
              detectedLigand={detectedLigand}
              medChemProfile={medChemProfile}
              activePharmacophoreGroup={activePharmacophoreGroup}
              onSelectPharmacophoreGroup={onSelectPharmacophoreGroup}
              onSelectPocketResidue={onSelectPocketResidue}
              onRetry3D={() => {
                setIs2DFallbackActive(false);
                setReloadTrigger((prev) => prev + 1);
              }}
              onOpenTutorial={onOpenTutorial}
              className="w-full h-full min-h-[500px]"
            />
          </div>
        ) : (
          <>
            {/* Mol* WebGL Canvas Target Container */}
            <div
              ref={containerRef}
              className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
              title="3D Molecular Graphics Canvas (Left-drag to rotate, Right-drag to pan, Scroll to zoom)"
            />

            {/* Clicked Atom Info Badge */}
            {clickedAtomInfo && (
              <div className="absolute top-3 left-3 z-20 px-2.5 py-1.5 rounded-md bg-slate-900/90 border border-cyan-500/60 text-xs shadow-lg backdrop-blur-xs flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-cyan-300 font-semibold">
                  {clickedAtomInfo.resn} {clickedAtomInfo.resi}:{clickedAtomInfo.atom}
                </span>
                <span className="text-[10px] text-slate-400">({clickedAtomInfo.elem})</span>
                <button
                  type="button"
                  onClick={() => setClickedAtomInfo(null)}
                  className="ml-1 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Dismiss atom info"
                >
                  ×
                </button>
              </div>
            )}

            {/* Floating Pharmacophore Chips Toolbar */}
            {medChemProfile && medChemProfile.pharmacophoreGroups.length > 0 && (
              <div
                data-testid="pharmacophore-chips-toolbar"
                className="absolute bottom-3 left-3 right-16 z-20 flex items-center gap-2 overflow-x-auto py-1.5 px-2 rounded-lg bg-slate-950/90 border border-slate-800 backdrop-blur-xs shadow-lg"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pharmacophores:</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {medChemProfile.pharmacophoreGroups.map((group) => {
                    const isActive = activePharmacophoreGroup?.id === group.id;
                    return (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => handleChipClick(group)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer shrink-0 border ${
                          isActive
                            ? 'bg-fuchsia-950/90 border-fuchsia-400 text-fuchsia-200 shadow-sm shadow-fuchsia-950'
                            : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white'
                        }`}
                        style={
                          isActive && group.colorAccent
                            ? { borderColor: group.colorAccent }
                            : undefined
                        }
                        title={`${group.name}: Click to focus 3D atoms and view PK/PD`}
                        aria-pressed={isActive}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: group.colorAccent || '#ec4899' }}
                        />
                        <span className="truncate max-w-[140px] sm:max-w-[200px]">
                          {group.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {onTogglePkDrawer && (
                  <button
                    type="button"
                    onClick={onTogglePkDrawer}
                    className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-600/80 text-indigo-200 transition-colors shrink-0 cursor-pointer"
                    title="Toggle PK & Clinical Effects Drawer"
                    aria-label="Toggle PK & Clinical Effects Drawer"
                    aria-pressed={isPkDrawerOpen}
                  >
                    <Pill className="w-3 h-3 text-indigo-400" />
                    <span>PK/PD</span>
                  </button>
                )}
              </div>
            )}

            {/* On-Canvas Floating Zoom Controls */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-20">
              <button
                type="button"
                onClick={handleZoomIn}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer shadow-md font-bold text-sm"
                title="Zoom in"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer shadow-md font-bold text-sm"
                title="Zoom out"
                aria-label="Zoom out"
              >
                −
              </button>
            </div>

            {/* Loading Indicator Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-30 p-4">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold text-slate-200">
                    Streaming Coordinates for PDB {cleanPdbId}...
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Streaming binary mmCIF (.bcif) &amp; initializing Mol* WebGL engine
                  </p>
                </div>
              </div>
            )}

            {/* Upgraded WebGL Diagnostic & Error Overlay */}
            {loadError && !isLoading && (() => {
              const isWebGlFailure =
                !isMolstarSupported() ||
                loadError.toLowerCase().includes('webgl') ||
                loadError.toLowerCase().includes('acceleration') ||
                loadError.toLowerCase().includes('context');

              return (
                <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center gap-4 z-30 p-6 text-center overflow-y-auto">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-rose-400" />
                  </div>

                  <div className="max-w-lg space-y-1.5">
                    <h3 className="text-base font-bold text-rose-300">
                      {`Unable to load 3D structure for ${cleanPdbId}`}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {isWebGlFailure
                        ? 'WebGL is not supported or graphics acceleration is disabled in your current browser environment.'
                        : 'Failed to stream macromolecular coordinates or structure. Please check your network connection or verify RCSB availability.'}
                    </p>
                    {loadError &&
                      loadError !==
                        'WebGL is not supported or graphics acceleration is disabled in your current browser environment.' && (
                        <p className="text-[11px] text-slate-400 font-mono bg-slate-900/80 px-2 py-1 rounded border border-slate-800 inline-block">
                          {loadError}
                        </p>
                      )}
                  </div>

                  {/* In-App Browser Diagnostic Card (displayed for WebGL issues) */}
                  {isWebGlFailure && (
                    <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-left shadow-lg space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>How to enable graphics acceleration:</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300">
                        <li className="leading-relaxed">
                          Open{' '}
                          <code className="text-cyan-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            chrome://settings/system
                          </code>{' '}
                          in browser address bar (or Settings &gt; System).
                        </li>
                        <li className="leading-relaxed">
                          Toggle ON{' '}
                          <strong className="text-slate-100">
                            "Use graphics acceleration when available"
                          </strong>
                          .
                        </li>
                        <li className="leading-relaxed">Relaunch browser and retry.</li>
                      </ol>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setIs2DFallbackActive(true)}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm shadow-cyan-950/50 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Switch to 2D Pocket Schematic</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReloadTrigger((prev) => prev + 1)}
                      className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Retry 3D WebGL</span>
                    </button>
                    <a
                      href={`https://www.rcsb.org/structure/${cleanPdbId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>View on RCSB</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* ================================================================= */}
      {/* BOTTOM NAVIGATION TIPS BAR                                        */}
      {/* ================================================================= */}
      <div className="px-3 py-1.5 bg-slate-950/95 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 shrink-0 select-none z-20">
        <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
          <Info className="w-3.5 h-3.5" />
          <span>Navigation:</span>
        </div>
        {is2DFallbackActive ? (
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-300">
            <span>Select Residue: Click contact card</span>
            <span>•</span>
            <span>Filter: Pharmacophore chip</span>
            <span>•</span>
            <span>Switch: Use toolbar button</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-300">
            <span>Rotate: Left-drag</span>
            <span>•</span>
            <span>Pan: Right-drag</span>
            <span>•</span>
            <span>Zoom: Scroll / Buttons</span>
            <span>•</span>
            <span>Recenter: Click atom</span>
          </div>
        )}
      </div>
    </div>
  );
};
