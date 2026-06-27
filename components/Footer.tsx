'use client';

import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import {
    ArrowUpRight,
    Mail,
    Phone,
    MessageCircle,
    Send,
    Calendar,
    Download,
    Github,
    Linkedin,
} from 'lucide-react';
import { motion } from 'framer-motion';

import SectionTitle from '@/components/SectionTitle';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import ContactForm from '@/app/_components/ContactForm';
import { toast } from '@/lib/toast';
import MagneticButton from '@/components/hero/MagneticButton';
import { LeetcodeIcon, ScholarIcon } from '@/components/icons/CustomIcons';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const RESUME_COUNTER_KEY = 'resume:download-count';

// Build-time stamp for the "Last deployed" line. Falls back to today's date
// at build time so the footer never renders a blank.
const LAST_DEPLOYED_ISO =
    process.env.NEXT_PUBLIC_LAST_DEPLOYED ?? new Date().toISOString();
const LAST_DEPLOYED_LABEL = new Date(LAST_DEPLOYED_ISO).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
});

const SocialIcon = ({ name }: { name: string }) => {
    switch (name.toLowerCase()) {
        case 'github':
            return <Github size={14} aria-hidden="true" />;
        case 'linkedin':
            return <Linkedin size={14} aria-hidden="true" />;
        case 'leetcode':
            return <LeetcodeIcon size={14} aria-hidden="true" />;
        case 'scholar':
            return <ScholarIcon size={14} aria-hidden="true" />;
        case 'email':
            return <Mail size={14} aria-hidden="true" />;
        default:
            return <ArrowUpRight size={14} aria-hidden="true" />;
    }
};

const Footer = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;
    const [downloadCount, setDownloadCount] = useState<number | null>(null);

    // Privacy-respecting, client-side counter — never makes a network call.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = window.localStorage.getItem(RESUME_COUNTER_KEY);
            const parsed = raw ? Number.parseInt(raw, 10) : 0;
            setDownloadCount(Number.isFinite(parsed) ? parsed : 0);
        } catch {
            setDownloadCount(0);
        }
    }, []);

    const handleResumeDownload = () => {
        // Bump the counter first so even a download that fails to start is
        // counted as user intent (best-effort, privacy-respecting).
        try {
            const next = (downloadCount ?? 0) + 1;
            window.localStorage.setItem(RESUME_COUNTER_KEY, String(next));
            setDownloadCount(next);
        } catch {
            /* ignore */
        }
        window.open('/api/resume-download', '_blank', 'noopener,noreferrer');
        toast({ title: 'Resume download started', variant: 'success' });
    };

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
                        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12">
                            {/* Left: Introduction */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <MessageCircle className="w-6 h-6 text-primary" />
                                        <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">
                                            Professional Contact
                                        </p>
                                    </div>

                                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-anton leading-tight text-white">
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

                                {/* Resume + Calendly CTAs (env-gated) */}
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={handleResumeDownload}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white hover:border-primary/50 hover:text-primary transition-colors"
                                    >
                                        <Download size={14} aria-hidden="true" />
                                        Resume
                                        {downloadCount !== null && downloadCount > 0 && (
                                            <span className="ml-1 text-[10px] font-mono uppercase tracking-widest text-white/40">
                                                ({downloadCount})
                                            </span>
                                        )}
                                    </button>
                                    {calendlyUrl ? (
                                        <MagneticButton
                                            href={calendlyUrl}
                                            className="border border-primary/50 bg-primary/10 text-primary hover:border-primary hover:bg-primary/20"
                                        >
                                            <Calendar size={14} aria-hidden="true" />
                                            Schedule a call
                                        </MagneticButton>
                                    ) : null}
                                </div>
                            </div>

                            {/* Right: Contact Cards */}
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-sm text-white/80">
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/50 font-semibold mb-3">Availability</p>
                                    <p>Open to collaborating with founders, engineers, researchers or just having a thoughtful technical conversation. Sometimes it’s about building systems. Sometimes it’s just about sharing ideas.</p>
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

                    {/* Contact Form */}
                    <div className="flex flex-col border-t border-white/10 pt-12 contact-item">
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-[0.45em] text-white/40">Send a Message</p>
                            <h3 className="mt-2 text-2xl md:text-3xl font-anton">Drop a line — get a response in 24 hours.</h3>
                        </div>
                        <ContactForm />
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-5 sm:p-8 rounded-2xl border border-white/10 bg-white/5">
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

                    {/* Site Map + Social Row + Build Stamp */}
                    <div className="border-t border-white/10 pt-8 contact-item">
                        <div className="grid gap-8 md:grid-cols-3">
                            <nav aria-label="Footer site map" className="space-y-3">
                                <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/40">
                                    Site
                                </p>
                                <ul className="space-y-1.5 text-sm">
                                    {[
                                        { href: '/', label: 'Home' },
                                        { href: '/#selected-projects', label: 'Projects' },
                                        { href: '/#open-source', label: 'Open Source' },
                                        { href: '/architecture', label: 'Architecture' },
                                        { href: '/blog', label: 'Blog' },
                                        { href: '/uses', label: 'Uses' },
                                    ].map((link) => (
                                        <li key={link.href}>
                                            <a
                                                href={link.href}
                                                className="text-white/70 transition-colors hover:text-primary"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            <div className="space-y-3">
                                <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/40">
                                    Socials
                                </p>
                                <ul className="flex flex-wrap gap-2">
                                    {[
                                        ...SOCIAL_LINKS,
                                        { name: 'email', url: `mailto:${GENERAL_INFO.email}` },
                                    ].map((link) => (
                                        <li key={link.name}>
                                            <a
                                                href={link.url}
                                                target={link.url.startsWith('http') ? '_blank' : undefined}
                                                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                aria-label={link.name}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 transition-colors hover:border-primary/50 hover:text-primary"
                                            >
                                                <SocialIcon name={link.name} />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-xs text-white/50">
                                    Resume + 30-min call CTAs are just above this footer.
                                </p>
                            </div>

                            <div className="space-y-2 text-xs text-white/50 md:text-right">
                                <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/40">
                                    Build
                                </p>
                                <p>
                                    Built with{' '}
                                    <span className="text-white/80">Next.js</span> +{' '}
                                    <span aria-label="love" role="img">
                                        ❤️
                                    </span>
                                    , typed in TypeScript, themed in dark mode.
                                </p>
                                <p>
                                    Last deployed:{' '}
                                    <time
                                        dateTime={LAST_DEPLOYED_ISO}
                                        className="font-mono text-white/70"
                                    >
                                        {LAST_DEPLOYED_LABEL}
                                    </time>
                                </p>
                                <p>
                                    Source on{' '}
                                    <a
                                        href="https://github.com/DhineshPonnarasan/portfolio-2.0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        GitHub
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-white/50 contact-item">
                        <p>
                            &copy; {new Date().getFullYear()} Dhinesh Ponnarasan. All rights reserved.
                        </p>
                        <p>Crafted with precision · Designed for impact · Engineered to inspire.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
