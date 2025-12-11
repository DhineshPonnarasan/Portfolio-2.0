'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_PUBLICATIONS } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ExternalLink, FileText, Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import React, { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Publications = () => {
    const containerRef = useRef<HTMLDivElement>(null);

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
                '.pub-row',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.15 },
            );
        },
        { scope: containerRef },
    );

    return (
        <section id="publications" className="py-20" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Publications" />

                <div className="flex flex-col border-t border-white/10">
                    {MY_PUBLICATIONS.map((pub, idx) => (
                        <a
                            key={idx}
                            href={pub.link}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="pub-row group relative py-10 border-b border-white/10 transition-colors hover:bg-white/[0.02]"
                        >
                            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                                {/* Index */}
                                <div className="text-4xl md:text-5xl font-anton text-white/10 group-hover:text-primary/20 transition-colors duration-500">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                        <h3 className="text-2xl md:text-3xl font-serif font-medium text-white group-hover:text-primary transition-colors duration-300 leading-tight max-w-3xl">
                                            {pub.title}
                                        </h3>
                                        
                                        <div className="shrink-0">
                                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-white/50 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-300 transform group-hover:-rotate-45">
                                                <ArrowUpRight size={24} />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-mono mb-6">
                                        <span className="text-white">{pub.venue}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                        <span>{pub.year}</span>
                                    </div>

                                    <div className="max-w-4xl space-y-2">
                                        {pub.points.map((point, i) => (
                                            <p key={i} className="text-muted-foreground/80 leading-relaxed text-sm md:text-base border-l-2 border-white/5 pl-4 group-hover:border-primary/30 transition-colors duration-300">
                                                {point}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Publications;
