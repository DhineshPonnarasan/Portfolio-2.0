"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Calendar, ChevronDown } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { motion, AnimatePresence } from 'framer-motion';

import SectionTitle from '@/components/SectionTitle';
import { cn } from '@/lib/utils';
import { MY_CONTRIBUTIONS } from '@/lib/data';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ORG_ICONS: { matcher: RegExp; src: string; alt: string }[] = [
    { matcher: /(swoc)/i, src: '/logo/swoc.svg', alt: 'SWoC' },
    { matcher: /(amazon|aws)/i, src: '/logo/aws.svg', alt: 'Amazon AI' },
    { matcher: /(google|deepmind|tensorflow|keras)/i, src: '/logo/tensorflow.svg', alt: 'Google DeepMind' },
    { matcher: /(meta|pytorch)/i, src: '/logo/pytorch.svg', alt: 'Meta AI' },
    { matcher: /(wechaty)/i, src: '/logo/wechaty.png', alt: 'Wechaty' },
    { matcher: /(numpy)/i, src: '/logo/numpy.svg', alt: 'NumPy' },
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

const OpenSource = () => {
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
                    <div className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-white/10 to-transparent" />

                    {MY_CONTRIBUTIONS.map((contribution, idx) => {
                        const isExpanded = expandedSlug === contribution.slug;
                        const icon = getOrgIcon(contribution.org);
                        const initials = getInitials(contribution.org);

                        return (
                            <article
                                key={contribution.slug}
                                className={cn(
                                    'os-item relative overflow-hidden border-b border-white/10 pb-8 last:border-0 transition-colors duration-300',
                                    isExpanded && 'border-b-primary/40 bg-white/[0.02]'
                                )}
                            >
                                <div className="flex flex-col gap-4 md:gap-5">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5">
                                                    {icon ? (
                                                        <Image src={icon.src} alt={icon.alt} width={44} height={44} className="object-contain" />
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
                                                    {contribution.period}
                                                </span>
                                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                    {contribution.role}
                                                </span>
                                                {contribution.stats && (
                                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                        PRs {contribution.stats.pullRequests ?? 0} • Commits {contribution.stats.commits ?? 0}
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
                                                    : 'text-white/70 hover:text-primary hover:border-primary/30'
                                            )}
                                        >
                                            {isExpanded ? 'Hide details' : 'View details'}
                                            <ChevronDown
                                                size={16}
                                                className={cn(
                                                    'transition-transform duration-300',
                                                    isExpanded && 'rotate-180'
                                                )}
                                            />
                                        </button>
                                        <div className="text-xs uppercase tracking-[0.2em] text-white/40">Open Source Track</div>
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
