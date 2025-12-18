'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MessageSquare, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IProject } from '@/types';

interface ArchitectureIntelligencePanelProps {
  project: IProject;
  isOpen: boolean;
  onClose: () => void;
}

interface ConversationEntry {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
}

const quickPrompts = [
  'How does Box 2 shield Box 3 during ingest pressure?',
  'Where are the biggest latency risks between Box 4 and Box 5?',
  'Which step turns raw inputs from Box 1 into signals Ops can trust?',
];

const ArchitectureIntelligencePanel = ({ project, isOpen, onClose }: ArchitectureIntelligencePanelProps) => {
  const [history, setHistory] = useState<ConversationEntry[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHistory([]);
    setQuestion('');
    setError(null);
  }, [project.id]);

  const sendQuestion = useCallback(
    async (prompt: string) => {
      const trimmed = prompt.trim();
      if (!trimmed) return;
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/architecture-intel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: project.id,
            question: trimmed,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Unable to process your question right now.');
        }

        setHistory((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            question: trimmed,
            answer: data.answer,
            timestamp: Date.now(),
          },
        ]);
        setQuestion('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error.');
      } finally {
        setIsLoading(false);
      }
    },
    [project.id]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendQuestion(question);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-[hsla(var(--background)_/_0.65)] backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          >
            <div className="w-full max-w-4xl rounded-[32px] border border-[hsla(var(--border)_/_0.55)] bg-[hsla(var(--background-light)_/_0.95)] shadow-[0_25px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl flex flex-col max-h-[90vh] overflow-hidden">

            <div className="px-6 pt-6 pb-6 border-b border-[hsla(var(--border)_/_0.55)] bg-[radial-gradient(circle_at_top,hsla(var(--background-light)_/_0.85),hsla(var(--background)_/_0.95))] space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[hsla(var(--foreground)_/_0.55)]">System Architecture Diagram</p>
                  <h5 className="text-2xl font-semibold text-[hsl(var(--foreground))]">Boxes 1 → 6 operating contract</h5>
                  <p className="text-sm text-[hsla(var(--foreground)_/_0.65)]">Grounded in {project.title}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-[hsla(var(--foreground)_/_0.55)] hover:text-[hsl(var(--foreground))] hover:bg-[hsla(var(--foreground)_/_0.08)]"
                  onClick={onClose}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[hsla(var(--border)_/_0.5)] bg-[hsla(var(--background)_/_0.5)] p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[hsla(var(--foreground)_/_0.55)] mb-1">Architecture Artifact</p>
                  <p className="text-sm text-[hsla(var(--foreground)_/_0.85)]">Immutable system diagram sets the contract—no redraw, no SVG, no alternate modes.</p>
                </div>
                <div className="rounded-2xl border border-[hsla(var(--border)_/_0.5)] bg-[hsla(var(--background)_/_0.5)] p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[hsla(var(--foreground)_/_0.55)] mb-1">Flow Guardrails</p>
                  <p className="text-sm text-[hsla(var(--foreground)_/_0.85)]">Reference Boxes 1 → 6 explicitly. The assistant only reasons within that sequencing.</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-b border-[hsla(var(--border)_/_0.55)] bg-[hsla(var(--background)_/_0.35)]">
              <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-3 text-sm text-[hsla(var(--foreground)_/_0.75)]">
                  <p>Reference the system flow directly and ask one precise scenario. The response arrives in a single voice—recruiter-friendly, engineer-respectful, confident.</p>
                  <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-[hsla(var(--foreground)_/_0.55)]">
                    <span className="rounded-full border border-[hsla(var(--border)_/_0.55)] px-3 py-1">🧠 One clean explanation</span>
                    <span className="rounded-full border border-[hsla(var(--border)_/_0.55)] px-3 py-1">👔 Recruiter-ready tone</span>
                    <span className="rounded-full border border-[hsla(var(--border)_/_0.55)] px-3 py-1">💎 Confident POV</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-[hsla(var(--border)_/_0.5)] bg-[hsla(var(--background)_/_0.5)] p-4 space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[hsla(var(--foreground)_/_0.55)]">Suggested investigations</p>
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="w-full rounded-xl border border-[hsla(var(--border)_/_0.45)] bg-[hsla(var(--background-light)_/_0.45)] px-3 py-2 text-left text-[hsla(var(--foreground)_/_0.8)] text-xs hover:border-[hsla(var(--primary)_/_0.6)] hover:text-[hsl(var(--foreground))]"
                      onClick={() => sendQuestion(prompt)}
                      disabled={isLoading}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
              {history.length === 0 && !isLoading && (
                <div className="text-sm text-[hsla(var(--foreground)_/_0.65)] leading-relaxed">
                  <p>Ask about failure modes, throughput bottlenecks, or why specific handoffs exist between Boxes 1 through 6. Answers stay anchored to the system diagram—no redrawing, no new modes.</p>
                </div>
              )}

              {history.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-[hsla(var(--border)_/_0.6)] bg-[hsla(var(--background)_/_0.55)] p-4 space-y-3 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                  <div className="flex items-center gap-2 text-xs text-[hsla(var(--foreground)_/_0.55)]">
                    <MessageSquare size={14} />
                    <span>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">{entry.question}</p>
                  <div className="prose prose-invert prose-sm max-w-none leading-relaxed text-[hsla(var(--foreground)_/_0.85)]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.answer}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 text-sm text-[hsla(var(--foreground)_/_0.7)]">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Generating architecture insight…</span>
                </div>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-[hsla(var(--border)_/_0.55)] p-4 bg-[hsla(var(--background)_/_0.45)]">
              <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[hsla(var(--foreground)_/_0.5)] mb-2 block">Ask AI about this architecture</label>
              <div className="flex gap-2">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1 resize-none rounded-xl border border-[hsla(var(--border)_/_0.6)] bg-[hsla(var(--background)_/_0.5)] px-3 py-2 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsla(var(--primary)_/_0.45)]"
                  rows={2}
                  placeholder="Ask about resilience, scaling, or bottlenecks..."
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="h-[46px] w-[46px] rounded-xl bg-primary/80 text-[hsl(var(--primary-foreground))] flex items-center justify-center hover:bg-primary"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                </button>
              </div>
            </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ArchitectureIntelligencePanel;
