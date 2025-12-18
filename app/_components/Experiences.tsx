'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import parse from 'html-react-parser';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const activeExperience = MY_EXPERIENCE[activeIndex];
    const detailRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (!detailRef.current) return;
        gsap.fromTo(
            detailRef.current,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' },
        );
    }, [activeIndex]);

    const isContractRole = (company: string, title: string) => /freelance|contract|consultant/i.test(`${company} ${title}`);

    return (
        <section className="py-20" id="experience" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Experience" />

                <div className="grid items-start gap-12 xl:grid-cols-[420px_minmax(0,1fr)]">
                    <div className="relative">
                        <div className="pointer-events-none absolute left-5 top-3 hidden h-[calc(100%-1.5rem)] w-px bg-white/10 lg:block" />
                        <div className="space-y-4">
                            {MY_EXPERIENCE.map((item, idx) => {
                                const active = idx === activeIndex;
                                const contract = isContractRole(item.company, item.title);

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveIndex(idx)}
                                        className={cn(
                                            'exp-item relative w-full rounded-[28px] border px-6 py-6 pl-12 text-left transition-all duration-300',
                                            active
                                                ? 'border-primary/70 bg-primary/10 text-white shadow-[0_25px_55px_rgba(34,211,238,0.22)]'
                                                : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-primary/40 hover:text-white'
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'absolute left-5 top-8 hidden size-3 rounded-full border-2 lg:block',
                                                active ? 'border-primary bg-primary/70' : 'border-white/30'
                                            )}
                                        />
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/50">Case {String(idx + 1).padStart(2, '0')}</p>
                                                <span className="text-[0.65rem] font-mono text-white/60">{item.duration}</span>
                                            </div>
                                            <h3 className="text-2xl font-semibold text-white">{item.company}</h3>
                                            <p className="text-sm text-white/60">{item.title}</p>
                                            <div className="flex flex-wrap gap-2 text-xs font-mono text-white/60">
                                                <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1">{item.location}</span>
                                                {contract && (
                                                    <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-white">Contract</span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div ref={detailRef} className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.04] p-10">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 92% 15%, rgba(34,211,238,0.2), transparent 45%)' }} />
                        <div className="relative space-y-8">
                            <div className="flex flex-wrap items-end justify-between gap-5">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">Role</p>
                                    <h3 className="mt-3 text-4xl font-anton text-white leading-tight">
                                        {activeExperience.title}
                                    </h3>
                                    <p className="text-base font-semibold text-primary">{activeExperience.company}</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left">
                                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">Duration</p>
                                    <p className="mt-2 text-base font-semibold text-white">{activeExperience.duration}</p>
                                    <p className="text-xs text-white/60">{activeExperience.location}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 text-xs font-mono text-white/70">
                                <span className="rounded-full border border-white/15 bg-black/20 px-4 py-1">Impact-driven pods</span>
                                {isContractRole(activeExperience.company, activeExperience.title) && (
                                    <span className="rounded-full border border-white/15 bg-black/20 px-4 py-1">Freelance / Contract</span>
                                )}
                            </div>

                            <div className="prose prose-invert prose-base max-w-none text-white/80 leading-relaxed">
                                {activeExperience.description && parse(activeExperience.description)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experiences;
