'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import parse from 'html-react-parser';
import { useRef, useState } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);

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
                '.exp-item',
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.1 },
            );
        },
        { scope: containerRef },
    );

    return (
        <section className="py-20" id="experience" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Experience" />

                <div className="grid lg:grid-cols-[350px_1fr] gap-10 min-h-[500px]">
                    {/* Left Side: Company List */}
                    <div className="flex flex-col gap-2 relative">
                        {/* Active Indicator Line (Desktop) */}
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5 hidden lg:block" />
                        <div 
                            className="absolute left-0 w-[2px] bg-primary transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hidden lg:block"
                            style={{
                                height: `${100 / MY_EXPERIENCE.length}%`,
                                top: `${(activeIndex / MY_EXPERIENCE.length) * 100}%`
                            }}
                        />

                        {MY_EXPERIENCE.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={cn(
                                    "exp-item text-left px-6 py-4 rounded-lg transition-all duration-300 relative overflow-hidden group",
                                    activeIndex === idx 
                                        ? "bg-white/5 lg:bg-transparent" 
                                        : "hover:bg-white/5"
                                )}
                            >
                                <div className={cn(
                                    "absolute left-0 top-0 bottom-0 w-[2px] bg-primary transition-opacity duration-300 lg:hidden",
                                    activeIndex === idx ? "opacity-100" : "opacity-0"
                                )} />
                                
                                <h3 className={cn(
                                    "text-lg font-bold transition-colors duration-300",
                                    activeIndex === idx ? "text-primary" : "text-white/60 group-hover:text-white"
                                )}>
                                    {item.company}
                                </h3>
                                <p className="text-sm font-mono text-white/40 mt-1">
                                    {item.duration.split('–')[0].trim()}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Right Side: Content */}
                    <div className="relative">
                        {MY_EXPERIENCE.map((item, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "transition-all duration-500 absolute top-0 left-0 w-full",
                                    activeIndex === idx 
                                        ? "opacity-100 translate-y-0 pointer-events-auto delay-100" 
                                        : "opacity-0 translate-y-4 pointer-events-none"
                                )}
                            >
                                <div className="flex flex-col gap-4 mb-6">
                                    <h3 className="text-3xl font-anton text-white">
                                        {item.title} 
                                        <span className="text-primary"> @ {item.company}</span>
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-muted-foreground">
                                        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                                            {item.duration}
                                        </span>
                                        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                                            {item.location}
                                        </span>
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed">
                                    {item.description && parse(item.description)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experiences;
