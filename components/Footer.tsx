'use client';
import SectionTitle from '@/components/SectionTitle';
import { LeetcodeIcon, ScholarIcon } from '@/components/icons/CustomIcons';
import { GENERAL_INFO } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowUpRight, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Footer = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const socialLinks = [
        {
            name: 'Linkedin',
            url: 'https://www.linkedin.com/in/dhinesh-s-p',
            icon: Linkedin,
        },
        {
            name: 'Github',
            url: 'https://github.com/DhineshPonnarasan',
            icon: Github,
        },
        {
            name: 'Leetcode',
            url: 'https://leetcode.com/u/Dhinesh_Ponnarasan/',
            icon: LeetcodeIcon,
        },
        {
            name: 'Scholar',
            url: 'https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=O5o69CgAAAAJ&sortby=pubdate',
            icon: ScholarIcon,
        },
    ];

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

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20">
                    <div className="contact-item">
                        <h2 className="text-4xl md:text-5xl font-anton mb-8 leading-tight">
                            Have a project in mind? <br />
                            <span className="text-primary">
                                Let&apos;s work together.
                            </span>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-md">
                            I&apos;m always open to discussing product design work
                            or partnership opportunities.
                        </p>

                        <div className="flex flex-col gap-6">
                            <a
                                href={`mailto:${GENERAL_INFO.email}`}
                                className="flex items-center gap-4 text-xl font-medium hover:text-primary transition-colors group"
                            >
                                <span className="p-3 rounded-full bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors duration-300">
                                    <Mail className="size-6" />
                                </span>
                                {GENERAL_INFO.email}
                            </a>
                            <a
                                href={`tel:${GENERAL_INFO.phone}`}
                                className="flex items-center gap-4 text-xl font-medium hover:text-primary transition-colors group"
                            >
                                <span className="p-3 rounded-full bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors duration-300">
                                    <Phone className="size-6" />
                                </span>
                                {GENERAL_INFO.phone}
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-item group flex items-center justify-between p-6 bg-zinc-900/50 border border-white/10 rounded-xl hover:border-primary/50 hover:bg-zinc-900 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="p-3 rounded-full bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors duration-300">
                                        <link.icon className="size-6" />
                                    </span>
                                    <span className="text-lg font-medium group-hover:text-primary transition-colors">
                                        {link.name}
                                    </span>
                                </div>
                                <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                            </a>
                        ))}
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
                        Designed & Built by Dhinesh
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
