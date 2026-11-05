import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '../data/quizData';
import { AntiplateletQuestion } from '../data/antiplateletQuizData';
import { Sparkles, Send, Loader2, Bot, AlertCircle } from 'lucide-react';
import { renderSanitizedContent } from '../utils/sanitizer';
import { medChemGraphDb } from '../db/medChemGraphDb';
import { getPharmacophoresForStructure } from '../utils/pharmacophoreData';

interface AITutorPanelProps {
  currentQuestion?: QuizQuestion | AntiplateletQuestion | any;
  topicTitle?: string;
  isOpen: boolean;
  onToggle: () => void;
}

const SanitizedMarkdown: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      renderSanitizedContent(containerRef.current, formatMarkdown(text));
    }
  }, [text]);

  return <div ref={containerRef} className={className} />;
};

export const AITutorPanel: React.FC<AITutorPanelProps> = ({ currentQuestion, topicTitle = 'Medicinal Chemistry: Antiplatelets' }) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your Medicinal Chemistry & Clinical Pharmacology Tutor. Ask me about structure-activity relationships (SAR), chemical pharmacophores, bioactivation pathways (e.g. CYP2C19 vs esterases), active thiol metabolites, or PK/PD differences between antiplatelets.`,
      time: 'Just now',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnDeviceAvailable, setIsOnDeviceAvailable] = useState<boolean>(false);

  // WebMCP: Expose client-side tools via document.modelContext.registerTool
  useEffect(() => {
    if (typeof document !== 'undefined' && document.modelContext?.registerTool) {
      try {
        document.modelContext.registerTool('searchDrugStructures', {
          description: 'Search medicinal chemistry drug structures by name, class, or target receptor',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Drug name, class, or target receptor keyword' },
            },
            required: ['query'],
          },
          handler: async (params: { query: string }) => {
            const q = (params.query || '').toLowerCase().trim();
            const all = await medChemGraphDb.entities.toArray();
            const matches = all
              .filter(
                (e) =>
                  e.id.toLowerCase().includes(q) ||
                  (e.name && e.name.toLowerCase().includes(q)) ||
                  (e.chemical_class && e.chemical_class.toLowerCase().includes(q)) ||
                  (e.target_receptor && e.target_receptor.toLowerCase().includes(q))
              )
              .slice(0, 5);
            return matches.map((m) => ({
              id: m.id,
              name: m.name || m.id,
              cid: m.cid,
              chemicalClass: m.chemical_class || m.chemicalClass,
              target: m.target_receptor || m.target,
              smiles: m.canonicalSmiles || m.smiles,
              summary: m.clinical_and_sar_summary,
            }));
          },
        });

        document.modelContext.registerTool('getPharmacophoreAnalysis', {
          description: 'Extract and analyze chemical pharmacophores and functional moieties for a drug structure',
          parameters: {
            type: 'object',
            properties: {
              drugName: { type: 'string', description: 'The name of the drug compound (e.g., clopidogrel, aspirin)' },
            },
            required: ['drugName'],
          },
          handler: async (params: { drugName: string }) => {
            const norm = (params.drugName || '').toLowerCase().trim();
            const drug = await medChemGraphDb.entities.get(norm);
            const pharmacophores = getPharmacophoresForStructure({
              id: norm,
              name: drug?.name || params.drugName,
              smiles: drug?.canonicalSmiles || drug?.smiles || '',
            } as any);
            return {
              drug: drug?.name || params.drugName,
              smiles: drug?.canonicalSmiles || drug?.smiles || '',
              pharmacophores: pharmacophores.map((p) => ({
                name: p.name,
                smarts: p.smarts,
                purpose: p.purpose,
                description: p.description,
                sarExplanation: p.casual_sar_explanation,
              })),
            };
          },
        });
      } catch (e) {
        console.warn('[AITutorPanel] WebMCP registration note:', e);
      }
    }

    // Check availability of on-device model (window.ai.languageModel)
    if (typeof window !== 'undefined' && window.ai?.languageModel?.capabilities) {
      window.ai.languageModel
        .capabilities()
        .then((cap) => {
          if (cap && (cap.available === 'readily' || cap.available === 'after-download')) {
            setIsOnDeviceAvailable(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleAsk = async (textToAsk?: string) => {
    const q = (textToAsk || inputQuestion).trim();
    if (!q || loading) return;

    setError(null);
    setInputQuestion('');

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const questionStem = currentQuestion?.questionStem || currentQuestion?.question || '';
      const structuresContext = currentQuestion?.structuresDisplayed
        ? currentQuestion.structuresDisplayed.map((s: any) => `${s.id}: ${s.name} (${s.chemicalClass}, Target: ${s.target}, Reversibility: ${s.reversibility}, MOA: ${s.moa_summary || s.sar_rationale || s.sarNotes})`).join('\n')
        : '';

      // 1. Proactively attempt On-Device Prompt API (window.ai.languageModel)
      if (typeof window !== 'undefined' && window.ai?.languageModel) {
        try {
          const capabilities = await window.ai.languageModel.capabilities?.();
          if (capabilities && capabilities.available !== 'no') {
            const session = await window.ai.languageModel.create?.({
              systemPrompt:
                'You are an expert Medicinal Chemistry and Clinical Pharmacology tutor. Provide accurate, clear, and clinically grounded explanations regarding structure-activity relationships, pharmacophores, and drug mechanisms.',
              temperature: 0.2,
            });

            if (session?.prompt) {
              const promptText = `Context:
