import React, { useState, useRef } from 'react';
import { QuizQuestion, HighYieldData } from '../data/quizData';
import { TopicProfile, SourceDocument } from '../utils/storage';
import {
  FileText,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Copy,
  Plus,
  Trash2,
  Play,
  Layers,
  ArrowRight,
  Info,
  Check,
  Presentation,
  BookOpen,
  Image as ImageIcon,
} from 'lucide-react';

interface PDFQuizImporterProps {
  topicProfiles?: TopicProfile[];
  activeProfileId?: string;
  onSelectProfile?: (profileId: string) => void;
  onSaveNewProfile?: (profile: TopicProfile) => void;
  onDeleteProfile?: (profileId: string) => void;
  // Aliases for compatibility
  customBanks?: TopicProfile[];
  activeBankId?: string;
  onSelectBank?: (bankId: string) => void;
  onSaveNewBank?: (bank: TopicProfile) => void;
  onDeleteBank?: (bankId: string) => void;
}

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.pptx', '.ppt', '.txt', '.md', '.png', '.jpg', '.jpeg', '.webp', '.bmp'];

function getFileTypeInfo(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) {
    return {
      type: 'pdf',
      badge: 'PDF Document',
      bgClass: 'bg-red-50 text-red-700 dark:bg-rose-950/60 dark:text-rose-300 border-red-200 dark:border-rose-900',
      icon: 'pdf',
    };
  }
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp') || lower.endsWith('.bmp')) {
    return {
      type: 'image',
      badge: 'Figure / Chart (OCR)',
      bgClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900',
      icon: 'image',
    };
  }
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
    return {
      type: 'word',
      badge: 'Word Document',
      bgClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900',
      icon: 'word',
    };
  }
  if (lower.endsWith('.pptx') || lower.endsWith('.ppt')) {
    return {
      type: 'powerpoint',
      badge: 'PowerPoint Slides',
      bgClass: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
      icon: 'powerpoint',
    };
  }
  return {
    type: 'text',
    badge: 'Clinical Notes / Text',
    bgClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    icon: 'text',
  };
}

