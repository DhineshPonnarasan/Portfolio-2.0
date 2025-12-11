'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_EDUCATION } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
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
        <section className="py-20 overflow-hidden" id="education" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Academic Background" />
                
                <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                    {MY_EDUCATION.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="edu-item group relative"
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Hover Reveal Image/Gradient Background */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-r from-primary/10 via-zinc-900 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"
                            )} />

                            <div className="relative flex flex-col md:flex-row gap-6 p-6 border-b border-white/10 group-hover:border-primary/50 transition-colors duration-500">
                                {/* Left: Index & Icon */}
                                <div className="hidden md:flex flex-col items-center gap-4 w-24 shrink-0">
                                    <span className="text-4xl font-anton text-white/10 group-hover:text-primary transition-colors duration-500">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </span>
                                    <div className="h-full w-[1px] bg-white/5 group-hover:bg-primary/30 transition-colors duration-500" />
                                </div>

                                {/* Middle: Content */}
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-3xl md:text-5xl font-anton text-white mb-2 group-hover:text-primary transition-colors duration-300">
                                                {item.institution}
                                            </h3>
                                            <p className="text-xl text-white/80 font-medium">
                                                {item.degree}
                                            </p>
                                        </div>
                                        
                                        <div className="flex flex-col items-end gap-2 text-right">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm font-mono text-muted-foreground group-hover:border-primary/30 transition-colors">
                                                <Calendar size={14} />
                                                {item.duration}
                                            </div>
                                            <div className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground">
                                                <MapPin size={14} />
                                                {item.location}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Collapsible Details */}
                                    <div className={cn(
                                        "grid transition-all duration-500 ease-in-out",
                                        hoveredIndex === idx ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0 mt-0"
                                    )}>
                                        <div className="overflow-hidden">
                                            <div className="flex flex-col md:flex-row gap-8 pt-6 border-t border-white/5">
                                                {item.gpa && (
                                                    <div className="shrink-0">
                                                        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1 block">GPA</span>
                                                        <span className="text-2xl font-anton text-white">{item.gpa}</span>
                                                    </div>
                                                )}
                                                {item.coursework && (
                                                    <div>
                                                        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Coursework</span>
                                                        <p className="text-muted-foreground/80 leading-relaxed max-w-2xl">
                                                            {item.coursework}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Action Arrow */}
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out hidden md:block">
                                    <ArrowRight size={40} className="text-primary" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
