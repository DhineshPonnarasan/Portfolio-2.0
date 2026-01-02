'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Beaker, CheckCircle2, Loader2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IProject } from '@/types';

interface ArchitectureLabPanelProps {
    project: IProject;
    isOpen: boolean;
    onClose: () => void;
}

type LabTab = 'challenge' | 'whatif';

const CHALLENGE_HINTS = [
    'Which boxes ingest data? Which boxes transform it?',
    'Where would you place caching or queues?',
    'How would you route alerts from later boxes back to Box 1 or 2?',
];

const WHAT_IF_TOGGLES = [
    'Replace batch ingest with streaming',
    'Introduce a central feature store',
    'Split monolith scoring into microservices',
    'Add blue/green or canary rollout',
] as const;

const ArchitectureLabPanel = ({ project, isOpen, onClose }: ArchitectureLabPanelProps) => {
    const [tab, setTab] = useState<LabTab>('challenge');
    const [attempt, setAttempt] = useState('');
    const [attemptFeedback, setAttemptFeedback] = useState<string | null>(null);
    const [attemptError, setAttemptError] = useState<string | null>(null);
    const [attemptLoading, setAttemptLoading] = useState(false);

    const [whatIfNotes, setWhatIfNotes] = useState('');
    const [whatIfSelection, setWhatIfSelection] = useState<string[]>([]);

    const runChallengeReview = async () => {
        if (!attempt.trim()) {
            setAttemptError('Describe your architecture attempt before asking for feedback.');
            return;
        }
        setAttemptLoading(true);
        setAttemptError(null);
        setAttemptFeedback(null);
        try {
            const response = await fetch('/api/architecture-challenge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: project.id, attempt }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Unable to review this attempt right now.');
            }
            setAttemptFeedback(data.feedback);
        } catch (error) {
            setAttemptError(error instanceof Error ? error.message : 'Unexpected error.');
        } finally {
            setAttemptLoading(false);
        }
    };

    const toggleWhatIf = (label: string) => {
        setWhatIfSelection((prev) =>
            prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0, scale: 0.97, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 16 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    >
                        <div className="w-full max-w-5xl max-h-[92vh] rounded-[28px] border border-white/12 bg-zinc-950/95 shadow-[0_25px_80px_rgba(0,0,0,0.55)] flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-zinc-900 to-zinc-950">
                                <div>
                                    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/60">
                                        Systems Lab
                                    </p>
                                    <h5 className="text-xl font-semibold text-white">
                                        Practice designing {project.title}&apos;s architecture
                                    </h5>
                                </div>
                                <button
                                    type="button"
                                    className="rounded-full p-2 text-white/60 hover:text-white hover:bg-white/10"
                                    onClick={onClose}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="px-6 pt-4 pb-2 border-b border-white/10 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-white/60">
                                <button
                                    type="button"
                                    className={`rounded-full px-3 py-1 border ${
                                        tab === 'challenge'
                                            ? 'border-primary text-primary bg-primary/10'
                                            : 'border-white/10 text-white/70'
                                    }`}
                                    onClick={() => setTab('challenge')}
                                >
                                    Challenge
                                </button>
                                <button
                                    type="button"
                                    className={`rounded-full px-3 py-1 border ${
                                        tab === 'whatif'
                                            ? 'border-primary text-primary bg-primary/10'
                                            : 'border-white/10 text-white/70'
                                    }`}
                                    onClick={() => setTab('whatif')}
                                >
                                    What-if design
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
                                {tab === 'challenge' && (
                                    <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
                                        <div className="space-y-3">
                                            <p className="text-xs text-white/70">
                                                Sketch how you think Boxes 1 → 6 should connect for this system. Focus
                                                on which boxes ingest, transform, score, and feed back signals.
                                            </p>
                                            <textarea
                                                value={attempt}
                                                onChange={(event) => setAttempt(event.target.value)}
                                                rows={8}
                                                className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
                                                placeholder="Describe your architecture attempt here – reference Boxes 1, 2, 3… and the arrows you think should exist between them."
                                            />
                                            <div className="flex flex-wrap gap-2 text-[0.65rem] text-white/60">
                                                {CHALLENGE_HINTS.map((hint) => (
                                                    <span
                                                        key={hint}
                                                        className="rounded-full border border-white/12 px-3 py-1"
                                                    >
                                                        {hint}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <button
                                                type="button"
                                                onClick={runChallengeReview}
                                                disabled={attemptLoading}
                                                className="inline-flex items-center gap-2 rounded-full bg-primary/90 px-5 py-2.5 text-sm font-semibold text-black shadow-lg hover:bg-primary"
                                            >
                                                {attemptLoading ? (
                                                    <Loader2 className="animate-spin" size={16} />
                                                ) : (
                                                    <Beaker size={16} />
                                                )}
                                                <span>
                                                    {attemptLoading ? 'Reviewing attempt…' : 'Review my architecture'}
                                                </span>
                                            </button>
                                            {attemptError && (
                                                <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                                                    <AlertCircle size={14} />
                                                    <span>{attemptError}</span>
                                                </div>
                                            )}
                                            {attemptFeedback && (
                                                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-50 space-y-2">
                                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                                        <CheckCircle2 size={14} />
                                                        <span>Reviewer feedback</span>
                                                    </div>
                                                    <div className="prose prose-invert prose-sm max-w-none">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {attemptFeedback}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            )}
                                            {!attemptFeedback && !attemptError && !attemptLoading && (
                                                <p className="text-xs text-white/60">
                                                    Feedback compares your text against the ASCII Boxes 1 → 6. It never
                                                    redraws the system, only calls out matches and gaps.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {tab === 'whatif' && (
                                    <div className="space-y-4">
                                        <p className="text-xs text-white/70">
                                            Flip a few switches to think through how this architecture would change
                                            under different design decisions. Use the notes as scaffolding for your own
                                            trade-off analysis.
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-[0.7rem] text-white/70">
                                            {WHAT_IF_TOGGLES.map((label) => {
                                                const active = whatIfSelection.includes(label);
                                                return (
                                                    <button
                                                        key={label}
                                                        type="button"
                                                        onClick={() => toggleWhatIf(label)}
                                                        className={`rounded-full border px-3 py-1 transition ${
                                                            active
                                                                ? 'border-primary text-primary bg-primary/10'
                                                                : 'border-white/15 text-white/70 hover:border-primary/60'
                                                        }`}
                                                    >
                                                        {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <textarea
                                            value={whatIfNotes}
                                            onChange={(event) => setWhatIfNotes(event.target.value)}
                                            rows={6}
                                            className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
                                            placeholder="Outline how Boxes 1 → 6 would change under the selected toggles. For example: which boxes become stateful, which need new queues, or where backpressure and retries should live."
                                        />
                                        <p className="text-[0.7rem] text-white/50">
                                            This space is intentionally offline: it helps you think through variations
                                            before you ever ask an AI or interviewer. You can copy these notes into
                                            Chitti or your own diagramming tool when you&apos;re ready.
                                        </p>
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

export default ArchitectureLabPanel;


