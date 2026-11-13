import React, { useState, useEffect, useCallback } from 'react';
import type { TopDrugClinicalMonograph } from '../data/topDrugsClinicalData.js';
import {
  AlertTriangle,
  Ban,
  Activity,
  ShieldAlert,
  ClipboardList,
  Sparkles,
  ArrowRight,
  Pill,
  HeartPulse,
  Eye,
} from 'lucide-react';

export type ClinicalTabId = 'pharmacology' | 'regimens' | 'patientCare';

export interface TopDrugClinicalCardProps {
  monograph: TopDrugClinicalMonograph;
  isFlipped: boolean;
  activeTab?: ClinicalTabId;
  onTabChange?: (tab: ClinicalTabId) => void;
  onFlip?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * TopDrugClinicalCard component implementing Option A Layout:
 * High-Yield Badges + 3 Clinical Tabs covering all 12 clinical domains.
 *
 * Front face (!isFlipped):
 * - Clean prominent generic name
 * - High-yield taxonomy class badges (Pharmacologic & Therapeutic)
 * - Amber/Rose FDA Boxed Warning badge pill (only when present, zero leaks)
 * - Dosage forms summary pill
 * - Subtle flip cue
 *
 * Back face (isFlipped):
 * - Header Zone: Generic Name, Brand Names, Dosage forms pills
 * - Top Callout Banners: FDA Black Box Warning (cleanly suppressed if absent), Contraindications
 * - 3 Structured Tabs Switcher: Pharmacology (1), Regimens & Safety (2), Patient Care & Monitoring (3)
 * - Tab Panes: MOA & Side Effects; Regimens & Interactions; Monitoring, Counseling & Dosage Forms
 */
export const TopDrugClinicalCard: React.FC<TopDrugClinicalCardProps> = ({
  monograph,
  isFlipped,
  activeTab,
  onTabChange,
  onFlip,
  className = '',
  children,
}) => {
  const [internalTab, setInternalTab] = useState<ClinicalTabId>('pharmacology');

  const currentTab: ClinicalTabId = activeTab ?? internalTab;

  const handleSelectTab = useCallback(
    (tab: ClinicalTabId) => {
      if (onTabChange) {
        onTabChange(tab);
      }
      if (activeTab === undefined) {
        setInternalTab(tab);
      }
    },
    [onTabChange, activeTab]
  );

  // Keyboard shortcuts: 1, 2, 3 to switch tabs when card is flipped
  useEffect(() => {
    if (!isFlipped) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      if (e.key === '1') {
        e.preventDefault();
        handleSelectTab('pharmacology');
      } else if (e.key === '2') {
        e.preventDefault();
        handleSelectTab('regimens');
      } else if (e.key === '3') {
        e.preventDefault();
        handleSelectTab('patientCare');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, handleSelectTab]);

  const hasBlackBoxWarning = Boolean(
    monograph.blackBoxWarning && monograph.blackBoxWarning.trim().length > 0
  );

  // Dosage forms summary string for front face
  const dosageFormsSummary = monograph.dosageForms && monograph.dosageForms.length > 0
    ? monograph.dosageForms
        .map((f) => f.split(':')[0].trim())
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .join(', ')
    : 'Standard Formulations';

  return (
    <div className={`w-full ${className}`}>
      {/* ========================================================= */}
      {/* FRONT FACE (!isFlipped): HIGH-YIELD BADGES (ZERO LEAKS)   */}
      {/* ========================================================= */}
      {!isFlipped && (
        <div
          onClick={onFlip}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onFlip?.();
            }
          }}
          role="button"
          tabIndex={0}
          className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[460px] justify-between p-6 sm:p-8 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500 hover:border-slate-700 transition-all select-none group"
          title="Click to reveal clinical monograph"
        >
          {/* Top Identifier Badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Top 200 Clinical Monograph</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
              Blinded Prompt
            </span>
          </div>

          {/* Centered Primary Monograph Identity */}
          <div className="flex flex-col items-center justify-center my-auto py-8 space-y-4 text-center">
            {/* Prominent Clean Generic Name */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-wide text-center">
              {monograph.genericName}
            </h2>

            {/* High-yield Taxonomy Class Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
              <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-2xs">
                {monograph.pharmacologicClass}
              </span>
              <span className="bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-2xs">
                {monograph.therapeuticClass}
              </span>
            </div>

            {/* Boxed Warning Signal Pill (ONLY if present) */}
            {hasBlackBoxWarning && (
              <div className="pt-1">
                <span className="bg-rose-950/60 text-rose-300 border border-rose-500/40 px-3.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>⚠️ FDA Boxed Warning Prescribed</span>
                </span>
              </div>
            )}

            {/* Dosage Forms Summary Pill */}
            <div className="pt-2">
              <span className="bg-slate-800/80 text-slate-300 border border-slate-700/60 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Forms: {dosageFormsSummary}</span>
              </span>
            </div>
          </div>

          {/* Subtle Flip Cue Footer */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
            <span>Click card or press Space to reveal clinical monograph</span>
            <ArrowRight className="w-4 h-4 text-blue-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BACK FACE (isFlipped): OPTION A STRUCTURED 3 CLINICAL TABS */}
      {/* ========================================================= */}
      {isFlipped && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col p-5 sm:p-6 text-slate-100 gap-4 min-h-[520px]">
          {/* 1. Header Zone: Generic Name, Brand Names, Dosage Forms */}
          <div className="pb-3 border-b border-slate-800 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                  {monograph.genericName}
                </h2>
              </div>

              {/* Taxonomy Class Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {monograph.pharmacologicClass}
                </span>
                <span className="bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {monograph.therapeuticClass}
                </span>
              </div>
            </div>

            {/* Brand Names List */}
            <div className="text-xs text-slate-300 flex items-baseline gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-400">Brand Names:</span>
              <span className="text-slate-200 font-medium">
                {monograph.brandNames.join(', ')}
              </span>
            </div>

            {/* Dosage Forms Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {monograph.dosageForms.map((form, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-medium"
                >
                  {form}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Top Callout Banners: FDA Black Box Warning & Contraindications */}
          <div className="space-y-2.5">
            {/* FDA Black Box Warning (ONLY if present, cleanly suppressed if absent) */}
            {hasBlackBoxWarning && (
              <div className="bg-rose-950/40 border border-rose-500/50 rounded-lg p-3 text-rose-200 text-xs sm:text-sm font-medium flex items-start gap-2.5 shadow-sm">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1 min-w-0">
                  <div className="font-bold text-rose-300 uppercase tracking-wider text-xs">
                    FDA BLACK BOX WARNING
                  </div>
                  <p className="text-rose-200/90 leading-relaxed font-normal text-xs sm:text-sm">
                    {monograph.blackBoxWarning}
                  </p>
                </div>
              </div>
            )}

            {/* Contraindications Callout Banner */}
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-lg p-2.5 text-amber-200 text-xs flex items-start gap-2.5 shadow-sm">
              <Ban className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 min-w-0">
                <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  Contraindications:
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-amber-200/90 leading-relaxed">
                  {monograph.contraindications.map((contraindication, idx) => (
                    <li key={idx} className="leading-snug">
                      {contraindication}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Segmented 3-Tab Switcher with Hotkeys */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
            <button
              type="button"
              onClick={() => handleSelectTab('pharmacology')}
              className={`py-2 px-2 sm:px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                currentTab === 'pharmacology'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Tab 1: Pharmacology</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-black/20 text-[10px] font-mono font-bold">
                1
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('regimens')}
              className={`py-2 px-2 sm:px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                currentTab === 'regimens'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Tab 2: Regimens &amp; Safety</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-black/20 text-[10px] font-mono font-bold">
                2
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('patientCare')}
              className={`py-2 px-2 sm:px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                currentTab === 'patientCare'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Tab 3: Patient Care &amp; Monitoring</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-black/20 text-[10px] font-mono font-bold">
                3
              </kbd>
            </button>
          </div>

          {/* 4. Tab Content Panes (Scrollable Container max-h-[360px]) */}
          <div className="max-h-[360px] overflow-y-auto pr-1 space-y-3.5 focus:outline-hidden">
            {/* ---------------------------------------------------- */}
            {/* TAB 1: PHARMACOLOGY (MOA, SIDE EFFECTS)              */}
            {/* ---------------------------------------------------- */}
            {currentTab === 'pharmacology' && (
              <div className="space-y-3">
                {/* Mechanism of Action Card */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <Activity className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Mechanism of Action (MOA)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                    {monograph.mechanismOfAction}
                  </p>
                </div>

                {/* Common Side Effects */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <HeartPulse className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Common Side Effects
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {monograph.sideEffects.common.map((effect, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-slate-900/90 text-slate-200 border border-slate-700/80 text-xs font-medium"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Severe Side Effects (if present) */}
                {monograph.sideEffects.severe && monograph.sideEffects.severe.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                    <div className="flex items-center gap-1.5 text-rose-400">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Severe / Life-Threatening Side Effects
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-rose-200/90 leading-relaxed">
                      {monograph.sideEffects.severe.map((severeEffect, idx) => (
                        <li key={idx} className="leading-snug">
                          {severeEffect}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 2: REGIMENS & SAFETY (DOSING, DRUG INTERACTIONS) */}
            {/* ---------------------------------------------------- */}
            {currentTab === 'regimens' && (
              <div className="space-y-3">
                {/* Dosing Regimens Card */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Pill className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Standard Dosing Regimens
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {monograph.dosingRegimens.map((regimen, idx) => (
                      <li
                        key={idx}
                        className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/50 flex items-start gap-2"
                      >
                        <span className="text-emerald-400 font-bold shrink-0">•</span>
                        <span>{regimen}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Major Drug Interactions */}
                {monograph.drugInteractions.major && monograph.drugInteractions.major.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-rose-950/25 border border-rose-900/40 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-rose-400">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Major Drug Interactions
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-900/60 text-rose-300 border border-rose-700/50">
                        High Risk / Contraindicated
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-rose-200/90 leading-relaxed">
                      {monograph.drugInteractions.major.map((interaction, idx) => (
                        <li
                          key={idx}
                          className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-start gap-2"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{interaction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Common Drug Interactions */}
                {monograph.drugInteractions.common && monograph.drugInteractions.common.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Common / Moderate Drug Interactions
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300 leading-relaxed list-disc list-inside">
                      {monograph.drugInteractions.common.map((interaction, idx) => (
                        <li key={idx} className="leading-snug">
                          {interaction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB 3: PATIENT CARE & MONITORING                    */}
            {/* ---------------------------------------------------- */}
            {currentTab === 'patientCare' && (
              <div className="space-y-3">
                {/* Monitoring Parameters Card */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <Eye className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Monitoring Parameters &amp; Lab Tests
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {monograph.monitoringParameters.map((param, idx) => (
                      <li
                        key={idx}
                        className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/50 flex items-start gap-2"
                      >
                        <span className="text-cyan-400 font-bold shrink-0">•</span>
                        <span>{param}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Administration & Patient Counseling */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <ClipboardList className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Administration &amp; Patient Counseling Pearls
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-200 leading-relaxed">
                    {monograph.administrationAndCounseling.map((counsel, idx) => (
                      <li
                        key={idx}
                        className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/50 flex items-start gap-2"
                      >
                        <span className="text-indigo-400 font-bold shrink-0">✓</span>
                        <span>{counsel}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dosage Forms Detail */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Pill className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Available Dosage Forms &amp; Strengths
                    </span>
                  </div>
                  <div className="space-y-1">
                    {monograph.dosageForms.map((form, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-md bg-slate-900/80 border border-slate-700/50 text-xs text-slate-300"
                      >
                        {form}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Optional Children Slot (e.g. Rating Buttons or Actions) */}
          {children && <div className="mt-2 pt-2 border-t border-slate-800">{children}</div>}
        </div>
      )}
    </div>
  );
};
