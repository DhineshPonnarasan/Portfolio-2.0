'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, PlayCircle, ExternalLink, ChevronDown } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { TALKS } from '@/lib/honors';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/motion-prefs';

const Talks = () => {
    const [expanded, setExpanded] = useState<string | null>(null);
    const reducedMotion = useReducedMotion();

    return (
        <section id="talks" className="py-20">
            <div className="container">
                <SectionTitle title="Talks & Publications" />

                <div className="mt-10 space-y-6">
                    {TALKS.map((talk) => (
                        <article
                            key={talk.id}
                            className={cn(
                                'rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors',
                                expanded === talk.id && 'border-primary/40 bg-primary/[0.04]',
                            )}
                        >
                            <header className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-anton text-white leading-tight">
                                        {talk.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-white/60">{talk.venue}</p>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-white/50">
                                    <span className="inline-flex items-center gap-2">
                                        <Calendar size={12} className="text-primary" />
                                        {talk.date}
                                    </span>
                                    {talk.url && (
                                        <a
                                            href={talk.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-primary hover:underline"
                                        >
                                            <ExternalLink size={12} /> Paper
                                        </a>
                                    )}
                                </div>
                            </header>

                            <p className="mt-3 text-sm leading-relaxed text-white/80">
                                {talk.description}
                            </p>

                            {talk.embed && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpanded((p) => (p === talk.id ? null : talk.id))
                                    }
                                    aria-expanded={expanded === talk.id}
                                    aria-controls={`talk-${talk.id}-embed`}
                                    className="mt-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary hover:underline"
                                >
                                    <PlayCircle size={14} />
                                    {expanded === talk.id ? 'Hide recording' : 'Watch recording'}
                                    <ChevronDown
                                        size={14}
                                        className={cn(
                                            'transition-transform',
                                            expanded === talk.id && 'rotate-180',
                                        )}
                                    />
                                </button>
                            )}

                            <AnimatePresence>
                                {talk.embed && expanded === talk.id && (
                                    <motion.div
                                        id={`talk-${talk.id}-embed`}
                                        initial={reducedMotion ? false : { opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
                                            <iframe
                                                src={talk.embed}
                                                title={`${talk.title} recording`}
                                                className="h-full w-full"
                                                loading="lazy"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Talks;
