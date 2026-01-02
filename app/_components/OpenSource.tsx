'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, GitPullRequest } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

import SectionTitle from '@/components/SectionTitle';
import { cn } from '@/lib/utils';
import { MY_CONTRIBUTIONS } from '@/lib/data';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BRAND_SIGNATURES = [
    { matcher: /(wechaty)/i, label: 'Wechaty', accent: 'from-[#f472b6]/30 to-transparent', image: '/logo/wechaty.png' },
    { matcher: /(swoc)/i, label: 'SWoC', accent: 'from-[#4ade80]/30 to-transparent', image: '/logo/swoc.svg' },
    { matcher: /(amazon|aws)/i, label: 'Amazon AI', accent: 'from-[#f59e0b]/30 to-transparent', image: '/logo/aws.svg' },
    { matcher: /(google|deepmind|tensorflow|keras)/i, label: 'Google DeepMind', accent: 'from-[#fb923c]/30 to-transparent', image: '/logo/tensorflow.svg' },
    { matcher: /(meta|pytorch)/i, label: 'Meta AI', accent: 'from-[#60a5fa]/30 to-transparent', image: '/logo/pytorch.svg' },
    { matcher: /(numpy)/i, label: 'NumPy', accent: 'from-[#22d3ee]/30 to-transparent', image: '/logo/numpy.svg' },
] as const;

type BrandSignature = {
    matcher: RegExp;
    label: string;
    accent: string;
    image?: string;
};

const getSignature = (org: string): BrandSignature =>
    BRAND_SIGNATURES.find((signature) => signature.matcher.test(org)) ?? {
        matcher: /(.*)/,
        label: org,
        accent: 'from-white/20 to-transparent',
        image: undefined,
    };

