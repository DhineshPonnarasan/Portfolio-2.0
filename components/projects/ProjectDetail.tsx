"use client";

import SystemArchitectureDiagrams from '../diagrams/SystemArchitectureDiagrams';
import ArrowAnimation from '@/components/ArrowAnimation';
import TransitionLink from '@/components/TransitionLink';
import ArchitectureIntelligencePanel from './ArchitectureIntelligencePanel';
import ArchitectureComparisonPanel from './ArchitectureComparisonPanel';
import ArchitectureSimulationPanel from './ArchitectureSimulationPanel';
import { IProject } from '@/types';
import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowLeft, ExternalLink, Github, Loader2, X } from 'lucide-react';
import parse from 'html-react-parser';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
    project: IProject;
}

const ProjectDetail = ({ project }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const architectureAnchorRef = useRef<HTMLDivElement>(null);
    const pulseTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [isIntelPanelOpen, setIsIntelPanelOpen] = useState(false);
    const [isComparePanelOpen, setIsComparePanelOpen] = useState(false);
    const [isSimulationOpen, setIsSimulationOpen] = useState(false);
    const [isExplainLoading, setIsExplainLoading] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [explainError, setExplainError] = useState<string | null>(null);
    const [isExplanationVisible, setIsExplanationVisible] = useState(false);
    const [showChittiPulse, setShowChittiPulse] = useState(false);
    const [pulseScheduled, setPulseScheduled] = useState(false);
    const [animationBadge, setAnimationBadge] = useState<string | null>(null);
    const architectureAnchorId = `system-architecture-${project.slug}`;
    const architectureDescribeId = `${architectureAnchorId}-diagram-desc`;

    const badgeTimerRef = useRef<NodeJS.Timeout | null>(null);
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
        badgeTimerRef.current = window.setTimeout(() => setAnimationBadge(null), 3200);
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
                        pulseTimerRef.current = window.setTimeout(() => {
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
        try {
            const response = await fetch('/api/architecture-explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: project.id }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Unable to explain this architecture right now.');
            }
            setExplanation(data.explanation);
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
        <section className="pt-5 pb-14">
            <div className="container" ref={containerRef}>
                <TransitionLink
                    back
                    href="/"
                    className="mb-16 inline-flex gap-2 items-center group h-12"
                >
                    <ArrowLeft className="group-hover:-translate-x-1 group-hover:text-primary transition-all duration-300" />
                    Back
                </TransitionLink>

                <div className="top-0 min-h-[calc(100svh-100px)] flex" id="info">
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
                                    <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                                        {project.techAndTechniques.map((tech, i) => (
                                            <li key={i}>{tech}</li>
                                        ))}
                                    </ul>
                                ) : project.techStack && project.techStack.length > 0 ? (
                                    <div className="text-lg">{project.techStack.join(', ')}</div>
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
                                <div>
                                    <h4 className="text-xl font-bold mb-3 text-primary">Key Features</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                                        {project.keyFeatures.map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {project.metrics && project.metrics.length > 0 && (
                                <div>
                                    <h4 className="text-xl font-bold mb-3 text-primary">Metrics</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                                        {project.metrics.map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {project.skills && project.skills.length > 0 && (
                                <div className="fade-in-later">
                                    <p className="text-muted-foreground font-anton mb-3">Tech Stack / Skills</p>
                                    <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                                        {project.skills.map((skill, i) => (
                                            <li key={i}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {project.interestingHighlights && project.interestingHighlights.length > 0 && (
                                <div className="fade-in-later">
                                    <h4 className="text-xl font-bold mb-3 text-primary">Interesting Highlights</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                                        {project.interestingHighlights.map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {project.interestingHighlights && project.interestingHighlights.length > 0 && (
                                <div className="mt-14 fade-in-later" id={architectureAnchorId} ref={architectureAnchorRef}>
                                    <div className="space-y-1">
                                        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground/70">Why this architecture matters</p>
                                        <p className="text-sm text-muted-foreground/80">
                                            It documents how this system keeps reliability, observability, and stakeholder communication aligned across every release.
                                        </p>
                                    </div>
                                    <div className="architecture-shell mt-6">
                                        <div className="architecture-shell__flow-highlight" aria-hidden="true" />
                                        <div className="architecture-shell__header">
                                            <div>
                                                <p className="architecture-shell__eyebrow">System Architecture</p>
                                                <h4 className="architecture-shell__title">Architecture That Ships</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    className="text-[0.6rem] tracking-[0.4em] uppercase border border-white/20 rounded-full px-3 py-1 text-muted-foreground/70 transition hover:text-white hover:border-white"
                                                    onClick={handleExplainArchitecture}
                                                >
                                                    Explain each box
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`text-[0.6rem] tracking-[0.4em] uppercase rounded-full px-3 py-1 border border-primary/30 text-primary transition hover:text-white hover:border-primary focus-visible:outline-none ${showChittiPulse ? 'architecture-action-badge--pulse' : ''}`}
                                                    onClick={handleAskChitti}
                                                >
                                                    Ask Chitti about this architecture
                                                </button>
                                            </div>
                                        </div>
                                        {animationBadge && (
                                            <div className="architecture-shell__badge" role="status">
                                                {animationBadge}
                                            </div>
                                        )}

                                        <p className="architecture-shell__subtitle">
                                            Every stakeholder reads the same system contract—clarity without mockups, just the boxes and arrows that actually ship.
                                        </p>

                                        <div className="architecture-shell__actions">
                                            <button
                                                type="button"
                                                className="architecture-button architecture-button--primary"
                                                onClick={handleExplainArchitecture}
                                            >
                                                Explain this architecture
                                            </button>
                                            <button
                                                type="button"
                                                className="architecture-button"
                                                onClick={() => setIsComparePanelOpen(true)}
                                            >
                                                Compare architectures
                                            </button>
                                            <button
                                                type="button"
                                                className="architecture-button"
                                                onClick={() => setIsSimulationOpen(true)}
                                            >
                                                Simulate this architecture
                                            </button>
                                        </div>

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
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
                                                    </div>
                                                )}
                                                {!explainError && !explanation && !isExplainLoading && (
                                                    <p className="text-white/70">No explanation yet. Try again in a moment.</p>
                                                )}
                                            </div>
                                        )}

                                        <div
                                            className="architecture-shell__diagram system-architecture overflow-auto text-white"
                                            aria-describedby={architectureDescribeId}
                                        >
                                            <span id={architectureDescribeId} className="sr-only">Boxes represent system components or services; arrows represent data flow and execution order.</span>
                                            <SystemArchitectureDiagrams projectId={project.id} />
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