Topic: ${topicTitle}
Question Stem: ${questionStem}
Structures Context: ${structuresContext}
Correct Answer: ${currentQuestion?.options ? currentQuestion.options[currentQuestion.correctIndex || 0] : ''}
Explanation: ${currentQuestion?.overallExplanation || currentQuestion?.explanation || ''}

User Inquiry: ${q}`;

              const reply = await session.prompt(promptText);
              if (reply) {
                const aiMsg = {
                  sender: 'ai' as const,
                  text: reply,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages((prev) => [...prev, aiMsg]);
                session.destroy?.();
                return;
              }
            }
          }
        } catch (onDeviceErr) {
          console.warn('[AITutorPanel] On-Device Prompt API fallback to network:', onDeviceErr);
        }
      }

      // 2. Network Fallback: /api/gemini/tutor
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          context: {
            topicTitle,
            question: questionStem,
            structuresContext,
            options: currentQuestion?.options,
            correctAnswer: currentQuestion?.options ? currentQuestion.options[currentQuestion.correctIndex || 0] : '',
            explanation: currentQuestion?.overallExplanation || currentQuestion?.explanation,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      const aiMsg = {
        sender: 'ai' as const,
        text: data.text || 'Unable to generate response.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Tutor failed:', err);
      setError(err?.message || 'Error connecting to AI Tutor.');
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Explain the Structure-Activity Relationship (SAR) of these molecules',
    'Why is one drug faster in onset or more toxic than the other?',
    'Explain the bioactivation pathway (intestinal esterase vs hepatic CYPs)',
    'Contrast the pharmacokinetics and pharmacodynamics between these structures',
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-4 md:p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-700/80 border border-blue-500/50 flex items-center justify-center text-white">
            <Bot className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm md:text-base text-white text-balance">MedChem &amp; Pharmacology AI Tutor</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">
                {isOnDeviceAvailable ? 'On-Device Gemini Nano' : 'Gemini 3.8 Flash'}
              </span>
            </div>
            <p className="text-xs text-blue-200">
              {currentQuestion ? `Context synced with ${currentQuestion.questionNumberLabel || `Question #${currentQuestion.id}`}` : 'General MedChem Inquiries'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto flex gap-2 no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            disabled={loading}
            onClick={() => handleAsk(prompt)}
            className="text-[11px] font-medium whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 md:p-6 space-y-4 max-h-[360px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                AI
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
              }`}
            >
              <SanitizedMarkdown
                className="prose prose-xs max-w-none space-y-2 text-pretty"
                text={msg.text}
              />
              <div
                className={`text-[10px] mt-2 font-medium ${
                  msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400 dark:text-slate-400'
                }`}
              >
                {msg.time}
              </div>
            </div>
            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                You
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 text-xs p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium">AI Clinical Tutor is synthesizing pathophysiologic &amp; therapeutic guidance...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-900">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 md:p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex gap-2"
        >
          <input
            id="ai-tutor-question-input"
            name="aiTutorQuestion"
            type="text"
            placeholder="Ask a question about this topic (e.g. why is TIBC high in IDA?)..."
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={loading}
            className="flex-grow bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 md:px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

function formatMarkdown(text: string): string {
  if (!text) return '';
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/^### (.*$)/gim, '<h4 class="font-bold text-slate-900 dark:text-white text-sm mt-3 mb-1">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="font-bold text-indigo-900 dark:text-indigo-300 text-sm mt-3 mb-1">$1</h3>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  return formatted;
}
