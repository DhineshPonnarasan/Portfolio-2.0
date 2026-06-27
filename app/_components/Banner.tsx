'use client';
import ArrowAnimation from '@/components/ArrowAnimation';
import ImportDhinesh from '@/components/import_dhinesh';
import MagneticButton from '@/components/hero/MagneticButton';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { useRef, memo } from 'react';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { LeetcodeIcon, ScholarIcon } from '@/components/icons/CustomIcons';
import { useReducedMotion } from '@/lib/motion-prefs';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SocialIcon = memo(({ name }: { name: string }) => {
    const iconProps = { className: "size-6 sm:size-8 group-hover:scale-110 transition-transform" };
    switch (name.toLowerCase()) {
        case 'github': return <Github {...iconProps} />;
        case 'linkedin': return <Linkedin {...iconProps} />;
        case 'leetcode': return <LeetcodeIcon {...iconProps} />;
        case 'scholar': return <ScholarIcon {...iconProps} />;
        default: return null;
    }
});
SocialIcon.displayName = 'SocialIcon';

const Banner = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shapesRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    useGSAP(
        () => {
            if (reducedMotion) {
                gsap.set('.banner-title, .banner-description, .banner-socials, .banner-cta', {
                    y: 0,
                    opacity: 1,
                });
                return;
            }
            const tl = gsap.timeline();
            tl.fromTo('.banner-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
                .fromTo('.banner-description', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '<0.2')
                .fromTo('.banner-socials', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '<0.2')
                .fromTo('.banner-cta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, '<0.1');
        },
        { scope: containerRef, dependencies: [reducedMotion] },
    );

    useGSAP(
        () => {
            if (reducedMotion || !containerRef.current) return;
            const opts = (end: string, yPercent: number) => ({
                yPercent,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end,
                    scrub: 0.5,
                },
            });
            gsap.to('.banner-title', opts('bottom top', -40));
            gsap.to('.banner-description', opts('bottom top', -60));
            gsap.to('.banner-socials', opts('bottom top', -80));
            if (shapesRef.current) {
                gsap.to(shapesRef.current, opts('bottom top', 30));
            }
        },
        { scope: containerRef, dependencies: [reducedMotion] },
    );

    return (
        <section className="relative overflow-hidden" id="banner">
            <ImportDhinesh />
            <ArrowAnimation />

            <div ref={shapesRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
                <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
            </div>

            <div
                className="container h-[100svh] min-h-[600px] max-md:pb-10 flex justify-center items-center relative z-10"
                ref={containerRef}
            >
                <div className="flex flex-col justify-center items-center text-center w-full max-w-[900px] px-2 sm:px-0">
                    <p className="banner-description mb-4 text-base sm:text-xl md:text-2xl text-muted-foreground font-medium">
                        Hi, I&apos;m{' '}
                        <span className="text-foreground font-bold">
                            Dhinesh Sadhu Subramaniam Ponnarasan
                        </span>
                    </p>

                    <h1 className="banner-title leading-[1.1] text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-anton min-h-[80px] sm:min-h-[120px] md:min-h-[140px] flex items-center justify-center">
                        <span className="text-primary">AI/ML Engineer</span>
                    </h1>

                    <p className="banner-description mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-[700px]">
                        I build intelligent systems, scalable applications, and
                        research-driven solutions across AI/ML, software
                        engineering, and open-source ecosystems.
                    </p>

                    {/* Magnetic CTAs */}
                    <div className="banner-cta mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <MagneticButton
                            href="/#selected-projects"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_rgba(16,185,129,0.35)]"
                            data-cursor="cta"
                        >
                            View Projects
                        </MagneticButton>
                        <MagneticButton
                            href="/#contact"
                            className="border border-white/20 bg-white/[0.04] text-white hover:border-primary/50 hover:text-primary backdrop-blur-md"
                            data-cursor="cta"
                        >
                            Get in Touch
                        </MagneticButton>
                    </div>

                    <div className="banner-socials flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-6 sm:mt-8">
                        {SOCIAL_LINKS.map((link) => {
                            let className = "p-2.5 sm:p-3 rounded-full transition-all duration-300 group ";
                            switch (link.name.toLowerCase()) {
                                case 'github':
                                    className += "bg-black text-white hover:bg-black/80";
                                    break;
                                case 'linkedin':
                                    className += "bg-[#0077b5] text-white hover:bg-[#0077b5]/80";
                                    break;
                                case 'leetcode':
                                    className += "bg-[#ffa116] text-black hover:bg-[#ffa116]/80";
                                    break;
                                case 'scholar':
                                    className += "bg-[#4285f4] text-white hover:bg-[#4285f4]/80";
                                    break;
                                default:
                                    className += "bg-secondary/50 hover:bg-primary hover:text-primary-foreground";
                            }

                            return (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={className}
                                    aria-label={link.name.toLowerCase() === 'leetcode' ? "LeetCode Logo" : link.name}
                                >
                                    <SocialIcon name={link.name} />
                                </a>
                            );
                        })}
                        <a
                            href={`mailto:${GENERAL_INFO.email}`}
                            className="p-2.5 sm:p-3 rounded-full bg-[#ea4335] text-white hover:bg-[#ea4335]/80 transition-all duration-300 group"
                            aria-label="Email"
                        >
                            <Mail className="size-6 sm:size-8 group-hover:scale-110 transition-transform" />
                        </a>
                        <a
                            href={`tel:${GENERAL_INFO.phone}`}
                            className="p-2.5 sm:p-3 rounded-full bg-[#34a853] text-white hover:bg-[#34a853]/80 transition-all duration-300 group"
                            aria-label="Contact"
                        >
                            <Phone className="size-6 sm:size-8 group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;