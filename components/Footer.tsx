'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';

import SectionTitle from '@/components/SectionTitle';
import { GENERAL_INFO } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Footer = () => {
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
                '.contact-item',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1 },
            );
        },
        { scope: containerRef },
    );

    return (
        <footer className="py-20" id="contact" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Get in Touch" />

                <div className="relative mt-12 overflow-hidden rounded-[40px] border border-white/10 bg-[hsla(var(--background-light)_/_0.95)] contact-item">
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(circle at 18% 12%, rgba(34,211,238,0.22), transparent 55%)' }}
                    />
                    <div className="relative grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="border-b border-white/10 p-8 lg:p-12 space-y-8">
                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">Professional Contact</p>
                                <h2 className="text-4xl md:text-5xl font-anton leading-tight text-white">
                                    I partner with teams that need dependable ML systems, rigorous APIs, and launch-ready polish.
                                </h2>
                                <p className="text-muted-foreground/90 text-lg max-w-2xl">
                                    Open to meaningful collaborations and impactful engineering work where architecture clarity, delivery speed, and technical honesty matter.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {['AI Systems', 'ML Pipelines', 'Scalable APIs', 'Cloud & MLOps', 'Open Source'].map((capability) => (
                                    <span
                                        key={capability}
                                        className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                                    >
                                        {capability}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 bg-black/25 p-8 lg:p-12">
                            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/80">
                                Open for founders, engineering leads, and research teams who need a systems-focused partner to scope, de-risk, and ship production-grade work.
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <a
                                    href={`mailto:${GENERAL_INFO.email}`}
                                    className="group flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 transition-all hover:border-primary/60 hover:bg-primary/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-2xl bg-white/10 p-3 text-white group-hover:text-primary transition-colors">
                                            <Mail className="size-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Email</p>
                                            <p className="text-lg font-semibold break-all">{GENERAL_INFO.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-white/60">
                                        <span>Share context & timeline</span>
                                        <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </a>
                                <a
                                    href={`tel:${GENERAL_INFO.phone}`}
                                    className="group flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 transition-all hover:border-primary/60 hover:bg-primary/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-2xl bg-white/10 p-3 text-white group-hover:text-primary transition-colors">
                                            <Phone className="size-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Phone</p>
                                            <p className="text-lg font-semibold break-all">{GENERAL_INFO.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-white/60">
                                        <span>Direct engineering contact</span>
                                        <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </a>
                            </div>

                            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Engagement cadence</p>
                                <ul className="space-y-2">
                                    <li>Discovery + scope alignment with success metrics defined.</li>
                                    <li>Architecture review to surface constraints, data realities, and risk.</li>
                                    <li>Focused delivery sprint with documented hand-off.</li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3 border border-white/10 rounded-2xl bg-black/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-white/70">Feel free to reach out for collaborations, opportunities or just to say hello! I promise I'm more fun than my code comments 😄</p>
                                <a
                                    href={'https://www.linkedin.com/in/dhinesh-s-p/'}
                                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    Debug life together👀?
                                    <ArrowUpRight className="size-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground contact-item">
                    <p>
                        &copy; {new Date().getFullYear()} Dhinesh Ponnarasan.
                        All rights reserved.
                    </p>
                    <a
                        href="https://github.com/DhineshPonnarasan/portfolio-2.0"
                        target="_blank"
                        className="hover:text-primary transition-colors"
                    >
                        Built with love, shipped with intent
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
