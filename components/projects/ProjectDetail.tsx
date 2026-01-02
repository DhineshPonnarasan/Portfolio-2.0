"use client";

import SystemArchitectureDiagrams from '../diagrams/SystemArchitectureDiagrams';
import ArrowAnimation from '@/components/ArrowAnimation';
import TransitionLink from '@/components/TransitionLink';
import ArchitectureIntelligencePanel from './ArchitectureIntelligencePanel';
import ArchitectureComparisonPanel from './ArchitectureComparisonPanel';
import ArchitectureSimulationPanel from './ArchitectureSimulationPanel';
import VoiceArchitectureExplanation from './VoiceArchitectureExplanation';
import { IProject } from '@/types';
import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowLeft, ExternalLink, Github, Loader2, X } from 'lucide-react';
import parse from 'html-react-parser';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MermaidDiagram from '../MermaidDiagram';
import { getArchitectureMetadata } from '@/lib/architecture';
import { MERMAID_DIAGRAMS } from '@/lib/mermaid-templates';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
    project: IProject;
}

const ProjectDetail = ({ project }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const architectureAnchorRef = useRef<HTMLDivElement>(null);
    const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isIntelPanelOpen, setIsIntelPanelOpen] = useState(false);
    const [isComparePanelOpen, setIsComparePanelOpen] = useState(false);
    const [isSimulationOpen, setIsSimulationOpen] = useState(false);
    const [isVoiceExplanationOpen, setIsVoiceExplanationOpen] = useState(false);
    const [isExplainLoading, setIsExplainLoading] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [explainError, setExplainError] = useState<string | null>(null);
    const [isExplanationVisible, setIsExplanationVisible] = useState(false);
    const [showChittiPulse, setShowChittiPulse] = useState(false);
    const [pulseScheduled, setPulseScheduled] = useState(false);
    const [animationBadge, setAnimationBadge] = useState<string | null>(null);
    const architectureAnchorId = `system-architecture-${project.slug}`;
    const architectureDescribeId = `${architectureAnchorId}-diagram-desc`;
    const { complexity, style } = getArchitectureMetadata(project.id);
    const [activeMode, setActiveMode] = useState<'overview' | 'data' | 'deployment'>('overview');
    const [viewMode, setViewMode] = useState<'ascii' | 'architecture' | 'workflow'>('ascii');

    const mermaidTemplates = MERMAID_DIAGRAMS[project.slug as keyof typeof MERMAID_DIAGRAMS];

    const badgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stopChittiPulse = () => {
        if (pulseTimerRef.current) {
            clearTimeout(pulseTimerRef.current);
            pulseTimerRef.current = null;
        }
        setShowChittiPulse(false);
        setPulseScheduled(true);
    };

    const triggerBadge = (message: string) => {
        if (badgeTimerRef.current) {
            clearTimeout(badgeTimerRef.current);
        }
        setAnimationBadge(message);
        badgeTimerRef.current = setTimeout(() => setAnimationBadge(null), 3200);
    };

    useGSAP(
        () => {
            if (!containerRef.current) return;

            gsap.set('.fade-in-later', {
                autoAlpha: 0,
                y: 30,
            });
            const tl = gsap.timeline({ delay: 0.4 });

            tl.to('.fade-in-later', {
                autoAlpha: 1,
                y: 0,
                stagger: 0.08,
            });
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            if (typeof window === 'undefined' || window.innerWidth < 992) return;

            gsap.to('#info', {
                filter: 'blur(3px)',
                autoAlpha: 0,
                scale: 0.92,
                scrollTrigger: {
                    trigger: '#info',
                    start: 'bottom bottom',
                    end: 'bottom top',
                    pin: true,
                    pinSpacing: false,
                    scrub: 0.5,
                },
            });
        },
        { scope: containerRef },
    );

    useEffect(() => {
        if (pulseScheduled || !architectureAnchorRef.current) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        pulseTimerRef.current = setTimeout(() => {
                            setShowChittiPulse(true);
                        }, 5000);
                        setPulseScheduled(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.3 },
        );

        observer.observe(architectureAnchorRef.current);

        return () => {
            observer.disconnect();
            if (pulseTimerRef.current) {
                clearTimeout(pulseTimerRef.current);
            }
        };
    }, [pulseScheduled]);

    const handleExplainArchitecture = async () => {
        stopChittiPulse();
        triggerBadge('Explaining the flow...');
        if (isExplainLoading) {
            return;
        }
        setIsExplanationVisible(true);
        setExplainError(null);
        setIsExplainLoading(true);
        setExplanation(null);
        try {
            const response = await fetch('/api/architecture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: project.slug, mode: activeMode }),
            });

            if (!response.ok || !response.body) {
                const data = await response.json().catch(() => ({}));
                throw new Error((data as any).error || 'Unable to explain this architecture right now.');
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
                    setExplanation(accumulated);
                }
            }
        } catch (error) {
            setExplainError(error instanceof Error ? error.message : 'Unexpected error.');
        } finally {
            setIsExplainLoading(false);
        }
    };

    const handleAskChitti = () => {
        stopChittiPulse();
        triggerBadge('Chatting with Chitti...');
        setIsIntelPanelOpen(true);
    };

    useEffect(() => {
        return () => {
            if (badgeTimerRef.current) {
                clearTimeout(badgeTimerRef.current);
            }
        };
    }, []);

    return (
        <section className="min-h-screen py-8">
            <div className="container" ref={containerRef}>
                <TransitionLink
                    back
                    href="/"
                    className="mb-12 inline-flex gap-2 items-center group h-12"
                >
                    <ArrowLeft className="group-hover:-translate-x-1 group-hover:text-primary transition-all duration-300" />
                    Back
                </TransitionLink>

                <div className="min-h-[calc(100vh-200px)] flex" id="info">
                    <div className="relative w-full">
                        <div className="flex items-start gap-6 mx-auto mb-10 max-w-[800px] flex-wrap md:flex-nowrap">
                            <h1 className="fade-in-later opacity-0 text-4xl md:text-[60px] leading-none font-anton overflow-hidden">
                                <span className="inline-block">{project.title}</span>
                            </h1>
                            <div className="fade-in-later opacity-0 flex gap-3">
                                {project.sourceCode && (
                                    <a
                                        href={project.sourceCode}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="hover:text-primary"
                                    >
                                        <Github size={30} />
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="hover:text-primary"
                                    >
                                        <ExternalLink size={30} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="max-w-[800px] space-y-7 pb-20 mx-auto">
                            <div className="fade-in-later">
                                <p className="text-muted-foreground font-anton mb-3">Year</p>
                                <div className="text-lg">{project.year}</div>
                            </div>

                            <div className="fade-in-later">
                                <p className="text-muted-foreground font-anton mb-3">Tech & Techniques</p>
                                {project.techAndTechniques && project.techAndTechniques.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {project.techAndTechniques.map((tech, i) => (
                                            <span key={i} className="tech-tag">{tech}</span>
                                        ))}
                                    </div>
                                ) : project.techStack && project.techStack.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map((tech, i) => (
                                            <span key={i} className="tech-tag">{tech}</span>
                                        ))}
                                    </div>
                                ) : null}
                            </div>

                            <div className="fade-in-later space-y-6">
                                <div className="flex flex-wrap items-baseline justify-between gap-3">
                                    <p className="text-muted-foreground font-anton mb-3">Description</p>
                                    <a
                                        href={`#${architectureAnchorId}`}
                                        className="text-[0.7rem] tracking-[0.5em] uppercase text-primary hover:text-white transition"
                                    >
                                        Jump to architecture
                                    </a>
                                </div>
                                {Array.isArray(project.description) ? (
                                    <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90 mb-4">
                                        {project.description.map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-lg prose-xl markdown-text mb-4">{parse(project.description)}</div>
                                )}
                            </div>

                            {project.keyFeatures && project.keyFeatures.length > 0 && (
                                <div className="fade-in-later">
                                    <h4 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                                        <span className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></span>
                                        Key Features
                                    </h4>
                                    <ul className="custom-bullet-list space-y-3">
                                        {project.keyFeatures.map((point, i) => (
                                            <li key={i} className="text-lg text-muted-foreground/90">{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {project.metrics && project.metrics.length > 0 && (
                                <div className="fade-in-later">
                                    <h4 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                                        <span className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></span>
                                        Metrics
                                    </h4>
                                    <ul className="custom-bullet-list space-y-3">
                                        {project.metrics.map((point, i) => (
                                            <li key={i} className="text-lg text-muted-foreground/90">{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {project.skills && project.skills.length > 0 && (
                                <div className="fade-in-later">
                                    <p className="text-muted-foreground font-anton mb-3">Tech Stack / Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.skills.map((skill, i) => (
                                            <span key={i} className="tech-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.interestingHighlights && project.interestingHighlights.length > 0 && (
                                <div className="fade-in-later">
                                    <h4 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                                        <span className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></span>
                                        Interesting Highlights
                                    </h4>
                                    <ul className="custom-bullet-list space-y-3">
                                        {project.interestingHighlights.map((point, i) => (
                                            <li key={i} className="text-lg text-muted-foreground/90">{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {project.interestingHighlights && project.interestingHighlights.length > 0 && (
                                <div className="mt-10 fade-in-later" id={architectureAnchorId} ref={architectureAnchorRef}>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground/80">
                                            <span className="font-semibold capitalize">{complexity}</span> complexity
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground/80">
                                            {style}
                                        </span>
                                    </div>
                                    <div className="architecture-shell mt-6">
                                        {/* Header */}
                                        <div className="architecture-shell__header mb-4">
                                            <div>
                                                <p className="architecture-shell__eyebrow">System Architecture</p>
                                                <h4 className="architecture-shell__title">{project.title}</h4>
                                            </div>
                                        </div>

                                        {/* View Controls */}
                                        <div className="flex flex-wrap items-center gap-3 mt-4">
                                            {/* Diagram Format */}
                                            <div className="flex gap-2 text-[0.7rem] tracking-wider uppercase">
                                                <button
                                                    type="button"
                                                    className={`architecture-view-mode-btn px-4 py-2 rounded-md border transition-all duration-200 ${
                                                        viewMode === 'ascii'
                                                            ? 'border-white/30 bg-white/10 text-white shadow-sm'
                                                            : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:bg-white/[0.06]'
                                                    }`}
                                                    onClick={() => setViewMode('ascii')}
                                                    aria-pressed={viewMode === 'ascii'}
                                                >
                                                    Detailed
                                                </button>
                                                {mermaidTemplates?.architecture && (
                                                    <button
                                                        type="button"
                                                        className={`architecture-view-mode-btn px-4 py-2 rounded-md border transition-all duration-200 ${
                                                            viewMode === 'architecture'
                                                                ? 'border-white/30 bg-white/10 text-white shadow-sm'
                                                                : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:bg-white/[0.06]'
                                                        }`}
                                                        onClick={() => setViewMode('architecture')}
                                                        aria-pressed={viewMode === 'architecture'}
                                                    >
                                                        Flow
                                                    </button>
                                                )}
                                                {mermaidTemplates?.workflow && (
                                                    <button
                                                        type="button"
                                                        className={`architecture-view-mode-btn px-4 py-2 rounded-md border transition-all duration-200 ${
                                                            viewMode === 'workflow'
                                                                ? 'border-white/30 bg-white/10 text-white shadow-sm'
                                                                : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:bg-white/[0.06]'
                                                        }`}
                                                        onClick={() => setViewMode('workflow')}
                                                        aria-pressed={viewMode === 'workflow'}
                                                    >
                                                        Workflow
                                                    </button>
                                                )}
                                            </div>

                                            {/* Explanation Mode */}
                                            <div className="flex gap-2 text-[0.7rem] tracking-wider uppercase ml-auto">
                                                <button
                                                    type="button"
                                                    className={`architecture-mode-btn px-4 py-2 rounded-md border transition-all duration-200 ${
                                                        activeMode === 'overview'
                                                            ? 'border-white/30 bg-white/10 text-white shadow-sm'
                                                            : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:bg-white/[0.06]'
                                                    }`}
                                                    onClick={() => setActiveMode('overview')}
                                                    aria-pressed={activeMode === 'overview'}
                                                    title="End-to-end system overview"
                                                >
                                                    Overview
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`architecture-mode-btn px-4 py-2 rounded-md border transition-all duration-200 ${
                                                        activeMode === 'data'
                                                            ? 'border-white/30 bg-white/10 text-white shadow-sm'
                                                            : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:bg-white/[0.06]'
                                                    }`}
                                                    onClick={() => setActiveMode('data')}
                                                    aria-pressed={activeMode === 'data'}
                                                    title="Data flow and transformations"
                                                >
                                                    Data
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`architecture-mode-btn px-4 py-2 rounded-md border transition-all duration-200 ${
                                                        activeMode === 'deployment'
                                                            ? 'border-white/30 bg-white/10 text-white shadow-sm'
                                                            : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:bg-white/[0.06]'
                                                    }`}
                                                    onClick={() => setActiveMode('deployment')}
                                                    aria-pressed={activeMode === 'deployment'}
                                                    title="Runtime and deployment topology"
                                                >
                                                    Deploy
                                                </button>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                                            <button
                                                type="button"
                                                className="architecture-button architecture-button--primary"
                                                onClick={handleExplainArchitecture}
                                                disabled={isExplainLoading}
                                            >
                                                {isExplainLoading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Explaining...
                                                    </span>
                                                ) : (
                                                    'Explain Flow'
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className={`architecture-button ${showChittiPulse ? 'architecture-action-badge--pulse' : ''}`}
                                                onClick={handleAskChitti}
                                            >
                                                Ask Questions
                                            </button>
                                            <button
                                                type="button"
                                                className={`architecture-button ${isVoiceExplanationOpen ? 'architecture-button--primary' : ''}`}
                                                onClick={() => setIsVoiceExplanationOpen(!isVoiceExplanationOpen)}
                                            >
                                                🎤 Voice
                                            </button>
                                            <button
                                                type="button"
                                                className="architecture-button"
                                                onClick={() => setIsComparePanelOpen(true)}
                                            >
                                                Compare
                                            </button>
                                            <button
                                                type="button"
                                                className="architecture-button md:col-span-2"
                                                onClick={() => setIsSimulationOpen(true)}
                                            >
                                                Simulate
                                            </button>
                                        </div>

                                        {animationBadge && (
                                            <div className="architecture-shell__badge" role="status">
                                                {animationBadge}
                                            </div>
                                        )}

                                        {/* Voice Explanation */}
                                        {isVoiceExplanationOpen && (
                                            <div className="mt-4">
                                                <VoiceArchitectureExplanation
                                                    projectId={project.id}
                                                    onClose={() => setIsVoiceExplanationOpen(false)}
                                                />
                                            </div>
                                        )}

                                        {isExplanationVisible && (
                                            <div className="architecture-explanation-card">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="architecture-explanation-card__label">Flow explanation</p>
                                                        <h5 className="architecture-explanation-card__title">Boxes 1 → 6 narrative</h5>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {isExplainLoading && <Loader2 className="animate-spin text-white/70" size={18} />}
                                                        <button
                                                            type="button"
                                                            aria-label="Close flow explanation"
                                                            className="rounded-full p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                                            onClick={() => setIsExplanationVisible(false)}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                {explainError && <p className="text-red-400">{explainError}</p>}
                                                {!explainError && explanation && (
                                                    <div className="prose prose-invert prose-sm max-w-none">
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                ul({ children, ...props }: any) {
                                                                    return (
                                                                        <ul className="custom-bullet-list space-y-2 mt-4" {...props}>
                                                                            {children}
                                                                        </ul>
                                                                    );
                                                                },
                                                                li({ children, ...props }: any) {
                                                                    return (
                                                                        <li className="text-white/90 leading-relaxed" {...props}>
                                                                            {children}
                                                                        </li>
                                                                    );
                                                                },
                                                                p({ children, ...props }: any) {
                                                                    // Convert paragraphs that look like bullets to list items
                                                                    const text = String(children);
                                                                    if (text.match(/^[-•]\s*Box\s+\d+/i) || text.match(/^Box\s+\d+/i)) {
                                                                        return (
                                                                            <ul className="custom-bullet-list space-y-2 mt-2">
                                                                                <li className="text-white/90 leading-relaxed">{children}</li>
                                                                            </ul>
                                                                        );
                                                                    }
                                                                    return <p className="text-white/90 leading-relaxed" {...props}>{children}</p>;
                                                                },
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
                                                                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                                                            {children}
                                                                        </code>
                                                                    );
                                                                },
                                                            }}
                                                        >
                                                            {explanation}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                                {!explainError && !explanation && !isExplainLoading && (
                                                    <p className="text-white/70">No explanation yet. Try again in a moment.</p>
                                                )}
                                            </div>
                                        )}

                                        <div
                                            className="architecture-shell__diagram system-architecture text-white"
                                            aria-describedby={architectureDescribeId}
                                        >
                                            <span
                                                id={architectureDescribeId}
                                                className="sr-only"
                                            >
                                                Boxes represent system components or services; arrows represent data flow and execution order.
                                            </span>
                                            {viewMode === 'ascii' && <SystemArchitectureDiagrams projectId={project.id} />}
                                            {viewMode === 'architecture' && mermaidTemplates?.architecture && (
                                                <MermaidDiagram chart={mermaidTemplates.architecture} />
                                            )}
                                            {viewMode === 'workflow' && mermaidTemplates?.workflow && (
                                                <MermaidDiagram chart={mermaidTemplates.workflow} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <ArchitectureIntelligencePanel
                                project={project}
                                isOpen={isIntelPanelOpen}
                                onClose={() => setIsIntelPanelOpen(false)}
                            />

                            <ArchitectureComparisonPanel
                                project={project}
                                isOpen={isComparePanelOpen}
                                onClose={() => setIsComparePanelOpen(false)}
                            />

                            <ArchitectureSimulationPanel
                                project={project}
                                isOpen={isSimulationOpen}
                                onClose={() => setIsSimulationOpen(false)}
                            />
                        </div>
                        <ArrowAnimation />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectDetail;
