import React, { useState, useRef } from 'react';
import { QuizQuestion } from '../data/quizData';
import { TopicProfile, SourceDocument } from '../utils/storage';
import {
  Sparkles,
  X,
  Upload,
  FileText,
  FileCheck,
  Presentation,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface AddQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile: TopicProfile;
  onQuestionsAdded: (
    profileId: string,
    newQuestions: QuizQuestion[],
    addedSources?: SourceDocument[]
  ) => void;
}

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.pptx', '.ppt', '.txt', '.md'];

function getFileBadge(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) {
    return {
      label: 'PDF',
      cls: 'bg-red-50 text-red-700 dark:bg-rose-950/50 dark:text-rose-300 border-red-200 dark:border-rose-900',
    };
  }
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
    return {
      label: 'Word',
      cls: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900',
    };
  }
  if (lower.endsWith('.pptx') || lower.endsWith('.ppt')) {
    return {
      label: 'PowerPoint',
      cls: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    };
  }
  return {
    label: 'Text / Notes',
    cls: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };
}

export const AddQuestionsModal: React.FC<AddQuestionsModalProps> = ({
  isOpen,
  onClose,
  targetProfile,
  onQuestionsAdded,
}) => {
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [customFocus, setCustomFocus] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentCount = targetProfile.questions?.length || 0;

  const handleFilesAdded = (files: FileList | null) => {
    if (!files) return;
    const newFiles: File[] = [];
    let err: string | null = null;

    Array.from(files).forEach((file) => {
      const name = file.name.toLowerCase();
      const valid = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
      if (!valid) {
        err = 'Supported formats: PDF (.pdf), Word (.docx, .doc), PowerPoint (.pptx, .ppt), and Text (.txt, .md).';
        return;
      }
      if (file.size > 35 * 1024 * 1024) {
        err = `"${file.name}" exceeds the 35MB limit.`;
        return;
      }
      if (!attachedFiles.some((f) => f.name === file.name)) {
        newFiles.push(file);
      }
    });

    if (err) setError(err);
    else setError(null);

    if (newFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setLoadingStage('Preparing request & encoding sources...');

    try {
      const filesPayload = await Promise.all(
        attachedFiles.map(async (file) => {
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

      setLoadingStage(
        attachedFiles.length > 0
          ? `Extracting and synthesizing ${questionCount} new questions from attached file(s)...`
          : `Synthesizing ${questionCount} fresh board questions covering new clinical angles...`
      );

      // Summarize existing questions so AI knows what to avoid repeating
      const existingSummary = (targetProfile.questions || []).slice(0, 35).map((q) => ({
        category: q.category,
        question: q.question,
      }));

      const response = await fetch('/api/gemini/add-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: targetProfile.title,
          topicSubtitle: targetProfile.subtitle,
          existingCount: currentCount,
          existingQuestions: existingSummary,
          questionCount,
          customFocus: customFocus.trim(),
          files: filesPayload,
          pdfFiles: filesPayload,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      setLoadingStage('Validating rationales and concept checks...');
      const data = await response.json();

      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No new questions were generated. Please try again with a different focus or file.');
      }

      onQuestionsAdded(targetProfile.id, data.questions, data.addedSources);
      onClose();
    } catch (err: any) {
      console.error('Failed to add questions:', err);
      setError(err?.message || 'Failed to generate additional questions.');
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Generate More Questions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[280px] sm:max-w-[360px]">
                {targetProfile.title} • {currentCount} questions loaded
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs sm:text-sm">
          {/* Question Count Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              1. Number of Questions to Add:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setQuestionCount(num)}
                  className={`py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    questionCount === num
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  +{num} Questions
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Will expand bank from {currentCount} to {currentCount + questionCount} questions.</span>
              <span>All questions include clinical cases &amp; concept checks.</span>
            </div>
          </div>

          {/* Optional Focus / Subtopics */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              2. Specific Focus / Subtopics (Optional):
            </label>
            <input
              id="add-questions-custom-focus-input"
              name="customFocus"
              type="text"
              disabled={isLoading}
              placeholder="e.g. Refractory cases, drug interactions, pediatric dosing, rare differentials..."
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 dark:placeholder-slate-500"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Leave blank to automatically cover balanced high-yield topics not yet tested in this bank.
            </p>
          </div>

          {/* Optional Source Document Attachment */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              3. Attach Additional Source Files (Optional):
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFilesAdded(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl p-4 text-center cursor-pointer transition-all"
            >
              <input
                ref={fileInputRef}
                id="add-questions-file-input"
                name="addQuestionsFiles"
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint,text/plain,text/markdown"
                onChange={(e) => handleFilesAdded(e.target.files)}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <Upload className="w-5 h-5 text-indigo-500 mb-1.5" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  Upload Word (.docx), PowerPoint (.pptx), or PDF (Optional)
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  If attached, questions will be derived directly from the document.
                </span>
              </div>
            </div>

            {/* List of attached files */}
            {attachedFiles.length > 0 && (
              <div className="mt-2.5 space-y-1.5">
                {attachedFiles.map((file, idx) => {
                  const badge = getFileBadge(file.name);
                  return (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {file.name}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-rose-950/40 border border-red-200 dark:border-rose-900 text-red-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-end gap-3 rounded-b-3xl">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{loadingStage || 'Generating with Gemini...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Generate +{questionCount} Questions</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
