'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeftRight, ChevronDown, Loader2, X } from 'lucide-react';
import { IProject } from '@/types';
import { PROJECTS } from '@/lib/data';

type SelectOption = { id: number; title: string };

interface ArchitectureSelectProps {
  label: string;
  value: number;
  onChange: (id: number) => void;
  options: SelectOption[];
}

const ArchitectureSelect = ({ label, value, onChange, options }: ArchitectureSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current || wrapperRef.current.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <label className="text-xs uppercase tracking-[0.25em] text-white/50">{label}</label>
      <button
        type="button"
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate text-left">{selected?.title ?? 'Select architecture'}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-3 z-20 max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950/95 shadow-xl backdrop-blur p-1"
            role="listbox"
            onWheelCapture={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            {options.map((option) => {
              const isSelected = option.id === value;
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${
                      isSelected ? 'bg-primary/20 text-white' : 'text-white/80 hover:bg-white/5'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {option.title}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ArchitectureComparisonPanelProps {
  project: IProject;
  isOpen: boolean;
  onClose: () => void;
}

const ArchitectureComparisonPanel = ({ project, isOpen, onClose }: ArchitectureComparisonPanelProps) => {
  const [firstProjectId, setFirstProjectId] = useState(project.id);
  const [secondProjectId, setSecondProjectId] = useState(() => PROJECTS.find((p) => p.id !== project.id)?.id ?? project.id);
  const [comparison, setComparison] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent background scroll when the modal is open
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    setFirstProjectId(project.id);
    setComparison('');
    setError(null);
    setSecondProjectId((current) => {
      if (project.id === current) {
        return PROJECTS.find((p) => p.id !== project.id)?.id ?? project.id;
      }
      return current;
    });
  }, [project.id]);

  useEffect(() => {
    setComparison('');
    setError(null);
  }, [firstProjectId, secondProjectId]);

  const selectableProjects = useMemo(() => PROJECTS.map((p) => ({ id: p.id, title: p.title })), []);

  const handleCompare = async () => {
    if (!firstProjectId || !secondProjectId || firstProjectId === secondProjectId) {
      setError('Select two different projects to compare.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/architecture-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstProjectId, secondProjectId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Comparison failed.');
      }
      setComparison(data.comparison);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-zinc-950/95 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">Architecture Comparison</p>
                <h5 className="text-xl font-semibold text-white">Contrast data flow, model choices, and trade-offs</h5>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-white/60 hover:text-white hover:bg-white/10"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
              <ArchitectureSelect
                label="Architecture A"
                value={firstProjectId}
                onChange={setFirstProjectId}
                options={selectableProjects}
              />
              <ArchitectureSelect
                label="Architecture B"
                value={secondProjectId}
                onChange={setSecondProjectId}
                options={selectableProjects}
              />
            </div>

            <div className="px-6">
              <button
                type="button"
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/80 px-4 py-2 text-black text-sm font-semibold hover:bg-primary"
                onClick={handleCompare}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <ArrowLeftRight size={16} />}
                <span>Compare Architectures</span>
              </button>
            </div>

            <div className="px-6 pb-6">
              {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
              {comparison && (
                <div className="prose prose-invert max-w-none border border-white/10 rounded-2xl bg-white/5 p-5 text-sm leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{comparison}</ReactMarkdown>
                </div>
              )}
              {isLoading && !comparison && (
                <p className="text-sm text-white/70">Synthesizing comparison…</p>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default ArchitectureComparisonPanel;
