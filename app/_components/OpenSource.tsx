"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, GitPullRequest, ExternalLink } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

import SectionTitle from '@/components/SectionTitle';
import { cn } from '@/lib/utils';
import { MY_CONTRIBUTIONS } from '@/lib/data';
import { useReducedMotion } from '@/lib/motion-prefs';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ORG_ICONS: { matcher: RegExp; src: string; alt: string }[] = [
    { matcher: /(codegraphcontext)/i, src: '/logo/codegraphcontext.svg', alt: 'CodeGraphContext' },
    { matcher: /(olake|datazip)/i, src: '/logo/olake.svg', alt: 'OLake / Datazip' },
    { matcher: /(microsoft|agent[\s-]?governance)/i, src: '/logo/microsoft.svg', alt: 'Microsoft' },
    { matcher: /(nvidia|megatron|tensorrt)/i, src: '/logo/nvidia.png', alt: 'NVIDIA' },
    { matcher: /(scanapi)/i, src: '/logo/scanapi.svg', alt: 'Scanapi' },
];

const getOrgIcon = (org: string) => ORG_ICONS.find((item) => item.matcher.test(org));

const getInitials = (text: string) =>
    text
        .split(' ')
        .map((part) => part.trim()[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

interface PRCountMap {
    [repo: string]: number | null;
}

const OpenSource = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
    const [prCounts, setPrCounts] = useState<PRCountMap>({});

    useEffect(() => {
        const repos = Array.from(
            new Set(
                MY_CONTRIBUTIONS.map((c) => c.repo).filter(
                    (r): r is string => typeof r === 'string' && r.length > 0,
                ),
            ),
        );
        if (repos.length === 0) return;
        const ctrl = new AbortController();
        (async () => {
            try {
                const res = await fetch(`/api/merged-prs?repos=${repos.join(',')}`, {
                    signal: ctrl.signal,
                });
                if (!res.ok) return;
                const json = (await res.json()) as { counts: PRCountMap };
                setPrCounts(json.counts ?? {});
            } catch {
                /* ignore */
            }
        })();
        return () => ctrl.abort();
    }, []);

    useGSAP(
        () => {
            if (reducedMotion) return;
            if (!containerRef.current) return;
            const tiles = containerRef.current.querySelectorAll('.os-tile');
            if (tiles.length === 0) return;
            gsap.fromTo(
                tiles,
                { opacity: 0, y: 32 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    ease: 'power3.out',
                    stagger: 0.06,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    },
                },
            );
        },
        { scope: containerRef, dependencies: [reducedMotion] },
    );

    const handleToggle = (slug: string) => {
        setExpandedSlug((prev) => (prev === slug ? null : slug));
    };

    return (
        <section id="open-source" className="py-20" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Open Source Contributions" />

                <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
                    {MY_CONTRIBUTIONS.map((contribution, idx) => {
                        const isFeatured = idx < 2;
                        const icon = getOrgIcon(contribution.org);
                        const initials = getInitials(contribution.org);
                        const prCount =
                            contribution.repo && prCounts[contribution.repo] !== undefined
                                ? prCounts[contribution.repo]
                                : null;
                        const isExpanded = expandedSlug === contribution.slug;

                        return (
                            <article
                                key={contribution.slug}
                                className={cn(
                                    'os-tile group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.025] via-white/[0.01] to-transparent p-6 lg:p-7',
                                    'transition-all duration-500 ease-out',
                                    'hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_42px_-12px_rgba(118,185,0,0.5)]',
                                    isFeatured && 'md:col-span-2',
                                )}
                            >
                                {/* Featured accent — primary glow */}
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500',
                                        isFeatured ? 'opacity-60' : 'opacity-0 group-hover:opacity-100',
                                    )}
                                    style={{
                                        background:
                                            'radial-gradient(120% 80% at 100% 0%, rgba(118,185,0,0.08), transparent 60%)',
                                    }}
                                />

                                {/* Top row: brand icon + meta pills */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                'flex flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#0a1628] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-300 group-hover:ring-1 group-hover:ring-primary/40',
                                                isFeatured ? 'h-14 w-14' : 'h-12 w-12',
                                            )}
                                        >
                                            {icon ? (
                                                <Image
                                                    src={icon.src}
                                                    alt={icon.alt}
                                                    width={isFeatured ? 56 : 48}
                                                    height={isFeatured ? 56 : 48}
                                                    sizes={isFeatured ? '56px' : '48px'}
                                                    loading="lazy"
                                                    className="object-contain"
                                                />
                                            ) : (
                                                <span
                                                    className={cn(
                                                        'font-anton tracking-wider text-white/90',
                                                        isFeatured ? 'text-base' : 'text-sm',
                                                    )}
                                                >
                                                    {initials}
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary/70">
                                                OSS {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            <h3
                                                className={cn(
                                                    'font-anton leading-none text-white',
                                                    isFeatured ? 'text-2xl md:text-3xl' : 'text-xl',
                                                )}
                                            >
                                                {contribution.org}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Right side: external repo link */}
                                    {contribution.link && (
                                        <a
                                            href={contribution.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Open ${contribution.repo ?? contribution.org} on GitHub`}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:border-primary/40 hover:text-primary"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>

                                {/* Pills row */}
                                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono text-white/70">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                        {contribution.role}
                                    </span>
                                    {prCount !== null && prCount > 0 && (
                                        <span
                                            className="inline-flex animate-fade-in items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary"
                                            title={`${prCount} merged pull requests on ${contribution.repo}`}
                                        >
                                            <GitPullRequest size={12} aria-hidden="true" />
                                            {prCount} merged PR{prCount === 1 ? '' : 's'}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/50">
                                        {contribution.period}
                                    </span>
                                </div>

                                {/* Title + description */}
                                <h4
                                    className={cn(
                                        'mt-5 font-anton leading-tight text-white transition-colors duration-300 group-hover:text-primary',
                                        isFeatured ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-lg md:text-xl',
                                    )}
                                >
                                    {contribution.title}
                                </h4>

                                <p
                                    className={cn(
                                        'mt-2 text-sm leading-relaxed text-white/65',
                                        isFeatured ? 'md:text-base' : 'line-clamp-2',
                                    )}
                                >
                                    {contribution.description}
                                </p>

                                {/* Tech chips */}
                                {contribution.techStack && contribution.techStack.length > 0 && (
                                    <div className="mt-5 flex flex-wrap gap-1.5">
                                        {contribution.techStack.slice(0, 6).map((tech) => (
                                            <span
                                                key={tech}
                                                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-white/70 transition-colors group-hover:border-white/20"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {contribution.techStack.length > 6 && (
                                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-white/50">
                                                +{contribution.techStack.length - 6}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Footer row */}
                                <div className="mt-auto pt-6 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(contribution.slug)}
                                        aria-expanded={isExpanded}
                                        className={cn(
                                            'inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] transition-colors',
                                            isExpanded ? 'text-primary' : 'text-white/50 hover:text-primary',
                                        )}
                                    >
                                        {isExpanded ? 'Hide details' : 'View details'}
                                    </button>
                                    {contribution.link && (
                                        <a
                                            href={contribution.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-white/70 transition-all group-hover:translate-x-1 group-hover:text-primary"
                                        >
                                            View repo
                                            <ArrowUpRight
                                                size={12}
                                                className="transition-transform group-hover:rotate-12"
                                            />
                                        </a>
                                    )}
                                </div>

                                {/* Expanded detail */}
                                {isExpanded && (
                                    <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-white/80">
                                        {(contribution.deepDivePoints || contribution.points?.slice(0, 3) || []).map(
                                            (point, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                                    <span>{point}</span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}

                                {/* Bottom subtle highlight */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                />
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default OpenSource;