import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Moon,
  Sun,
  RotateCcw,
  Eye,
  EyeOff,
  Edit3,
  Sliders,
  Sparkles,
  AlertTriangle,
  Check,
  BookOpen,
  Network,
  Download,
  Upload,
  Database,
  FileJson,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { ReviewModule } from '../types/reviewModule';
import {
  exportReviewModuleAsJson,
  exportFullBackupAsJson,
  parseAndValidateJsonPayload,
  detectCollisions,
  applyImport,
  type ParsedImportResult,
  type ImportCollision,
} from '../utils/jsonPortability';
import {
  loadTopicProfiles,
  DEFAULT_STRUCTURE_IMAGE_BG,
  DEFAULT_STRUCTURE_IMAGE_DARK_BG,
  DEFAULT_STRUCTURE_LOCK_OBSIDIAN,
  DEFAULT_BOND_LIGHT_COLOR,
  DEFAULT_BOND_DARK_COLOR,
} from '../utils/storage';
import { StructureStylePanel } from './StructureStylePanel';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  hideDrugNames: boolean;
  onToggleHideDrugNames: () => void;
  showKnowledgeGraph: boolean;
  onToggleShowKnowledgeGraph: () => void;
  onResetQuiz: () => void;
  onOpenEditor: () => void;
  activeModuleTitle: string;
  totalQuestions: number;
  answeredQuestions: number;
  activeModule?: ReviewModule;
  allModules?: ReviewModule[];
  structureImageBg?: string;
  onUpdateStructureImageBg?: (color: string) => void;
  structureImageDarkBg?: string;
  onUpdateStructureImageDarkBg?: (color: string) => void;
  lockObsidian?: boolean;
  onToggleLockObsidian?: (locked: boolean) => void;
  bondLightColor?: string;
  onUpdateBondLightColor?: (color: string) => void;
  bondDarkColor?: string;
  onUpdateBondDarkColor?: (color: string) => void;
  onImportComplete?: (message: string, importedModuleId?: string) => void;
  onImportCollision?: (parsed: ParsedImportResult, collisions: ImportCollision[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  hideDrugNames,
  onToggleHideDrugNames,
  showKnowledgeGraph,
  onToggleShowKnowledgeGraph,
  onResetQuiz,
  onOpenEditor,
  activeModuleTitle,
  totalQuestions,
  answeredQuestions,
  activeModule,
  allModules,
  structureImageBg = DEFAULT_STRUCTURE_IMAGE_BG,
  onUpdateStructureImageBg,
  structureImageDarkBg = DEFAULT_STRUCTURE_IMAGE_DARK_BG,
  onUpdateStructureImageDarkBg,
  lockObsidian = DEFAULT_STRUCTURE_LOCK_OBSIDIAN,
  onToggleLockObsidian,
  bondLightColor = DEFAULT_BOND_LIGHT_COLOR,
  onUpdateBondLightColor,
  bondDarkColor = DEFAULT_BOND_DARK_COLOR,
  onUpdateBondDarkColor,
  onImportComplete,
  onImportCollision,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    }

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleExportModule = () => {
    if (!activeModule) return;
    setIsExporting(true);
    try {
      exportReviewModuleAsJson(activeModule);
      setImportStatus({ type: 'success', message: `Exported "${activeModule.title}" as JSON.` });
    } catch (err) {
      setImportStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Export failed.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportFullBackup = async () => {
    setIsExporting(true);
    try {
      await exportFullBackupAsJson(hideDrugNames);
      setImportStatus({ type: 'success', message: 'Exported full platform backup as JSON.' });
    } catch (err) {
      setImportStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Full export failed.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseAndValidateJsonPayload(text);

      const existingModules = allModules || (activeModule ? [activeModule] : []);
      const existingProfiles = loadTopicProfiles();
      const collisions = detectCollisions(parsed, existingModules, existingProfiles);

      if (collisions.length > 0 && onImportCollision) {
        onImportCollision(parsed, collisions);
        onClose();
        return;
      }

      const result = await applyImport(parsed, 'overwrite');
      setImportStatus({ type: 'success', message: result.message });
      if (onImportComplete) {
        onImportComplete(result.message, result.importedModuleId);
      }
    } catch (err) {
      setImportStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to import JSON file.',
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmReset = () => {
    onResetQuiz();
    setShowResetConfirm(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      onClick={handleBackdropClick}
      className="m-auto p-4 bg-transparent outline-none max-w-full max-h-screen text-slate-800 dark:text-slate-100"
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 text-balance">
                Settings &amp; Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeModuleTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-150 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Appearance & Theme */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Theme &amp; Appearance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose your interface display mode (default: Dark Mode)
                </p>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-150 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') onToggleTheme();
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>Dark Mode</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">
                      (Default)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    High contrast obsidian canvas
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') onToggleTheme();
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Light Mode
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Crisp clinical daytime theme
                  </div>
                </div>
              </button>
            </div>

            {/* Structure Image Canvas & Bond Line Styling Panel */}
            <StructureStylePanel
              theme={theme}
              structureImageBg={structureImageBg}
              onUpdateStructureImageBg={onUpdateStructureImageBg || (() => {})}
              structureImageDarkBg={structureImageDarkBg}
              onUpdateStructureImageDarkBg={onUpdateStructureImageDarkBg || (() => {})}
              lockObsidian={lockObsidian}
              onToggleLockObsidian={onToggleLockObsidian || (() => {})}
              bondLightColor={bondLightColor}
              onUpdateBondLightColor={onUpdateBondLightColor || (() => {})}
              bondDarkColor={bondDarkColor}
              onUpdateBondDarkColor={onUpdateBondDarkColor || (() => {})}
            />
          </div>

          <hr className="border-slate-150 dark:border-slate-800" />

          {/* Section 2: Study Controls & Blind Identification */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Study &amp; Self-Testing Controls
            </h3>

            {/* Blind structure name toggle */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  {hideDrugNames ? (
                    <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>Blind Structure Recognition Mode</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Hides drug names from molecular cards so you must identify structures by SAR alone
                </p>
              </div>

              <button
                type="button"
                id="toggle-hide-names-setting"
                name="toggleHideNames"
                onClick={onToggleHideDrugNames}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  hideDrugNames ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    hideDrugNames ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Enable Knowledge Graph (Beta) toggle */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Enable Knowledge Graph (Beta)</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Show the interactive pharmacology graph. Recommended only when a large number of lectures have been ingested.
                </p>
              </div>

              <button
                type="button"
                id="toggle-knowledge-graph-setting"
                name="toggleKnowledgeGraph"
                onClick={onToggleShowKnowledgeGraph}
                role="switch"
                aria-checked={showKnowledgeGraph}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  showKnowledgeGraph ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    showKnowledgeGraph ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Reset Quiz & Session Progress */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                    <span>Reset Review Progress</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Clear answers, placements, and start the review fresh ({answeredQuestions} of {totalQuestions} answered)
                  </p>
                </div>

                {!showResetConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
                  >
                    Reset Answers
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleConfirmReset}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Reset</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {showResetConfirm && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>This will clear all matching selections and question responses.</span>
                </div>
              )}
            </div>
          </div>

          <hr className="border-slate-150 dark:border-slate-800" />

          {/* Section 3: Advanced Module & Question Authoring */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Question &amp; Module Authoring (Advanced)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailored for educators and authors to edit questions, rationales, and structures
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Need to customize question stems, add new sub-statements, adjust correct answer keys, or re-order chemical structures? Use the dedicated Question Studio.
              </p>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEditor();
                }}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open Question &amp; Structure Editor</span>
              </button>
            </div>
          </div>

          <hr className="border-slate-150 dark:border-slate-800" />

          {/* Section 4: Data Backup & Portability */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <FileJson className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Data Backup &amp; Portability</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Export your curriculum review modules or full profile backup to share or restore anytime
              </p>
            </div>

            {importStatus.type !== 'idle' && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                  importStatus.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                }`}
              >
                {importStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="flex-1 font-medium">{importStatus.message}</span>
                <button
                  type="button"
                  onClick={() => setImportStatus({ type: 'idle', message: '' })}
                  className="text-[11px] underline opacity-80 hover:opacity-100 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Export Active Module */}
              <button
                type="button"
                onClick={handleExportModule}
                disabled={!activeModule || isExporting}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-750 text-left transition-colors flex flex-col justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Export Active Module
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  Download questions, drugs, and rationales for "{activeModuleTitle}"
                </p>
              </button>

              {/* Export Full Backup */}
              <button
                type="button"
                onClick={handleExportFullBackup}
                disabled={isExporting}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-750 text-left transition-colors flex flex-col justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Full Platform Backup
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  Export all modules, study profiles, progress, and preferences
                </p>
              </button>
            </div>

            {/* Import File Section */}
            <div className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center sm:justify-start gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Import Module or Backup JSON</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Restore a curriculum module, topic profile, or complete platform backup file (.json)
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelected}
                accept=".json,application/json"
                className="hidden"
                id="json-import-input-settings"
              />
              <label
                htmlFor="json-import-input-settings"
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select JSON File</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-150 dark:border-slate-800 flex items-center justify-end bg-slate-50 dark:bg-slate-850">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </dialog>
  );
};
