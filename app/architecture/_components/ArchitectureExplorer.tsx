'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SystemArchitectureDiagrams from '@/components/diagrams/SystemArchitectureDiagrams';
import MermaidDiagram from '@/components/MermaidDiagram';
import { trackEvent } from '@/lib/analytics';
import { Loader2 } from 'lucide-react';

type ArchitectureMode = 'overview' | 'data' | 'deployment';

interface ArchitectureExplorerProject {
    id: number;
    slug: string;
    title: string;
    year: number;
    techAndTechniques?: string[];
    techStack?: string[];
}

interface Props {
    projects: ArchitectureExplorerProject[];
}

interface ProjectState {
    explanation: string | null;
    mode: ArchitectureMode;
    isLoading: boolean;
    error: string | null;
}

const MODES: { id: ArchitectureMode; label: string }[] = [
    { id: 'overview', label: 'High-level' },
    { id: 'data', label: 'Data pipeline' },
    { id: 'deployment', label: 'Deployment' },
];

const STORAGE_KEY_PREFIX = 'architecture:view:';

const ArchitectureExplorer = ({ projects }: Props) => {
    const [stateBySlug, setStateBySlug] = useState<Record<string, ProjectState>>(() =>
        Object.fromEntries(
            projects.map((project) => [
                project.slug,
                {
                    explanation: null,
                    mode: 'overview',
                    isLoading: false,
                    error: null,
                },
            ]),
        ),
    );

    useEffect(() => {
        const nextState: Record<string, ProjectState> = { ...stateBySlug };

        projects.forEach((project) => {
            MODES.forEach((mode) => {
                const cacheKey = `${STORAGE_KEY_PREFIX}${project.slug}:${mode.id}`;
                const cached = typeof window !== 'undefined' ? window.localStorage.getItem(cacheKey) : null;
                if (cached && !nextState[project.slug]?.explanation) {
                    nextState[project.slug] = {
                        explanation: cached,
                        mode: mode.id,
                        isLoading: false,
                        error: null,
                    };
                }
            });
        });

        setStateBySlug(nextState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateProjectState = useCallback((slug: string, patch: Partial<ProjectState>) => {
        setStateBySlug((prev) => ({
            ...prev,
            [slug]: { ...(prev[slug] || { explanation: null, mode: 'overview', isLoading: false, error: null }), ...patch },
        }));
    }, []);

    const handleModeChange = (slug: string, mode: ArchitectureMode) => {
        updateProjectState(slug, { mode });
        trackEvent('architecture_mode_change', { slug, mode });
    };

    const handleGenerate = async (project: ArchitectureExplorerProject) => {
        const current = stateBySlug[project.slug] || {
            explanation: null,
            mode: 'overview' as ArchitectureMode,
            isLoading: false,
            error: null,
        };

        const cacheKey = `${STORAGE_KEY_PREFIX}${project.slug}:${current.mode}`;
        const cached = typeof window !== 'undefined' ? window.localStorage.getItem(cacheKey) : null;

        if (cached) {
            updateProjectState(project.slug, { explanation: cached, error: null });
            trackEvent('architecture_view_cached', { slug: project.slug, mode: current.mode });
            return;
        }

        updateProjectState(project.slug, { isLoading: true, error: null, explanation: null });
        trackEvent('architecture_view_requested', { slug: project.slug, mode: current.mode });

        try {
            const response = await fetch('/api/architecture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: project.slug, mode: current.mode }),
            });

            if (!response.ok || !response.body) {
                const data = await response.json().catch(() => ({}));
                throw new Error((data as any).error || 'Unable to generate architecture right now.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let accumulated = '';

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    accumulated += chunk;
                    updateProjectState(project.slug, { explanation: accumulated });
                }
            }

            if (typeof window !== 'undefined' && accumulated.trim()) {
                window.localStorage.setItem(cacheKey, accumulated);
            }
        } catch (error) {
            updateProjectState(project.slug, {
                error: error instanceof Error ? error.message : 'Unexpected error.',
                explanation: null,
            });
        } finally {
            updateProjectState(project.slug, { isLoading: false });
        }
    };

    return (
        <section className="grid gap-6 md:gap-8 md:grid-cols-2">
            {projects.map((project) => {
                const projectState = stateBySlug[project.slug] || {
                    explanation: null,
                    mode: 'overview' as ArchitectureMode,
                    isLoading: false,
                    error: null,
                };

                return (
                    <article
                        key={project.slug}
                        className="rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-sm p-5 md:p-6 flex flex-col gap-4"
                    >
                        <header className="space-y-1">
                            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground/70">
                                Project {project.id.toString().padStart(2, '0')}
                            </p>
                            <h2 className="text-lg md:text-xl font-anton">{project.title}</h2>
                            <p className="text-xs text-muted-foreground/80">Year: {project.year}</p>
                        </header>

                        <div className="flex flex-wrap gap-2 text-[0.6rem] tracking-[0.25em] uppercase">
                            {MODES.map((mode) => (
                                <button
                                    key={mode.id}
                                    type="button"
                                    className={`px-3 py-1 rounded-full border transition-all duration-300 ${
                                        projectState.mode === mode.id
                                            ? 'border-primary text-primary bg-primary/10 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                                            : 'border-white/10 text-muted-foreground/80 hover:border-primary/40 hover:text-primary/80'
                                    }`}
                                    onClick={() => handleModeChange(project.slug, mode.id)}
                                >
                                    {mode.label}
                                </button>
                            ))}
                        </div>

                        {/* Clean Diagram Area - No Box Clusters */}
                        <div className="rounded-xl overflow-hidden bg-transparent">
                            <SystemArchitectureDiagrams projectId={project.id} />
                        </div>

                        {/* Premium Pill Buttons Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                            <button
                                type="button"
                                className="architecture-button architecture-button--primary"
                                onClick={() => handleGenerate(project)}
                                disabled={projectState.isLoading}
                            >
                                {projectState.isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Loading…
                                    </span>
                                ) : (
                                    'Explain Flow'
                                )}
                            </button>
                            <button
                                type="button"
                                className="architecture-button"
                                onClick={() => handleGenerate(project)}
                                disabled={projectState.isLoading}
                            >
                                Overview
                            </button>
                            <button
                                type="button"
                                className="architecture-button"
                                onClick={() => handleGenerate(project)}
                                disabled={projectState.isLoading}
                            >
                                Ask Questions
                            </button>
                            <button
                                type="button"
                                className="architecture-button"
                                onClick={() => handleGenerate(project)}
                                disabled={projectState.isLoading}
                            >
                                Simulate
                            </button>
                        </div>

                        <div className="mt-2">
                            {projectState.error && (
                                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                                    {projectState.error}
                                </p>
                            )}
                            {!projectState.error && projectState.explanation && (
                                <div className="mt-2 prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, inline, className, children, ...props }: any) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                if (match && match[1] === 'mermaid') {
                                                    return (
                                                        <MermaidDiagram chart={String(children).replace(/\n$/, '')} />
                                                    );
                                                }
                                                return !inline && match ? (
                                                    <pre className="bg-zinc-950 p-3 rounded-lg overflow-x-auto my-2 border border-white/10">
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    </pre>
                                                ) : (
                                                    <code
                                                        className="bg-white/10 px-1.5 py-0.5 rounded text-[0.7rem] font-mono"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                );
                                            },
                                        }}
                                    >
                                        {projectState.explanation}
                                    </ReactMarkdown>
                                </div>
                            )}
                            {!projectState.error &&
                                !projectState.explanation &&
                                !projectState.isLoading && (
                                    <p className="text-xs text-muted-foreground/80">
                                        Generate an architecture view to see a narrative of how Boxes 1 → 6 work together
                                        for this project.
                                    </p>
                                )}
                        </div>
                    </article>
                );
            })}
        </section>
    );
};

export default ArchitectureExplorer;


