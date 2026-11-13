import React, { useState } from 'react';
import {
  RotateCcw,
  HelpCircle,
  Settings,
  Pill,
  Atom,
  Layers,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Target,
  Zap,
  Activity,
  ShieldAlert,
} from 'lucide-react';
import type { DetectedLigandInfo } from '../services/structure3dService';
import type {
  PharmacophorePkPdGroup,
  KeyPocketResidueContact,
  TargetMedChemProfile,
  InteractionType,
} from '../types/structure3d';
import { isMolstarSupported } from '../services/molstarLoader';

export interface TwoDPocketFallbackViewProps {
  pdbId: string;
  targetName?: string;
  geneSymbol?: string;
  detectedLigand?: DetectedLigandInfo | null;
  medChemProfile?: TargetMedChemProfile | null;
  activePharmacophoreGroup?: PharmacophorePkPdGroup | null;
  onSelectPharmacophoreGroup?: (group: PharmacophorePkPdGroup | null) => void;
  onSelectPocketResidue?: (residue: KeyPocketResidueContact | null) => void;
  onRetry3D?: () => void;
  onOpenTutorial?: () => void;
  className?: string;
}

/**
 * Styling mappings for binding pocket interaction types conforming to 3D Lab color coding.
 */
const INTERACTION_BADGE_CONFIG: Record<
  InteractionType,
  { label: string; badgeClasses: string; typicalDistance: string }
> = {
  'hydrogen-bond': {
    label: 'Hydrogen Bond',
    badgeClasses: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
    typicalDistance: '~2.8 - 3.2 Å',
  },
  ionic: {
    label: 'Ionic Salt Bridge',
    badgeClasses: 'bg-fuchsia-950/70 text-fuchsia-300 border-fuchsia-800/60',
    typicalDistance: '~3.0 - 3.5 Å',
  },
  hydrophobic: {
    label: 'Hydrophobic',
    badgeClasses: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
    typicalDistance: '~3.5 - 4.2 Å',
  },
  'pi-stacking': {
    label: 'Pi-Stacking',
    badgeClasses: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    typicalDistance: '~3.4 - 3.8 Å',
  },
  covalent: {
    label: 'Covalent Bond',
    badgeClasses: 'bg-rose-950/70 text-rose-300 border-rose-800/60',
    typicalDistance: '~1.5 - 1.8 Å',
  },
  coordination: {
    label: 'Metal Coordination',
    badgeClasses: 'bg-blue-950/70 text-blue-300 border-blue-800/60',
    typicalDistance: '~2.1 - 2.5 Å',
  },
};

/**
 * TwoDPocketFallbackView
 *
 * Interactive pedagogical 2D binding pocket and SAR schematic rendered when WebGL
 * hardware acceleration is disabled or unavailable. Provides drug 2D structure,
 * contact residue breakdown with color-coded interaction pills, pharmacophore PK/PD
 * summaries, and browser hardware acceleration recovery instructions.
 */
