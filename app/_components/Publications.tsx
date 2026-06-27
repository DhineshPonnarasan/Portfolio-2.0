'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_PUBLICATIONS } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import React, { useRef } from 'react';
import { useReducedMotion } from '@/lib/motion-prefs';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Short, recognizable conference abbreviations for the venue pill.
const VENUE_BADGE_RE = /^(IEEE\s*[-–—]\s*)/i;

const formatVenueBadge = (venue: string) => {
    // Strip the leading "IEEE - " prefix and trim to a short tag.
    const cleaned = venue.replace(VENUE_BADGE_RE, '').trim();
    // Try to extract a recognisable acronym (e.g. iTech SECOM → iTech SECOM).
    const short = cleaned.length > 38 ? cleaned.slice(0, 38).trimEnd() + '…' : cleaned;
    return { badge: 'IEEE', short };
};

const Publications = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    useGSAP(
        () => {
            if (reducedMotion) return;
            if (!containerRef.current) return;
            const tiles = containerRef.current.querySelectorAll('.pub-card');
            if (tiles.length === 0) return;
            gsap.fromTo(
                tiles,
                { opacity: 0, y: 28 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    ease: 'power3.out',
                    stagger: 0.08,
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

    return (
        <section id="publications" className="py-20" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Publications" />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {MY_PUBLICATIONS.map((pub, idx) => {
                        const { badge, short } = formatVenueBadge(pub.venue);
                        return (
                            <a
                                key={`${pub.title}-${idx}`}
                                href={pub.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Read paper: ${pub.title}`}
                                className={cn(
                                    'pub-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.025] via-white/[0.01] to-transparent p-6 lg:p-7',
                                    'transition-all duration-500 ease-out',
                                    'hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_42px_-12px_rgba(118,185,0,0.5)]',
                                )}
                            >
                                {/* Hover glow accent */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    style={{
                                        background:
                                            'radial-gradient(120% 80% at 0% 0%, rgba(118,185,0,0.08), transparent 60%)',
                                    }}
                                />

                                {/* Top row: IEEE badge + year pill */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-md border border-primary/30 bg-primary/[0.08] px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary">
                                            {badge}
                                        </span>
                                        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50">
                                            {short}
                                        </span>
                                    </div>
                                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-white/70">
                                        {pub.year}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="mt-5 font-anton text-xl leading-tight text-white transition-colors duration-300 group-hover:text-primary md:text-2xl">
                                    {pub.title}
                                </h3>

                                {/* Bullets */}
                                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/70">
                                    {pub.points.slice(0, 3).map((point, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Footer */}
                                <div className="mt-auto pt-6 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.25em] text-white/40">
                                        <BookOpen size={11} /> Peer-reviewed
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/70 transition-all group-hover:translate-x-1 group-hover:text-primary">
                                        Read paper
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
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Publications;