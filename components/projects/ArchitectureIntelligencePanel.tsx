'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
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
  'Walk me through the data flow from Box 1 to Box 6',
  'What are the key reliability boundaries in this system?',
  'How does this architecture handle failure scenarios?',
];

const ArchitectureIntelligencePanel = ({ project, isOpen, onClose }: ArchitectureIntelligencePanelProps) => {
  const [history, setHistory] = useState<ConversationEntry[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll lock when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
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
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div 
              className="w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl flex flex-col max-h-[85vh] overflow-hidden"
              style={{ overscrollBehavior: 'contain' }}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/10 bg-zinc-900/50 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-white/50">Architecture Explorer</p>
                    <h5 className="text-xl font-semibold text-white">{project.title}</h5>
                  </div>
                  <button
                    type="button"
                    className="rounded-full p-2 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={onClose}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Quick prompts */}
              <div className="px-6 py-4 border-b border-white/10 bg-zinc-900/30 shrink-0">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Quick questions</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:border-primary/50 hover:text-white transition-colors"
                      onClick={() => sendQuestion(prompt)}
                      disabled={isLoading}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversation area */}
              <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0 custom-scrollbar"
                style={{ overscrollBehavior: 'contain' }}
              >
                {history.length === 0 && !isLoading && (
                  <div className="text-sm text-white/50 leading-relaxed py-8 text-center">
                    <p>Ask about data flow, failure modes, scaling considerations, or any architectural decisions in this system.</p>
                  </div>
                )}

                {history.map((entry) => (
                  <motion.div 
                    key={entry.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <MessageSquare size={14} />
                      <span>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm font-medium text-white">{entry.question}</p>
                    <div className="prose prose-invert prose-sm max-w-none leading-relaxed text-white/80">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.answer}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-3 text-sm text-white/60 py-4">
                    <Loader2 className="animate-spin" size={16} />
                    <span>Analyzing architecture...</span>
                  </div>
                )}

                {error && <p className="text-sm text-red-400 py-2">{error}</p>}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t border-white/10 p-4 bg-zinc-900/50 shrink-0">
                <div className="flex gap-3">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
                    rows={2}
                    placeholder="Ask about resilience, scaling, data flow..."
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="h-[54px] w-[54px] rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                    disabled={isLoading || !question.trim()}
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
