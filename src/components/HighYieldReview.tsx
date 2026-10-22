import React, { useState, useMemo } from 'react';
import {
  HighYieldData,
  defaultHighYieldData,
  DifferentialMatrix,
  DifferentialMatrixRow,
} from '../data/quizData';
import {
  BookOpen,
  Sparkles,
  AlertOctagon,
  CheckCircle2,
  Plus,
  Loader2,
  Trash2,
  Copy,
  Check,
  Search,
  Eye,
  Layers,
  ArrowRight,
  ShieldAlert,
  Stethoscope,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';

interface HighYieldReviewProps {
  highYield?: HighYieldData;
  topicTitle?: string;
  topicSubtitle?: string;
  onUpdateHighYield?: (updated: HighYieldData) => void;
}

const PRESET_MATRIX_TYPES = [
  {
    type: 'bundle',
    label: '⭐ Multi-Category Matrix Bundle (All 4 in 1)',
    desc: 'Simultaneously generates Diagnostics, Pharmacotherapy, Board Traps, and Decision Algorithms',
  },
  {
    type: 'diagnostic',
    label: 'Diagnostic & Lab Workup Algorithm',
    desc: 'Biomarkers, first-line screening vs gold-standard confirmatory tests',
  },
  {
    type: 'pharmacotherapy',
    label: 'Pharmacotherapy & Management Comparison',
    desc: 'Drug classes, dosing thresholds, clinical trials, boxed warnings',
  },
  {
    type: 'traps',
    label: 'High-Yield Board Traps & Lookalike Conditions',
    desc: 'Classic examination distractors and why students get them wrong',
  },
  {
    type: 'algorithms',
    label: 'Next Best Step Clinical Decision Matrix',
    desc: 'Acute stabilization, risk stratification, and step-by-step guideline algorithms',
  },
  {
    type: 'morphology',
    label: 'Peripheral Smear & Morphology Differential',
    desc: 'Cellular abnormalities, microscopic hallmarks, and pathognomonic findings',
  },
];

export const HighYieldReview: React.FC<HighYieldReviewProps> = ({
  highYield: customHighYield,
  topicTitle = 'Clinical Practice',
  topicSubtitle,
  onUpdateHighYield,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMatrixIndex, setActiveMatrixIndex] = useState(0);
  const [isExamMode, setIsExamMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DifferentialMatrixRow | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Generate matrix modal states
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateFocus, setGenerateFocus] = useState('');
  const [generateType, setGenerateType] = useState('bundle');
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeData: HighYieldData = customHighYield || defaultHighYieldData;

  // Aggregate all matrices: primary differentialMatrix + any additionalMatrices
  const allMatrices: DifferentialMatrix[] = useMemo(() => {
    const list: DifferentialMatrix[] = [];
    if (activeData.differentialMatrix && activeData.differentialMatrix.columns) {
      list.push(activeData.differentialMatrix);
    }
    if (Array.isArray(activeData.additionalMatrices)) {
      activeData.additionalMatrices.forEach((m) => {
        if (m && m.columns && m.rows) {
          list.push(m);
        }
      });
    }
    return list;
  }, [activeData]);

  const safeIndex = Math.min(Math.max(0, activeMatrixIndex), Math.max(0, allMatrices.length - 1));
  const currentMatrix = allMatrices[safeIndex] || activeData.differentialMatrix;

  const comparisonSections = activeData.comparisonSections || [];
  const highYieldPearls = activeData.highYieldPearls || [];

  // Filtered rows in active matrix
  const filteredRows = useMemo(() => {
    if (!currentMatrix || !currentMatrix.rows) return [];
    if (!searchTerm.trim()) return currentMatrix.rows;
    const term = searchTerm.toLowerCase();
    return currentMatrix.rows.filter(
      (r) =>
        r.condition.toLowerCase().includes(term) ||
        (r.keyPearl && r.keyPearl.toLowerCase().includes(term)) ||
        (r.badge && r.badge.toLowerCase().includes(term)) ||
        (r.boardTrap && r.boardTrap.toLowerCase().includes(term)) ||
        (r.firstLineTest && r.firstLineTest.toLowerCase().includes(term)) ||
        r.values.some((v) => v.toLowerCase().includes(term))
    );
  }, [currentMatrix, searchTerm]);

  // Filtered pearls
  const filteredPearls = useMemo(() => {
    if (!searchTerm.trim()) return highYieldPearls;
    const term = searchTerm.toLowerCase();
    return highYieldPearls.filter(
      (p) => p.topic.toLowerCase().includes(term) || p.detail.toLowerCase().includes(term)
    );
  }, [highYieldPearls, searchTerm]);

  // Handle generating new matrix via API (Supports both bundle & single matrix)
  const handleGenerateMatrix = async (typeToUse = generateType, focusToUse = generateFocus) => {
    setIsGenerating(true);
    setGenerateError(null);

    const existingTitles = allMatrices.map((m) => m.title);

    try {
      const res = await fetch('/api/gemini/generate-matrices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle,
          topicSubtitle,
          existingMatrixTitles: existingTitles,
          customFocus: focusToUse.trim(),
          matrixType: typeToUse,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();

      // Handle 4-category bundle response
      if (Array.isArray(data.matrices) && data.matrices.length > 0) {
        const newMatrices: DifferentialMatrix[] = data.matrices.map((m: any, idx: number) => ({
          ...m,
          id: m.id || `matrix_bundle_${Date.now()}_${idx}`,
        }));

        const updatedAdditional = [...(activeData.additionalMatrices || []), ...newMatrices];
        const updatedPearls = data.additionalPearls
          ? [...(activeData.highYieldPearls || []), ...data.additionalPearls]
          : activeData.highYieldPearls;

        const updatedHighYield: HighYieldData = {
          ...activeData,
          additionalMatrices: updatedAdditional,
          highYieldPearls: updatedPearls,
        };

        if (onUpdateHighYield) {
          onUpdateHighYield(updatedHighYield);
        }

        // Switch to the first newly added matrix
        setActiveMatrixIndex(allMatrices.length);
        setShowGenerateModal(false);
        setGenerateFocus('');
        setSuccessToast(`Generated 4-category exam matrix suite (+${newMatrices.length} matrices: Diagnostics, Drugs, Traps, Algorithms)!`);
        setTimeout(() => setSuccessToast(null), 8000);
        return;
      }

      // Handle single matrix response
      if (!data.matrix || !data.matrix.columns || !data.matrix.rows) {
        throw new Error('AI did not return a valid matrix structure.');
      }

      const newMatrix: DifferentialMatrix = {
        ...data.matrix,
        id: `matrix_${Date.now()}`,
      };

      const updatedAdditional = [...(activeData.additionalMatrices || []), newMatrix];
      const updatedPearls = data.additionalPearls
        ? [...(activeData.highYieldPearls || []), ...data.additionalPearls]
        : activeData.highYieldPearls;

      const updatedHighYield: HighYieldData = {
        ...activeData,
        additionalMatrices: updatedAdditional,
        highYieldPearls: updatedPearls,
      };

      if (onUpdateHighYield) {
        onUpdateHighYield(updatedHighYield);
      }

      // Switch to the newly generated matrix (it is the last item in allMatrices)
      setActiveMatrixIndex(allMatrices.length);
      setShowGenerateModal(false);
      setGenerateFocus('');
      setSuccessToast(`Generated new matrix: "${newMatrix.title}"!`);
      setTimeout(() => setSuccessToast(null), 7000);
    } catch (err: any) {
      console.error('Failed to generate high-yield matrix:', err);
      setGenerateError(err?.message || 'Failed to generate matrix');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle deleting a custom matrix
  const handleDeleteMatrix = (indexToDelete: number) => {
    if (indexToDelete === 0) {
      alert('The primary differential matrix cannot be deleted.');
      return;
    }
    const matrixTitle = allMatrices[indexToDelete]?.title;
    if (window.confirm(`Delete the matrix "${matrixTitle}"?`)) {
      // Index 0 is differentialMatrix, index >= 1 are in additionalMatrices
      const additionalIndex = indexToDelete - 1;
      const updatedAdditional = (activeData.additionalMatrices || []).filter(
        (_, i) => i !== additionalIndex
      );

      const updatedHighYield: HighYieldData = {
        ...activeData,
        additionalMatrices: updatedAdditional,
      };

      if (onUpdateHighYield) {
        onUpdateHighYield(updatedHighYield);
      }

      setActiveMatrixIndex(Math.max(0, indexToDelete - 1));
      setSuccessToast(`Deleted matrix "${matrixTitle}".`);
      setTimeout(() => setSuccessToast(null), 5000);
    }
  };

  // Copy matrix table as Markdown
  const handleCopyMarkdown = () => {
    if (!currentMatrix) return;
    const headers = ['Condition', ...currentMatrix.columns.slice(1, -1), 'Key Clinical Pearl'];
    const headerLine = `| ${headers.join(' | ')} |`;
    const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`;
    const rowLines = currentMatrix.rows.map(
      (r) => `| ${r.condition} | ${r.values.join(' | ')} | ${r.keyPearl} |`
    );
    const md = `# ${currentMatrix.title}\n${currentMatrix.subtitle || ''}\n\n${headerLine}\n${separatorLine}\n${rowLines.join('\n')}`;

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Success Notification Banner */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 text-xs font-bold px-1.5 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Matrix Navigation Control */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Comprehensive Board Exam Knowledge Base
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              {topicTitle} — High-Yield Clinical Matrices
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              In-depth diagnostic algorithms, lab criteria, pharmacotherapy tables, and common board exam traps.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Exam Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsExamMode(!isExamMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isExamMode
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-300'
              }`}
              title="Toggle in-depth examination features (Next Best Step, Gold Standard, Board Traps)"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isExamMode ? 'Board Trap Mode: ON' : 'Board Trap Mode'}</span>
            </button>

            {/* Copy Markdown */}
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy active matrix table as Markdown for study notes"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Table!' : 'Copy Table'}</span>
            </button>

            {/* 1-CLICK MULTI-CATEGORY BUNDLE GENERATION */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerateMatrix('bundle', 'Complete high-yield exam preparation suite')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white text-xs md:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              title="Generate 4-Category Matrix Bundle: Diagnostics, Drugs, Traps, and Algorithms"
            >
              {isGenerating && generateType === 'bundle' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing 4 Matrices...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Generate 4-Category Bundle</span>
                </>
              )}
            </button>

            {/* CUSTOM MATRIX BUILDER BUTTON */}
            <button
              type="button"
              onClick={() => {
                setGenerateError(null);
                setShowGenerateModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Custom Matrix</span>
            </button>
          </div>
        </div>

        {/* Matrix Tab Selector Pills & Category Filters */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> Category:
              </span>
              {[
                { id: 'all', label: `All (${allMatrices.length})` },
                { id: 'diag', label: 'Diagnostics' },
                { id: 'pharm', label: 'Pharmacotherapy' },
                { id: 'traps', label: 'Board Traps' },
                { id: 'algo', label: 'Decision Algorithms' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    categoryFilter === tab.id
                      ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-300 dark:border-indigo-800'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="high-yield-filter-input"
                name="highYieldFilter"
                type="text"
                placeholder="Filter conditions & pearls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {allMatrices.map((matrix, idx) => {
              const isActive = idx === safeIndex;
              const titleLower = (matrix.title + ' ' + (matrix.category || '')).toLowerCase();
              if (categoryFilter === 'diag' && !titleLower.includes('diag') && !titleLower.includes('differential') && !titleLower.includes('lab') && !titleLower.includes('morphology')) {
                return null;
              }
              if (categoryFilter === 'pharm' && !titleLower.includes('pharm') && !titleLower.includes('drug') && !titleLower.includes('therapy')) {
                return null;
              }
              if (categoryFilter === 'traps' && !titleLower.includes('trap') && !titleLower.includes('lookalike') && !titleLower.includes('distractor')) {
                return null;
              }
              if (categoryFilter === 'algo' && !titleLower.includes('algo') && !titleLower.includes('decision') && !titleLower.includes('step')) {
                return null;
              }

              return (
                <button
                  key={matrix.id || idx}
                  type="button"
                  onClick={() => setActiveMatrixIndex(idx)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-amber-300' : 'bg-indigo-500 dark:bg-indigo-400'
                    }`}
                  />
                  <span>{matrix.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {matrix.rows ? `${matrix.rows.length} Rows` : ''}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setGenerateError(null);
                setShowGenerateModal(true);
              }}
              className="px-3 py-2 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Differential Matrix Display Table */}
      {currentMatrix && currentMatrix.columns && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          {/* Table Header Banner */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />{' '}
                {currentMatrix.category || 'High-Yield Clinical Differential Matrix'}
              </div>
              <h2 className="text-xl md:text-2xl font-bold">{currentMatrix.title}</h2>
              {currentMatrix.subtitle && (
                <p className="text-xs text-indigo-200 mt-1 max-w-2xl leading-relaxed">
                  {currentMatrix.subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
              <span className="text-xs bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full border border-indigo-400/30 font-medium">
                {filteredRows.length} of {currentMatrix.rows.length} Conditions
              </span>
              {safeIndex > 0 && (
                <button
                  type="button"
                  onClick={() => handleDeleteMatrix(safeIndex)}
                  className="p-1.5 text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors cursor-pointer"
                  title="Delete this custom matrix"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {currentMatrix.columns.map((col, idx) => (
                    <th key={idx} className="p-3.5 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                  {/* Extra Exam Columns in Board Exam Mode */}
                  {isExamMode && (
                    <>
                      <th className="p-3.5 whitespace-nowrap bg-indigo-100/60 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200">
                        First-Line Screening
                      </th>
                      <th className="p-3.5 whitespace-nowrap bg-indigo-100/60 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200">
                        Next Best Clinical Step
                      </th>
                      <th className="p-3.5 whitespace-nowrap bg-rose-100/60 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200">
                        Classic Board Trap / Distractor
                      </th>
                    </>
                  )}
                  <th className="p-3.5 text-center whitespace-nowrap">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors group"
                  >
                    {/* Condition Name with Badge */}
                    <td className="p-3.5 font-bold text-indigo-950 dark:text-indigo-300 bg-indigo-50/20 dark:bg-indigo-950/30">
                      <div className="flex items-center gap-2">
                        <span>{row.condition}</span>
                        {row.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold whitespace-nowrap">
                            {row.badge}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Middle Column Values */}
                    {row.values.map((val, valIdx) => {
                      const isDecreased =
                        val.includes('Low') || val.includes('↓') || val.includes('<');
                      const isIncreased =
                        val.includes('High') || val.includes('↑') || val.includes('>');
                      const isSuppressed = val.includes('Suppressed');

                      let colorClass = 'text-slate-700 dark:text-slate-300';
                      if (isDecreased) colorClass = 'text-red-600 dark:text-rose-400 font-semibold';
                      else if (isIncreased)
                        colorClass = 'text-emerald-600 dark:text-emerald-400 font-semibold';
                      else if (isSuppressed)
                        colorClass = 'text-amber-600 dark:text-amber-400 font-semibold';

                      return (
                        <td key={valIdx} className={`p-3.5 ${colorClass}`}>
                          {val}
                        </td>
                      );
                    })}

                    {/* Key Pearl Column */}
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 leading-relaxed min-w-[220px]">
                      {row.keyPearl}
                    </td>

                    {/* Optional Board Exam Mode Extra Columns */}
                    {isExamMode && (
                      <>
                        <td className="p-3.5 text-slate-800 dark:text-slate-200 bg-indigo-50/30 dark:bg-indigo-950/20 text-xs min-w-[180px]">
                          {row.firstLineTest || 'Clinical presentation & standard baseline labs'}
                        </td>
                        <td className="p-3.5 text-emerald-800 dark:text-emerald-300 bg-indigo-50/30 dark:bg-indigo-950/20 text-xs font-medium min-w-[180px]">
                          {row.nextBestStep || 'Initiate targeted clinical protocol'}
                        </td>
                        <td className="p-3.5 text-rose-800 dark:text-rose-300 bg-rose-50/30 dark:bg-rose-950/20 text-xs min-w-[200px]">
                          {row.boardTrap || 'Ensure distinguishing from lookalike phenotypes'}
                        </td>
                      </>
                    )}

                    {/* Drill-Down Action Button */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedRow(row)}
                        className="px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors cursor-pointer"
                        title="View complete clinical master card"
                      >
                        Deep Dive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comparison Sections (Pharmacology & Guideline Cards) */}
      {comparisonSections.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Pharmacology &amp; Management Comparisons ({comparisonSections.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {comparisonSections.map((section, sIdx) => (
              <div
                key={sIdx}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 flex-shrink-0" />
                      {section.title}
                    </h3>
                    {section.badge && (
                      <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                        {section.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {section.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className={`p-3.5 rounded-xl border transition-all ${
                          item.warning
                            ? 'border-red-200 dark:border-rose-900/60 bg-red-50/40 dark:bg-rose-950/20'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div>
                            <div className="font-bold text-xs md:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{item.label}</span>
                              {item.badge && (
                                <span className="text-[9px] bg-red-100 dark:bg-rose-950 text-red-700 dark:text-rose-300 font-bold px-1.5 py-0.2 rounded">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.subtext && (
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {item.subtext}
                              </div>
                            )}
                          </div>

                          {item.highlight && (
                            <div className="text-right flex-shrink-0">
                              <span className="text-xs md:text-sm font-extrabold text-indigo-700 dark:text-indigo-400">
                                {item.highlight}
                              </span>
                            </div>
                          )}
                        </div>

                        {item.detail && (
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                            {item.detail}
                          </p>
                        )}

                        {item.warning && (
                          <div className="mt-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                            <AlertOctagon className="w-3 h-3 flex-shrink-0" />
                            <span>{item.warning}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {section.footerNote && (
                  <div className="mt-4 p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                    <strong>Clinical Pearl: </strong>
                    {section.footerNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High-Yield Pearls Cards */}
      {highYieldPearls.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Board Exam Review Pearls ({filteredPearls.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPearls.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                <div className="font-bold text-indigo-900 dark:text-indigo-300 text-sm mb-1">
                  {item.topic}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: CONDITION DEEP-DIVE FLASHCARD */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl">
                      {selectedRow.condition}
                    </h3>
                    {selectedRow.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                        {selectedRow.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Board Exam Clinical Drill-Down Card
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRow(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-sm rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Diagnostic Markers Summary */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                Biomarker &amp; Diagnostic Matrix Profile:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedRow.values.map((v, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* First-Line Test vs Gold Standard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block mb-1">
                  First-Line Screening / Initial Workup:
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedRow.firstLineTest || 'Complete Blood Count & Basic Metabolic Panel'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block mb-1">
                  Definitive Gold-Standard Confirmation:
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedRow.goldStandard || 'Pathological biopsy / molecular genetic assay'}
                </p>
              </div>
            </div>

            {/* Next Best Step */}
            {selectedRow.nextBestStep && (
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block mb-1">
                  Immediate Clinical Action (Next Best Step):
                </span>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedRow.nextBestStep}
                </p>
              </div>
            )}

            {/* Board Trap / Classic Distractor */}
            {selectedRow.boardTrap && (
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 mb-1">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Classic Board Exam Trap / Lookalike Distractor:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedRow.boardTrap}
                </p>
              </div>
            )}

            {/* Clinical Pearl */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Clinical Takeaway Pearl:
              </span>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {selectedRow.keyPearl}
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedRow(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GENERATE MORE HIGH-YIELD MATRICES */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl">
                    Generate In-Depth High-Yield Matrix
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-sm">
                    Topic: {topicTitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-sm rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  1. Select Matrix Domain / Category:
                </label>
                <div className="space-y-2">
                  {PRESET_MATRIX_TYPES.map((preset) => {
                    const isSelected = generateType === preset.type;
                    return (
                      <button
                        key={preset.type}
                        type="button"
                        onClick={() => {
                          setGenerateType(preset.type);
                          setGenerateFocus(preset.label);
                        }}
                        className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-600/20'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs sm:text-sm">{preset.label}</div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {preset.desc}
                          </p>
                        </div>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Focus */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  2. Custom Focus or Specific Exam Criteria (Optional):
                </label>
                <input
                  id="high-yield-generate-focus-input"
                  name="generateFocus"
                  type="text"
                  placeholder="e.g. Coagulation factor cascade, pediatric vs adult differences, guideline thresholds..."
                  value={generateFocus}
                  onChange={(e) => setGenerateFocus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {generateError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-rose-950/40 border border-red-200 dark:border-rose-900 text-red-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 flex-shrink-0" />
                  <span>{generateError}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerateMatrix()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Multi-Column Matrix...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Generate In-Depth Matrix with Gemini</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
