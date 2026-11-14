import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Maximize2,
  Minimize2,
  HelpCircle,
  RotateCcw,
  ExternalLink,
  Layers,
  Dna,
  Atom,
  Sparkles,
  Compass,
  Info,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import {
  fetchPdbCoordinates,
  identifyLigandResidue,
  LIGAND_CODE_ALIASES,
  type DetectedLigandInfo,
} from '../services/structure3dService';
import type {
  Drug3DCatalogEntry,
  DrugBindingSite,
  LigandRenderMode,
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
  drugEntry?: Drug3DCatalogEntry;
  ligandMode?: LigandRenderMode;
  ligandChain?: string;
  activeBindingSite?: DrugBindingSite | null;
  onSelectBindingSite?: (site: DrugBindingSite | null) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenTutorial: () => void;
  targetName?: string;
  geneSymbol?: string;
  medChemProfile?: TargetMedChemProfile;
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

export const MOLSTAR_THEME_COLORS = {
  cyanCarbon: { r: 6, g: 182, b: 212 },
  magentaCarbon: { r: 236, g: 72, b: 153 },
  emeraldPocket: { r: 16, g: 185, b: 129 },
  amberHBond: { r: 245, g: 158, b: 11 },
  slateRibbon: { r: 100, g: 116, b: 139 },
  slateBg: { r: 2, g: 6, b: 23 },
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
 * Builds a strict Mol* mmCIF QueryParam for a bound drug ligand.
 * Never emits legacy fields (chem_comp_id, struct_asym_id, residue_number)
 * that fail on binary mmCIF (.bcif) structures.
 */
export function buildMolstarLigandQuery(
  ligand: Pick<DetectedLigandInfo, 'resn' | 'chain' | 'resi'> | null,
  ligandMode: LigandRenderMode = 'het'
): Record<string, unknown> | null {
  if (!ligand) return null;

  if (ligandMode === 'chain' || ligandMode === 'carbs') {
    const chainId = (ligand.chain || ligand.resn || '').trim();
    return chainId ? { auth_asym_id: chainId } : null;
  }

  const compId = (ligand.resn || '').trim();
  if (!compId) return null;

  const query: Record<string, unknown> = {
    label_comp_id: compId,
  };
  if (ligand.chain) {
    query.auth_asym_id = ligand.chain;
  }
  if (typeof ligand.resi === 'number' && ligand.resi > 0) {
    query.auth_seq_id = ligand.resi;
  }
  return query;
}

/**
 * Builds a strict Mol* mmCIF QueryParam for a receptor binding-pocket residue.
 */
export function buildMolstarResidueQuery(
  chain: string,
  resi: number
): { auth_asym_id: string; auth_seq_id: number } {
  return {
    auth_asym_id: chain,
    auth_seq_id: resi,
  };
}

/**
 * Resolves a static catalog fallback ligand descriptor when PDBe text coordinate
 * pre-parsing fails, times out, or when rendering peptide ('chain') / oligosaccharide ('carbs') ligands.
 */
export function resolveFallbackLigandFromCatalog(
  preferredLigandCode?: string,
  ligandChain?: string,
  ligandMode: LigandRenderMode = 'het'
): DetectedLigandInfo | null {
  if (ligandMode === 'chain' || ligandMode === 'carbs') {
    const chain = (ligandChain || preferredLigandCode || '').trim();
    if (!chain) return null;
    return {
      resn: (preferredLigandCode || chain).trim(),
      chain,
      resi: 0,
      atomCount: 1,
    };
  }

  const rawCode = preferredLigandCode?.trim().toUpperCase();
  if (!rawCode) return null;
  const resolvedCode = (LIGAND_CODE_ALIASES[rawCode] || rawCode).toUpperCase();

  return {
    resn: resolvedCode,
    chain: (ligandChain || '').trim(),
    resi: 0,
    atomCount: 1,
  };
}

/**
 * Drug-Centered Mol* (MolStar) WebGL Molecular Graphics Canvas.
 * Disposes previous plugin instances cleanly on drug transitions, queries binary mmCIF
 * coordinates strictly via label_comp_id / auth_asym_id / auth_seq_id, and supports
 * 'het', 'chain', and 'carbs' ligand modes plus clickable Binding Site walkthroughs.
 */
export const ThreeDLabCanvas: React.FC<ThreeDLabCanvasProps> = ({
  pdbId,
  preferredLigandCode,
  drugEntry,
  ligandMode,
  ligandChain,
  activeBindingSite = null,
  onSelectBindingSite,
  isFullscreen,
  onToggleFullscreen,
  onOpenTutorial,
  targetName,
  geneSymbol,
  medChemProfile: propMedChemProfile,
  activePharmacophoreGroup = null,
  onSelectPharmacophoreGroup,
  onSelectPocketResidue,
  initial2DFallback = false,
  initialLoadError = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const loadGenerationRef = useRef<number>(0);

  const [is2DFallbackActive, setIs2DFallbackActive] = useState<boolean>(initial2DFallback);
  const [detectedLigand, setDetectedLigand] = useState<DetectedLigandInfo | null>(null);
  const [showRibbon, setShowRibbon] = useState<boolean>(true);
  const [subPocketColorMode, setSubPocketColorMode] = useState<boolean>(true);
  const [clickedAtomInfo, setClickedAtomInfo] = useState<{
    atom: string;
    resn: string;
    resi: number;
    chain: string;
    elem: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(!initialLoadError);
  const [loadError, setLoadError] = useState<string | null>(initialLoadError);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const cleanPdbId = (pdbId || drugEntry?.pdbId || '').trim().toUpperCase();
  const effectiveLigandMode: LigandRenderMode = ligandMode || drugEntry?.ligandMode || 'het';
  const effectiveLigandCode = preferredLigandCode || drugEntry?.ligandCode;
  const effectiveLigandChain = ligandChain || drugEntry?.ligandChain;
  const effectiveTargetName = drugEntry?.targetName || targetName;
  const effectiveGeneSymbol = drugEntry?.geneSymbol || geneSymbol;

  const medChemProfile: TargetMedChemProfile | undefined = useMemo(() => {
    const legacy =
      propMedChemProfile ||
      (effectiveGeneSymbol ? findMedChemProfile(effectiveGeneSymbol) : undefined) ||
      (cleanPdbId ? findMedChemProfile(cleanPdbId) : undefined);
    if (legacy) return legacy;
    if (!drugEntry) return undefined;

    return {
      targetGeneSymbol: drugEntry.geneSymbol,
      pdbId: cleanPdbId || drugEntry.pdbId,
      drugName: drugEntry.genericName,
      ligandCode: drugEntry.ligandCode,
      pharmacophoreGroups: drugEntry.bindingSites.map((site) => ({
        id: site.id,
        name: site.drugMoiety,
        atomNames: [],
        colorAccent: site.colorAccent,
        pharmacokinetics: {
          absorption: drugEntry.pharmacologicClass,
          metabolism: drugEntry.prodrugNote || 'Direct active binding species in target pocket.',
          prodrugRole: drugEntry.prodrugNote,
          halfLifeAndClearance: `${drugEntry.targetName} (${drugEntry.geneSymbol})`,
        },
        clinicalPharmacodynamics: {
          targetBindingRole: site.reactionSummary,
          physiologicEffect: drugEntry.overallMechanism,
          adverseEffectRisks: site.clinicalRelevance,
        },
      })),
      keyPocketResidues: drugEntry.bindingSites.flatMap((site) =>
        site.residues.map((res) => ({
          resi: res.resi,
          resn: res.resn,
          chain: res.chain,
          label: res.label,
          interactionType: site.interactionType,
          clinicalImpact: `${site.reactionSummary} ${site.clinicalRelevance}`,
          subPocketName: site.siteName,
          pharmacophoreGroupId: site.id,
          colorAccent: site.colorAccent,
        }))
      ),
    };
  }, [propMedChemProfile, effectiveGeneSymbol, cleanPdbId, drugEntry]);

  // --------------------------------------------------------------------------
  // Scene Rendering Function via Mol* Visual Engine
  // --------------------------------------------------------------------------
  const renderScene = useCallback(
    (
      viewer: any,
      ligand: DetectedLigandInfo | null,
      ribbonActive: boolean,
      subPocketZonesActive: boolean,
      selectedSite: DrugBindingSite | null = null,
      pharmacophoreGroup: PharmacophorePkPdGroup | null = null
    ) => {
      if (!viewer) return;

      try {
        if (typeof viewer.visual?.clearHighlight === 'function') {
          viewer.visual.clearHighlight();
        }

        // 1. Suppress global HETATM clutter while keeping polymer ribbon (and carbs when ligandMode === 'carbs')
        if (typeof viewer.visual?.visibility === 'function') {
          viewer.visual.visibility({
            polymer: ribbonActive,
            het: false,
            water: false,
            carbs: effectiveLigandMode === 'carbs',
            nonStandard: false,
          });
        }

        if (typeof viewer.visual?.update === 'function') {
          viewer.visual.update({
            cartoon: ribbonActive,
            pocket: Boolean(ligand),
            pocketDistance: 5.0,
            surface: false,
            interactions: Boolean(ligand),
            atomLabels: false,
          });
        }

        const singleLigandQuery = buildMolstarLigandQuery(ligand, effectiveLigandMode);
        const allResidueQueries: Array<{ auth_asym_id: string; auth_seq_id: number }> = [];
        const activeSiteResidueQueries: Array<{ auth_asym_id: string; auth_seq_id: number }> = [];
        const tooltipItems: any[] = [];

        if (typeof viewer.visual?.select === 'function') {
          const selectData: any[] = [];

          // A. Bound drug ligand in ball-and-stick with CPK heteroatoms + cyan carbon skeleton
          if (ligand && singleLigandQuery) {
            selectData.push({
              ...singleLigandQuery,
              representation: 'ball-and-stick',
              color: null,
            });

            selectData.push({
              ...singleLigandQuery,
              type_symbol: 'C',
              representation: 'ball-and-stick',
              representationColor: MOLSTAR_THEME_COLORS.cyanCarbon,
              color: null,
            });

            tooltipItems.push({
              ...singleLigandQuery,
              tooltip: `Bound Drug Ligand: ${drugEntry?.crystallizedLigandName || ligand.resn} (Chain ${ligand.chain || effectiveLigandChain || 'A'})`,
            });

            if (ligand.catalyticMetals?.length) {
              for (const metal of ligand.catalyticMetals) {
                selectData.push({
                  label_comp_id: metal.resn,
                  auth_asym_id: metal.chain,
                  auth_seq_id: metal.resi,
                  representation: 'ball-and-stick',
                  color: null,
                });
              }
            }
          }

          // B. Drug Binding Sites (primary) or fallback MedChem pocket residues
          if (drugEntry?.bindingSites?.length) {
            for (const site of drugEntry.bindingSites) {
              const isSiteActive = selectedSite?.id === site.id;
              const siteRgb = subPocketZonesActive
                ? hexToRgbColor(site.colorAccent, MOLSTAR_THEME_COLORS.emeraldPocket)
                : isSiteActive
                ? MOLSTAR_THEME_COLORS.magentaCarbon
                : MOLSTAR_THEME_COLORS.emeraldPocket;

              for (const residue of site.residues) {
                const targetChain = residue.chain || ligand?.chain || effectiveLigandChain || 'A';
                const resQuery = buildMolstarResidueQuery(targetChain, residue.resi);
                allResidueQueries.push(resQuery);
                if (isSiteActive) {
                  activeSiteResidueQueries.push(resQuery);
                }

                selectData.push({
                  ...resQuery,
                  representation: 'ball-and-stick',
                  color: null,
                });

                selectData.push({
                  ...resQuery,
                  type_symbol: 'C',
                  representation: 'ball-and-stick',
                  representationColor: siteRgb,
                  color: siteRgb,
                });

                tooltipItems.push({
                  ...resQuery,
                  tooltip: `${residue.label} • ${site.siteName} (${site.interactionType})`,
                });
              }
            }
          } else if (medChemProfile?.keyPocketResidues?.length) {
            for (const residue of medChemProfile.keyPocketResidues) {
              const targetChain = residue.chain || ligand?.chain || 'A';
              const resQuery = buildMolstarResidueQuery(targetChain, residue.resi);
              allResidueQueries.push(resQuery);
              const resRgb = subPocketZonesActive
                ? hexToRgbColor(
                    resolvePocketResidueColor(residue, medChemProfile),
                    MOLSTAR_THEME_COLORS.emeraldPocket
                  )
                : MOLSTAR_THEME_COLORS.emeraldPocket;

              selectData.push({
                ...resQuery,
                representation: 'ball-and-stick',
                color: null,
              });

              selectData.push({
                ...resQuery,
                type_symbol: 'C',
                representation: 'ball-and-stick',
                representationColor: resRgb,
                color: resRgb,
              });

              tooltipItems.push({
                ...resQuery,
                tooltip: `${residue.label} • ${residue.subPocketName || residue.interactionType} (${residue.interactionType})`,
              });
            }
          }

          // C. Optional legacy pharmacophore atom accenting
          if (pharmacophoreGroup && ligand && singleLigandQuery && effectiveLigandMode === 'het') {
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
            });
          }

          if (selectData.length > 0) {
            viewer.visual.select({
              data: selectData,
              nonSelectedColor: MOLSTAR_THEME_COLORS.slateRibbon,
              nonSelectedOpacity: ligand ? 0.28 : 0.85,
            });
          }
        }

        // 3. Trigger Mol* 5Å pocket contacts & non-covalent interactions
        if (ligand && singleLigandQuery && typeof viewer.visual?.interactivityFocus === 'function') {
          viewer.visual.interactivityFocus({
            data: [singleLigandQuery],
          });
        }

        // 4. Attach 3D hover tooltips
        if (tooltipItems.length > 0 && typeof viewer.visual?.tooltips === 'function') {
          viewer.visual.tooltips({ data: tooltipItems });
        }

        // 5. Highlight active binding site residues
        if (selectedSite && activeSiteResidueQueries.length > 0 && typeof viewer.visual?.highlight === 'function') {
          const highlightRgb = hexToRgbColor(selectedSite.colorAccent, MOLSTAR_THEME_COLORS.magentaCarbon);
          viewer.visual.highlight({
            data: activeSiteResidueQueries.map((q) => ({
              ...q,
              color: highlightRgb,
            })),
          });
        }

        // 6. Focus camera on active Binding Site + ligand, or full pocket + ligand
        if (typeof viewer.visual?.focus === 'function') {
          if (selectedSite && activeSiteResidueQueries.length > 0) {
            const focusTargets = singleLigandQuery
              ? [singleLigandQuery, ...activeSiteResidueQueries]
              : [...activeSiteResidueQueries];
            viewer.visual.focus(focusTargets);
          } else if (singleLigandQuery) {
            viewer.visual.focus([singleLigandQuery, ...allResidueQueries]);
          }
        }
      } catch (err) {
        console.warn('Mol* scene styling notification:', err);
      }
    },
    [drugEntry, effectiveLigandChain, effectiveLigandMode, medChemProfile]
  );

  const latestRenderSceneRef = useRef(renderScene);
  latestRenderSceneRef.current = renderScene;

  const latestConfigRef = useRef({
    drugEntry,
    effectiveLigandCode,
    effectiveLigandChain,
    showRibbon,
    subPocketColorMode,
    activeBindingSite,
    activePharmacophoreGroup,
    medChemProfile,
    onSelectBindingSite,
    onSelectPocketResidue,
  });
  latestConfigRef.current = {
    drugEntry,
    effectiveLigandCode,
    effectiveLigandChain,
    showRibbon,
    subPocketColorMode,
    activeBindingSite,
    activePharmacophoreGroup,
    medChemProfile,
    onSelectBindingSite,
    onSelectPocketResidue,
  };

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
  // Synchronize Active Binding Site or Toggle State Changes
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (viewerRef.current && detectedLigand) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        showRibbon,
        subPocketColorMode,
        activeBindingSite,
        activePharmacophoreGroup
      );
    }
  }, [
    detectedLigand,
    showRibbon,
    subPocketColorMode,
    activeBindingSite,
    activePharmacophoreGroup,
    renderScene,
  ]);

  // --------------------------------------------------------------------------
  // Simplified Drug Studio Scene Action Handlers
  // --------------------------------------------------------------------------
  const handleResetView = () => {
    onSelectBindingSite?.(null);
    setClickedAtomInfo(null);
    if (viewerRef.current) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        showRibbon,
        subPocketColorMode,
        null,
        activePharmacophoreGroup
      );
      if (typeof viewerRef.current.visual?.reset === 'function') {
        viewerRef.current.visual.reset({ camera: true });
      } else if (viewerRef.current.plugin?.canvas3d?.requestCameraReset) {
        viewerRef.current.plugin.canvas3d.requestCameraReset();
      } else if (typeof viewerRef.current.zoomTo === 'function') {
        viewerRef.current.zoomTo();
      }
    }
  };

  const handleToggleRibbon = () => {
    const nextRibbon = !showRibbon;
    setShowRibbon(nextRibbon);
    if (viewerRef.current) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        nextRibbon,
        subPocketColorMode,
        activeBindingSite,
        activePharmacophoreGroup
      );
    }
  };

  const handleToggleSubPocketColorMode = () => {
    const nextMode = !subPocketColorMode;
    setSubPocketColorMode(nextMode);
    if (viewerRef.current) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        showRibbon,
        nextMode,
        activeBindingSite,
        activePharmacophoreGroup
      );
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

  // --------------------------------------------------------------------------
  // Mol* WebGL Initialization, Fresh Child Mount & Clean Disposal
  // --------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    let mountNode: HTMLDivElement | null = null;
    const abortController = new AbortController();
    const generation = ++loadGenerationRef.current;

    const loadMolstarAndInit = async () => {
      if (!cleanPdbId) {
        setIsLoading(false);
        setLoadError('No PDB ID specified.');
        return;
      }

      setIsLoading(true);
      setLoadError(null);
      setClickedAtomInfo(null);

      if (!isMolstarSupported()) {
        if (typeof window !== 'undefined') {
          setLoadError(
            'WebGL is not supported or graphics acceleration is disabled in your current browser environment.'
          );
          setIsLoading(false);
          return;
        }
      }

      try {
        const currentCfg = latestConfigRef.current;
        const resolvedCode = preferredLigandCode || currentCfg.effectiveLigandCode;
        const resolvedChain = currentCfg.effectiveLigandChain;
        let ligand: DetectedLigandInfo | null = null;

        // 1. Pre-parse text PDB coordinates only when catalog drugEntry metadata is absent (avoids blocking .bcif on .ent timeouts)
        if (effectiveLigandMode === 'het' && !currentCfg.drugEntry) {
          try {
            const pdbData = await fetchPdbCoordinates(cleanPdbId, abortController.signal);
            if (!isMounted || generation !== loadGenerationRef.current) return;
            ligand = identifyLigandResidue(pdbData, resolvedCode, resolvedChain);
          } catch (coordErr) {
            if (abortController.signal.aborted) return;
            console.warn(
              `[ThreeDLabCanvas] Non-fatal: Could not pre-fetch text PDB coordinates for ${cleanPdbId}, falling back to static catalog ligand:`,
              coordErr
            );
          }
        }

        if (!isMounted || generation !== loadGenerationRef.current) return;

        // Static catalog fallback for 'chain', 'carbs', or if coordinate pre-fetch failed / returned null
        if (!ligand) {
          ligand = resolveFallbackLigandFromCatalog(
            resolvedCode,
            resolvedChain,
            effectiveLigandMode
          );
        }

        setDetectedLigand(ligand);
        setShowRibbon(true);

        // 2. Resolve Binary mmCIF (.bcif) coordinate URL
        const bcifUrl = getBinaryCifUrl(cleanPdbId);
        const coordinateUrl = (await getCachedCoordinateUrl(cleanPdbId)) || bcifUrl;
        if (!isMounted || generation !== loadGenerationRef.current) return;

        // 3. Dynamically load Mol* / PDBeMolstar plugin
        await loadMolstarPluginScript();
        if (!isMounted || generation !== loadGenerationRef.current || !containerRef.current) {
          return;
        }

        mountNode = document.createElement('div');
        mountNode.className = 'w-full h-full relative';
        containerRef.current.replaceChildren(mountNode);

        const MolstarPluginClass =
          (window as any).PDBeMolstarPlugin || (window as any).molstar?.PDBeMolstarPlugin;

        let viewer: any = null;
        if (typeof MolstarPluginClass === 'function') {
          viewer = new MolstarPluginClass();
        } else if (typeof (window as any).molstar?.createViewer === 'function') {
          viewer = (window as any).molstar.createViewer(mountNode);
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
              dispose: () => {},
              canvas3d: {
                camera: { zoom: () => {} },
                requestCameraReset: () => {},
                requestResize: () => {},
              },
            },
          };
        }

        viewerRef.current = viewer;

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
          hideStructure:
            effectiveLigandMode === 'carbs'
              ? ['het', 'water', 'nonStandard']
              : ['het', 'water', 'carbs', 'nonStandard'],
          loadMaps: false,
          lighting: 'matte',
          alphafoldView: false,
        };

        const applyLatestScene = () => {
          if (!isMounted || generation !== loadGenerationRef.current) return;
          const cfg = latestConfigRef.current;
          latestRenderSceneRef.current(
            viewer,
            ligand,
            true,
            cfg.subPocketColorMode,
            cfg.activeBindingSite,
            cfg.activePharmacophoreGroup
          );
        };

        if (typeof viewer.render === 'function') {
          await viewer.render(mountNode, molstarOptions);
          if (!isMounted || generation !== loadGenerationRef.current) return;
          applyLatestScene();
        }

        if (viewer.events?.loadComplete?.subscribe) {
          viewer.events.loadComplete.subscribe(() => {
            applyLatestScene();
          });
        }

        if (viewer.plugin?.behaviors?.interaction?.click?.subscribe) {
          viewer.plugin.behaviors.interaction.click.subscribe((event: any) => {
            if (!isMounted || generation !== loadGenerationRef.current || !event?.current) {
              return;
            }
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

            const cfg = latestConfigRef.current;
            if (cfg.onSelectBindingSite && cfg.drugEntry?.bindingSites?.length) {
              const matchedSite = cfg.drugEntry.bindingSites.find((site) =>
                site.residues.some(
                  (r) => r.resi === resSeq && (!r.chain || r.chain === chainId)
                )
              );
              if (matchedSite) {
                cfg.onSelectBindingSite(matchedSite);
              }
            }

            if (cfg.onSelectPocketResidue && cfg.medChemProfile) {
              const matchedContact = cfg.medChemProfile.keyPocketResidues.find(
                (r) => r.resi === resSeq && (!r.resn || r.resn === resName)
              );
              if (matchedContact) {
                cfg.onSelectPocketResidue(matchedContact);
              }
            }
          });
        }

        applyLatestScene();
        setIsLoading(false);
      } catch (err: any) {
        if (!isMounted || generation !== loadGenerationRef.current) return;
        console.error(`Error initializing Mol* for PDB ${cleanPdbId}:`, err);
        setLoadError(err?.message || `Failed to stream coordinates for PDB ${cleanPdbId}`);
        setIsLoading(false);
      }
    };

    loadMolstarAndInit();

    return () => {
      isMounted = false;
      abortController.abort();
      const activeViewer = viewerRef.current;
      viewerRef.current = null;
      if (activeViewer) {
        try {
          if (typeof activeViewer.plugin?.dispose === 'function') {
            activeViewer.plugin.dispose();
          } else if (typeof activeViewer.clear === 'function') {
            activeViewer.clear();
          } else if (typeof activeViewer.destroy === 'function') {
            activeViewer.destroy();
          }
        } catch (_) {}
      }
      mountNode?.remove();
    };
  }, [cleanPdbId, preferredLigandCode, effectiveLigandMode, reloadTrigger]);

  // --------------------------------------------------------------------------
  // Resize handler for Fullscreen toggles & Panel Collapse
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

  const primaryTitle = drugEntry?.genericName || effectiveTargetName || 'Co-crystal Complex';

  return (
    <div
      className={`flex flex-col w-full h-full bg-slate-950 text-white relative overflow-hidden select-none ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* ================================================================= */}
      {/* TOP HEADER: Drug Identity, Exact/Class Crystal Badge & Actions    */}
      {/* ================================================================= */}
      <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 z-20">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="font-bold text-sm text-white truncate max-w-[200px] sm:max-w-[280px]">
            {primaryTitle}
          </span>
          {drugEntry && effectiveTargetName && (
            <span className="text-slate-300 font-medium truncate max-w-[180px] sm:max-w-[240px]">
              • {effectiveTargetName}
            </span>
          )}
          {effectiveGeneSymbol && (
            <span className="text-[10px] font-mono text-slate-400">
              [{effectiveGeneSymbol}]
            </span>
          )}

          {drugEntry ? (
            drugEntry.isExactDrugCrystal ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-600/60">
                Exact Drug Crystal (PDB {cleanPdbId})
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/90 text-amber-300 border border-amber-600/60">
                Class Pocket Crystal: {drugEntry.crystallizedLigandName} (PDB {cleanPdbId})
              </span>
            )
          ) : (
            <>
              <span className="px-2 py-0.5 font-mono font-bold rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/60">
                {cleanPdbId}
              </span>
              {!detectedLigand && !isLoading && !loadError && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Apo Protein (No bound ligand)
                </span>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={`https://www.rcsb.org/structure/${cleanPdbId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium text-[11px]"
            title={`View PDB ${cleanPdbId} on RCSB Portal (opens in new tab)`}
          >
            <span>RCSB</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            type="button"
            onClick={onOpenTutorial}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 transition-colors font-semibold text-[11px] cursor-pointer shadow-xs"
            title="Open 3D Lab Guide"
            aria-label="Open 3D Lab Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Guide</span>
          </button>

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
      {/* SIMPLIFIED SCENE CONTROLS BAR                                     */}
      {/* ================================================================= */}
      <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0 z-20">
        {is2DFallbackActive ? (
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 py-0.5">
              <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-cyan-950/80 text-cyan-300 border border-cyan-800/80">
                2D Pocket Schematic Active
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Interactive contact map &amp; SAR analysis mode
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIs2DFallbackActive(false);
                setReloadTrigger((prev) => prev + 1);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border bg-cyan-950/90 hover:bg-cyan-900 border-cyan-400 text-cyan-200 shadow-xs"
              title="Switch to 3D Mol* WebGL Viewer"
              aria-label="Switch to 3D Mol*"
            >
              <Atom className="w-3.5 h-3.5 text-cyan-400" />
              <span>Switch to 3D Mol*</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handleResetView}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              title="Reset View: Recenter camera on drug and full binding pocket"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset View</span>
            </button>

            <button
              type="button"
              onClick={handleToggleRibbon}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
                showRibbon
                  ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Protein Ribbon: Show or hide receptor secondary structure cartoon"
              aria-pressed={showRibbon}
            >
              <Dna className="w-3.5 h-3.5 text-purple-400" />
              <span>Protein Ribbon</span>
            </button>

            <button
              type="button"
              onClick={handleToggleSubPocketColorMode}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
                subPocketColorMode
                  ? 'bg-fuchsia-950/80 border-fuchsia-500 text-fuchsia-200 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Sub-Pocket Colors: Color-code binding site residues to match their Binding Site cards"
              aria-pressed={subPocketColorMode}
            >
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Sub-Pocket Colors</span>
            </button>
          </div>
        )}
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
              targetName={effectiveTargetName}
              geneSymbol={effectiveGeneSymbol}
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
            <div
              ref={containerRef}
              className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
              title="3D Molecular Graphics Canvas (Left-drag to rotate, Right-drag to pan, Scroll to zoom)"
            />

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

            {isLoading && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-30 p-4">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold text-slate-200">
                    Streaming Coordinates for PDB {cleanPdbId}...
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Streaming binary mmCIF (.bcif) &amp; isolating drug binding pocket
                  </p>
                </div>
              </div>
            )}

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
