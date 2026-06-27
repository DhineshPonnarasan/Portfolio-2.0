'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '@/components/SectionTitle';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/motion-prefs';

// Defer the GitHub stats widget to keep the home route's first-load chunk slim.
const GitHubStats = dynamic(() => import('./social/GitHubStats'), {
    ssr: false,
    loading: () => <StatsCardSkeleton lines={3} />,
});

const LeetCodeCard = dynamic(() => import('./social/LeetCodeCard'), {
    ssr: false,
    loading: () => <StatsCardSkeleton lines={2} />,
});

interface Testimonial {
    id: string;
    name: string;
    role: string;
    quote: string;
    available?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 't1',
        name: 'Available on request',
        role: 'Engineering Manager · Tech Lead',
        quote:
            'Dhinesh consistently delivered production-grade ML systems that exceeded our reliability and latency targets.',
        available: false,
    },
    {
        id: 't2',
        name: 'Available on request',
        role: 'Open Source Maintainer',
        quote:
            'Meticulous, communicative, and pragmatic — every PR shipped with thoughtful tests and a clear migration plan.',
        available: false,
    },
    {
        id: 't3',
        name: 'Available on request',
        role: 'Research Collaborator',
        quote:
            'Bridges research and engineering with rare clarity. The architecture decisions are always explained, never improvised.',
        available: false,
    },
];

const StatsCardSkeleton = ({ lines }: { lines: number }) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 animate-pulse">
        <div className="h-3 w-1/3 rounded bg-white/10" />
        <div className="mt-4 space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="h-6 w-2/3 rounded bg-white/5" />
            ))}
        </div>
    </div>
);

const SocialProof = () => {
    const reducedMotion = useReducedMotion();
    const [shimmer, setShimmer] = useState(true);

    useEffect(() => {
        if (reducedMotion) {
            setShimmer(false);
            return;
        }
        const t = setTimeout(() => setShimmer(false), 1200);
        return () => clearTimeout(t);
    }, [reducedMotion]);

    return (
        <section id="social-proof" className="py-20">
            <div className="container">
                <SectionTitle title="Trust & Proof" />

                <div className="grid gap-6 md:grid-cols-3">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.figure
                            key={t.id}
                            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.4, delay: reducedMotion ? 0 : i * 0.06 }}
                            className={cn(
                                'rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors',
                                !t.available && 'opacity-70',
                            )}
                        >
                            <blockquote className="text-sm leading-relaxed text-white/85">
                                “{t.quote}”
                            </blockquote>
                            <figcaption className="mt-5 text-xs">
                                <span
                                    className={cn(
                                        'font-semibold uppercase tracking-[0.2em]',
                                        t.available ? 'text-primary' : 'text-white/40',
                                    )}
                                >
                                    {t.name}
                                </span>
                                <span className="block text-white/40">{t.role}</span>
                            </figcaption>
                        </motion.figure>
                    ))}
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    <GitHubStats reducedMotion={reducedMotion} shimmer={shimmer} />
                    <LeetCodeCard reducedMotion={reducedMotion} />
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
