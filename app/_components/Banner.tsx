'use client';
import ArrowAnimation from '@/components/ArrowAnimation';
import ImportDhinesh from '@/components/import_dhinesh';
import MagneticButton from '@/components/hero/MagneticButton';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { useState, useRef, useEffect, memo } from 'react';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { LeetcodeIcon, ScholarIcon } from '@/components/icons/CustomIcons';
import { useReducedMotion } from '@/lib/motion-prefs';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const roles: string[] = [
    'AI/ML Engineer',
    'Applications Developer',
    'Software Developer',
    'Open Source Contributor',
    'Research Publisher',
];

const useTypewriter = (
    words: string[],
    typingSpeed: number = 100,
    deletingSpeed: number = 50,
    pauseTime: number = 2000,
    reducedMotion: boolean = false,
) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);
    const [text, setText] = useState('');

    useEffect(() => {
        if (reducedMotion && words.length > 0) {
            setText(words[0]);
        }
    }, [reducedMotion, words]);

    useEffect(() => {
        if (reducedMotion) return;
        const timeout2 = setTimeout(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearTimeout(timeout2);
    }, [blink, reducedMotion]);

    useEffect(() => {
        if (reducedMotion) return;
        if (index >= words.length) {
            setIndex(0);
            return;
        }

        if (
            subIndex === words[index].length + 1 &&
            !reverse
        ) {
            setReverse(true);
            return;
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(
            () => {
                setSubIndex((prev) => prev + (reverse ? -1 : 1));
            },
            Math.max(
                reverse ? deletingSpeed : typingSpeed,
                subIndex === words[index].length ? pauseTime : 0,
            ),
        );

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words, typingSpeed, deletingSpeed, pauseTime, reducedMotion]);

    useEffect(() => {
        if (reducedMotion) return;
        setText(words[index].substring(0, subIndex));
    }, [subIndex, index, words, reducedMotion]);

    return text;
};

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

const TERMINAL_INTRO_KEY = 'banner:terminal-intro-shown';
const TERMINAL_LINES = [
    '> boot portfolio --interactive',
    '> loading modules: ml.engine, fs.api, web.runtime …',
    '> ready.',
];

const TerminalIntro = ({ onDone }: { onDone: () => void }) => {
    const [visibleLines, setVisibleLines] = useState<string[]>([]);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (reducedMotion) {
            setVisibleLines(TERMINAL_LINES);
            const t = setTimeout(onDone, 600);
            return () => clearTimeout(t);
        }
        let cancelled = false;
        (async () => {
            for (const line of TERMINAL_LINES) {
                if (cancelled) return;
                setVisibleLines((prev) => [...prev, line]);
                // eslint-disable-next-line no-await-in-loop
                await new Promise((r) => setTimeout(r, 350));
            }
            if (!cancelled) {
                setTimeout(() => {
                    if (!cancelled) onDone();
                }, 400);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [onDone, reducedMotion]);

    return (
        <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/85 backdrop-blur-sm font-mono text-xs sm:text-sm text-primary/90"
        >
            <div className="space-y-1">
                {visibleLines.map((line, i) => (
                    <div key={i} className="opacity-90">
                        {line}
                        {i === visibleLines.length - 1 && <span className="animate-pulse">_</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Banner = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shapesRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const text = useTypewriter(roles, 100, 50, 2000, reducedMotion);
    const [showTerminal, setShowTerminal] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const seen = window.sessionStorage.getItem(TERMINAL_INTRO_KEY);
            if (!seen) {
                window.sessionStorage.setItem(TERMINAL_INTRO_KEY, '1');
                setShowTerminal(true);
            }
        } catch {
            // Session storage unavailable — just skip the intro.
        }
    }, []);

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
            tl.fromTo(
                '.banner-title',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
            )
                .fromTo(
                    '.banner-description',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
                    '<0.2',
                )
                .fromTo(
                    '.banner-socials',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
                    '<0.2',
                )
                .fromTo(
                    '.banner-cta',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08 },
                    '<0.1',
                );
        },
        { scope: containerRef, dependencies: [reducedMotion] },
    );

    // Scroll-driven parallax: typewriter + background shapes drift up while
    // the user scrolls past the hero. Honours reduced motion.
    useGSAP(
        () => {
            if (reducedMotion || !containerRef.current) return;

            gsap.to('.banner-title', {
                yPercent: -40,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.5,
                },
            });
            gsap.to('.banner-description', {
                yPercent: -60,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.5,
                },
            });
            gsap.to('.banner-socials', {
                yPercent: -80,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.5,
                },
            });
            if (shapesRef.current) {
                gsap.to(shapesRef.current, {
                    yPercent: 30,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.5,
                    },
                });
            }
        },
        { scope: containerRef, dependencies: [reducedMotion] },
    );

    // Split the typewriter text into per-glyph spans for a kinetic, premium
    // entrance feel. Reduced motion keeps it as a single span.
    const glyphs = reducedMotion ? null : Array.from(text);

    return (
        <section className="relative overflow-hidden" id="banner">
            <ImportDhinesh />
            <ArrowAnimation />

            {/* Background gradient mesh + parallax shapes */}
            <div
                aria-hidden="true"
                className="hero-gradient-mesh pointer-events-none absolute inset-0 -z-10 opacity-80"
                ref={(node) => {
                    if (node) {
                        // Scrub background-position on scroll via GSAP so the
                        // hero feels alive but stays on the GPU.
                        gsap.to(node, {
                            backgroundPosition: '100% 100%',
                            ease: 'none',
                            scrollTrigger: {
                                trigger: node,
                                start: 'top top',
                                end: 'bottom top',
                                scrub: 0.6,
                            },
                        });
                    }
                }}
            />
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
                        <span className="text-primary inline-flex">
                            {glyphs ? (
                                <span aria-label={text} className="inline-flex">
                                    {glyphs.map((g, i) => (
                                        <span
                                            key={`${g}-${i}`}
                                            aria-hidden="true"
                                            className="inline-block"
                                            style={{
                                                animation: `glyphRise 0.45s ${i * 18}ms both`,
                                            }}
                                        >
                                            {g === ' ' ? '\u00A0' : g}
                                        </span>
                                    ))}
                                    <span
                                        className="animate-pulse font-sans font-thin ml-1"
                                        style={{ color: '#00FF66' }}
                                    >
                                        |
                                    </span>
                                </span>
                            ) : (
                                <>
                                    {text}
                                    <span
                                        className="animate-pulse font-sans font-thin ml-1"
                                        style={{ color: '#00FF66' }}
                                    >
                                        |
                                    </span>
                                </>
                            )}
                        </span>
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

            {/* One-shot terminal intro overlay, persisted in sessionStorage. */}
            {showTerminal && <TerminalIntro onDone={() => setShowTerminal(false)} />}

            <style>{`
                @keyframes glyphRise {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (prefers-reduced-motion: reduce) {
                    [style*="glyphRise"] { animation: none !important; opacity: 1 !important; transform: none !important; }
                }
            `}</style>
        </section>
    );
};

export default Banner;
