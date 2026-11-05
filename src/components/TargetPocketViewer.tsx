import React, { useState, useEffect, useRef } from 'react';
import { ChemicalStructure } from '../types/reviewModule';
import { TargetPocketProfile, TargetResidue, findTargetPocketForStructure } from '../data/targetPocketData';
import {
  ExternalLink,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Maximize2,
  Atom,
  Dna,
  Layers,
  Compass,
  Play,
  Pause,
  Info,
  Check
} from 'lucide-react';

interface TargetPocketViewerProps {
  structure: ChemicalStructure;
  customProfile?: TargetPocketProfile;
  className?: string;
  onSelectResidue?: (residue: TargetResidue) => void;
}

declare global {
  interface Window {
    $3Dmol?: any;
  }
}

export const TargetPocketViewer: React.FC<TargetPocketViewerProps> = ({
  structure,
  customProfile,
  className = '',
  onSelectResidue
}) => {
  const profile = customProfile || findTargetPocketForStructure(structure);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  const [renderStyle, setRenderStyle] = useState<'cartoon' | 'surface' | 'stick' | 'spacefill'>('cartoon');
  const [showResidueSticks, setShowResidueSticks] = useState<boolean>(true);
  const [selectedResidueNum, setSelectedResidueNum] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isLoading3D, setIsLoading3D] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Dynamic 3Dmol script loader
  useEffect(() => {
    let isMounted = true;

    const initViewer = () => {
      if (!isMounted || !containerRef.current || !profile) return;
      if (!window.$3Dmol) return;

      try {
        setIsLoading3D(true);
        setLoadError(null);

        // Clear existing canvas
        containerRef.current.innerHTML = '';

        const config = {
          backgroundColor: '#0f172a', // slate-900
          antialias: true
        };

        const viewer = window.$3Dmol.createViewer(containerRef.current, config);
        viewerRef.current = viewer;

        // Fetch PDB coordinates from RCSB
        const pdbUrl = `https://files.rcsb.org/download/${profile.pdbId}.pdb`;

        fetch(pdbUrl)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status} fetching PDB ${profile.pdbId}`);
            return res.text();
          })
          .then((pdbData) => {
            if (!isMounted) return;
            viewer.addModel(pdbData, 'pdb');

            applyViewerStyle(viewer, renderStyle, showResidueSticks, profile, selectedResidueNum);

            viewer.zoomTo();
            viewer.render();
            setIsLoading3D(false);
          })
          .catch((err) => {
            if (!isMounted) return;
            console.warn('3Dmol direct PDB download failed, trying mmCIF fallback:', err);
            // Fallback: try mmCIF
            const cifUrl = `https://files.rcsb.org/download/${profile.pdbId}.cif`;
            fetch(cifUrl)
              .then((r) => r.text())
              .then((cifData) => {
                if (!isMounted) return;
                viewer.addModel(cifData, 'cif');
                applyViewerStyle(viewer, renderStyle, showResidueSticks, profile, selectedResidueNum);
                viewer.zoomTo();
                viewer.render();
                setIsLoading3D(false);
              })
              .catch((cifErr) => {
                if (!isMounted) return;
                console.error('3Dmol structure load error:', cifErr);
                setLoadError(`Interactive 3D preview offline. View via RCSB or Antigravity Sidecar.`);
                setIsLoading3D(false);
              });
          });
      } catch (err: any) {
        if (!isMounted) return;
        setLoadError(err?.message || 'Error initializing 3D viewer');
        setIsLoading3D(false);
      }
    };

    if (!window.$3Dmol) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.4.2/3Dmol-min.js';
      script.async = true;
      script.onload = () => {
        initViewer();
      };
      script.onerror = () => {
        if (isMounted) {
          setLoadError('WebGL 3D engine script unavailable. Explore via RCSB PDB or Sidecar.');
          setIsLoading3D(false);
        }
      };
      document.head.appendChild(script);
    } else {
      initViewer();
    }

    return () => {
      isMounted = false;
      if (viewerRef.current) {
        try {
          viewerRef.current.clear();
        } catch (_) {}
      }
    };
  }, [profile?.pdbId]);

  // Update styles on viewer
  const applyViewerStyle = (
    viewer: any,
    style: string,
    showSticks: boolean,
    p: TargetPocketProfile,
    highlightRes: number | null
  ) => {
    if (!viewer) return;
    viewer.setStyle({}, {}); // Clear old styles

    // Main protein backbone
    if (style === 'cartoon') {
      viewer.setStyle({ hetflag: false }, { cartoon: { color: 'spectrum', opacity: 0.85 } });
    } else if (style === 'stick') {
      viewer.setStyle({ hetflag: false }, { stick: { colorscheme: 'amino', radius: 0.15 } });
    } else if (style === 'spacefill') {
      viewer.setStyle({ hetflag: false }, { sphere: { colorscheme: 'amino', scale: 0.3 } });
    } else if (style === 'surface') {
      viewer.setStyle({ hetflag: false }, { cartoon: { color: 'lightgray', opacity: 0.5 } });
      try {
        viewer.addSurface(window.$3Dmol.SurfaceType.VDW, { opacity: 0.4, color: 'white' });
      } catch (_) {}
    }

    // Always highlight coordinating heteroatoms and ions (e.g. Zn2+, Mg2+, Ca2+, Na+)
    viewer.setStyle(
      { hetflag: true },
      {
        sphere: { radius: 1.2, color: 'gold' },
        stick: { radius: 0.25, colorscheme: 'element' }
      }
    );

    // Key Pocket Residues as Ball & Sticks with designated colors
    if (showSticks && p.keyResidues.length > 0) {
      p.keyResidues.forEach((res) => {
        const isSelected = highlightRes === res.residueNumber;
        viewer.addStyle(
          { resi: res.residueNumber },
          {
            stick: {
              color: res.color,
              radius: isSelected ? 0.45 : 0.25
            },
            sphere: {
              color: res.color,
              radius: isSelected ? 0.6 : 0.35
            }
          }
        );
      });
    }

    viewer.render();
  };

  // Re-apply style when state changes
  useEffect(() => {
    if (viewerRef.current && profile) {
      applyViewerStyle(viewerRef.current, renderStyle, showResidueSticks, profile, selectedResidueNum);
    }
  }, [renderStyle, showResidueSticks, selectedResidueNum, profile]);

  // Handle spin toggle
  useEffect(() => {
    if (!viewerRef.current) return;
    if (isSpinning) {
      viewerRef.current.spin('y', 1);
    } else {
      viewerRef.current.spin(false);
    }
  }, [isSpinning]);

  const handleSelectResidue = (res: TargetResidue) => {
    setSelectedResidueNum(res.residueNumber);
    if (onSelectResidue) onSelectResidue(res);

    if (viewerRef.current) {
      try {
        // Zoom and center on selected residue
        viewerRef.current.zoomTo({ resi: res.residueNumber }, 800);
      } catch (_) {}
    }
  };

  const handleResetOrientation = () => {
    setSelectedResidueNum(null);
    if (viewerRef.current) {
      try {
        viewerRef.current.setRotation([0, 0, 0]);
        viewerRef.current.zoomTo();
        viewerRef.current.render();
      } catch (_) {}
    }
  };

  const handleCopySidecarLink = () => {
    navigator.clipboard.writeText('sidecar://science/biomolecular_structure_viewer/ui.html');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!profile) {
    return (
      <div className={`p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center ${className}`}>
        <Atom className="w-10 h-10 mx-auto text-slate-400 mb-2" />
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
          Target Pocket Profile Not Found
        </h4>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          No macromolecular pocket profile is currently indexed for {structure?.name || 'this structure'}. Check the 2D pharmacophore details.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Target Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/90 via-slate-900 to-slate-900 text-white p-4 rounded-2xl border border-indigo-700/50 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider">
                3D Macromolecular Target Pocket
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                PDB: {profile.pdbId}
              </span>
              {profile.resolution && (
                <span className="text-[10px] text-slate-400">({profile.resolution})</span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white mt-1">
              {profile.targetName}
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              {profile.pocketName} &bull; <span className="italic">{profile.organism}</span>
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://www.rcsb.org/3d-view/${profile.pdbId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold shadow-sm transition-all"
              title="Open full crystal structure in RCSB 3D Mol* Viewer"
            >
              <span>RCSB Mol*</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={`https://alphafold.ebi.ac.uk/entry/${profile.alphaFoldId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              title="Open full prediction in AlphaFold Protein Structure Database"
            >
              <span>AlphaFold DB</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={handleCopySidecarLink}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Click to copy Biomolecular Structure Viewer sidecar link"
            >
              <Dna className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Sidecar Link Copied!' : 'Sidecar Viewer'}</span>
              {copiedLink ? <Check className="w-3 h-3" /> : null}
            </button>
          </div>
        </div>

        {/* Pocket Description */}
        <p className="text-[11px] text-slate-300/90 leading-relaxed mt-2.5 pt-2 border-t border-slate-800">
          <span className="font-semibold text-indigo-300">Active Site Architecture:</span> {profile.pocketDescription}
        </p>
      </div>

      {/* 3D WebGL Canvas Surface */}
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-inner flex flex-col">
        {/* Floating Canvas Controls Overlay */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          {/* Representation Style Pills */}
          <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
            {(['cartoon', 'surface', 'stick', 'spacefill'] as const).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setRenderStyle(style)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  renderStyle === style
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Orientation and Spin Controls */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
            <button
              type="button"
              onClick={() => setShowResidueSticks(!showResidueSticks)}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                showResidueSticks ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Key Residue Sticks"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsSpinning(!isSpinning)}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSpinning ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title={isSpinning ? 'Pause Auto-Spin' : 'Start Auto-Spin'}
            >
              {isSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleResetOrientation}
              className="p-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              title="Reset 3D Camera View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3Dmol WebGL Container */}
        <div
          ref={containerRef}
          className="w-full h-[360px] sm:h-[440px] relative cursor-grab active:cursor-grabbing bg-slate-950"
        />

        {/* Loading Spinner */}
        {isLoading3D && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs font-semibold text-slate-300">
              Loading PDB {profile.pdbId} Coordinates from RCSB...
            </p>
          </div>
        )}

        {/* Error Fallback Banner */}
        {loadError && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
            <Atom className="w-12 h-12 text-indigo-400 mb-2 animate-pulse" />
            <h5 className="text-sm font-bold text-white">Interactive 3D Preview</h5>
            <p className="text-xs text-slate-400 mt-1 max-w-md">{loadError}</p>
            <div className="mt-3 flex items-center gap-2">
              <a
                href={`https://www.rcsb.org/3d-view/${profile.pdbId}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <span>Open in RCSB Mol* 3D Viewer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Bottom Helper Bar */}
        <div className="bg-slate-900/90 border-t border-slate-800 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Click &amp; drag to rotate &bull; Scroll to zoom &bull; Right-click to pan</span>
          </span>
          {profile.coordinatingIons && profile.coordinatingIons.length > 0 && (
            <span className="text-amber-400 font-mono font-semibold">
              Catalytic Ion: {profile.coordinatingIons.join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Residue Explorer Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Key Catalytic &amp; Binding Pocket Residues
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Click residue chip to highlight in 3D
          </span>
        </div>

        {/* Residue Chips */}
        <div className="flex flex-wrap gap-2">
          {profile.keyResidues.map((res) => {
            const isSelected = selectedResidueNum === res.residueNumber;
            return (
              <button
                key={`${res.chain}_${res.residueNumber}`}
                type="button"
                onClick={() => handleSelectResidue(res)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: res.color }}
                />
                <span className="font-mono font-bold">
                  {res.residueName}
                  {res.residueNumber}
                </span>
                <span className="text-[10px] opacity-75">({res.role.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>

        {/* Selected Residue Detail Callout */}
        {selectedResidueNum && (
          (() => {
            const activeRes = profile.keyResidues.find((r) => r.residueNumber === selectedResidueNum);
            if (!activeRes) return null;
            return (
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: activeRes.color }}
                    />
                    <span>
                      {activeRes.residueName}
                      {activeRes.residueNumber} &bull; {activeRes.role}
                    </span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {activeRes.interactionType}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                  {activeRes.description}
                </p>
              </div>
            );
          })()
        )}
      </div>

      {/* Target SAR & Medicinal Chemistry Insights */}
      <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Structure-Activity Relationship (SAR) Takeaways for {structure?.name}</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
          {profile.sarTakeaways.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 mt-0.5">&bull;</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
