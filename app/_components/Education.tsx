'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_EDUCATION } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Calendar, MapPin, Award, BookOpen } from 'lucide-react';
import { useRef, useState } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Education = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

            tl.fromTo(
                '.edu-item',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out' },
            );
        },
        { scope: containerRef },
    );

    return (
        <section className="py-20" id="education" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Academic Background" />

                <div className="mt-12 space-y-10">
                    {MY_EDUCATION.map((item, idx) => {
                        const isHovered = hoveredIndex === idx;

                        return (
                            <div
                                key={idx}
                                className="edu-item group"
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 border-b border-white/10 pb-8 last:border-0">
                                    <div className="text-4xl font-anton text-white/15 group-hover:text-primary/50 transition-colors">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                            <div className="space-y-1">
                                                <h3 className="text-3xl font-anton text-white group-hover:text-primary transition-colors">
                                                    {item.institution}
                                                </h3>
                                                <p className="text-lg text-white/70 font-medium">{item.degree}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-xs font-mono text-white/60">
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                                    <Calendar size={14} className="text-primary" />
                                                    {item.duration}
                                                </span>
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                                    <MapPin size={14} className="text-primary" />
                                                    {item.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "space-y-3 transition-all duration-300",
                                            isHovered ? "opacity-100" : "opacity-80"
                                        )}>
                                            {item.gpa && (
                                                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-sm font-semibold">
                                                    <Award className="w-4 h-4 text-primary" />
                                                    GPA {item.gpa}
                                                </div>
                                            )}
                                            {item.coursework && (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                                                        <BookOpen className="w-4 h-4 text-primary/70" /> Coursework
                                                    </div>
                                                    <p className="text-sm text-white/70 leading-relaxed">{item.coursework}</p>
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
        </section>
    );
};

export default Education;
