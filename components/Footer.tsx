'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowUpRight, Mail, Phone, MessageCircle, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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

                <div className="mt-12 space-y-12">
                    {/* Main Content Section */}
                    <div className="flex flex-col border-t border-white/10 pt-12 contact-item">
                        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
                            {/* Left: Introduction */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <MessageCircle className="w-6 h-6 text-primary" />
                                        <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">Professional Contact</p>
                                    </div>
                                    
                                    <h2 className="text-4xl md:text-6xl font-anton leading-tight text-white">
                                        Crafting <span className="text-primary">production-grade systems</span> that scale, 
                                        <span className="text-primary"> shipping ML solutions</span> from research to deployment, 
                                        and <span className="text-primary">building products</span> that solve real problems.
                                    </h2>
                                    
                                    <p className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed">
                                        I specialize in <span className="text-primary font-semibold">end-to-end engineering</span>—from data pipelines to production APIs. 
                                        As a <span className="text-primary font-semibold">Research Publisher</span>, I blend code, visual storytelling, and architecture to turn complex problems into elegant solutions.
                                    </p>
                                    
                                    <p className="text-white/60 text-base max-w-2xl">
                                        Seeking <span className="text-primary font-semibold">meaningful collaborations</span> where technical excellence, 
                                        <span className="text-primary font-semibold"> delivery speed</span>, and <span className="text-primary font-semibold">architectural clarity</span> drive impact.
                                    </p>
                                </div>

                                {/* Capabilities */}
                                <div className="flex flex-wrap gap-3">
                                    {['AI Systems', 'ML Pipelines', 'Scalable APIs', 'Cloud & MLOps', 'Open Source'].map((capability) => (
                                        <span
                                            key={capability}
                                            className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 hover:border-primary/30 hover:text-primary transition-colors cursor-default"
                                        >
                                            {capability}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Contact Cards */}
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-sm text-white/80">
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/50 font-semibold mb-3">Availability</p>
                                    <p>Open for founders, engineering leads, and research teams who need a systems-focused partner to scope, de-risk, and ship production-grade work.</p>
                                </div>

                                <div className="space-y-4">
                                    <motion.a
                                        href={`mailto:${GENERAL_INFO.email}`}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 px-6 py-5 transition-all hover:border-primary/60 hover:bg-primary/5"
                                    >
                                        <div className="p-3 rounded-xl bg-white/10 border border-white/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                                            <Mail className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs uppercase tracking-[0.3em] text-white/50 font-semibold mb-1">Email</p>
                                            <p className="text-base font-semibold text-white break-all">{GENERAL_INFO.email}</p>
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0" />
                                    </motion.a>

                                    <motion.a
                                        href={`tel:${GENERAL_INFO.phone}`}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 px-6 py-5 transition-all hover:border-primary/60 hover:bg-primary/5"
                                    >
                                        <div className="p-3 rounded-xl bg-white/10 border border-white/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                                            <Phone className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs uppercase tracking-[0.3em] text-white/50 font-semibold mb-1">Phone</p>
                                            <p className="text-base font-semibold text-white">{GENERAL_INFO.phone}</p>
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0" />
                                    </motion.a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Engagement Process */}
                    <div className="flex flex-col border-t border-white/10 pt-12 contact-item">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                                        01
                                    </div>
                                    <p className="text-xs uppercase tracking-widest text-white/50 font-semibold">Discovery</p>
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    Scope alignment with success metrics defined and clear expectations set.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                                        02
                                    </div>
                                    <p className="text-xs uppercase tracking-widest text-white/50 font-semibold">Architecture</p>
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    Review to surface constraints, data realities, and potential risks.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                                        03
                                    </div>
                                    <p className="text-xs uppercase tracking-widest text-white/50 font-semibold">Delivery</p>
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    Focused sprint with documented hand-off and knowledge transfer.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="flex flex-col border-t border-white/10 pt-12 contact-item">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-8 rounded-2xl border border-white/10 bg-white/5">
                            <div className="flex-1">
                                <p className="text-white/70 text-base leading-relaxed">
                                    Feel free to reach out for collaborations, opportunities or just to say hello! I promise I&apos;m more fun than my code comments 😄
                                </p>
                            </div>
                            <motion.a
                                href={'https://www.linkedin.com/in/dhinesh-s-p/'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 shrink-0"
                            >
                                <Send className="w-4 h-4" />
                                Debug life together 👀?
                                <ArrowUpRight className="w-4 h-4" />
                            </motion.a>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="border-t border-white/10 pt-8 space-y-4 contact-item">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                            <div className="flex flex-col gap-1">
                                <p className="text-muted-foreground">
                                    &copy; 2025 Dhinesh Ponnarasan
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    All rights reserved
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-right">
                                <a
                                    href="https://github.com/DhineshPonnarasan/portfolio-2.0"
                                    target="_blank"
                                    className="hover:text-primary transition-colors text-sm"
                                >
                                    Built with love, shipped with intent
                                </a>
                                <p className="text-xs text-muted-foreground/70">
                                    Crafted with precision • Designed for impact • Engineered to inspire
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
