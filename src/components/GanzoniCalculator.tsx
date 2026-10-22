import React, { useState } from 'react';
import { Calculator, ArrowRight, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export const GanzoniCalculator: React.FC = () => {
  const [weight, setWeight] = useState<number>(80);
  const [targetHb, setTargetHb] = useState<number>(13.0);
  const [actualHb, setActualHb] = useState<number>(9.0);
  const [depotIron, setDepotIron] = useState<number>(500);

  const hbDeficit = Math.max(0, targetHb - actualHb);
  const circulatingDeficit = weight * hbDeficit * 2.4;
  const totalDeficit = Math.round(circulatingDeficit + depotIron);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-colors">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ganzoni Iron Deficit Clinical Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Calculate total elemental iron requirements for IV iron repletion therapy</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 text-sm text-slate-700 dark:text-slate-300">
        <div className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          The Classic Ganzoni Formula (1970)
        </div>
        <code className="text-indigo-800 dark:text-indigo-300 font-mono text-xs md:text-sm block bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 my-2">
          Total Iron Deficit (mg) = [Weight (kg) × (Target Hb − Actual Hb) × 2.4] + Iron Depot (mg)
        </code>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          * Factor 2.4 = 0.07 (normal blood volume L/kg body weight) × 3.4 (mg iron per gram of Hb) × 10 (conversion factor dl to L).
          Standard depot reserve iron is typically 500 mg for adults ≥ 35 kg (or 15 mg/kg for pediatrics/low weight).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Patient Weight (kg)
          </label>
          <div className="relative">
            <input
              id="ganzoni-weight-input"
              name="patientWeight"
              type="number"
              min="20"
              max="250"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">kg</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Target Hemoglobin (g/dL)
          </label>
          <div className="relative">
            <input
              id="ganzoni-target-hb-input"
              name="targetHemoglobin"
              type="number"
              min="8"
              max="16"
              step="0.1"
              value={targetHb}
              onChange={(e) => setTargetHb(parseFloat(e.target.value) || 0)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">g/dL</span>
          </div>
          <div className="flex gap-2 mt-1.5">
            <button
              type="button"
              onClick={() => setTargetHb(13.0)}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              Men (13.0)
            </button>
            <button
              type="button"
              onClick={() => setTargetHb(12.0)}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              Women (12.0)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Actual Hemoglobin (g/dL)
          </label>
          <div className="relative">
            <input
              id="ganzoni-actual-hb-input"
              name="actualHemoglobin"
              type="number"
              min="3"
              max="18"
              step="0.1"
              value={actualHb}
              onChange={(e) => setActualHb(parseFloat(e.target.value) || 0)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">g/dL</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Target Iron Stores / Depot
          </label>
          <div className="relative">
            <input
              id="ganzoni-depot-iron-input"
              name="depotIron"
              type="number"
              min="0"
              max="1000"
              step="50"
              value={depotIron}
              onChange={(e) => setDepotIron(parseFloat(e.target.value) || 0)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">mg</span>
          </div>
        </div>
      </div>

      {/* Result Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md border border-indigo-700/40">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
              Calculated Total Iron Deficit
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-white flex items-baseline gap-2">
              {totalDeficit.toLocaleString()}
              <span className="text-lg font-normal text-indigo-200">mg elemental iron</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-xs space-y-1.5 border border-white/10">
            <div className="text-indigo-200 font-semibold">Step-by-Step Breakdown:</div>
            <div>
              • Hb Deficit: <span className="font-mono text-white font-medium">{hbDeficit.toFixed(1)} g/dL</span> ({targetHb} - {actualHb})
            </div>
            <div>
              • Circulating Deficit: <span className="font-mono text-white font-medium">{Math.round(circulatingDeficit)} mg</span> ({weight} kg × {hbDeficit.toFixed(1)} × 2.4)
            </div>
            <div>
              • Depot Iron Reserve: <span className="font-mono text-white font-medium">{depotIron} mg</span>
            </div>
          </div>
        </div>

        {/* Clinical Repletion Regimen Suggestions */}
        <div className="mt-6 pt-6 border-t border-indigo-700/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ferric Derisomaltose (Monoferric)
            </div>
            <p className="text-slate-300">
              Can administer 1,000 mg in a single IV infusion over 20 min in patients ≥ 50 kg. Balance of ~{Math.max(0, totalDeficit - 1000)} mg if required later.
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="font-semibold text-sky-300 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ferric Carboxymaltose (Injectafer)
            </div>
            <p className="text-slate-300">
              750 mg IV × 2 doses separated by ≥ 7 days (total 1,500 mg maximum course). Monitor serum phosphate if repeat courses given.
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Iron Sucrose (Venofer)
            </div>
            <p className="text-slate-300">
              Administered as 200 mg slow IV injection on 5 distinct clinic sessions (max 1,000 mg over 14 days) to prevent hypotension.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
