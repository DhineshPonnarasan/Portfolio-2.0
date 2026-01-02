'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_EDUCATION } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Calendar, MapPin, GraduationCap, Award, BookOpen } from 'lucide-react';
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
                
                <div className="flex flex-col border-t border-white/10 mt-12">
                    {MY_EDUCATION.map((item, idx) => {
                        const isEven = idx % 2 === 0;
                        
                        return (
                            <div 
                                key={idx} 
                                className={cn(
                                    "edu-item group relative py-10 border-b border-white/10 transition-colors hover:bg-white/[0.02]",
                                    idx === MY_EDUCATION.length - 1 && "border-b-0"
                                )}
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div className={cn(
                                    "flex flex-col md:flex-row gap-6 md:gap-12",
                                    isEven ? "" : "md:flex-row-reverse"
                                )}>
                                    {/* Left/Right: Index */}
                                    <div className="text-4xl md:text-5xl font-anton text-white/10 group-hover:text-primary/20 transition-colors duration-500 shrink-0">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </div>

                                    {/* Middle: Main Content */}
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                            <div>
                                                <h3 className="text-3xl md:text-5xl font-anton text-white mb-2 group-hover:text-primary transition-colors duration-300">
                                                    {item.institution}
                                                </h3>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Award className="w-5 h-5 text-primary/70" />
                                                    <p className="text-xl text-white/80 font-medium">
                                                        {item.degree}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-end gap-2 text-right shrink-0">
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

                                        {/* Expandable Details */}
                                        <div className={cn(
                                            "grid transition-all duration-500 ease-in-out",
                                            hoveredIndex === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <BookOpen className="w-4 h-4 text-primary/70" />
                                                                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Coursework</span>
                                                            </div>
                                                            <p className="text-muted-foreground/80 leading-relaxed max-w-2xl">
                                                                {item.coursework}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
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
