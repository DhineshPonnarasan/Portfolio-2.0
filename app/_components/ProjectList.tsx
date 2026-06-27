'use client';
import SectionTitle from '@/components/SectionTitle';
import TransitionLink from '@/components/TransitionLink';
import { PROJECTS } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowUpRight, Filter, X } from 'lucide-react';
import { useRef, useState, useMemo } from 'react';
import MetricCounter from '@/components/projects/MetricCounter';
import { useReducedMotion } from '@/lib/motion-prefs';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

    useGSAP(
        () => {
            if (reducedMotion) return;
            if (!containerRef.current) return;
            const tiles = containerRef.current.querySelectorAll('.proj-tile');
            if (tiles.length === 0) return;
            gsap.fromTo(
                tiles,
                { opacity: 0, y: 32 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    ease: 'power3.out',
                    stagger: 0.07,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                },
            );
        },
        { scope: containerRef, dependencies: [reducedMotion, activeFilter] },
    );

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

    // Pull 3-4 short stack chips from techAndTechniques / skills.
    const getStackIcons = (project: (typeof PROJECTS)[number]) => {
        const sources = project.techAndTechniques ?? project.skills ?? [];
        const flat = sources.flatMap(deriveStackFromText);
        return flat.slice(0, 4);
    };

    // Convert raw metrics strings like "✅ 21% lift in precision-recall AUC..."
    // into small chips with just the headline number ("21% lift").
    const getMetricChips = (project: (typeof PROJECTS)[number]) => {
        const out: string[] = [];
        for (const raw of project.metrics ?? []) {
            const cleaned = raw.replace(/^[^a-zA-Z0-9+]+/, '').trim();
            // Look for a leading number/percentage like "21%" / "<50 ms" / "10x throughput".
            const match = cleaned.match(/^([+-]?<?\d+(?:\.\d+)?\s?(?:%|ms|x|k|m)?)\b[\s,]*(.*)$/i);
            if (match) {
                const num = match[1].trim();
                const rest = match[2].trim();
                // Take a short noun phrase from the rest.
                const short = rest.split(/[,.]/).map((s) => s.trim()).find(Boolean) ?? '';
                const trimmed = short.length > 36 ? short.slice(0, 36) + '…' : short;
                out.push(trimmed ? `${num} ${trimmed.toLowerCase()}` : num);
            }
            if (out.length === 3) break;
        }
        return out;
    };

    const getShortDescription = (project: (typeof PROJECTS)[number]) => {
        const desc = Array.isArray(project.description)
            ? project.description[0]
            : project.description;
        if (!desc) return '';
        return desc.length > 140 ? desc.slice(0, 140).trimEnd() + '…' : desc;
    };

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
                        {stackOptions.slice(0, 8).map((tech) => (
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

                {/* Bento grid */}
                {filteredProjects.length === 0 ? (
                    <p className="py-12 text-center text-sm text-white/50">
                        No projects match this filter yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {filteredProjects.map((project, index) => {
                            const isFeatured = index < 2;
                            const stackIcons = getStackIcons(project);
                            const chips = getMetricChips(project);
                            const desc = getShortDescription(project);

                            return (
                                <TransitionLink
                                    key={project.slug}
                                    href={`/projects/${project.slug}`}
                                    aria-label={`View project: ${project.title}`}
                                    className={cn(
                                        'proj-tile group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.025] via-white/[0.01] to-transparent p-6 lg:p-7',
                                        'transition-all duration-500 ease-out',
                                        'hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_42px_-12px_rgba(118,185,0,0.5)]',
                                        isFeatured && 'md:col-span-2',
                                    )}
                                >
                                    {/* Featured accent — primary glow ring */}
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            'pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                                            isFeatured && 'opacity-60',
                                        )}
                                        style={{
                                            background:
                                                'radial-gradient(120% 80% at 50% 0%, rgba(118,185,0,0.08), transparent 60%)',
                                        }}
                                    />

                                    {/* Top row: stack icons */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center -space-x-2">
                                            {stackIcons.length > 0 ? (
                                                stackIcons.map((tech, i) => (
                                                    <span
                                                        key={`${project.slug}-${tech}`}
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#0a1628] text-[10px] font-mono uppercase text-white/70 shadow-[0_0_0_2px_rgba(10,22,40,1)]"
                                                        title={tech}
                                                        style={{ zIndex: stackIcons.length - i }}
                                                    >
                                                        {tech
                                                            .replace(/[^a-zA-Z0-9+]/g, '')
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#0a1628] text-[10px] font-mono uppercase text-white/40">
                                                    AI
                                                </span>
                                            )}
                                        </div>
                                        <span className="ml-auto text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className={cn(
                                            'mt-5 font-anton leading-[1.05] text-white transition-colors duration-300 group-hover:text-primary',
                                            isFeatured ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl',
                                        )}
                                    >
                                        {project.title}
                                    </h3>

                                    {/* Description */}
                                    <p
                                        className={cn(
                                            'mt-3 text-sm leading-relaxed text-white/65',
                                            isFeatured ? 'max-w-3xl md:text-base' : 'line-clamp-2',
                                        )}
                                    >
                                        {desc}
                                    </p>

                                    {/* Metric chips */}
                                    {chips.length > 0 && (
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {chips.map((c) => (
                                                <span
                                                    key={`${project.slug}-chip-${c}`}
                                                    className="inline-flex items-center rounded-full border border-primary/30 bg-primary/[0.08] px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-primary"
                                                >
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer row */}
                                    <div className="mt-auto pt-6 flex items-center justify-between">
                                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
                                            {project.year}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/70 transition-all group-hover:translate-x-1 group-hover:text-primary">
                                            View project
                                            <ArrowUpRight
                                                size={14}
                                                className="transition-transform group-hover:rotate-12"
                                            />
                                        </span>
                                    </div>

                                    {/* Bottom subtle highlight */}
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    />
                                </TransitionLink>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectList;