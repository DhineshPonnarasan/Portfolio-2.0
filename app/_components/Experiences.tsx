'use client';

import SectionTitle from '@/components/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import parse from 'html-react-parser';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Calendar, ChevronDown } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    useGSAP(
        () => {
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
                        delay: idx * 0.12,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: row,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    },
                );
            });
        },
        { scope: containerRef },
    );

    const isContractRole = (company: string, title: string) => /freelance|contract|consultant/i.test(`${company} ${title}`);

    const COMPANY_LOGOS: Record<string, string> = {
        'Uplifty AI': '/logo/Uplifty-AI.jpg',
        'Afame Technologies': '/logo/Afame.jfif',
        'V3Techserv': '/logo/V3techserv.webp',
        'Freelance - Upwork': '/logo/upwork_logo.jfif',
    };

    const COMPANY_TAGS: Record<string, string[]> = {
        'Uplifty AI': ['Machine Learning', 'Product', 'Deployment'],
        'Afame Technologies': ['Data Analysis', 'Dashboards', 'Visualization'],
        'V3Techserv': ['Backend', 'API', 'Scalability'],
        'Freelance - Upwork': ['Full-Stack', 'Client Delivery', 'User Experience'],
    };

    const handleToggle = (idx: number) => {
        setExpandedIndex((prev) => (prev === idx ? null : idx));
    };

    return (
        <section className="py-20" id="experience" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Professional Experience" />

                <div className="mt-12 relative space-y-8 md:space-y-10">
                    <div className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-white/10 to-transparent" />

                    {MY_EXPERIENCE.map((item, idx) => {
                        const isExpanded = expandedIndex === idx;
                        const contract = isContractRole(item.company, item.title);

                        return (
                            <article
                                key={`${item.company}-${idx}`}
                                className={cn(
                                    'exp-item relative overflow-hidden border-b border-white/10 pb-8 last:border-0',
                                    'transition-colors duration-300',
                                    isExpanded && 'border-b-primary/40 bg-white/[0.02]'
                                )}
                            >
                                <div className="grid gap-4 grid-cols-[auto,1fr] items-start">
                                    <div className="flex flex-col items-center gap-3 pt-1">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-[11px] font-semibold text-primary">
                                            {(idx + 1).toString().padStart(2, '0')}
                                        </div>
                                        <div className="hidden md:block h-full w-px bg-white/10" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-shrink-0 h-10 w-10 md:h-10 md:w-10 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                                                        <Image
                                                            src={COMPANY_LOGOS[item.company] ?? '/logo/chatbot-avatar.png'}
                                                            alt={item.company}
                                                            width={36}
                                                            height={36}
                                                            sizes="36px"
                                                            loading="lazy"
                                                            className="h-8 w-8 md:h-9 md:w-9 object-cover"
                                                        />
                                                    </div>
                                                    <h3 className="text-2xl md:text-3xl font-anton text-white leading-tight">
                                                        {item.company}
                                                    </h3>
                                                </div>

                                                <p className="text-sm font-semibold text-white/75">{item.title}</p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 text-xs font-mono text-white/60">
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
                                        </div>

                                        <p className="text-sm leading-relaxed text-white/75">
                                            {'learned' in item && typeof (item as { learned?: string }).learned === 'string'
                                                ? (item as { learned: string }).learned
                                                : 'Built products, shipped features, and collaborated across teams.'}
                                        </p>

                                        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-white/60">
                                            {(COMPANY_TAGS[item.company] ?? ['Delivery', 'Collaboration', 'Execution']).map((tag) => (
                                                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{tag}</span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(idx)}
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
                                                    className={cn('transition-transform duration-300', isExpanded && 'rotate-180')}
                                                />
                                            </button>
                                            <div className="text-xs uppercase tracking-[0.2em] text-white/40">{item.type}</div>
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
                                                    <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/80">
                                                        {item.description ? (
                                                            <div className="custom-bullet-list">{parse(item.description)}</div>
                                                        ) : (
                                                            <p className="text-white/60">Detailed responsibilities coming soon.</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Experiences;
