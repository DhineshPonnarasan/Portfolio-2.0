'use client';

import SectionTitle from '@/components/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import parse from 'html-react-parser';
import { useRef, useState } from 'react';
import { Calendar, MapPin, Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useReducedMotion } from '@/lib/motion-prefs';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    useGSAP(
        () => {
            if (reducedMotion) return;
            const rows = containerRef.current?.querySelectorAll('.exp-item');
            if (!rows) return;

            rows.forEach((row, idx) => {
                gsap.fromTo(
                    row,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        delay: idx * 0.08,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: row,
                            start: 'top 88%',
                            toggleActions: 'play none none none',
                        },
                    },
                );
            });
        },
        { scope: containerRef, dependencies: [reducedMotion] },
    );

    const isContractRole = (company: string, title: string) =>
        /freelance|contract|consultant/i.test(`${company} ${title}`);

    const COMPANY_LOGOS: Record<string, string> = {
        'Uplifty AI': '/logo/Uplifty-AI.jpg',
        'Afame Technologies': '/logo/Afame.jfif',
        'V3Techserv': '/logo/V3techserv.webp',
        'Freelance - Upwork': '/logo/upwork_logo.jfif',
    };

    // Clean 2-letter monogram fallback (navy square style matching OSS brand icons).
    const getMonogram = (name: string) => {
        const parts = name.replace(/[-_]/g, ' ').trim().split(/\s+/);
        const first = parts[0]?.[0] ?? '';
        const second = parts[1]?.[0] ?? parts[0]?.[1] ?? '';
        return (first + second).toUpperCase();
    };

    return (
        <section className="py-20" id="experience" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Professional Experience" />

                <div className="relative mt-14">
                    {/* Vertical rail on the left edge (mobile) */}
                    <div
                        aria-hidden="true"
                        className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-white/10 to-transparent md:hidden"
                    />

                    <div className="space-y-12 md:space-y-20">
                        {MY_EXPERIENCE.map((item, idx) => {
                            const contract = isContractRole(item.company, item.title);
                            const isOdd = idx % 2 === 1;
                            const isExpanded = expandedIdx === idx;
                            const logoSrc = COMPANY_LOGOS[item.company];
                            const monogram = getMonogram(item.company);

                            return (
                                <article
                                    key={`${item.company}-${idx}`}
                                    className={cn(
                                        'exp-item group relative',
                                        'rounded-2xl border border-white/5 bg-white/[0.015] backdrop-blur-[2px]',
                                        'transition-all duration-500',
                                        'hover:border-primary/40 hover:shadow-[0_0_36px_-12px_rgba(118,185,0,0.45)]',
                                    )}
                                >
                                    {/* Mobile row — single column with rail */}
                                    <div className="md:hidden p-6 pl-16 relative">
                                        <span
                                            aria-hidden="true"
                                            className="absolute left-[22px] top-9 inline-flex h-3 w-3 -translate-x-1/2 rounded-full border-2 border-background bg-primary shadow-[0_0_10px_rgba(118,185,0,0.6)]"
                                        />
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#0a1628] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                                                {logoSrc ? (
                                                    <Image
                                                        src={logoSrc}
                                                        alt={item.company}
                                                        width={56}
                                                        height={56}
                                                        sizes="56px"
                                                        loading="lazy"
                                                        className="h-14 w-14 object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-base font-anton tracking-wider text-white/90">
                                                        {monogram}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary/70">
                                                    {String(idx + 1).padStart(2, '0')} / Role
                                                </span>
                                                <h3 className="text-xl font-anton leading-tight text-white">
                                                    {item.company}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold text-white/75">{item.title}</p>
                                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono text-white/60">
                                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                <Calendar size={12} className="text-primary" />
                                                {item.duration}
                                            </span>
                                            {item.location && (
                                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                    <MapPin size={12} className="text-primary" />
                                                    {item.location}
                                                </span>
                                            )}
                                            {contract && (
                                                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                                                    <Briefcase size={12} /> Contract
                                                </span>
                                            )}
                                        </div>
                                        <div className="custom-bullet-list mt-4 text-sm leading-relaxed text-white/80">
                                            {parse(item.description)}
                                        </div>
                                        {item.learned && (
                                            <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/[0.06] px-3 py-2">
                                                <Sparkles size={14} className="mt-0.5 shrink-0 text-primary" />
                                                <p className="text-[12px] italic leading-relaxed text-white/70">
                                                    {item.learned}
                                                </p>
                                            </div>
                                        )}
                                        <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
                                            {item.type}
                                        </div>
                                    </div>

                                    {/* Desktop row — alternating layout */}
                                    <div className="hidden md:grid md:grid-cols-12 md:gap-10 p-8 lg:p-10">
                                        {/* Left half — logo + meta */}
                                        <div
                                            className={cn(
                                                'md:col-span-5 flex flex-col gap-5',
                                                isOdd && 'md:order-2 md:items-end md:text-right',
                                            )}
                                        >
                                            <div className={cn('flex items-center gap-4', isOdd && 'flex-row-reverse')}>
                                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#0a1628] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] ring-1 ring-white/5 transition-all duration-300 group-hover:ring-primary/40">
                                                    {logoSrc ? (
                                                        <Image
                                                            src={logoSrc}
                                                            alt={item.company}
                                                            width={56}
                                                            height={56}
                                                            sizes="56px"
                                                            loading="lazy"
                                                            className="h-14 w-14 object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-base font-anton tracking-wider text-white/90">
                                                            {monogram}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={cn('space-y-1', isOdd && 'text-right')}>
                                                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary/70">
                                                        Role {String(idx + 1).padStart(2, '0')}
                                                    </span>
                                                    <h3 className="text-3xl lg:text-4xl font-anton leading-none text-white">
                                                        {item.company}
                                                    </h3>
                                                </div>
                                            </div>

                                            <p
                                                className={cn(
                                                    'text-sm lg:text-base font-semibold text-white/75',
                                                    isOdd && 'ml-auto',
                                                )}
                                            >
                                                {item.title}
                                            </p>

                                            <div
                                                className={cn(
                                                    'flex flex-wrap gap-2 text-[11px] font-mono text-white/60',
                                                    isOdd && 'justify-end',
                                                )}
                                            >
                                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                    <Calendar size={12} className="text-primary" />
                                                    {item.duration}
                                                </span>
                                                {item.location && (
                                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                        <MapPin size={12} className="text-primary" />
                                                        {item.location}
                                                    </span>
                                                )}
                                                {contract && (
                                                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                                                        <Briefcase size={12} /> Contract
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                className={cn(
                                                    'text-[10px] uppercase tracking-[0.2em] text-white/40',
                                                    isOdd && 'ml-auto',
                                                )}
                                            >
                                                {item.type}
                                            </div>
                                        </div>

                                        {/* Right half — bullets + learned */}
                                        <div className={cn('md:col-span-7', isOdd && 'md:order-1')}>
                                            <div className="custom-bullet-list text-sm leading-relaxed text-white/80">
                                                {parse(item.description)}
                                            </div>

                                            {item.learned && (
                                                <button
                                                    type="button"
                                                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                                                    aria-expanded={isExpanded}
                                                    className={cn(
                                                        'mt-6 inline-flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/[0.06] px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-primary/[0.1]',
                                                        isOdd && 'ml-auto',
                                                    )}
                                                >
                                                    <Sparkles size={14} className="mt-0.5 shrink-0 text-primary" />
                                                    <span className="text-[12px] italic leading-relaxed text-white/70">
                                                        {item.learned}
                                                    </span>
                                                </button>
                                            )}

                                            <div
                                                className={cn(
                                                    'mt-5 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-white/40 transition-all group-hover:translate-x-1 group-hover:text-primary',
                                                    isOdd && 'ml-auto',
                                                )}
                                            >
                                                View role <ArrowRight size={12} />
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
};

export default Experiences;