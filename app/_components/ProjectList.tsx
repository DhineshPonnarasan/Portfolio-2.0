'use client';
import SectionTitle from '@/components/SectionTitle';
import TransitionLink from '@/components/TransitionLink';
import { PROJECTS } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowUpRight, Filter, X } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState, useMemo } from 'react';
import Project from './Project';
import MetricCounter from '@/components/projects/MetricCounter';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion-prefs';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MOBILE_BREAKPOINT = 768;

const STACK_NORMALIZE_RE = /^[^a-zA-Z0-9+]+/;

const deriveStackFromText = (text: string) =>
    text
        .replace(STACK_NORMALIZE_RE, '')
        .trim()
        .split(/[,/&]/)
        .map((s) => s.trim())
        .filter(Boolean);

const ProjectList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const projectListRef = useRef<HTMLDivElement>(null);
    const imageContainer = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const reducedMotion = useReducedMotion();

    const stackOptions = useMemo(() => {
        const set = new Set<string>();
        for (const p of PROJECTS) {
            const tags = (p.techAndTechniques ?? p.skills ?? []).flatMap(deriveStackFromText);
            tags.forEach((t) => set.add(t));
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, []);

    const filteredProjects = useMemo(() => {
        if (!activeFilter) return PROJECTS;
        return PROJECTS.filter((p) => {
            const tags = (p.techAndTechniques ?? p.skills ?? []).flatMap(deriveStackFromText);
            return tags.includes(activeFilter);
        });
    }, [activeFilter]);

    // Throttled hover-image follower. The image is rendered on the desktop only.
    useGSAP(
        (context, contextSafe) => {
            if (typeof window === 'undefined') return;
            if (window.innerWidth < MOBILE_BREAKPOINT) return;
            if (reducedMotion) return;

            let frame: number | null = null;
            let latestEvent: globalThis.MouseEvent | null = null;

            const flush = () => {
                frame = null;
                if (!latestEvent || !imageContainer.current || !containerRef.current) return;
                const e = latestEvent;
                const rect = containerRef.current.getBoundingClientRect();
                if (
                    rect.y > e.clientY ||
                    rect.bottom < e.clientY ||
                    rect.x > e.clientX ||
                    rect.right < e.clientX
                ) {
                    gsap.to(imageContainer.current, { duration: 0.3, opacity: 0 });
                    return;
                }
                gsap.to(imageContainer.current, {
                    x: e.clientX + 20,
                    y: e.clientY + 20,
                    duration: 0.5,
                    opacity: 1,
                    ease: 'power2.out',
                });
            };

            const handleMouseMove = (contextSafe
                ? contextSafe((e: globalThis.MouseEvent) => {
                      latestEvent = e;
                      if (frame !== null) return;
                      frame = requestAnimationFrame(flush);
                  })
                : (e: globalThis.MouseEvent) => {
                      latestEvent = e;
                      if (frame !== null) return;
                      frame = requestAnimationFrame(flush);
                  }) as unknown as (_e: globalThis.MouseEvent) => void;

            window.addEventListener('mousemove', handleMouseMove, { passive: true });

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                if (frame !== null) cancelAnimationFrame(frame);
            };
        },
        { scope: containerRef, dependencies: [containerRef.current, reducedMotion] },
    );

    useGSAP(
        () => {
            if (reducedMotion) return;
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'top 80%',
                    toggleActions: 'restart none none reverse',
                    scrub: 1,
                },
            });

            tl.from(containerRef.current, {
                y: 150,
                opacity: 0,
            });
        },
        { scope: containerRef, dependencies: [reducedMotion] },
    );

    const handleMouseEnter = (slug: string) => {
        if (typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT) {
            setSelectedProject(null);
            return;
        }
        if (reducedMotion) return;
        setSelectedProject(slug);
    };

    const handleMouseLeave = () => {
        setSelectedProject(null);
    };

    const metrics = useMemo(() => {
        const total = PROJECTS.length;
        const years = PROJECTS.reduce(
            (acc, p) => Math.min(acc, p.year),
            new Date().getFullYear(),
        );
        const yoe = new Date().getFullYear() - years;
        const techs = stackOptions.length;
        return { total, yoe, techs };
    }, [stackOptions]);

    return (
        <section className="pb-section pt-20" id="selected-projects">
            <div className="container" ref={containerRef}>
                <SectionTitle title="PROJECTS" />

                {/* Architecture Explorer CTA — discoverability */}
                <div className="mb-10 -mt-4">
                    <TransitionLink
                        href="/architecture"
                        className="group inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                    >
                        <span className="relative h-2 w-2 rounded-full bg-primary/60 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(16,185,129,0.6)] transition-all" />
                        <span>View in Architecture Explorer</span>
                        <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </TransitionLink>
                </div>

                {/* Metrics + filter chips */}
                <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-wrap items-end gap-6">
                        <MetricCounter
                            value={metrics.total}
                            className="text-3xl font-anton text-white"
                            prefix="_"
                            suffix="."
                        />
                        <span className="pb-1 text-xs font-mono uppercase tracking-[0.3em] text-white/40">
                            Projects
                        </span>
                        <MetricCounter
                            value={metrics.yoe}
                            className="text-3xl font-anton text-primary"
                            suffix="+"
                        />
                        <span className="pb-1 text-xs font-mono uppercase tracking-[0.3em] text-white/40">
                            Years
                        </span>
                        <MetricCounter
                            value={metrics.techs}
                            className="text-3xl font-anton text-secondary"
                        />
                        <span className="pb-1 text-xs font-mono uppercase tracking-[0.3em] text-white/40">
                            Tools
                        </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <Filter size={14} className="shrink-0 text-white/40" aria-hidden="true" />
                        <button
                            type="button"
                            onClick={() => setActiveFilter(null)}
                            aria-pressed={activeFilter === null}
                            className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-widest transition-colors ${
                                activeFilter === null
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-white/10 bg-white/[0.04] text-white/60 hover:border-primary/40 hover:text-primary'
                            }`}
                        >
                            All
                        </button>
                        {stackOptions.map((tech) => (
                            <button
                                key={tech}
                                type="button"
                                onClick={() => setActiveFilter((prev) => (prev === tech ? null : tech))}
                                aria-pressed={activeFilter === tech}
                                className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-widest transition-colors ${
                                    activeFilter === tech
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-white/10 bg-white/[0.04] text-white/60 hover:border-primary/40 hover:text-primary'
                                }`}
                            >
                                {tech}
                            </button>
                        ))}
                        {activeFilter && (
                            <button
                                type="button"
                                onClick={() => setActiveFilter(null)}
                                aria-label="Clear filter"
                                className="ml-1 rounded-full border border-white/10 bg-white/[0.04] p-1 text-white/60 hover:text-white"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="group/projects relative">
                    <div
                        className="flex flex-col max-md:gap-10"
                        ref={projectListRef}
                    >
                        <AnimatePresence mode="popLayout" initial={false}>
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={project.slug}
                                    layout={!reducedMotion}
                                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25, delay: reducedMotion ? 0 : index * 0.02 }}
                                >
                                    <Project
                                        index={index}
                                        project={project}
                                        selectedProject={selectedProject}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filteredProjects.length === 0 && (
                            <p className="py-12 text-center text-sm text-white/50">
                                No projects match this filter yet.
                            </p>
                        )}
                    </div>

                    {/* Desktop Hover Image Preview */}
                    <div
                        ref={imageContainer}
                        className="pointer-events-none fixed left-0 top-0 z-50 h-[300px] w-[450px] overflow-hidden rounded-xl opacity-0 max-md:hidden mix-blend-exclusion"
                    >
                        {selectedProject && (
                            <div className="relative w-full h-full bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                <Image
                                    ref={imageRef}
                                    src={`/projects/${selectedProject}/ui.svg`}
                                    alt="project preview"
                                    fill
                                    sizes="(min-width: 768px) 450px, 100vw"
                                    className="object-contain p-4"
                                    loading="lazy"
                                    unoptimized
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectList;