export default function OpenSource() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

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

            tl.fromTo(
                '.os-card',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1 },
            );
        },
        { scope: containerRef },
    );

    const handleToggle = (slug: string) => {
        setExpandedSlug((prev) => (prev === slug ? null : slug));
    };

    return (
        <section id="open-source" className="py-20" ref={containerRef}>
            <div className="container space-y-12">
                <SectionTitle title="Open Source Contributions" />

                <div className="relative mt-6">
                    <div className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-white/10 md:block" />
                    <div className="space-y-10">
                        {MY_CONTRIBUTIONS.map((contribution, idx) => {
                            const isExpanded = expandedSlug === contribution.slug;
                            const deepDiveId = `deep-dive-${contribution.slug}`;

                            return (
                                <article key={contribution.slug} className="os-card">
                                    <div className={cn('group relative pl-6 md:pl-16', idx % 2 === 1 && 'md:ml-10')}>
                                        <span className="absolute left-1 top-10 inline-flex size-4 items-center justify-center rounded-full border border-primary/40 bg-black/80 md:left-3">
                                            <span className="size-2 rounded-full bg-primary" />
                                        </span>

                                        <div
                                            className={cn(
                                                'rounded-[32px] border border-white/10 bg-white/[0.03] p-8 pb-16 transition-all duration-500 hover:-translate-y-2 hover:border-primary/60 hover:bg-white/[0.08] hover:shadow-[0_0_45px_rgba(16,185,129,0.25)] focus-within:border-primary/60 focus-within:shadow-[0_0_45px_rgba(16,185,129,0.25)]',
                                                isExpanded && 'border-primary/70 bg-white/[0.08] shadow-[0_25px_55px_rgba(16,185,129,0.3)]',
                                            )}
                                        >
                                            <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                                                <div className="space-y-4 text-sm text-white/70">
                                                    <div className="flex items-center gap-3 text-primary">
                                                        <div className="rounded-2xl bg-primary/15 p-3 text-primary">
                                                            <GitPullRequest size={22} />
                                                        </div>
                                                        <span className="font-mono text-xs text-white/60">{contribution.period}</span>
                                                    </div>
                                                    <p className="text-xl font-semibold text-white">{contribution.org}</p>
                                                    <p className="text-[0.7rem] uppercase tracking-[0.35em] text-white/50">{contribution.role}</p>
                                                    <p className="text-xs font-mono text-white/40">{contribution.slug}</p>
                                                </div>

                                                <div className="space-y-4">
                                                    <h3 className="text-2xl font-semibold text-white transition-colors group-hover:text-primary">
                                                        {contribution.title}
                                                    </h3>
                                                    <p className="text-sm text-white/70 leading-relaxed">
                                                        {contribution.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {contribution.techStack?.slice(0, 5).map((tech) => (
                                                            <span key={tech} className="tech-tag text-xs">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {contribution.techStack && contribution.techStack.length > 5 && (
                                                            <span className="tech-tag text-xs">
                                                                +{contribution.techStack.length - 5}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {contribution.stats && (
                                                <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-center sm:grid-cols-3">
                                                    <div>
                                                        <p className="text-2xl font-anton text-white">
                                                            {contribution.stats.pullRequests ?? 0}
                                                        </p>
                                                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">PRs</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-anton text-white">
                                                            {contribution.stats.commits ?? 0}
                                                        </p>
                                                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Commits</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-anton text-white">
                                                            {contribution.stats.linesOfCode ?? '—'}
                                                        </p>
                                                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">LoC</p>
                                                    </div>
                                                </div>
                                            )}

                                            <BrandSignature org={contribution.org} />

                                            <div className="mt-6 flex items-center justify-between text-sm font-semibold text-primary">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(contribution.slug)}
                                                    aria-expanded={isExpanded}
                                                    aria-controls={deepDiveId}
                                                    className="flex items-center gap-2 text-primary transition-all duration-300 hover:text-white hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                                                >
                                                    View deep dive
                                                    <ArrowUpRight size={16} className={cn('transition-transform duration-300', isExpanded && 'rotate-45')} />
                                                </button>
                                                <span className="text-xs font-mono text-white/50">{contribution.slug}</span>
                                            </div>

                                            <div
                                                id={deepDiveId}
                                                className={cn(
                                                    'mt-6 overflow-hidden transition-[max-height,opacity] duration-500 ease-out',
                                                    isExpanded ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0',
                                                )}
                                                aria-hidden={!isExpanded}
                                            >
                                                <div className="rounded-[24px] border border-white/10 bg-black/30 p-6">
                                                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">Deep dive</p>
                                                    <ul className="mt-4 space-y-3 text-sm text-white/80">
                                                        {(contribution.deepDivePoints || contribution.points.slice(0, 3)).map((point) => (
                                                            <li key={point} className="flex gap-3">
                                                                <span className="mt-1 size-1.5 rounded-full bg-primary" />
                                                                <span>{point}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    {contribution.link && (
                                                        <a
                                                            href={contribution.link}
                                                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-white"
                                                        >
                                                            View Repository →
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

const BrandSignature = ({ org }: { org: string }) => {
    const signature = getSignature(org);

    return (
        <div className="pointer-events-none absolute bottom-5 right-5 flex justify-end">
            <div
                className={cn(
                    'flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 shadow-lg backdrop-blur',
                    'bg-gradient-to-br',
                    signature.accent,
                    'translate-x-8 translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:translate-y-0 group-focus-within:opacity-100',
                )}
            >
                <div className="rounded-xl border border-white/20 bg-black/30 p-1">
                    {signature.image ? (
                        <Image 
                            src={signature.image} 
                            alt={signature.label} 
                            width={28} 
                            height={28} 
                            className="size-7 object-contain"
                            onError={(e) => {
                                // Fallback to text if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector('span')) {
                                    const fallback = document.createElement('span');
                                    fallback.className = 'text-sm font-semibold';
                                    fallback.textContent = signature.label.slice(0, 2).toUpperCase();
                                    parent.appendChild(fallback);
                                }
                            }}
                        />
                    ) : (
                        <span className="text-sm font-semibold">{signature.label.slice(0, 2).toUpperCase()}</span>
                    )}
                </div>
                <span className="text-[0.55rem] tracking-[0.3em] text-white/80">{signature.label}</span>
            </div>
        </div>
    );
};
