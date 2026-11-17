import React, { useState, useEffect } from 'react';
import { BookOpen, Box, FileText } from 'lucide-react';
import {
  loadLaunchpadConfig,
  getLexicompSearchUrl,
  getAccessPharmacySearchUrl,
  getOpenAthensAuthUrl,
  type LaunchpadConfig,
} from '../utils/launchpadUrls';
import { resolveDrug3DEntry } from '../data/drug3dCatalog';
import { findCanonicalTargetForDrug } from '../utils/canonicalTargets';
import type { ChemicalStructure } from '../types/reviewModule';

const ClinicalDossierModal = React.lazy(() =>
  import('./ClinicalDossierModal').then((m) => ({ default: m.ClinicalDossierModal }))
);

export interface ClinicalReferenceToolbarProps {
  drugName: string;
  structure?: ChemicalStructure | null;
  onSelectStructureFor3D?: (structure: ChemicalStructure) => void;
  variant?: 'full' | 'compact';
  show3DButton?: boolean;
  className?: string;
}

export const ClinicalReferenceToolbar: React.FC<ClinicalReferenceToolbarProps> = ({
  drugName,
  structure,
  onSelectStructureFor3D,
  variant = 'full',
  show3DButton = true,
  className = '',
}) => {
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [config, setConfig] = useState<LaunchpadConfig>(() => loadLaunchpadConfig());

  useEffect(() => {
    const handleConfigChange = (e?: Event) => {
      if (e && 'detail' in e && (e as CustomEvent).detail) {
        setConfig((e as CustomEvent).detail);
      } else {
        setConfig(loadLaunchpadConfig());
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('launchpad-config-changed', handleConfigChange);
      return () => {
        window.removeEventListener('launchpad-config-changed', handleConfigChange);
      };
    }
  }, []);

  const effectiveDrugName = drugName || structure?.name || '';

  const has3DTarget = Boolean(
    (structure && resolveDrug3DEntry(structure.name)) ||
      resolveDrug3DEntry(effectiveDrugName) ||
      findCanonicalTargetForDrug(effectiveDrugName) ||
      (structure && findCanonicalTargetForDrug(structure.name))
  );

  const handle3DClick = () => {
    if (!has3DTarget) return;

    if (onSelectStructureFor3D && structure) {
      onSelectStructureFor3D(structure);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('app-open-3d-lab', {
          detail: { structure, drugName: effectiveDrugName },
        })
      );
    }
  };

  const showOpenAthens = !config.authType || config.authType === 'openathens';

  return (
    <>
      {variant === 'compact' ? (
        <div className={`inline-flex items-center gap-1.5 flex-wrap text-xs ${className}`}>
          <button
            type="button"
            onClick={() => setIsDossierOpen(true)}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors cursor-pointer"
            title="Clinical Info Box / Dossier"
          >
            <FileText className="w-3 h-3" />
            <span>Dossier</span>
          </button>

          {show3DButton && (
            <button
              type="button"
              onClick={handle3DClick}
              disabled={!has3DTarget}
              className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border transition-colors ${
                has3DTarget
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
              title={
                has3DTarget
                  ? 'Open 3D Lab'
                  : '3D crystal complex not yet available for this compound'
              }
            >
              <Box className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              <span>3D</span>
            </button>
          )}

          {config.showBadges !== false && (
            <>
              <a
                href={getLexicompSearchUrl(effectiveDrugName, config)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                title={`Search ${effectiveDrugName} on Lexicomp`}
              >
                Lexi ↗
              </a>
              <a
                href={getAccessPharmacySearchUrl(effectiveDrugName, config)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
                title={`Search ${effectiveDrugName} on AccessPharmacy`}
              >
                Access ↗
              </a>
            </>
          )}
        </div>
      ) : (
        <div
          className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2.5 space-y-2 ${className}`}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Clinical Pharmacology & References:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {show3DButton && (
                <button
                  type="button"
                  onClick={handle3DClick}
                  disabled={!has3DTarget}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                    has3DTarget
                      ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                  title={
                    has3DTarget
                      ? 'Open this molecule and target complex in the 3D Lab'
                      : '3D crystal complex not yet available for this compound'
                  }
                >
                  <Box className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  <span>Open in 3D Lab →</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsDossierOpen(true)}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                title="Clinical Info Box"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Clinical Info Box</span>
              </button>
            </div>
          </div>

          {config.showBadges !== false && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[10px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Institutional Launchpad:</span>
              <a
                href={getLexicompSearchUrl(effectiveDrugName, config)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors font-medium flex items-center gap-1"
              >
                Lexicomp ↗
              </a>
              <a
                href={getAccessPharmacySearchUrl(effectiveDrugName, config)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors font-medium flex items-center gap-1"
              >
                AccessPharmacy ↗
              </a>
              {showOpenAthens && (
                <a
                  href={getOpenAthensAuthUrl(config)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={
                    config.institutionName
                      ? `Authenticate ${config.institutionName} OpenAthens Session`
                      : 'Authenticate Institutional Session'
                  }
                  className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors font-medium flex items-center gap-1"
                >
                  Auth 🔑
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {isDossierOpen && (
        <React.Suspense fallback={null}>
          <ClinicalDossierModal
            isOpen={isDossierOpen}
            onClose={() => setIsDossierOpen(false)}
            drugName={effectiveDrugName}
          />
        </React.Suspense>
      )}
    </>
  );
};
