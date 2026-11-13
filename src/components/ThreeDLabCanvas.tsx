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
  Plus,
  Minus,
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
import { findMedChemProfile } from '../data/canonicalPharmacophorePkData';

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
}

declare global {
  interface Window {
    $3Dmol?: any;
  }
}

/**
 * 3Dmol WebGL Molecular Graphics Canvas with Ligand-First Rendering,
 * Dampened Scroll Zoom, On-Canvas Navigation & Pharmacophore Engine.
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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  // Scene state
  const [detectedLigand, setDetectedLigand] = useState<DetectedLigandInfo | null>(null);
  const [showPocket, setShowPocket] = useState<boolean>(false);
  const [showRibbon, setShowRibbon] = useState<boolean>(false);
  const [showHBonds, setShowHBonds] = useState<boolean>(false);
  const [showAtomLabels, setShowAtomLabels] = useState<boolean>(false);
  const [clickedAtomInfo, setClickedAtomInfo] = useState<{
    atom: string;
    resn: string;
    resi: number;
    chain: string;
    elem: string;
  } | null>(null);

  // Loading & error state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pdbCoordinates, setPdbCoordinates] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const cleanPdbId = pdbId ? pdbId.trim().toUpperCase() : '';

  // Canonical medicinal chemistry profile for pharmacophore groups & key pocket residues
  const medChemProfile: TargetMedChemProfile | undefined =
    (geneSymbol ? findMedChemProfile(geneSymbol) : undefined) ||
    (cleanPdbId ? findMedChemProfile(cleanPdbId) : undefined);

  // --------------------------------------------------------------------------
  // Scene Rendering Function
  // --------------------------------------------------------------------------
  const renderScene = useCallback(
    (
      viewer: any,
      ligand: DetectedLigandInfo | null,
      pocketActive: boolean,
      ribbonActive: boolean,
      hbondsActive: boolean,
      atomLabelsActive: boolean = false,
      pharmacophoreGroup: PharmacophorePkPdGroup | null = null
    ) => {
      if (!viewer) return;

      // 1. Reset existing styles, shapes, and residue labels
      viewer.setStyle({}, {});
      if (typeof viewer.removeAllShapes === 'function') {
        viewer.removeAllShapes();
      }
      if (typeof viewer.removeAllLabels === 'function') {
        viewer.removeAllLabels();
      }

      // 2. Always hide water molecules
      viewer.setStyle({ resn: 'HOH' }, {});
      viewer.setStyle({ resn: 'WAT' }, {});

      if (ligand) {
        // --- Ligand-Bound Complex Mode ---

        // Protein Backbone (Use { hetflag: false } to reliably select polymer residues)
        if (ribbonActive) {
          viewer.setStyle(
            { hetflag: false },
            { cartoon: { color: 'spectrum', opacity: 0.6 } }
          );
        } else {
          viewer.setStyle({ hetflag: false }, {});
        }

        // Binding Pocket Residues (5Å distance around ligand)
        if (pocketActive) {
          viewer.setStyle(
            { within: { distance: 5.0, sel: { resn: ligand.resn } } },
            { stick: { colorscheme: 'amino', radius: 0.15 } }
          );
          if (typeof viewer.addResLabels === 'function') {
            viewer.addResLabels(
              { within: { distance: 5.0, sel: { resn: ligand.resn } } },
              { fontSize: 10, fontColor: 'white', backgroundOpacity: 0.6 }
            );
          }
        }

        // High-contrast Ligand Sticks
        viewer.setStyle(
          { resn: ligand.resn },
          { stick: { colorscheme: 'cyanCarbon', radius: 0.25 } }
        );

        // Pharmacophore Group Accent Highlighting
        if (pharmacophoreGroup) {
          const hasAtoms =
            pharmacophoreGroup.atomNames && pharmacophoreGroup.atomNames.length > 0;
          const selector = hasAtoms
            ? { resn: ligand.resn, atom: pharmacophoreGroup.atomNames }
            : { resn: ligand.resn };
          try {
            viewer.setStyle(
              selector,
              { stick: { colorscheme: 'magentaCarbon', radius: 0.35 } }
            );
          } catch (err) {
            console.warn('Unable to style pharmacophore atoms:', err);
          }
        }

        // Ligand Atom Name Labels
        if (atomLabelsActive && typeof viewer.addPropertyLabels === 'function') {
          try {
            viewer.addPropertyLabels(
              "atom",
              { resn: ligand.resn },
              { fontSize: 11, fontColor: 'white', backgroundOpacity: 0.6 }
            );
          } catch (err) {
            console.warn('Unable to add ligand atom labels:', err);
          }
        }

        // Polar Hydrogen Bonds (Distance <= 3.2Å)
        if (hbondsActive && typeof viewer.selectedAtoms === 'function') {
          try {
            const ligandAtoms = viewer.selectedAtoms({ resn: ligand.resn }) || [];
            const pocketAtoms =
              viewer.selectedAtoms({
                within: { distance: 3.5, sel: { resn: ligand.resn } },
              }) || [];

            const isPolar = (a: any) => {
              const elem = (a.elem || '').toUpperCase();
              return elem === 'N' || elem === 'O';
            };

            const polarLigand = ligandAtoms.filter(isPolar);
            const polarPocket = pocketAtoms.filter(
              (a: any) => isPolar(a) && a.resn !== ligand.resn
            );

            for (const la of polarLigand) {
              for (const pa of polarPocket) {
                const dx = la.x - pa.x;
                const dy = la.y - pa.y;
                const dz = la.z - pa.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                // Classical hydrogen bond contact threshold: 1.8Å to 3.2Å
                if (dist <= 3.2 && dist >= 1.8) {
                  if (typeof viewer.addCylinder === 'function') {
                    viewer.addCylinder({
                      start: { x: la.x, y: la.y, z: la.z },
                      end: { x: pa.x, y: pa.y, z: pa.z },
                      radius: 0.06,
                      color: 'yellow',
                      fromCap: 1,
                      toCap: 1,
                      dashed: true,
                    });
                  }
                }
              }
            }
          } catch (err) {
            console.warn('Unable to compute polar hydrogen bonds:', err);
          }
        }
      } else {
        // --- Apo Protein Fallback Mode (No bound ligand) ---
        if (ribbonActive) {
          viewer.setStyle(
            { hetflag: false },
            { cartoon: { color: 'spectrum' } }
          );
        } else {
          viewer.setStyle({ hetflag: false }, {});
        }
      }

      viewer.render();
    },
    []
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
      viewerRef.current.zoom(zoomFactor);
      viewerRef.current.render();
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
        showRibbon,
        showHBonds,
        showAtomLabels,
        activePharmacophoreGroup
      );

      if (activePharmacophoreGroup) {
        const hasAtoms =
          activePharmacophoreGroup.atomNames && activePharmacophoreGroup.atomNames.length > 0;
        try {
          if (hasAtoms) {
            viewerRef.current.zoomTo({
              resn: detectedLigand.resn,
              atom: activePharmacophoreGroup.atomNames,
            });
          } else {
            viewerRef.current.zoomTo({ resn: detectedLigand.resn });
          }
        } catch (_) {
          viewerRef.current.zoomTo({ resn: detectedLigand.resn });
        }
      }
    }
  }, [
    activePharmacophoreGroup,
    detectedLigand,
    showPocket,
    showRibbon,
    showHBonds,
    showAtomLabels,
    renderScene,
  ]);

  // --------------------------------------------------------------------------
  // One-Click Scene Action Handlers
  // --------------------------------------------------------------------------
  const handleIsolateLigand = () => {
    setShowPocket(false);
    setShowRibbon(false);
    setShowHBonds(false);

    if (viewerRef.current) {
      renderScene(
        viewerRef.current,
        detectedLigand,
        false,
        false,
        false,
        showAtomLabels,
        activePharmacophoreGroup
      );
      if (detectedLigand) {
        viewerRef.current.zoomTo({ resn: detectedLigand.resn });
      } else {
        viewerRef.current.zoomTo();
      }
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
        showRibbon,
        showHBonds,
        showAtomLabels,
        activePharmacophoreGroup
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
        nextRibbon,
        showHBonds,
        showAtomLabels,
        activePharmacophoreGroup
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
        showRibbon,
        nextHBonds,
        showAtomLabels,
        activePharmacophoreGroup
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
        showRibbon,
        showHBonds,
        nextAtomLabels,
        activePharmacophoreGroup
      );
    }
  };

  const handleRecenterCamera = () => {
    if (viewerRef.current) {
      if (detectedLigand) {
        viewerRef.current.zoomTo({ resn: detectedLigand.resn });
      } else {
        viewerRef.current.zoomTo();
      }
    }
  };

  const handleZoomIn = () => {
    if (viewerRef.current) {
      viewerRef.current.zoom(1.15);
      viewerRef.current.render();
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      viewerRef.current.zoom(0.85);
      viewerRef.current.render();
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
  // Dynamic 3Dmol Script & Coordinate Fetch Lifecycle
  // --------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const loadPdbAndInit = async () => {
      if (!cleanPdbId) {
        setIsLoading(false);
        setLoadError('No PDB ID specified.');
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const pdbData = await fetchPdbCoordinates(cleanPdbId);
        if (!isMounted) return;

        setPdbCoordinates(pdbData);

        const ligand = identifyLigandResidue(pdbData, preferredLigandCode);
        setDetectedLigand(ligand);

        // Initial view settings
        const initialRibbon = !ligand; // Apo fallback defaults ribbon to visible
        const initialPocket = false;
        const initialHBonds = false;

        setShowRibbon(initialRibbon);
        setShowPocket(initialPocket);
        setShowHBonds(initialHBonds);

        // Check if 3Dmol is already available in DOM
        const setupViewer = () => {
          if (!isMounted || !containerRef.current || !window.$3Dmol) return;

          containerRef.current.innerHTML = '';
          const config = {
            backgroundColor: '#020617', // slate-950
            antialias: true,
          };

          const viewer = window.$3Dmol.createViewer(containerRef.current, config);
          viewerRef.current = viewer;

          viewer.addModel(pdbData, 'pdb');

          // Atom click for camera recentering and atom tooltip tag
          viewer.setClickable({}, true, (atom: any) => {
            if (atom) {
              setClickedAtomInfo({
                atom: atom.atom || atom.name || '',
                resn: atom.resn || '',
                resi: atom.resi,
                chain: atom.chain || '',
                elem: atom.elem || '',
              });

              if (onSelectPocketResidue && medChemProfile) {
                const matchedContact = medChemProfile.keyPocketResidues.find(
                  (r) => r.resi === atom.resi && (!r.resn || r.resn === atom.resn)
                );
                if (matchedContact) {
                  onSelectPocketResidue(matchedContact);
                }
              }

              if (viewerRef.current) {
                viewerRef.current.zoomTo({ resi: atom.resi, chain: atom.chain });
              }
            }
          });

          renderScene(
            viewer,
            ligand,
            initialPocket,
            initialRibbon,
            initialHBonds,
            showAtomLabels,
            activePharmacophoreGroup
          );

          if (ligand) {
            viewer.zoomTo({ resn: ligand.resn });
          } else {
            viewer.zoomTo();
          }

          viewer.render();
          setIsLoading(false);
        };

        if (!window.$3Dmol) {
          const existingScript = document.querySelector(
            'script[src="https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.4.2/3Dmol-min.js"]'
          );
          if (existingScript) {
            existingScript.addEventListener('load', setupViewer, { once: true });
          } else {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.4.2/3Dmol-min.js';
            script.async = true;
            script.onload = () => {
              if (isMounted) setupViewer();
            };
            script.onerror = () => {
              if (isMounted) {
                setLoadError('Failed to load 3Dmol.js WebGL graphics library.');
                setIsLoading(false);
              }
            };
            document.head.appendChild(script);
          }
        } else {
          setupViewer();
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error(`Error loading PDB ${cleanPdbId}:`, err);
        setLoadError(err?.message || `Failed to fetch coordinates for PDB ${cleanPdbId}`);
        setIsLoading(false);
      }
    };

    loadPdbAndInit();

    return () => {
      isMounted = false;
      if (viewerRef.current) {
        try {
          viewerRef.current.clear();
        } catch (_) {}
      }
    };
  }, [cleanPdbId, preferredLigandCode, reloadTrigger, renderScene]);

  // --------------------------------------------------------------------------
  // Resize handler for Fullscreen toggles
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (viewerRef.current && typeof viewerRef.current.resize === 'function') {
      const timer = setTimeout(() => {
        try {
          viewerRef.current.resize();
          viewerRef.current.render();
        } catch (_) {}
      }, 150);
      return () => clearTimeout(timer);
    }
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
              Ligand: {detectedLigand.resn} ({detectedLigand.atomCount} atoms)
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
      {/* SCENE CONTROLS TOOLBAR: One-Click Toggles                         */}
      {/* ================================================================= */}
      <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0 z-20">
        <div className="flex flex-wrap items-center gap-1.5">
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

          {/* Binding Pocket (5Å) (Additive Toggle) */}
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
            title="Binding Pocket (5Å): Toggle stick representation and labels for residues within 5Å of ligand"
            aria-pressed={showPocket}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Binding Pocket (5Å)</span>
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

          {/* Hydrogen Bonds (Additive Toggle) */}
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
            title="Hydrogen Bonds: Compute and display polar contacts <= 3.2Å"
            aria-pressed={showHBonds}
          >
            <Atom className="w-3.5 h-3.5 text-amber-400" />
            <span>Hydrogen Bonds</span>
          </button>

          {/* Atom Labels (Additive Toggle) */}
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
            title="Atom Labels: Display atom names for the bound ligand"
            aria-pressed={showAtomLabels}
          >
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Atom Labels</span>
          </button>
        </div>

        {/* Recenter Camera (Action) */}
        <div>
          <button
            type="button"
            onClick={handleRecenterCamera}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            title="Recenter Camera: Reset orientation and zoom to active selection"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recenter Camera</span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3D WEBGL CANVAS, CONTROLS & STATUS OVERLAYS                       */}
      {/* ================================================================= */}
      <div className="flex-1 w-full relative bg-slate-950 overflow-hidden">
        {/* WebGL Canvas Target Container */}
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
                Fetching Coordinates for PDB {cleanPdbId}...
              </p>
              <p className="text-[11px] text-slate-400">
                Parsing coordinates &amp; detecting primary small-molecule ligand
              </p>
            </div>
          </div>
        )}

        {/* Error State Overlay */}
        {loadError && !isLoading && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-3 z-30 p-6 text-center">
            <AlertCircle className="w-8 h-8 text-rose-400" />
            <div className="max-w-md space-y-1.5">
              <p className="text-xs font-bold text-rose-300">
                Unable to load 3D structure for {cleanPdbId}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">{loadError}</p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReloadTrigger((prev) => prev + 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
              >
                Retry
              </button>
              <a
                href={`https://www.rcsb.org/structure/${cleanPdbId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors inline-flex items-center gap-1"
              >
                <span>View on RCSB</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
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
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-300">
          <span>Rotate: Left-drag</span>
          <span>•</span>
          <span>Pan: Right-drag</span>
          <span>•</span>
          <span>Zoom: Scroll</span>
          <span>•</span>
          <span>Recenter: Click atom</span>
        </div>
      </div>
    </div>
  );
};
