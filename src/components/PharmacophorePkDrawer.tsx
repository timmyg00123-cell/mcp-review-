import React, { useState, useEffect } from 'react';
import {
  X,
  Compass,
  Zap,
  Sparkles,
  Clock,
  Target,
  HeartPulse,
  AlertTriangle,
  Atom,
  Layers,
} from 'lucide-react';
import type {
  PharmacophorePkPdGroup,
  KeyPocketResidueContact,
  TargetMedChemProfile,
} from '../types/structure3d';

export interface PharmacophorePkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeGroup: PharmacophorePkPdGroup | null;
  profile: TargetMedChemProfile | null;
  selectedPocketResidue: KeyPocketResidueContact | null;
  onSelectGroup: (group: PharmacophorePkPdGroup) => void;
  onSelectPocketResidue: (residue: KeyPocketResidueContact | null) => void;
}

const INTERACTION_BADGE_STYLES: Record<string, string> = {
  covalent: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  ionic: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  'hydrogen-bond': 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  'pi-stacking': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  coordination: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  hydrophobic: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
};

export const PharmacophorePkDrawer: React.FC<PharmacophorePkDrawerProps> = ({
  isOpen,
  onClose,
  activeGroup,
  profile,
  selectedPocketResidue,
  onSelectGroup,
  onSelectPocketResidue,
}) => {
  const [activeTab, setActiveTab] = useState<'pk' | 'pd'>('pk');

  // Listen for Escape key to close the drawer
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

  return (
    <>
      {/* Clickable backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer Panel */}
      <aside
        role="region"
        aria-label="Pharmacokinetics & Clinical Effect Drawer"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 bottom-0 w-80 sm:w-96 max-w-full bg-slate-900/95 backdrop-blur border-l border-slate-800 z-40 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl text-slate-100 ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Header Section */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-start justify-between gap-2 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap text-xs text-sky-400 font-medium">
              {profile?.targetGeneSymbol && (
                <span className="bg-sky-950/80 border border-sky-800/60 px-2 py-0.5 rounded font-mono font-bold">
                  {profile.targetGeneSymbol}
                </span>
              )}
              {profile?.pdbId && (
                <span className="bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded font-mono text-slate-300">
                  PDB: {profile.pdbId}
                </span>
              )}
              {profile?.ligandCode && (
                <span className="bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded font-mono text-slate-400">
                  Ligand: {profile.ligandCode}
                </span>
              )}
            </div>
            <h2 className="text-sm font-semibold text-white truncate mt-1.5" title={profile?.drugName || 'Target Drug'}>
              {profile?.drugName || 'Medicinal Chemistry Profile'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pharmacophore Group Switcher Bar */}
        {profile?.pharmacophoreGroups && profile.pharmacophoreGroups.length > 0 && (
          <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/60 shrink-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Pharmacophore Groups</span>
              <span className="text-slate-500">{profile.pharmacophoreGroups.length} available</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {profile.pharmacophoreGroups.map((grp) => {
                const isActive = activeGroup?.id === grp.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => onSelectGroup(grp)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-slate-800 text-sky-300 border-sky-500/60 shadow-sm ring-1 ring-sky-500/40'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: grp.colorAccent || '#38bdf8' }}
                      aria-hidden="true"
                    />
                    <span className="truncate max-w-[150px]">{grp.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-xs">
          {activeGroup ? (
            <>
              {/* Active Group Title & Formula / Atom Badges */}
              <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                      Active Moiety
                    </span>
                    <h3 className="text-sm font-semibold text-white mt-0.5">{activeGroup.name}</h3>
                  </div>
                  {activeGroup.chemicalFormula && (
                    <span className="bg-sky-500/10 border border-sky-500/30 text-sky-300 px-2 py-0.5 rounded font-mono font-semibold text-xs shrink-0">
                      {activeGroup.chemicalFormula}
                    </span>
                  )}
                </div>

                {/* Atom list badge */}
                {activeGroup.atomNames && activeGroup.atomNames.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                      <Atom className="w-3 h-3 text-slate-500" />
                      Atoms:
                    </span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {activeGroup.atomNames.map((atom) => (
                        <span
                          key={atom}
                          className="bg-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-300 border border-slate-700/60"
                        >
                          {atom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tab Controls: PK vs PD */}
              <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'pk'}
                  onClick={() => setActiveTab('pk')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'pk'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Pharmacokinetics (PK)
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'pd'}
                  onClick={() => setActiveTab('pd')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'pd'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  Clinical Effect (PD)
                </button>
              </div>

              {/* Tab Content Panels */}
              {activeTab === 'pk' ? (
                <div className="space-y-3">
                  {/* Absorption Card */}
                  <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-sky-400 font-semibold mb-1">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Absorption & Bioavailability</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {activeGroup.pharmacokinetics.absorption}
                    </p>
                  </div>

                  {/* Metabolism Card */}
                  <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Metabolism & Clearance Pathways</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {activeGroup.pharmacokinetics.metabolism}
                    </p>
                  </div>

                  {/* Prodrug Bioactivation Card (conditional) */}
                  {activeGroup.pharmacokinetics.prodrugRole && (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Prodrug Bioactivation</span>
                      </div>
                      <p className="text-emerald-200/90 leading-relaxed text-xs">
                        {activeGroup.pharmacokinetics.prodrugRole}
                      </p>
                    </div>
                  )}

                  {/* Half-Life & Clearance Card */}
                  <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Half-Life & Clearance</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {activeGroup.pharmacokinetics.halfLifeAndClearance}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Target Binding Role Card */}
                  <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-sky-400 font-semibold mb-1">
                      <Target className="w-3.5 h-3.5" />
                      <span>Target Binding Role</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {activeGroup.clinicalPharmacodynamics.targetBindingRole}
                    </p>
                  </div>

                  {/* Downstream Physiologic Effect Card */}
                  <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span>Downstream Physiologic Effect</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {activeGroup.clinicalPharmacodynamics.physiologicEffect}
                    </p>
                  </div>

                  {/* Adverse Effect Risks Card */}
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Adverse Effect Risks & Safety</span>
                    </div>
                    <p className="text-amber-200/90 leading-relaxed text-xs">
                      {activeGroup.clinicalPharmacodynamics.adverseEffectRisks}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800 text-center text-slate-400">
              <Compass className="w-6 h-6 mx-auto mb-2 text-slate-500 opacity-60" />
              <p className="text-xs">No active pharmacophore group selected.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Choose a pharmacophore group above or click a 3D chip to inspect PK/PD data.
              </p>
            </div>
          )}

          {/* Key Pocket Contacts Inspector */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Key Pocket Contacts
                </h4>
              </div>
              {profile?.keyPocketResidues && (
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                  {profile.keyPocketResidues.length} residues
                </span>
              )}
            </div>

            {/* Residue Chips Switcher */}
            {profile?.keyPocketResidues && profile.keyPocketResidues.length > 0 ? (
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {profile.keyPocketResidues.map((res) => {
                  const isSelected = selectedPocketResidue?.resi === res.resi;
                  return (
                    <button
                      key={`${res.resn}-${res.resi}`}
                      type="button"
                      onClick={() =>
                        onSelectPocketResidue(isSelected ? null : res)
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all border ${
                        isSelected
                          ? 'bg-sky-600/30 text-sky-200 border-sky-400 ring-1 ring-sky-400 shadow-sm'
                          : 'bg-slate-800 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <span>
                        {res.resn}
                        {res.resi}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic mb-2">
                No key pocket contacts cataloged for this target.
              </p>
            )}

            {/* Selected Residue Detail Card */}
            {selectedPocketResidue ? (
              <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono font-bold text-sky-300 text-xs">
                      {selectedPocketResidue.resn}
                      {selectedPocketResidue.resi}
                      {selectedPocketResidue.chain && (
                        <span className="text-slate-400 font-normal ml-1">
                          (Chain {selectedPocketResidue.chain})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white font-medium mt-0.5">
                      {selectedPocketResidue.label}
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border shrink-0 ${
                      INTERACTION_BADGE_STYLES[selectedPocketResidue.interactionType] ||
                      'bg-slate-500/20 text-slate-300 border-slate-500/40'
                    }`}
                  >
                    {selectedPocketResidue.interactionType}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Clinical Consequence & Impact
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs mt-1">
                    {selectedPocketResidue.clinicalImpact}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-lg p-3 text-center text-slate-500">
                <p className="text-xs">
                  Select a pocket residue above or in the 3D viewer to inspect interaction mechanism & clinical impact.
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
