'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Home, FolderGit2, Cpu, BookOpen } from 'lucide-react';

const QUICK_LINKS = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/projects', label: 'Projects', icon: FolderGit2 },
    { href: '/architecture', label: 'Architecture', icon: Cpu },
    { href: '/blog', label: 'Blog', icon: BookOpen },
];

export default function NotFound() {
    const glichRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        if (!glichRef.current) return;
        
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(glichRef.current, {
            skewX: -10,
            duration: 0.1,
            ease: "power4.inOut"
        })
        .to(glichRef.current, {
            skewX: 10,
            duration: 0.1,
            ease: "power4.inOut"
        })
        .to(glichRef.current, {
            skewX: 0,
            duration: 0.1,
            ease: "power4.inOut"
        })
        .to(glichRef.current, {
            opacity: 0.5,
            duration: 0.05,
            yoyo: true,
            repeat: 3
        }, "+=2");

    }, { scope: glichRef });

    return (
        <main className="h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden text-center px-4">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0" />

            <div className="relative z-10 space-y-6 max-w-lg">
                <div className="text-primary font-mono text-xs tracking-[0.5em] uppercase opacity-70">
                    System Alert: Critical Failure
                </div>
                
                <h1 
                    ref={glichRef}
                    className="text-8xl md:text-9xl font-anton text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 tracking-wide"
                >
                    404
                </h1>
                
                <div className="space-y-2">
                    <p className="text-xl md:text-2xl text-white font-medium">
                        Module Not Found
                    </p>
                    <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                        The requested sector has been corrupted or does not exist in the neural network.
                        <br />
                        Please return to the main terminal.
                    </p>
                </div>

                <div className="pt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center h-12 px-8 rounded-none border border-primary/50 text-primary font-mono text-sm uppercase tracking-widest hover:bg-primary/10 hover:border-primary transition-all duration-300"
                    >
                        [ Reboot System ]
                    </Link>
                </div>

                <nav
                    className="pt-6 flex flex-wrap items-center justify-center gap-2"
                    aria-label="Quick navigation"
                >
                    {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-mono uppercase tracking-widest text-white/70 transition-colors hover:border-primary/40 hover:text-primary"
                        >
                            <Icon size={12} aria-hidden="true" />
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
            
            {/* Decorative Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_-10%,rgba(0,0,0,1)_100%)] z-20" />
        </main>
    );
}
