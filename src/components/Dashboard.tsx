import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewModule } from '../types/reviewModule';
import {
  loadAllReviewModules,
  initModuleStorageFromDexie,
  deleteReviewModule,
} from '../utils/moduleStorage';
import {
  Layers,
  BookOpen,
  Trash2,
  CheckCircle2,
  Play,
  Upload,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FlaskConical,
  HelpCircle,
  FileText,
  AlertCircle,
  Clock,
  ArrowRight,
  Compass,
} from 'lucide-react';

export interface DashboardProps {
  activeModuleId?: string;
  onSelectModule?: (moduleId: string) => void;
  onEditModule?: (moduleId: string) => void;
  onStartBackgroundIngest?: (file: File) => void;
  onNavigateToTab?: (tab: 'document-review' | 'matrix' | 'knowledge-graph' | 'dashboard') => void;
  onDeleteModuleSuccess?: (deletedId: string) => void;
  isIngesting?: boolean;
  ingestionProgressPercent?: number;
  ingestionMessage?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  activeModuleId,
  onSelectModule,
  onEditModule,
  onStartBackgroundIngest,
  onNavigateToTab,
  onDeleteModuleSuccess,
  isIngesting = false,
  ingestionProgressPercent = 0,
  ingestionMessage = '',
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // 1. Fetch all curriculum modules & drug decks from Dexie with TanStack Query
  const {
    data: modules = [],
    isLoading,
    isError,
  } = useQuery<ReviewModule[]>({
    queryKey: ['modules'],
    queryFn: async () => {
      const dexieModules = await initModuleStorageFromDexie();
      if (dexieModules && dexieModules.length > 0) {
        return dexieModules;
      }
      return loadAllReviewModules();
    },
    initialData: loadAllReviewModules(),
    staleTime: 0,
  });

  // 2. TanStack Query mutation for safe background deletion and cache invalidation
  const deleteMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      deleteReviewModule(moduleId);
      return moduleId;
    },
    onSuccess: (deletedId) => {
      // Strictly invalidate the 'modules' query to trigger a clean background refetch
      // instead of mutating state locally, preventing reconciliation bugs
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      setConfirmDeleteId(null);
      if (onDeleteModuleSuccess) {
        onDeleteModuleSuccess(deletedId);
      }
    },
    onError: (err: any) => {
      console.error('Failed to delete module:', err);
    },
  });

  const handleFileSelected = (file: File) => {
    if (onStartBackgroundIngest) {
      onStartBackgroundIngest(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Curriculum Management &amp; Drug Decks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Medicinal Chemistry Review Dashboard
          </h1>
          <p className="text-sm text-blue-200 leading-relaxed">
            Manage your drug decks, explore multi-page question synthesis, compare molecular SAR
            features in the Comparator, and run non-blocking background imports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Import Drug Deck</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.pptx,.jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileSelected(file);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }
            }}
          />

          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('matrix')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs transition-colors cursor-pointer"
              title="Open Structure Comparator"
            >
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              <span>Go to Comparator</span>
            </button>
          )}
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Non-intrusive Background Ingestion Banner (Non-blocking) */}
      {isIngesting && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <span>Background Ingestion Active</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{ingestionProgressPercent}%</span>
              </div>
              <div className="text-[11px] text-blue-700 dark:text-blue-300">
                {ingestionMessage || 'Synthesizing drug deck questions and molecular structures in background...'}
              </div>
            </div>
          </div>
          <div className="w-full sm:w-48 bg-blue-200 dark:bg-blue-900 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-400 h-full transition-all duration-300"
              style={{ width: `${Math.max(5, ingestionProgressPercent)}%` }}
            />
          </div>
        </div>
      )}

      {/* Quick Drug Deck Upload Dropzone (Non-blocking) */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
            : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-900/40'
        }`}
      >
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Drop a Drug Deck (PDF, PPTX, or Image) here
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Extraction runs completely in the background via our Web Worker. You can navigate between tabs
            and work with the Comparator while it processes.
          </p>
        </div>
      </div>

      {/* Module List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Available Drug Decks &amp; Modules
            </h2>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {modules.length}
            </span>
          </div>
          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('document-review')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Go to Active Deck</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Note: Strictly using stable Dexie database identifier `key={module.id}` */}
          {/* Completely removes any `key={index}` to prevent DOM reconciliation bugs on deletion */}
          {modules.map((module) => {
            const isActive = module.id === activeModuleId;
            const isConfirming = confirmDeleteId === module.id;
            const canDelete = modules.length > 1;

            const pageCount = module.pages?.length || 0;
            const questionCount =
              module.pages?.reduce(
                (acc, p) =>
                  acc + (p.sections?.reduce((sAcc, s) => sAcc + (s.questions?.length || 0), 0) || 0),
                0
              ) || 0;
            const structureCount =
              module.pages?.reduce(
                (acc, p) =>
                  acc + (p.sections?.reduce((sAcc, s) => sAcc + (s.structures?.length || 0), 0) || 0),
                0
              ) || 0;

            return (
              <div
                key={module.id}
                className={`relative group rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="p-5 space-y-3">
                  {/* Card Header & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {module.course || 'Course Review'}
                        </span>
                        {module.isBuiltIn && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                            Built-in
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                        {module.title}
                      </h3>
                      {module.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {module.subtitle}
                        </p>
                      )}
                    </div>

                    {isActive && (
                      <span className="shrink-0 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Pages</div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{pageCount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Questions</div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{questionCount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Structures</div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{structureCount}</div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-slate-50/50 dark:bg-slate-850/50 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between gap-2">
                  {isConfirming ? (
                    <div className="w-full flex items-center justify-between gap-2 animate-fadeIn">
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold truncate">
                        Confirm delete?
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(module.id)}
                          disabled={deleteMutation.isPending}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        {!isActive ? (
                          <button
                            type="button"
                            onClick={() => onSelectModule?.(module.id)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Select Deck</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onNavigateToTab?.('document-review')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Study Now</span>
                          </button>
                        )}

                        {onEditModule && (
                          <button
                            type="button"
                            onClick={() => onEditModule(module.id)}
                            className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                        )}
                      </div>

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(module.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
