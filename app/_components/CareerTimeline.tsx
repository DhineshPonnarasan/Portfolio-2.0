'use client';

import { useMemo, useRef } from 'react';
import { Briefcase, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { MY_EXPERIENCE, MY_EDUCATION } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/motion-prefs';

type TimelineEntry = {
    id: string;
    kind: 'work' | 'education';
    title: string;
    org: string;
    period: string;
    location?: string;
};

const buildTimeline = (): TimelineEntry[] => {
    const work: TimelineEntry[] = MY_EXPERIENCE.map((item, idx) => ({
        id: `work-${idx}-${item.company}`,
        kind: 'work',
        title: item.title,
        org: item.company,
        period: item.duration,
        location: item.location,
    }));
    const edu: TimelineEntry[] = MY_EDUCATION.map((item, idx) => ({
        id: `edu-${idx}-${item.institution}`,
        kind: 'education',
        title: item.degree,
        org: item.institution,
        period: item.duration,
        location: item.location,
    }));
    // Newest entries first — both sources are newest-first in lib/data.ts.
    return [...work, ...edu];
};

const CareerTimeline = () => {
    const entries = useMemo(buildTimeline, []);
    const scrollerRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    const scrollBy = (dir: 1 | -1) => {
        const el = scrollerRef.current;
        if (!el) return;
        const step = Math.min(el.clientWidth * 0.8, 600);
        el.scrollBy({
            left: dir * step,
            behavior: reducedMotion ? 'auto' : 'smooth',
        });
    };

    return (
        <section id="career-timeline" className="py-20" aria-labelledby="career-timeline-title">
            <div className="container">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <SectionTitle title="Career Timeline" />
                    <div
                        className="flex items-center gap-2 self-start sm:self-end"
                        role="group"
                        aria-label="Scroll career timeline"
                    >
                        <button
                            type="button"
                            onClick={() => scrollBy(-1)}
                            className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-white/70 transition-colors hover:border-primary/40 hover:text-primary"
                            aria-label="Scroll timeline left"
                        >
                            <ChevronLeft size={16} aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollBy(1)}
                            className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-white/70 transition-colors hover:border-primary/40 hover:text-primary"
                            aria-label="Scroll timeline right"
                        >
                            <ChevronRight size={16} aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
                    A compact view of roles + degrees in chronological order. Scroll sideways
                    on mobile, vertically on desktop.
                </p>

                {/* Horizontal scroll on small screens; vertical cards on desktop. */}
                <div
                    ref={scrollerRef}
                    className="mt-10 flex gap-4 overflow-x-auto pb-4 md:hidden snap-x snap-mandatory scroll-smooth"
                    role="list"
                    aria-label="Career timeline"
                >
                    {entries.map((entry) => (
                        <TimelineCard key={entry.id} entry={entry} compact />
                    ))}
                </div>

                <ol
                    className="mt-10 hidden md:block relative space-y-6 border-l border-white/10 pl-6"
                    aria-label="Career timeline"
                >
                    {entries.map((entry) => (
                        <li key={entry.id} className="relative">
                            <span
                                className={cn(
                                    'absolute -left-[34px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black',
                                    entry.kind === 'work'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-white text-black',
                                )}
                                aria-hidden="true"
                            >
                                {entry.kind === 'work' ? (
                                    <Briefcase size={12} />
                                ) : (
                                    <GraduationCap size={12} />
                                )}
                            </span>
                            <TimelineCard entry={entry} />
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

const TimelineCard = ({ entry, compact = false }: { entry: TimelineEntry; compact?: boolean }) => {
    const Icon = entry.kind === 'work' ? Briefcase : GraduationCap;
    return (
        <article
            className={cn(
                'min-w-[260px] snap-start rounded-2xl border border-white/10 bg-white/[0.03] p-4',
                compact && 'flex-1',
            )}
            role="listitem"
        >
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-white/40">
                <Icon size={12} className="text-primary" aria-hidden="true" />
                {entry.kind === 'work' ? 'Work' : 'Education'}
                <span className="ml-auto text-white/50">{entry.period}</span>
            </div>
            <h3 className="mt-2 text-base font-anton text-white leading-tight">{entry.org}</h3>
            <p className="mt-1 text-sm text-white/75">{entry.title}</p>
            {entry.location && (
                <p className="mt-1 text-xs text-white/50">{entry.location}</p>
            )}
        </article>
    );
};

export default CareerTimeline;