import React, { useState } from 'react';
import { ReviewModule, ExamModeStatus } from '../types/reviewModule';
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  Table2,
  Network,
  Edit3,
  Eye,
  EyeOff,
  Timer,
  Play,
  Sliders,
  Sparkles,
  ExternalLink,
  Upload,
  RotateCcw,
  Trash2,
  Check,
  MoreHorizontal,
  Layers,
} from 'lucide-react';

export interface NavbarProps {
  courseCode?: string;
  activeModule: ReviewModule;
  modules: ReviewModule[];
  onSwitchModule: (id: string) => void;
  onDeleteModule: (id: string) => void;
  onRestoreDefaultModule?: () => void;
  canRestoreDefault?: boolean;
  onOpenImporter: () => void;
  onOpenEditor: () => void;
  onOpenQuizSetup: () => void;
  activeTab: 'document-review' | 'matrix' | 'knowledge-graph';
  onSelectTab: (tab: 'document-review' | 'matrix' | 'knowledge-graph') => void;
  pagesCount: number;
  showKnowledgeGraph?: boolean;
  hideDrugNames: boolean;
  onToggleHideDrugNames: () => void;
  examStatus: ExamModeStatus;
  examDurationMinutes: number;
  examRemainingSeconds: number;
  examElapsedSeconds: number;
  isExamSetupOpen: boolean;
  onToggleExamSetup: () => void;
  onStartExam: (mins: number) => void;
  onSubmitExam: () => void;
  formatTime: (sec: number) => string;
  allQuestionsCount: number;
  showTutor: boolean;
  onToggleTutor: () => void;
  onOpenSettings: () => void;
  onOpenPubChem: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  courseCode = 'MCP II',
  activeModule,
  modules,
  onSwitchModule,
  onDeleteModule,
  onRestoreDefaultModule,
  canRestoreDefault = false,
  onOpenImporter,
  onOpenEditor,
  onOpenQuizSetup,
  activeTab,
  onSelectTab,
  pagesCount,
  showKnowledgeGraph = false,
  hideDrugNames,
  onToggleHideDrugNames,
  examStatus,
  examDurationMinutes,
  examRemainingSeconds,
  examElapsedSeconds,
  isExamSetupOpen,
  onToggleExamSetup,
  onStartExam,
  onSubmitExam,
  formatTime,
  allQuestionsCount,
  showTutor,
  onToggleTutor,
  onOpenSettings,
  onOpenPubChem,
}) => {
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [confirmDeleteModuleId, setConfirmDeleteModuleId] = useState<string | null>(null);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* ==================================================== */}
        {/* 1. LEFT ZONE (SCOPE): Course > Topic Breadcrumb      */}
        {/* ==================================================== */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs">
              {activeModule.code || courseCode}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />

            {/* Scope Topic Switcher Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsModuleDropdownOpen(!isModuleDropdownOpen);
                  setIsToolsMenuOpen(false);
                }}
                className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 px-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Switch course topic / module"
              >
                <span className="truncate max-w-[120px] sm:max-w-[180px] md:max-w-[220px]">
                  {activeModule.title}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Scope Dropdown Menu */}
              {isModuleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                      setIsModuleDropdownOpen(false);
                      setConfirmDeleteModuleId(null);
                    }}
                  />

                  <div
                    className="absolute left-0 top-full mt-1.5 w-84 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-40 animate-fadeIn space-y-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <span>Curriculum Modules</span>
                      <span className="text-[10px] font-mono lowercase text-slate-400">
                        {modules.length} {modules.length === 1 ? 'module' : 'modules'}
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5">
                      {modules.map((m) => {
                        const isActive = m.id === activeModule.id;
                        const isConfirming = confirmDeleteModuleId === m.id;
                        const canDelete = modules.length > 1;

                        return (
                          <div
                            key={m.id}
                            className={`group w-full p-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold border border-blue-200 dark:border-blue-800'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent'
                            }`}
                          >
                            {isConfirming ? (
                              <div className="w-full flex items-center justify-between gap-2 py-0.5 animate-fadeIn">
                                <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold truncate">
                                  Delete "{m.title}"?
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteModule(m.id);
                                    }}
                                    className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-2xs transition-colors cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setConfirmDeleteModuleId(null);
                                    }}
                                    className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-[10px] transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSwitchModule(m.id);
                                    setIsModuleDropdownOpen(false);
                                  }}
                                  className="min-w-0 flex-1 w-full text-left cursor-pointer flex flex-col overflow-hidden"
                                >
                                  <div className="flex items-center gap-1.5 w-full min-w-0">
                                    <span className="truncate font-semibold">{m.title}</span>
                                    {m.isBuiltIn && (
                                      <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 font-normal">
                                        Core
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-normal w-full" title={m.subtitle || ''}>
                                    {m.subtitle ? `${m.subtitle} · ` : ''}{m.pages?.length || 1} {m.pages?.length === 1 ? 'Slide' : 'Slides'}
                                  </div>
                                </button>

                                <div className="flex items-center gap-1 shrink-0">
                                  {isActive && (
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                  )}

                                  {canDelete && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmDeleteModuleId(m.id);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all cursor-pointer"
                                      title={`Remove "${m.title}"`}
                                      aria-label={`Remove module ${m.title}`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      {canRestoreDefault && onRestoreDefaultModule && (
                        <button
                          type="button"
                          onClick={() => {
                            onRestoreDefaultModule();
                            setIsModuleDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore Default Curriculum Module</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onOpenImporter();
                          setIsModuleDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>+ Import New Review Document</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenEditor();
                          setIsModuleDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Active Module &amp; Questions</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 2. CENTER ZONE (VIEWS): Centered Segmented Tab Bar   */}
        {/* ==================================================== */}
        <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium">
          <button
            type="button"
            onClick={() => onSelectTab('document-review')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1.5 ${
              activeTab === 'document-review'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Review lecture slides, chemical structures, and case questions"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Review Deck</span>
            {pagesCount > 0 && (
              <span className="text-[10px] font-mono font-normal opacity-70">
                ({pagesCount})
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('matrix')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Comprehensive Medicinal Chemistry & PK/PD Matrix"
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>MedChem Matrix</span>
          </button>

          {showKnowledgeGraph && (
            <button
              type="button"
              onClick={() => onSelectTab('knowledge-graph')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-1.5 ${
                activeTab === 'knowledge-graph'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Interactive Pharmacology Knowledge Graph"
            >
              <Network className="w-3.5 h-3.5 text-indigo-500" />
              <span>Knowledge Graph</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenEditor}
            className="px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
            title="Author or edit practice questions and clinical rationales"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Question Studio</span>
          </button>
        </div>

        {/* ==================================================== */}
        {/* 3. RIGHT ZONE (TOOLS & TOGGLES): Switches & Icon Menu*/}
        {/* ==================================================== */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Hide Names Visual Switch/Pill Toggle */}
          <button
            type="button"
            disabled={examStatus === 'active'}
            onClick={onToggleHideDrugNames}
            title={
              hideDrugNames || examStatus === 'active'
                ? 'Drug names are hidden on structure cards. Click to show.'
                : 'Hide drug names to test structure recognition.'
            }
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-2xs ${
              hideDrugNames || examStatus === 'active'
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-700'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {hideDrugNames || examStatus === 'active' ? (
              <EyeOff className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="hidden sm:inline">
              {hideDrugNames || examStatus === 'active' ? 'Names Hidden' : 'Hide Names'}
            </span>
            {/* Visual switch toggle indicator */}
            <span
              className={`w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10 transition-colors inline-block ${
                hideDrugNames || examStatus === 'active'
                  ? 'bg-amber-500 shadow-inner'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          </button>

          {/* Exam Mode Visual Pill Toggle / Active Timer */}
          <div className="relative">
            {examStatus === 'active' ? (
              <button
                type="button"
                onClick={onSubmitExam}
                className="px-3 py-1 text-xs font-bold rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-xs cursor-pointer animate-pulse"
                title="Submit your exam answers"
              >
                <Timer className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums">
                  {examDurationMinutes > 0
                    ? formatTime(examRemainingSeconds)
                    : formatTime(examElapsedSeconds)}
                </span>
                <span className="hidden sm:inline">· Submit</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onToggleExamSetup}
                className="px-2.5 py-1 text-xs font-semibold rounded-full border border-amber-300 dark:border-amber-800 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                title="Start Timed Exam Simulation Mode without hints"
              >
                <Timer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">Exam Mode</span>
              </button>
            )}

            {/* Exam Setup Popover */}
            {isExamSetupOpen && examStatus !== 'active' && (
              <div
                className="absolute right-0 top-full mt-1.5 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3.5 z-50 space-y-3 text-xs animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-amber-600" />
                    <span>Timed Exam Simulation</span>
                  </span>
                  <button
                    type="button"
                    onClick={onToggleExamSetup}
                    className="text-slate-400 hover:text-slate-600 text-[11px] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Hides all drug names, locks solution keys, and suppresses instant hints across all{' '}
                  <strong>{allQuestionsCount} questions</strong> until you submit your exam.
                </p>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Select Duration:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: '15 Minutes', mins: 15 },
                      { label: '30 Minutes', mins: 30 },
                      { label: '45 Minutes', mins: 45 },
                      { label: 'Untimed Blind', mins: 0 },
                    ].map((opt) => (
                      <button
                        key={opt.mins}
                        type="button"
                        onClick={() => onStartExam(opt.mins)}
                        className="py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Play className="w-3 h-3 text-amber-600" />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Secondary Tools Compact Icon Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsToolsMenuOpen(!isToolsMenuOpen);
                setIsModuleDropdownOpen(false);
              }}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer flex items-center justify-center"
              title="Secondary Tools &amp; Preferences"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>

            {/* Tools Dropdown Menu */}
            {isToolsMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsToolsMenuOpen(false)}
                />

                <div
                  className="absolute right-0 top-full mt-1.5 w-60 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-40 animate-fadeIn space-y-1 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Secondary Tools
                  </div>

                  {/* AI Tutor Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      onToggleTutor();
                      setIsToolsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                      showTutor
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>AI MedChem Tutor</span>
                    </div>
                    {showTutor && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  {/* PubChem API Inspector */}
                  <button
                    type="button"
                    onClick={() => {
                      onOpenPubChem();
                      setIsToolsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>NIH PubChem Inspector</span>
                    </div>
                  </button>

                  {/* Quiz Setup / Lecture Review */}
                  <button
                    type="button"
                    onClick={() => {
                      onOpenQuizSetup();
                      setIsToolsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Lecture Review &amp; Quiz Setup</span>
                    </div>
                  </button>

                  {/* Settings & Preferences */}
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSettings();
                      setIsToolsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-800 mt-1 pt-2"
                  >
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-slate-500" />
                      <span>Settings &amp; Preferences</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
