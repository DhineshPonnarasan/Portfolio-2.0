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
import { Briefcase, MapPin, Calendar, Building2, ArrowUpRight, Sparkles, ChevronDown } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    useGSAP(
        () => {
            const cards = containerRef.current?.querySelectorAll('.exp-card');
            if (!cards) return;

            cards.forEach((card, idx) => {
                gsap.fromTo(
                    card,
                    { 
                        opacity: 0, 
                        y: 60,
                        scale: 0.95
                    },
                    { 
                        opacity: 1, 
                        y: 0,
                        scale: 1,
                        duration: 0.7,
                        delay: idx * 0.15,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });
        },
        { scope: containerRef },
    );

    const isContractRole = (company: string, title: string) => /freelance|contract|consultant/i.test(`${company} ${title}`);

    return (
        <section className="py-20" id="experience" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Experience" />

                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {MY_EXPERIENCE.map((item, idx) => {
                        const isExpanded = expandedIndex === idx;
                        const contract = isContractRole(item.company, item.title);

                        return (
                            <motion.div
                                key={idx}
                                className="exp-card group relative"
                                whileHover={{ y: -4 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className={cn(
                                    "relative h-full rounded-3xl border transition-all duration-500 overflow-hidden",
                                    "bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-white/[0.01]",
                                    "backdrop-blur-sm",
                                    isExpanded 
                                        ? "border-primary/60 shadow-[0_25px_55px_rgba(16,185,129,0.25)]" 
                                        : "border-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                                )}>
                                    {/* Gradient overlay on hover */}
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500",
                                        isExpanded && "opacity-100"
                                    )} />

                                    {/* Top corner badge */}
                                    <div className="absolute top-6 right-6 z-10">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl border-2 flex items-center justify-center text-lg font-anton transition-all duration-500",
                                            isExpanded
                                                ? "bg-primary/20 border-primary/50 text-primary shadow-lg shadow-primary/30"
                                                : "bg-white/5 border-white/10 text-white/30 group-hover:border-primary/30"
                                        )}>
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                    </div>

                                    <div className="relative p-6 md:p-8 space-y-6">
                                        {/* Header */}
                                        <div className="space-y-3 pt-8">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-5 h-5 text-primary/70" />
                                                <h3 className={cn(
                                                    "text-2xl md:text-3xl font-anton transition-colors duration-300",
                                                    isExpanded ? "text-primary" : "text-white group-hover:text-primary"
                                                )}>
                                                    {item.company}
                                                </h3>
                                            </div>
                                            <p className="text-lg text-white/80 font-medium">
                                                {item.title}
                                            </p>
                                        </div>

                                        {/* Info badges */}
                                        <div className="flex flex-wrap gap-2">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-white/70">
                                                <Calendar className="w-3 h-3" />
                                                {item.duration}
                                            </div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-white/70">
                                                <MapPin className="w-3 h-3" />
                                                {item.location}
                                            </div>
                                            {contract && (
                                                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                                                    <Sparkles className="w-3 h-3" />
                                                    Contract
                                                </div>
                                            )}
                                        </div>

                                        {/* Expandable Details */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-6 border-t border-white/10 space-y-4">
                                                        <div className="flex items-center gap-2">
                                                            <Briefcase className="w-4 h-4 text-primary/70" />
                                                            <p className="text-xs uppercase tracking-widest text-white/50 font-medium">Key Responsibilities</p>
                                                        </div>
                                                        {item.description && (
                                                            <div className="custom-bullet-list text-white/80 leading-relaxed text-sm">
                                                                {parse(item.description)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Toggle Button */}
                                        <button
                                            onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                                            className={cn(
                                                "w-full flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300",
                                                isExpanded
                                                    ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                                                    : "border-white/10 bg-white/5 text-white/70 hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                                            )}
                                        >
                                            <span className="text-sm font-semibold">
                                                {isExpanded ? 'Hide details' : 'View details'}
                                            </span>
                                            <ChevronDown 
                                                size={16} 
                                                className={cn(
                                                    "transition-transform duration-300",
                                                    isExpanded && "rotate-180"
                                                )} 
                                            />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Experiences;
