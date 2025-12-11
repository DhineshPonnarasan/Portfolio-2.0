'use client';
import ArrowAnimation from '@/components/ArrowAnimation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { useState, useRef, useEffect } from 'react';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { LeetcodeIcon, ScholarIcon } from '@/components/icons/CustomIcons';

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
) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);
    const [text, setText] = useState('');

    // Blinking cursor effect
    useEffect(() => {
        const timeout2 = setTimeout(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearTimeout(timeout2);
    }, [blink]);

    useEffect(() => {
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
    }, [subIndex, index, reverse, words, typingSpeed, deletingSpeed, pauseTime]);

    useEffect(() => {
        setText(words[index].substring(0, subIndex));
    }, [subIndex, index, words]);

    return text;
};

const SocialIcon = ({ name }: { name: string }) => {
    const iconProps = { className: "size-8 group-hover:scale-110 transition-transform" };
    switch (name.toLowerCase()) {
        case 'github': return <Github {...iconProps} />;
        case 'linkedin': return <Linkedin {...iconProps} />;
        case 'leetcode': return <LeetcodeIcon {...iconProps} />;
        case 'scholar': return <ScholarIcon {...iconProps} />;
        default: return null;
    }
};

const Banner = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const text = useTypewriter(roles, 100, 50, 2000);

    useGSAP(
        () => {
            gsap.fromTo(
                '.banner-title',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
            );

            gsap.fromTo(
                '.banner-description',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    delay: 0.5,
                    ease: 'power3.out',
                },
            );

            gsap.fromTo(
                '.banner-socials',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    delay: 0.8,
                    ease: 'power3.out',
                },
            );
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.5,
                },
            });

            tl.to('.banner-title', { y: -100, opacity: 0 });
            tl.to('.banner-description', { y: -150, opacity: 0 }, '<0.1');
            tl.to('.banner-socials', { y: -200, opacity: 0 }, '<0.1');
        },
        { scope: containerRef },
    );

    return (
        <section className="relative overflow-hidden" id="banner">
            <ArrowAnimation />
            <div
                className="container h-[100svh] min-h-[600px] max-md:pb-10 flex justify-center items-center"
                ref={containerRef}
            >
                <div className="flex flex-col justify-center items-center text-center max-w-[900px]">
                    <p className="banner-description mb-4 text-xl sm:text-2xl text-muted-foreground font-medium">
                        Hi, I&apos;m{' '}
                        <span className="text-foreground font-bold">
                            Dhinesh Sadhu Subramaniam Ponnarasan
                        </span>
                    </p>

                    <h1 className="banner-title leading-[1.1] text-4xl sm:text-7xl font-anton min-h-[100px] sm:min-h-[140px] flex items-center justify-center">
                        <span className="text-primary">
                            {text}
                            <span 
                                className="animate-pulse font-sans font-thin ml-1"
                                style={{ color: '#00FF66' }}
                            >
                                |
                            </span>
                        </span>
                    </h1>
                    
                    <p className="banner-description mt-4 text-lg text-muted-foreground max-w-[700px]">
                        I build intelligent systems, scalable applications, and
                        research-driven solutions across AI/ML, software
                        engineering, and open-source ecosystems.
                    </p>

                    <div className="banner-socials flex flex-wrap items-center justify-center gap-6 mt-8">
                        {SOCIAL_LINKS.map((link) => {
                            let className = "p-3 rounded-full transition-all duration-300 group ";
                            switch(link.name.toLowerCase()) {
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
                             className="p-3 rounded-full bg-[#ea4335] text-white hover:bg-[#ea4335]/80 transition-all duration-300 group"
                             aria-label="Email"
                        >
                            <Mail className="size-8 group-hover:scale-110 transition-transform" />
                        </a>
                        <a
                             href={`tel:${GENERAL_INFO.phone}`}
                             className="p-3 rounded-full bg-[#34a853] text-white hover:bg-[#34a853]/80 transition-all duration-300 group"
                             aria-label="Contact"
                        >
                            <Phone className="size-8 group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