export const TwoDPocketFallbackView: React.FC<TwoDPocketFallbackViewProps> = ({
  pdbId,
  targetName,
  geneSymbol,
  detectedLigand,
  medChemProfile,
  activePharmacophoreGroup,
  onSelectPharmacophoreGroup,
  onSelectPocketResidue,
  onRetry3D,
  onOpenTutorial,
  className = '',
}) => {
  const [showBrowserGuide, setShowBrowserGuide] = useState<boolean>(false);
  const [selectedResidueState, setSelectedResidueState] = useState<KeyPocketResidueContact | null>(null);
  const [internalActiveGroup, setInternalActiveGroup] = useState<PharmacophorePkPdGroup | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  // Controlled vs uncontrolled pharmacophore group state
  const currentActiveGroup =
    activePharmacophoreGroup !== undefined ? activePharmacophoreGroup : internalActiveGroup;

  // Resolve target labels
  const displayGene = geneSymbol || medChemProfile?.targetGeneSymbol || '';
  const displayTarget = targetName || (displayGene ? `${displayGene} Target` : '') || pdbId;

  // Resolve drug and ligand information
  const drugName =
    medChemProfile?.drugName ||
    (detectedLigand as any)?.name ||
    detectedLigand?.description ||
    detectedLigand?.resn ||
    pdbId;

  const ligandCode = medChemProfile?.ligandCode || detectedLigand?.resn || 'LIG';

  const cleanDrugName =
    drugName
      .replace(/\s*\(.*?\)\s*/g, '')
      .replace(/\s+(Active|Analog|Inhibitor).*/i, '')
      .trim() || ligandCode;
  const pubChemImgUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(cleanDrugName)}/PNG`;

  const handleGroupClick = (group: PharmacophorePkPdGroup) => {
    const nextGroup = currentActiveGroup?.id === group.id ? null : group;
    setInternalActiveGroup(nextGroup);
    onSelectPharmacophoreGroup?.(nextGroup);
  };

  const handleResidueClick = (residue: KeyPocketResidueContact) => {
    const nextResidue = selectedResidueState?.resi === residue.resi ? null : residue;
    setSelectedResidueState(nextResidue);
    onSelectPocketResidue?.(nextResidue);
  };

  return (
    <div
      className={`w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto select-text ${className}`}
      data-testid="two-d-pocket-fallback-view"
    >
      {/* Header Bar */}
      <div className="shrink-0 bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-100">{displayTarget}</h2>
              {displayGene && displayGene !== displayTarget && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  {displayGene}
                </span>
              )}
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                PDB: {pdbId.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs text-amber-300 font-medium">
                {isMolstarSupported()
                  ? '2D Pocket & SAR Schematic Mode'
                  : 'WebGL Acceleration Unavailable • 2D Pocket & SAR Schematic Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-action="retry-3d"
            onClick={() => onRetry3D?.()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title="Attempt to initialize 3D Mol* WebGL graphics again"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try 3D View Again</span>
          </button>

          <button
            type="button"
            data-action="toggle-guide"
            onClick={() => setShowBrowserGuide((prev) => !prev)}
            aria-expanded={showBrowserGuide}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 ${
              showBrowserGuide
                ? 'bg-amber-950/80 text-amber-200 border-amber-700/80'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
            }`}
            title="Toggle WebGL Hardware Acceleration Recovery Guide"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Browser WebGL Guide</span>
            {showBrowserGuide ? (
              <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {onOpenTutorial && (
            <button
              type="button"
              data-action="open-tutorial"
              onClick={onOpenTutorial}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
              title="Open 3D Lab Pedagogical Guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tutorial</span>
            </button>
          )}
        </div>
      </div>

      {/* Hardware Acceleration Troubleshooting Panel */}
      {showBrowserGuide && (
        <div className="shrink-0 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border-b border-amber-800/40 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                <Info className="w-4 h-4 text-amber-400" />
                <span>How to Enable WebGL Hardware Acceleration in Your Browser</span>
              </div>
              <button
                type="button"
                onClick={() => setShowBrowserGuide(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded"
                aria-label="Dismiss guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                <div className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Google Chrome / Microsoft Edge / Brave
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  <li>
                    Open a new browser tab and navigate to{' '}
                    <code className="text-cyan-300 font-mono bg-slate-900 px-1 py-0.5 rounded">
                      chrome://settings/system
                    </code>
                  </li>
                  <li>
                    Toggle ON{' '}
                    <strong className="text-slate-100">
                      "Use graphics acceleration when available"
                    </strong>
                  </li>
                  <li>Click Relaunch to restart your browser and re-enable 3D Mol* WebGL.</li>
                </ol>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Mozilla Firefox &amp; Safari
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>
                    Firefox: Go to{' '}
                    <code className="text-amber-300 font-mono bg-slate-900 px-1 py-0.5 rounded">
                      about:config
                    </code>
                    , search for <code className="text-slate-200 font-mono">webgl.disabled</code>, and verify it is set to <code className="text-emerald-400 font-mono">false</code>.
                  </li>
                  <li>
                    Safari: Preferences &gt; Advanced &gt; Show Develop Menu &gt; Experimental Features &gt; verify WebGL is active.
                  </li>
                  <li>
                    After verifying, click <strong className="text-cyan-300">"Try 3D View Again"</strong> above.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Top Section: Ligand 2D Depiction & Metadata Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 md:p-5 shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
            {/* 2D Structure Rendering */}
            <div className="shrink-0 w-44 h-44 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden group">
              {!imageError ? (
                <img
                  src={pubChemImgUrl}
                  alt={`${drugName} 2D Chemical Structure`}
                  className="max-w-full max-h-full object-contain filter contrast-125 brightness-110"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="text-center p-3">
                  <Atom className="w-12 h-12 text-cyan-400/80 mx-auto mb-2 animate-pulse" />
                  <span className="text-xs font-mono text-cyan-300 font-bold block">{ligandCode}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">2D Schematic Structure</span>
                </div>
              )}
              <div className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-slate-900/80 text-slate-400 border border-slate-800">
                PubChem 2D
              </div>
            </div>

            {/* Ligand Metadata & Overview */}
            <div className="flex-1 min-w-0 space-y-2.5 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 inline-flex items-center gap-1">
                  <Pill className="w-3 h-3" />
                  Co-Crystallized Drug Ligand
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
                  {ligandCode}
                </span>
                {detectedLigand?.atomCount && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {detectedLigand.atomCount} Heavy Atoms
                  </span>
                )}
                {currentActiveGroup?.chemicalFormula && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-800/60">
                    Formula: {currentActiveGroup.chemicalFormula}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-100">{drugName}</h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {medChemProfile
                  ? `Curated high-resolution medicinal chemistry profile for ${displayTarget} in complex with ${drugName}. Explore key pocket residues below to observe interaction mechanisms (H-bonds, salt bridges, hydrophobic contacts) and pharmacophore hotspots.`
                  : `Automated ligand isolation for co-crystal complex ${pdbId}. Key binding residues and spatial contacts are presented below for 2D analysis without requiring 3D WebGL.`}
              </p>

              {/* Quick Legend of Pocket Interaction Types */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-center md:justify-start gap-1.5 text-[11px]">
                <span className="text-slate-400 font-medium mr-1">Interactions:</span>
                {(
                  [
                    'hydrogen-bond',
                    'ionic',
                    'hydrophobic',
                    'pi-stacking',
                    'covalent',
                    'coordination',
                  ] as InteractionType[]
                ).map((type) => {
                  const cfg = INTERACTION_BADGE_CONFIG[type];
                  return (
                    <span
                      key={type}
                      className={`px-2 py-0.5 rounded border text-[10px] font-medium ${cfg.badgeClasses}`}
                    >
                      {cfg.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Pharmacophore Groups Filter / Selection Bar */}
        {medChemProfile?.pharmacophoreGroups && medChemProfile.pharmacophoreGroups.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-slate-200">
                  SAR &amp; Pharmacophore Hotspots
                </h4>
                <span className="text-xs text-slate-400">
                  (Click a group to inspect clinical PK/PD)
                </span>
              </div>
              {currentActiveGroup && (
                <button
                  type="button"
                  onClick={() => {
                    setInternalActiveGroup(null);
                    onSelectPharmacophoreGroup?.(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {medChemProfile.pharmacophoreGroups.map((group) => {
                const isSelected = currentActiveGroup?.id === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    data-pharmacophore-id={group.id}
                    aria-pressed={isSelected}
                    onClick={() => handleGroupClick(group)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      isSelected
                        ? 'bg-cyan-950 text-cyan-200 border-cyan-500 ring-2 ring-cyan-400/50 shadow-md shadow-cyan-950'
                        : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: group.colorAccent || '#06b6d4' }}
                    />
                    <span>{group.name}</span>
                    {group.chemicalFormula && (
                      <span className="text-[10px] font-mono px-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {group.chemicalFormula}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Pharmacophore PK/PD Breakdown Card */}
            {currentActiveGroup && (
              <div className="bg-slate-900/90 border border-cyan-800/60 rounded-xl p-4 space-y-3 mt-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <h5 className="text-sm font-bold text-cyan-300">
                      {currentActiveGroup.name}
                    </h5>
                    {currentActiveGroup.chemicalFormula && (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {currentActiveGroup.chemicalFormula}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Atoms: {currentActiveGroup.atomNames.slice(0, 6).join(', ')}
                    {currentActiveGroup.atomNames.length > 6 ? '...' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 space-y-1">
                    <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Absorption &amp; Permeability (PK)
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {currentActiveGroup.pharmacokinetics.absorption}
                    </p>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 space-y-1">
                    <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      Metabolism &amp; Clearance (PK)
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {currentActiveGroup.pharmacokinetics.metabolism}
                    </p>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 space-y-1">
                    <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      Target Binding &amp; Mechanism (PD)
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {currentActiveGroup.clinicalPharmacodynamics.targetBindingRole}
                    </p>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 space-y-1">
                    <div className="font-semibold text-rose-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Clinical Impact &amp; Adverse Risks (PD)
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {currentActiveGroup.clinicalPharmacodynamics.adverseEffectRisks ||
                        currentActiveGroup.clinicalPharmacodynamics.physiologicEffect}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interactive Binding Pocket Residue Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-slate-200">
                Key Binding Pocket Residues &amp; Contact Mechanisms
              </h4>
              {medChemProfile?.keyPocketResidues && (
                <span className="text-xs text-slate-400">
                  ({medChemProfile.keyPocketResidues.length} curated contacts)
                </span>
              )}
            </div>
            {selectedResidueState && (
              <button
                type="button"
                onClick={() => {
                  setSelectedResidueState(null);
                  onSelectPocketResidue?.(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Clear Selected Residue
              </button>
            )}
          </div>

          {medChemProfile?.keyPocketResidues && medChemProfile.keyPocketResidues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {medChemProfile.keyPocketResidues.map((residue) => {
                const config =
                  INTERACTION_BADGE_CONFIG[residue.interactionType] ||
                  INTERACTION_BADGE_CONFIG['hydrogen-bond'];
                const isSelected = selectedResidueState?.resi === residue.resi;

                return (
                  <button
                    key={`${residue.resi}-${residue.resn}-${residue.chain || 'A'}`}
                    type="button"
                    data-residue-resi={residue.resi}
                    aria-pressed={isSelected}
                    onClick={() => handleResidueClick(residue)}
                    className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-950/60'
                        : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-sm text-slate-100">
                            {residue.label || `${residue.resn}${residue.resi}`}
                          </span>
                          {residue.chain && (
                            <span className="text-[10px] font-mono px-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              Ch.{residue.chain}
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded border shrink-0 ${config.badgeClasses}`}
                        >
                          {config.label}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {residue.clinicalImpact}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Contact Distance
                      </span>
                      <span className="font-mono text-cyan-300 font-medium">
                        {config.typicalDistance}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center space-y-2">
              <Layers className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-300">
                No curated med chem pocket contacts registered for this target.
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Select another curricular target from the library or use the WebGL recovery steps
                above to restore full 3D interactive Mol* graphics.
              </p>
            </div>
          )}
        </div>

        {/* Pedagogical Footer Note */}
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 text-xs text-slate-400 flex items-center gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Pedagogical Insight:</strong> In medicinal chemistry,
            target affinity and residence time are governed by spatial pocket interactions.
            Hydrogen bonds (cyan) provide orientation and specificity, ionic salt bridges (fuchsia)
            anchor charge centers, and hydrophobic surfaces (amber) optimize desolvation entropy.
          </span>
        </div>
      </div>
    </div>
  );
};
