import React, { useEffect } from 'react';
import type { TopDrugClassProfile } from '../data/clinical/classProfiles';
import {
  X,
  ShieldAlert,
  Activity,
  AlertTriangle,
  Pill,
  Sparkles,
  Stethoscope,
  Layers,
} from 'lucide-react';

export interface ClassProfileAnchorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TopDrugClassProfile | null;
  currentDrugName?: string;
}

/**
 * Slide-out anchor profile drawer providing shared class baseline mechanics
 * (universal MOA, class-wide toxicities, baseline monitoring, boxed warnings)
 * alongside a high-yield subclass exception roster highlighting member drug nuances.
 */
export const ClassProfileAnchorDrawer: React.FC<ClassProfileAnchorDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  currentDrugName,
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Safe null handling: suppress rendering if drawer is closed or profile is null
  if (!isOpen || !profile) {
    return null;
  }

  const normalizedCurrentDrug = currentDrugName?.trim().toLowerCase();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Class Profile Anchor"
    >
      <div
        className="w-full max-w-lg md:max-w-xl bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-slate-900 shrink-0">
          <div className="space-y-1.5 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Layers className="w-4 h-4" />
              </span>
              <h2
                id="class-anchor-title"
                className="text-lg font-bold text-white tracking-tight"
              >
                {profile.className}
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
                {profile.therapeuticCategory}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700/60">
                {profile.memberDrugNames.length} Member Drugs
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Section 1: Universal Class Baseline */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-base">🏛️</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Universal Class Baseline
              </h3>
            </div>

            {/* Universal MOA */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mechanism of Action (MOA)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {profile.universalMoa}
              </p>
            </div>

            {/* Class-Wide Toxicities */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Class-Wide Toxicities & Adverse Effects</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.classWideToxicities.map((toxicity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg bg-amber-950/30 text-amber-200/90 border border-amber-800/40"
                  >
                    {toxicity}
                  </span>
                ))}
              </div>
            </div>

            {/* Baseline Monitoring */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                <Activity className="w-3.5 h-3.5" />
                <span>Baseline & Periodic Monitoring</span>
              </div>
              <div className="space-y-1.5">
                {profile.baselineMonitoring.map((parameter, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-sky-200/90 bg-sky-950/20 border border-sky-800/30 rounded-lg px-2.5 py-1.5"
                  >
                    <Stethoscope className="w-3.5 h-3.5 mt-0.5 text-sky-400 shrink-0" />
                    <span>{parameter}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Boxed Warnings (Conditional) */}
            {profile.classBlackBoxWarnings &&
              profile.classBlackBoxWarnings.length > 0 && (
                <div className="bg-rose-950/30 border border-rose-800/50 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Black Box Warning (Boxed Warning)</span>
                  </div>
                  <div className="space-y-1.5">
                    {profile.classBlackBoxWarnings.map((warning, idx) => (
                      <p
                        key={idx}
                        className="text-xs text-rose-200 leading-relaxed"
                      >
                        {warning}
                      </p>
                    ))}
                  </div>
                </div>
              )}
          </section>

          {/* Section 2: Subclass Exceptions Roster */}
          <section className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🔥</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Subclass Exceptions Roster
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Drug-Specific Nuances
              </span>
            </div>

            <div className="space-y-3">
              {profile.memberDrugNames.map((drugName) => {
                const isCurrent = Boolean(
                  normalizedCurrentDrug &&
                    normalizedCurrentDrug === drugName.trim().toLowerCase()
                );
                const exceptions = profile.exceptionsByDrug[drugName] || [];

                return (
                  <div
                    key={drugName}
                    className={`rounded-xl p-3.5 transition-all ${
                      isCurrent
                        ? 'bg-emerald-950/20 border-2 border-emerald-500 shadow-lg shadow-emerald-950/50'
                        : 'bg-slate-800/40 border border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    {/* Drug Card Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Pill
                          className={`w-4 h-4 ${
                            isCurrent ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        />
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent ? 'text-emerald-300' : 'text-slate-200'
                          }`}
                        >
                          {drugName}
                        </h4>
                      </div>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Current Study Drug
                        </span>
                      )}
                    </div>

                    {/* Exceptions List */}
                    {exceptions.length > 0 ? (
                      <ul className="space-y-1.5 pl-1">
                        {exceptions.map((exc, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-300 leading-relaxed flex items-start gap-2"
                          >
                            <span
                              className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                                isCurrent ? 'bg-emerald-400' : 'bg-indigo-400'
                              }`}
                            />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Follows universal class baseline profile with no distinct outliers.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>
            Anchored class profile with {profile.memberDrugNames.length} subclass exceptions
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