export const PDFQuizImporter: React.FC<PDFQuizImporterProps> = ({
  topicProfiles,
  activeProfileId,
  onSelectProfile,
  onSaveNewProfile,
  onDeleteProfile,
  customBanks,
  activeBankId,
  onSelectBank,
  onSaveNewBank,
  onDeleteBank,
}) => {
  const actualProfiles = topicProfiles || customBanks || [];
  const currentActiveId = activeProfileId || activeBankId || 'default';
  const handleSelect = onSelectProfile || onSelectBank || (() => {});
  const handleSave = onSaveNewProfile || onSaveNewBank || (() => {});
  const handleDelete = onDeleteProfile || onDeleteBank || (() => {});

  // Multiple files queue
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<'extract-all' | 'generate' | 'extract'>('extract-all');
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [typedCount, setTypedCount] = useState<string>('25');
  const [customFocus, setCustomFocus] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [newlyCreatedProfile, setNewlyCreatedProfile] = useState<TopicProfile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSupportedFile = (file: File) => {
    const name = file.name.toLowerCase();
    return ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
  };

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validNewFiles: File[] = [];
    let errMessage: string | null = null;

    Array.from(files).forEach((file) => {
      if (!isSupportedFile(file)) {
        errMessage = 'Supported files: PDF (.pdf), Word (.docx, .doc), PowerPoint (.pptx, .ppt), and Text (.txt, .md).';
        return;
      }
      if (file.size > 35 * 1024 * 1024) {
        errMessage = `File "${file.name}" exceeds the 35MB limit.`;
        return;
      }
      // Avoid duplicate file names
      if (!selectedFiles.some((f) => f.name === file.name)) {
        validNewFiles.push(file);
      }
    });

    if (errMessage) setError(errMessage);
    else setError(null);

    if (validNewFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validNewFiles]);
      setNewlyCreatedProfile(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProcessSources = async () => {
    if (selectedFiles.length === 0) {
      setError('Please attach at least one document (PDF, Word, or PowerPoint).');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setNewlyCreatedProfile(null);
    setProcessingStage(`Encoding ${selectedFiles.length} document source(s)...`);

    try {
      // Convert all files to base64
      const filesPayload = await Promise.all(
        selectedFiles.map(async (file) => {
          const pureBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const res = reader.result as string;
              resolve(res.split(',')[1]);
            };
            reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
            reader.readAsDataURL(file);
          });

          return {
            fileName: file.name,
            fileSize: file.size,
            fileBase64: pureBase64,
            pdfBase64: pureBase64,
          };
        })
      );

      setProcessingStage(
        selectedFiles.length > 1
          ? `Preparing case questions & high-yield study matrices from ${selectedFiles.length} combined sources...`
          : 'Analyzing document and preparing clinical questions & study matrices...'
      );

      const response = await fetch('/api/gemini/pdf-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: filesPayload,
          pdfFiles: filesPayload,
          mode,
          extractAll: mode === 'extract-all',
          questionCount: mode === 'extract-all' ? 100 : questionCount,
          customFocus: customFocus.trim(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      setProcessingStage('Assembling High-Yield Differential Matrix & Board Questions...');
      const data = await response.json();

      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No clinical questions could be synthesized from the provided documents.');
      }

      const sourcesList: SourceDocument[] = selectedFiles.map((f, i) => ({
        id: `src_${Date.now()}_${i}`,
        fileName: f.name,
        fileSize: f.size,
        uploadedAt: new Date().toLocaleDateString(),
      }));

      const newProfile: TopicProfile = {
        id: `topic_${Date.now()}`,
        title: data.title || selectedFiles[0].name.replace(/\.[^/.]+$/, ''),
        subtitle:
          data.subtitle ||
          (selectedFiles.length > 1
            ? `Synthesized from ${selectedFiles.length} combined sources (${selectedFiles.map((s) => s.name).join(', ')})`
            : `Synthesized from ${selectedFiles[0].name}`),
        sources: sourcesList,
        questions: data.questions,
        highYield: data.highYield,
        createdAt: new Date().toLocaleDateString(),
      };

      setNewlyCreatedProfile(newProfile);
      handleSave(newProfile);
      setSelectedFiles([]);
    } catch (err: any) {
      console.error('Source processing error:', err);
      setError(err?.message || 'Failed to process source documents.');
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Multi-Source Document Synthesizer
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Upload PDFs, Word documents (.docx, .doc), or PowerPoint lecture slides (.pptx, .ppt) to generate board-style questions and custom High-Yield Matrices.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <span className="text-xs bg-red-50 dark:bg-rose-950/40 text-red-700 dark:text-rose-300 border border-red-200 dark:border-rose-900 px-2.5 py-1 rounded-full font-semibold">
              PDF
            </span>
            <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 px-2.5 py-1 rounded-full font-semibold">
              Word (.docx)
            </span>
            <span className="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 px-2.5 py-1 rounded-full font-semibold">
              PowerPoint (.pptx)
            </span>
            <span className="text-xs bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900 px-2.5 py-1 rounded-full font-semibold">
              Images / Charts (OCR)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload Sources & Configure */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                1. Attach Source Documents (PDF, Word, PowerPoint, Images):
              </label>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFilesAdded(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 bg-white dark:bg-slate-900/60 rounded-2xl p-6 text-center cursor-pointer transition-all"
              >
                <input
                  ref={fileInputRef}
                  id="pdf-quiz-file-input"
                  name="pdfQuizFiles"
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.md,.png,.jpg,.jpeg,.webp,.bmp,image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint,text/plain,text/markdown"
                  onChange={(e) => handleFilesAdded(e.target.files)}
                  className="hidden"
                />

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs md:text-sm mb-1">
                    Drag and drop documents or images here, or click to browse
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md">
                    Accepts <strong>PDF</strong> guidelines, <strong>Word (.docx)</strong> study notes, <strong>PowerPoint (.pptx)</strong> lecture slides, and <strong>Images/Charts (OCR)</strong>. Combine multiple sources!
                  </p>
                </div>
              </div>
            </div>

            {/* List of Attached Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Attached Sources ({selectedFiles.length}):</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Another Document
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedFiles.map((f, idx) => {
                    const info = getFileTypeInfo(f.name);
                    return (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {info.type === 'image' ? (
                            <ImageIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                          ) : info.type === 'powerpoint' ? (
                            <Presentation className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          ) : info.type === 'word' ? (
                            <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          ) : (
                            <FileCheck className="w-5 h-5 text-red-500 flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {f.name}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] border ${info.bgClass}`}>
                                {info.badge}
                              </span>
                              <span>•</span>
                              <span>{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Remove Source"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-rose-950/30 border border-red-200 dark:border-rose-900 text-red-700 dark:text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Strategy & Options */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                2. Synthesis Strategy:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('extract-all')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    mode === 'extract-all'
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                        <Copy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Exact Verbatim Copy</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                        All Questions
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Transcribes and imports 100% of all questions in the document(s) exactly as written (e.g. all 25, 30, or 60 questions) with zero truncation or question limits.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('generate')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    mode === 'generate'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Synthesize New Qs</span>
                      </div>
                      <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold px-1.5 py-0.5 rounded">
                        1–100 Qs
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Generates brand-new board questions, concept checks, and differential matrices synthesized from attached sources.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('extract')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    mode === 'extract'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                        <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Extract Subset</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-1.5 py-0.5 rounded">
                        1–100 Qs
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Extracts existing questions from document up to your specifically chosen question count.
                    </p>
                  </div>
                </button>
              </div>

              {/* Number of Questions (1 through 100) or Extract-All Notice */}
              <div className="pt-2">
                {mode === 'extract-all' ? (
                  <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Exact Verbatim Question Import:</span> All questions in your source document(s) (e.g. all 25, 30, or 60+ questions) will be copied and transcribed exactly as written without any question limit.
                      <span className="block text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                        Preserves original clinical cases, question stems, and choices (A, B, C, D) verbatim from the source.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 bg-slate-50/80 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Target Question Count (Type 1 through 100):
                      </label>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {questionCount} Questions Selected
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500 font-medium">Count:</span>
                        <input
                          id="quiz-question-count-input"
                          name="questionCount"
                          type="number"
                          min={1}
                          max={100}
                          value={typedCount}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTypedCount(val);
                            const parsed = parseInt(val, 10);
                            if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
                              setQuestionCount(parsed);
                            }
                          }}
                          onBlur={() => {
                            const parsed = parseInt(typedCount, 10);
                            if (isNaN(parsed) || parsed < 1) {
                              setQuestionCount(1);
                              setTypedCount('1');
                            } else if (parsed > 100) {
                              setQuestionCount(100);
                              setTypedCount('100');
                            } else {
                              setQuestionCount(parsed);
                              setTypedCount(String(parsed));
                            }
                          }}
                          className="w-20 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2.5 py-1.5 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                          placeholder="1-100"
                          title="Type any number from 1 to 100"
                        />
                      </div>

                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[5, 10, 15, 20, 25, 30, 50, 75, 100].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              setQuestionCount(preset);
                              setTypedCount(String(preset));
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              questionCount === preset
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                            }`}
                          >
                            {preset} Qs
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Focus */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Special Focus or Cross-Source Instructions (Optional):
                </label>
                <input
                  id="quiz-custom-focus-input"
                  name="customFocus"
                  type="text"
                  placeholder="e.g. questions from slides, pharmacology from doc, focus on missed topics..."
                  value={customFocus}
                  onChange={(e) => setCustomFocus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-3.5 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <button
                  type="button"
                  disabled={selectedFiles.length === 0 || isProcessing}
                  onClick={handleProcessSources}
                  className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{processingStage || 'Processing documents with Gemini...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>
                        {selectedFiles.length > 1
                          ? `Synthesize Combined Topic from ${selectedFiles.length} Sources`
                          : 'Synthesize Topic Workspace from Source'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Topic Profiles & Mode Switcher */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 dark:border-slate-700/80 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Topic Profiles &amp; Workspaces
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Switching profiles refocuses questions &amp; matrices
                  </p>
                </div>
                <span className="text-xs font-semibold bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded">
                  {actualProfiles.length} Total
                </span>
              </div>

              <div className="space-y-3">
                {actualProfiles.map((profile) => {
                  const isActive = currentActiveId === profile.id;

                  return (
                    <div
                      key={profile.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isActive
                          ? 'border-indigo-600 bg-white dark:bg-slate-900 ring-2 ring-indigo-600/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="font-bold text-xs md:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{profile.title}</span>
                            {profile.id === 'default' && (
                              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-1.5 py-0.2 rounded">
                                Core Anemia
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {profile.subtitle}
                          </div>
                        </div>

                        {isActive && (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1 flex-shrink-0">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>

                      {/* Source details */}
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 mb-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          <span>{profile.questions.length} Questions</span>
                          <span>•</span>
                          <span>{profile.highYield?.highYieldPearls?.length || 0} Review Pearls</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <BookOpen className="w-3 h-3" />
                          <span className="truncate">
                            {profile.sources && profile.sources.length > 0
                              ? `${profile.sources.length} Attached Source(s): ${profile.sources.map((s) => s.fileName).join(', ')}`
                              : 'Core Clinical Guidelines'}
                          </span>
                        </div>
                      </div>

                      {/* Profile Actions */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        {!isActive ? (
                          <button
                            type="button"
                            onClick={() => handleSelect(profile.id)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Play className="w-3 h-3" /> Apply This Topic
                          </button>
                        ) : (
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                            App currently tuned to this topic
                          </span>
                        )}

                        {profile.id !== 'default' && (
                          <button
                            type="button"
                            onClick={() => handleDelete(profile.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete this topic profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Newly Created Profile Success Banner */}
            {newlyCreatedProfile && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 text-emerald-950 dark:text-emerald-100 transition-all animate-fade-in shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 dark:text-emerald-300 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Topic Workspace Ready!</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-200 mb-4 leading-relaxed">
                  Synthesized <strong>{newlyCreatedProfile.questions.length} questions</strong>, a custom Differential Matrix, and High-Yield Pearls from your {newlyCreatedProfile.sources.length} source file(s).
                </p>
                <button
                  type="button"
                  onClick={() => handleSelect(newlyCreatedProfile.id)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" /> Apply &amp; Start Studying "{newlyCreatedProfile.title}"
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
