'use client';

import { Award as AwardIcon, Calendar, ExternalLink } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { AWARDS } from '@/lib/honors';

const Awards = () => {
    if (AWARDS.length === 0) return null;
    return (
        <section id="awards" className="py-20">
            <div className="container">
                <SectionTitle title="Awards" />
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {AWARDS.map((award) => (
                        <article
                            key={award.id}
                            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-primary/40 hover:bg-primary/[0.05]"
                        >
                            <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-primary/15 p-2.5 text-primary">
                                <AwardIcon size={20} aria-hidden="true" />
                            </div>
                            <h3 className="text-base font-anton text-white leading-tight">
                                {award.title}
                            </h3>
                            <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
                                {award.issuer}
                            </p>
                            <div className="mt-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-white/50">
                                <span className="inline-flex items-center gap-2">
                                    <Calendar size={12} className="text-primary" />
                                    {award.date}
                                </span>
                                {award.url && (
                                    <a
                                        href={award.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-primary hover:underline"
                                    >
                                        <ExternalLink size={12} /> Verify
                                    </a>
                                )}
                            </div>
                            {award.description && (
                                <p className="mt-3 text-xs leading-relaxed text-white/70">
                                    {award.description}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Awards;
