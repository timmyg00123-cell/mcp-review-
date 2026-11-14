import React, { useState, useEffect } from 'react';
import {
  X,
  Compass,
  Eye,
  Layers,
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MousePointer,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';

export interface ThreeDLabTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThreeDLabTutorialModal: React.FC<ThreeDLabTutorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('3d_lab_tutorial_dismissed') === 'true';
      }
    } catch {
      // ignore
    }
    return false;
  });

  // Handle Escape key dismissal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setDontShowAgain(checked);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('3d_lab_tutorial_dismissed', String(checked));
      }
    } catch {
      // ignore
    }
  };

  const handleNext = () => {
    if (activeStep < 4) {
      setActiveStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 id="tutorial-modal-title" className="text-lg font-bold text-white tracking-wide">
                3D Molecular Lab Tutorial
              </h2>
              <p className="text-xs text-slate-400">
                How to Use &amp; What to Look For in 3D Space
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tutorial"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-800/80 bg-slate-950/40">
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeStep === 1
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">1. Controls</span>
              <span className="sm:hidden">1</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeStep === 2
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">2. Ligand</span>
              <span className="sm:hidden">2</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeStep === 3
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3. Pocket</span>
              <span className="sm:hidden">3</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeStep === 4
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">4. Potency</span>
              <span className="sm:hidden">4</span>
            </button>
          </div>
        </div>

        {/* Modal Body: Active Step Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Compass className="w-5 h-5" />
                <h3 className="text-base font-semibold text-white">
                  Step 1: Navigating in 3D Space
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Interact smoothly with the molecular structure using standard mouse, trackpad, or touch gestures.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="flex items-center space-x-2 text-cyan-300 text-xs font-semibold">
                    <RotateCcw className="w-4 h-4 text-cyan-400" />
                    <span>Left-Click Drag</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Rotate</strong> molecular structure smoothly around the active pivot point.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="flex items-center space-x-2 text-cyan-300 text-xs font-semibold">
                    <MousePointer className="w-4 h-4 text-cyan-400" />
                    <span>Right-Click Drag (or Shift+Left Drag)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Pan</strong> camera across the 3D canvas viewport without rotating.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="flex items-center space-x-2 text-cyan-300 text-xs font-semibold">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Scroll Wheel / Pinch</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Zoom</strong> in to inspect fine interatomic distances, or zoom out for macro context.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="flex items-center space-x-2 text-cyan-300 text-xs font-semibold">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Click Any Atom</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Center rotation pivot</strong> on that selected atom for effortless orbital inspection.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200">
                <span className="font-semibold text-cyan-300">Pro-Tip:</span> Pick any drug from the <strong>1.–39. Therapeutic Classes</strong> list on the left, and click <strong>&quot;Reset View&quot;</strong> in the top toolbar anytime to re-center on the full binding pocket.
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Eye className="w-5 h-5" />
                <h3 className="text-base font-semibold text-white">
                  Step 2: Isolating the Small-Molecule Ligand
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every drug chosen from the <strong>1.–39. Therapeutic Classes</strong> opens centered on the bound drug ligand (cyan carbons with CPK heteroatoms) and its surrounding receptor pocket, with crystallization water and buffer clutter hidden automatically.
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <h4 className="text-xs font-semibold text-cyan-300 mb-1">
                    1. Core Chemical Scaffold
                  </h4>
                  <p className="text-xs text-slate-300">
                    Identify the central molecular scaffold (e.g. purine/pyrimidine base, statin dihydroxyheptanoic acid, or phenethylamine core) that anchors the molecule.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <h4 className="text-xs font-semibold text-cyan-300 mb-1">
                    2. 3D Conformation &amp; Ring Systems
                  </h4>
                  <p className="text-xs text-slate-300">
                    Observe the bioactive 3D ring conformation (e.g. chair versus boat, planar heteroaryl rings, or twisted biphenyl dihedral angles) that the receptor stabilizes.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <h4 className="text-xs font-semibold text-cyan-300 mb-1">
                    3. Key Functional Substituents
                  </h4>
                  <p className="text-xs text-slate-300">
                    Locate hydrogen bond donor/acceptor moieties, ionizable basic or acidic groups, and lipophilic halogen/alkyl substituents projected into solvent or pocket recesses.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Layers className="w-5 h-5" />
                <h3 className="text-base font-semibold text-white">
                  Step 3: Active-Site Interactions &amp; Pharmacophores
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Click any numbered card under <strong>&quot;Relevant Binding Sites&quot;</strong> in the right-hand panel (or toggle <strong>&quot;Sub-Pocket Colors&quot;</strong>) to zoom directly onto those receptor residues and read how the drug reacts there:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Polar
                  </span>
                  <h4 className="text-xs font-semibold text-white">
                    Hydrogen Bonds (H-bonds)
                  </h4>
                  <p className="text-xs text-slate-300">
                    Directional polar interactions between drug donor/acceptor atoms and protein backbone/sidechains (dashed yellow lines, &le; 3.2 &#197;).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Electrostatic
                  </span>
                  <h4 className="text-xs font-semibold text-white">
                    Ionic Salt Bridges
                  </h4>
                  <p className="text-xs text-slate-300">
                    Charged basic amines paired with acidic Asp (aspartate) or Glu (glutamate) residues, providing strong electrostatic enthalpy.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Aromatic
                  </span>
                  <h4 className="text-xs font-semibold text-white">
                    Aromatic &pi;&ndash;&pi; Stacking
                  </h4>
                  <p className="text-xs text-slate-300">
                    Benzene and heteroaryl rings aligning face-to-face or T-shaped with Phe, Tyr, or Trp aromatic sidechains.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Entropic
                  </span>
                  <h4 className="text-xs font-semibold text-white">
                    Hydrophobic Pockets
                  </h4>
                  <p className="text-xs text-slate-300">
                    Lipophilic alkyl and aryl groups fitting snugly into Leu, Ile, Val, and Met clefts, driving desolvation and favorable entropy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Activity className="w-5 h-5" />
                <h3 className="text-base font-semibold text-white">
                  Step 4: Translating 3D Contacts into Potency (Ki, IC50)
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The physical binding contacts you observe in 3D directly govern the quantitative binding affinity numbers reported in the ChEMBL SAR panel.
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <h4 className="text-xs font-semibold text-cyan-300 mb-1">
                    Nanomolar &amp; Picomolar Potency (Ki &amp; IC50)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Lower numerical Ki and IC50 values signify tighter binding and higher potency. High-affinity pharmaceutical drugs typically exhibit low nanomolar (nM) or picomolar (pM) affinity, whereas weak micromolar (&mu;M) binders require higher drug concentrations.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <h4 className="text-xs font-semibold text-cyan-300 mb-1">
                    Logarithmic Affinity: pChEMBL Scale
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ChEMBL reports normalized affinity as <strong>pChEMBL</strong> (&minus;log<sub>10</sub>[M]). Higher is more potent:
                    a pChEMBL of <strong>8.0 = 10 nM</strong>, while a pChEMBL of <strong>9.0 = 1 nM</strong>. Each integer step represents a 10-fold enhancement in binding affinity.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <h4 className="text-xs font-semibold text-cyan-300 mb-1">
                    Steric Clashes &amp; Loss of Potency
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Analog modifications that introduce bulky groups causing steric clashes with pocket walls, or that disrupt key hydrogen bonds, result in immediate 10-fold to 1,000-fold loss of potency in SAR screening assays.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <label className="flex items-center space-x-2 text-xs text-slate-400 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={handleCheckboxChange}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer"
            />
            <span>Don&apos;t show automatically on launch</span>
          </label>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-400 font-medium">
              Step {activeStep} of 4
            </span>

            {activeStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            {activeStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Got it / Start Exploring</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
