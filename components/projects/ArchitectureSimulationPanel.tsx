"use client";

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Loader2, Play, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IProject } from '@/types';

interface ArchitectureSimulationPanelProps {
  project: IProject;
  isOpen: boolean;
  onClose: () => void;
}

const SCENARIOS = [
  'Traffic spike at ingress',
  'Data drift in upstream signals',
  'Model failure during deployment',
  'Cold start scenario',
  'Latency bottleneck',
];

const ArchitectureSimulationPanel = ({ project, isOpen, onClose }: ArchitectureSimulationPanelProps) => {
  const [scenario, setScenario] = useState<string>(SCENARIOS[0]);
  const [customScenario, setCustomScenario] = useState('');
  const [simulation, setSimulation] = useState('');
  const [lastSimulatedScenario, setLastSimulatedScenario] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const activeScenario = useMemo(() => customScenario.trim() || scenario, [customScenario, scenario]);

  const runSimulation = async () => {
    const chosenScenario = activeScenario;
    if (!chosenScenario) {
      setError('Provide a scenario to simulate.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/architecture-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, scenario: chosenScenario }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Simulation failed.');
      }
      setSimulation(data.simulation);
      setLastSimulatedScenario(chosenScenario);
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
            className="fixed inset-0 z-40 bg-[hsla(var(--background)_/_0.65)] backdrop-blur-sm"
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
            transition={{ type: 'spring', stiffness: 210, damping: 24 }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-5xl rounded-[32px] border border-[hsla(var(--border)_/_0.55)] bg-[hsla(var(--background-light)_/_0.95)] shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl flex flex-col max-h-[92vh] overflow-hidden">
              <div className="flex items-start justify-between gap-6 px-8 py-6 border-b border-[hsla(var(--border)_/_0.5)] bg-[radial-gradient(circle_at_85%_20%,hsla(var(--primary)_/_0.18),transparent_45%)]">
                <div className="space-y-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[hsla(var(--foreground)_/_0.6)]">Architecture simulation</p>
                  <h5 className="text-2xl font-semibold text-[hsl(var(--foreground))]">Stress-test Boxes 1→6 for {project.title}</h5>
                  <p className="text-sm text-[hsla(var(--foreground)_/_0.7)]">Outputs stay ASCII-only; every narrative traces the immutable diagram.</p>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-[hsla(var(--foreground)_/_0.55)] hover:text-[hsl(var(--foreground))] hover:bg-[hsla(var(--foreground)_/_0.08)]"
                  onClick={onClose}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 grid gap-6 px-8 py-6 lg:grid-cols-[1.15fr,0.85fr] overflow-y-auto custom-scrollbar min-h-0" style={{ overscrollBehavior: 'contain' }}>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[hsla(var(--foreground)_/_0.55)]">Preset stressors</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {SCENARIOS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setScenario(preset);
                            setCustomScenario('');
                          }}
                          className={`rounded-full border px-3 py-2 text-xs transition ${
                            preset === scenario && !customScenario
                              ? 'border-[hsla(var(--primary)_/_0.8)] bg-[hsla(var(--primary)_/_0.15)] text-[hsl(var(--foreground))]'
                              : 'border-[hsla(var(--border)_/_0.6)] text-[hsla(var(--foreground)_/_0.75)] hover:border-[hsla(var(--primary)_/_0.6)]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[hsla(var(--border)_/_0.5)] bg-[hsla(var(--background)_/_0.55)] p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[hsla(var(--foreground)_/_0.55)]">
                      <Sparkles size={14} />
                      <span>Custom scenario</span>
                    </div>
                    <textarea
                      rows={3}
                      value={customScenario}
                      onChange={(event) => setCustomScenario(event.target.value)}
                      placeholder="e.g., Multi-region failover while Box 5 is under maintenance"
                      className="w-full rounded-xl border border-[hsla(var(--border)_/_0.55)] bg-[hsla(var(--background-light)_/_0.6)] px-4 py-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsla(var(--primary)_/_0.45)]"
                    />
                    <p className="text-xs text-[hsla(var(--foreground)_/_0.65)]">Optional. Leave blank to run the highlighted preset.</p>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-[hsla(var(--border)_/_0.5)] bg-[hsla(var(--background)_/_0.5)] p-5">
                  <div className="rounded-2xl border border-[hsla(var(--border)_/_0.4)] bg-[hsla(var(--background-light)_/_0.4)] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-[hsla(var(--foreground)_/_0.6)]">Scenario preview</p>
                    <p className="mt-2 text-sm text-[hsl(var(--foreground))] min-h-[48px]">
                      {activeScenario || 'Choose a preset or describe your own stress test.'}
                    </p>
                    {lastSimulatedScenario && (
                      <p className="mt-3 text-xs text-[hsla(var(--foreground)_/_0.5)]">Last run · {lastSimulatedScenario}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={runSimulation}
                      disabled={isLoading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-[hsl(var(--primary-foreground))] text-sm font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition hover:opacity-90"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                      <span>{isLoading ? 'Simulating...' : 'Run simulation'}</span>
                    </button>
                    {error && (
                      <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        <AlertTriangle size={16} />
                        <span>{error}</span>
                      </div>
                    )}
                    <p className="text-[0.75rem] text-[hsla(var(--foreground)_/_0.6)]">Outputs reference Box numbers explicitly. No mockups, no restyling of the ASCII diagram.</p>
                  </div>
                </div>
              </div>

              <div className="px-8 pb-7">
                {simulation ? (
                  <div className="prose prose-invert max-w-none rounded-2xl border border-[hsla(var(--border)_/_0.55)] bg-[hsla(var(--background)_/_0.55)] p-6 text-sm leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{simulation}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[hsla(var(--border)_/_0.5)] bg-[hsla(var(--background)_/_0.35)] p-6 text-sm text-[hsla(var(--foreground)_/_0.65)]">
                    The simulator narrates how each box absorbs the stress case you select. Pick a preset or describe your own to see how the ASCII system behaves end-to-end.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ArchitectureSimulationPanel;
