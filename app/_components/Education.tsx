'use client';

import SectionTitle from '@/components/SectionTitle';
import { MY_EDUCATION } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Calendar, MapPin, Award, BookOpen, GraduationCap } from 'lucide-react';
import { useRef, useState } from 'react';
import { formatPeriod } from '@/lib/time-period';
import { useReducedMotion } from '@/lib/motion-prefs';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const shortYear = (duration: string) => {
    const m = duration.match(/(\d{4})/);
    return m ? m[1] : '';
};

const Education = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    useGSAP(
        () => {
            if (reducedMotion) return;
            if (!containerRef.current) return;
            const nodes = containerRef.current.querySelectorAll('.edu-node');
            if (nodes.length === 0) return;
            gsap.fromTo(
                nodes,
                { opacity: 0, y: 24 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    ease: 'power3.out',
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    },
                },
            );
            // Animate the rail fill on scroll.
            const rail = containerRef.current.querySelector('.edu-rail-fill');
            if (rail) {
                gsap.fromTo(
                    rail,
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        ease: 'none',
                        transformOrigin: 'left center',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top 85%',
                            end: 'bottom 75%',
                            scrub: 1,
                        },
                    },
                );
            }
        },
        { scope: containerRef, dependencies: [reducedMotion] },
    );

    return (
        <section className="py-20" id="education" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Academic Background" />

                {/* Desktop + tablet horizontal rail */}
                <div className="relative mt-14 hidden md:block">
                    {/* Track base */}
                    <div
                        aria-hidden="true"
                        className="absolute left-4 right-4 top-[68px] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                    {/* Animated fill */}
                    <div
                        aria-hidden="true"
                        className="edu-rail-fill absolute left-4 right-4 top-[68px] h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0"
                    />

                    <div
                        ref={railRef}
                        className="grid grid-cols-4 gap-4 lg:gap-8"
                    >
                        {MY_EDUCATION.map((item, idx) => {
                            const isActive = activeIdx === idx;
                            const year = shortYear(item.duration);
                            return (
                                <div
                                    key={`${item.institution}-${idx}`}
                                    className="edu-node group relative flex flex-col items-center"
                                >
                                    {/* Year pill above the dot */}
                                    <span className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-white/70">
                                        {year}
                                    </span>

                                    {/* Dot on the rail */}
                                    <button
                                        type="button"
                                        onClick={() => setActiveIdx(isActive ? null : idx)}
                                        onMouseEnter={() => setActiveIdx(idx)}
                                        onMouseLeave={() => setActiveIdx(null)}
                                        onFocus={() => setActiveIdx(idx)}
                                        onBlur={() => setActiveIdx(null)}
                                        aria-expanded={isActive}
                                        aria-label={`Show details for ${item.institution}`}
                                        className={cn(
                                            'relative z-10 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-300',
                                            isActive
                                                ? 'border-primary bg-primary shadow-[0_0_18px_rgba(118,185,0,0.7)] scale-110'
                                                : 'border-primary/60 bg-[#0a1628] group-hover:border-primary group-hover:shadow-[0_0_14px_rgba(118,185,0,0.45)]',
                                        )}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'h-1.5 w-1.5 rounded-full transition-all',
                                                isActive ? 'bg-[#0a1628]' : 'bg-primary/80 group-hover:bg-primary',
                                            )}
                                        />
                                    </button>

                                    {/* Vertical drop to card */}
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            'mt-1 h-4 w-px bg-gradient-to-b from-primary/60 to-transparent transition-opacity',
                                            isActive ? 'opacity-100' : 'opacity-30',
                                        )}
                                    />

                                    {/* Card under the dot */}
                                    <div
                                        className={cn(
                                            'mt-3 flex w-full flex-col rounded-xl border bg-white/[0.02] p-4 text-center transition-all duration-500',
                                            isActive
                                                ? 'border-primary/50 bg-white/[0.04] shadow-[0_0_36px_-12px_rgba(118,185,0,0.55)]'
                                                : 'border-white/10 group-hover:border-primary/30 group-hover:bg-white/[0.04]',
                                        )}
                                    >
                                        <div className="inline-flex items-center justify-center text-[10px] font-mono uppercase tracking-[0.3em] text-primary/70">
                                            <GraduationCap size={11} className="mr-1" />
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                        <h3 className="mt-2 font-anton text-base leading-tight text-white lg:text-lg">
                                            {item.institution}
                                        </h3>
                                        <p className="mt-1 text-[12px] leading-snug text-white/70">{item.degree}</p>

                                        {/* Meta row */}
                                        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-white/55">
                                            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                                                <Calendar size={10} className="text-primary" />
                                                {formatPeriod(item.duration)}
                                            </span>
                                        </div>

                                        {/* Expanded detail (hover/focus) */}
                                        <div
                                            className={cn(
                                                'grid transition-all duration-500 ease-out',
                                                isActive
                                                    ? 'mt-3 grid-rows-[1fr] opacity-100'
                                                    : 'grid-rows-[0fr] opacity-0',
                                            )}
                                        >
                                            <div className="min-h-0 overflow-hidden text-left">
                                                {item.gpa && (
                                                    <div className="mb-2 inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/[0.06] px-2 py-1 text-[10px] font-semibold text-primary">
                                                        <Award size={10} /> GPA {item.gpa}
                                                    </div>
                                                )}
                                                <div className="flex items-start gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                                    <MapPin size={10} className="mt-0.5 shrink-0 text-primary/70" />
                                                    <span className="leading-snug">{item.location}</span>
                                                </div>
                                                {item.coursework && (
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/55">
                                                            <BookOpen size={10} className="text-primary/70" /> Coursework
                                                        </div>
                                                        <p className="text-[11px] leading-snug text-white/70">{item.coursework}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile horizontal-scroll rail */}
                <div className="mt-12 md:hidden">
                    <div
                        className="overflow-x-auto pb-4 snap-x snap-mandatory"
                        role="region"
                        aria-label="Education timeline (swipe horizontally)"
                    >
                        <div className="relative inline-flex min-w-full items-stretch gap-6 px-2">
                            {/* Mobile rail line */}
                            <span
                                aria-hidden="true"
                                className="absolute left-2 right-2 top-[58px] h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                            />
                            {MY_EDUCATION.map((item, idx) => {
                                const year = shortYear(item.duration);
                                const isActive = activeIdx === idx;
                                return (
                                    <div
                                        key={`mobile-${item.institution}-${idx}`}
                                        className="edu-node relative flex w-64 flex-shrink-0 snap-center flex-col items-center"
                                    >
                                        <span className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-white/70">
                                            {year}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setActiveIdx(isActive ? null : idx)}
                                            aria-expanded={isActive}
                                            aria-label={`Show details for ${item.institution}`}
                                            className={cn(
                                                'relative z-10 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-300',
                                                isActive
                                                    ? 'border-primary bg-primary shadow-[0_0_18px_rgba(118,185,0,0.7)] scale-110'
                                                    : 'border-primary/60 bg-[#0a1628]',
                                            )}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'h-1.5 w-1.5 rounded-full',
                                                    isActive ? 'bg-[#0a1628]' : 'bg-primary/80',
                                                )}
                                            />
                                        </button>
                                        <span
                                            aria-hidden="true"
                                            className="mt-1 h-4 w-px bg-gradient-to-b from-primary/60 to-transparent"
                                        />
                                        <div
                                            className={cn(
                                                'mt-3 flex w-full flex-col rounded-xl border bg-white/[0.02] p-4 text-center transition-all',
                                                isActive
                                                    ? 'border-primary/50 bg-white/[0.04]'
                                                    : 'border-white/10',
                                            )}
                                        >
                                            <h3 className="font-anton text-base leading-tight text-white">
                                                {item.institution}
                                            </h3>
                                            <p className="mt-1 text-[12px] leading-snug text-white/70">{item.degree}</p>
                                            <div className="mt-2 text-[10px] font-mono uppercase tracking-wider text-white/55">
                                                {formatPeriod(item.duration)}
                                            </div>
                                            {isActive && (
                                                <div className="mt-3 text-left">
                                                    {item.gpa && (
                                                        <div className="mb-1 inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/[0.06] px-2 py-1 text-[10px] font-semibold text-primary">
                                                            <Award size={10} /> GPA {item.gpa}
                                                        </div>
                                                    )}
                                                    <div className="flex items-start gap-1.5 text-[10px] text-white/60">
                                                        <MapPin size={10} className="mt-0.5 shrink-0 text-primary/70" />
                                                        <span>{item.location}</span>
                                                    </div>
                                                    {item.coursework && (
                                                        <p className="mt-2 text-[11px] leading-snug text-white/70">{item.coursework}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Education;