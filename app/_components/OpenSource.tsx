"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Calendar, ChevronDown, GitPullRequest } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { motion, AnimatePresence } from 'framer-motion';

import SectionTitle from '@/components/SectionTitle';
import { cn } from '@/lib/utils';
import { MY_CONTRIBUTIONS } from '@/lib/data';
import { formatPeriod } from '@/lib/time-period';

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
    const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
    const [prCounts, setPrCounts] = useState<PRCountMap>({});

    // Lazy fetch closed-PR counts for every repo that has one. The server
    // caches per-repo for 6 hours, so refreshing the page is cheap.
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
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    end: 'bottom bottom',
                    scrub: 1,
                },
            });

            tl.fromTo('.os-item', { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.1 });
        },
        { scope: containerRef },
    );

    const handleToggle = (slug: string) => {
        setExpandedSlug((prev) => (prev === slug ? null : slug));
    };

    return (
        <section id="open-source" className="py-20" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Open Source Contributions" />
                <div className="mt-12 relative space-y-8 md:space-y-10">
                    {MY_CONTRIBUTIONS.map((contribution, idx) => {
                        const isExpanded = expandedSlug === contribution.slug;
                        const icon = getOrgIcon(contribution.org);
                        const initials = getInitials(contribution.org);
                        const prCount =
                            contribution.repo && prCounts[contribution.repo] !== undefined
                                ? prCounts[contribution.repo]
                                : null;

                        return (
                            <article
                                key={contribution.slug}
                                className={cn(
                                    'os-item relative overflow-hidden border-b border-white/10 pb-8 last:border-0 transition-colors duration-300',
                                    isExpanded && 'border-b-primary/40 bg-white/[0.02]',
                                )}
                            >
                                <div className="flex flex-col gap-4 md:gap-5">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5">
                                                    {icon ? (
                                                        <Image src={icon.src} alt={icon.alt} width={44} height={44} sizes="44px" loading="lazy" className="object-contain" />
                                                    ) : (
                                                        <span className="text-sm font-semibold text-white/80">{initials}</span>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary/70">OSS {(idx + 1).toString().padStart(2, '0')}</span>
                                                    <h3 className="text-2xl md:text-3xl font-anton text-white leading-tight">
                                                        {contribution.org}
                                                    </h3>
                                                </div>
                                            </div>
                                            <p className="text-sm font-semibold text-white/70">{contribution.title}</p>
                                            <div className="flex flex-wrap gap-2 text-xs font-mono text-white/60">
                                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                    <Calendar size={12} className="text-primary" />
                                                    {formatPeriod(contribution.period)}
                                                </span>
                                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
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
                                            </div>
                                        </div>

                                        <div className="text-xs uppercase tracking-[0.2em] text-white/40">Open Source</div>
                                    </div>

                                    <p className="text-sm leading-relaxed text-white/75">
                                        {contribution.description}
                                    </p>

                                    {contribution.techStack && contribution.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-2 text-xs text-white/70">
                                            {contribution.techStack.slice(0, 6).map((tech) => (
                                                <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                    {tech}
                                                </span>
                                            ))}
                                            {contribution.techStack.length > 6 && (
                                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                    +{contribution.techStack.length - 6}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-2">
                                        <button
                                            type="button"
                                            onClick={() => handleToggle(contribution.slug)}
                                            className={cn(
                                                'inline-flex items-center gap-2 text-sm font-semibold transition-all border-b border-transparent',
                                                isExpanded
                                                    ? 'text-primary border-primary/50'
                                                    : 'text-white/70 hover:text-primary hover:border-primary/30',
                                            )}
                                        >
                                            {isExpanded ? 'Hide details' : 'View details'}
                                            <ChevronDown
                                                size={16}
                                                className={cn(
                                                    'transition-transform duration-300',
                                                    isExpanded && 'rotate-180',
                                                )}
                                            />
                                        </button>
                                        <div className="text-xs uppercase tracking-[0.2em] text-white/40">Open Source Contribution</div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-4 space-y-2 text-sm text-white/80">
                                                    {(contribution.deepDivePoints || contribution.points?.slice(0, 3) || []).map((point, i) => (
                                                        <div key={i} className="flex gap-2">
                                                            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                                                            <span>{point}</span>
                                                        </div>
                                                    ))}
                                                    {contribution.link && (
                                                        <a
                                                            href={contribution.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-primary hover:text-white"
                                                        >
                                                            View Repository <ArrowUpRight size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default OpenSource;
