'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_STACK } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import React, { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Skills = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const slideUpEl =
                containerRef.current?.querySelectorAll('.slide-up');

            if (!slideUpEl?.length) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    end: 'bottom 80%',
                    scrub: 0.5,
                },
            });

            tl.fromTo(
                '.slide-up',
                {
                    opacity: 0,
                    y: 40,
                },
                {
                    opacity: 1,
                    y: 0,
                    ease: 'power2.out',
                    stagger: 0.05,
                }
            );
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 1,
                },
            });

            tl.to(containerRef.current, {
                y: -150,
                opacity: 0,
            });
        },
        { scope: containerRef },
    );

    return (
        <section id="my-stack" ref={containerRef} className="py-20">
            <div className="container">
                <SectionTitle title="My Stack" />

                <div className="space-y-20">
                    {Object.entries(MY_STACK).map(([key, value]) => (
                        <div className="grid sm:grid-cols-12 gap-8 sm:gap-4" key={key}>
                            <div className="sm:col-span-4 lg:col-span-3">
                                <p className="slide-up text-3xl sm:text-4xl font-anton leading-tight text-muted-foreground uppercase tracking-wide">
                                    {key}
                                </p>
                            </div>

                            <div className="sm:col-span-8 lg:col-span-9 flex gap-6 flex-wrap content-start">
                                {value.map((item) => {
                                    return (
                                        <div
                                            className="slide-up group relative flex items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-white/5"
                                            key={item.name}
                                        >
                                            <div className="w-8 h-8 relative flex items-center justify-center">
                                                <Image
                                                    src={item.icon}
                                                    alt={item.name}
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>
                                            <span className="text-zinc-200 text-base font-medium group-hover:text-white transition-colors">
                                                {item.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
