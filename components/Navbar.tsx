'use client';
import { cn } from '@/lib/utils';
import { useEffect, useState, type CSSProperties } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MusicPlayer from './MusicPlayer';

const MENU_LINKS = [
    {
        name: 'Home',
        url: '/',
        color: 'bg-yellow-500 text-black',
    },
    {
        name: 'About Me',
        url: '/#about-me',
        color: 'bg-blue-500 text-white',
    },
    {
        name: 'Education',
        url: '/#education',
        color: 'bg-teal-500 text-black',
    },
    {
        name: 'Experience',
        url: '/#experience',
        color: 'bg-indigo-500 text-white',
    },
    {
        name: 'Projects',
        url: '/#selected-projects',
        color: 'bg-red-500 text-white',
    },
    {
        name: 'Skills',
        url: '/#my-stack',
        color: 'bg-purple-500 text-white',
    },
    {
        name: 'Open Source Contributions',
        url: '/#open-source',
        color: 'bg-pink-500 text-white',
    },
    {
        name: 'Publications',
        url: '/#publications',
        color: 'bg-orange-500 text-white',
    },
    {
        name: 'Architecture',
        url: '/architecture',
        color: 'bg-emerald-400 text-black',
    },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
        return () => document.body.classList.remove('menu-open');
    }, [isMenuOpen]);

    return (
        <>
            <div className="sticky top-0 z-[4] flex items-center justify-between px-5 md:px-10 pt-5 gap-4">
                {/* Back Button */}
                {pathname !== '/' ? (
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    >
                        <div className="flex size-10 items-center justify-center rounded-full bg-black/10 backdrop-blur-sm border border-white/5 transition-all group-hover:bg-white/10">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="hidden md:inline-block font-mono text-xs uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            Back
                        </span>
                    </button>
                ) : (
                    <div /> /* Spacer to keep menu on right if justify-between is used, or just use ml-auto on menu */
                )}

                <div className="flex items-center gap-4">
                    {/* Music Player - Home Only */}
                    {pathname === '/' && <MusicPlayer />}

                    {/* Menu Button */}
                    <button
                        className={cn(
                            'group size-12 relative z-[2]',
                        )}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span
                            className={cn(
                                'inline-block w-3/5 h-0.5 bg-foreground rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 duration-300 -translate-y-[5px] ',
                                {
                                    'rotate-45 -translate-y-1/2': isMenuOpen,
                                    'md:group-hover:rotate-12': !isMenuOpen,
                                },
                            )}
                        ></span>
                        <span
                            className={cn(
                                'inline-block w-3/5 h-0.5 bg-foreground rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 duration-300 translate-y-[5px] ',
                                {
                                    '-rotate-45 -translate-y-1/2': isMenuOpen,
                                    'md:group-hover:-rotate-12': !isMenuOpen,
                                },
                            )}
                        ></span>
                    </button>
                </div>
            </div>

            <div
                className={cn(
                    'overlay fixed inset-0 z-[2] bg-black/70 transition-all duration-150',
                    {
                        'opacity-0 invisible pointer-events-none': !isMenuOpen,
                    },
                )}
                onClick={() => setIsMenuOpen(false)}
            ></div>

            <div
                className={cn(
                    'menu-panel fixed top-0 right-0 h-[100dvh] w-full md:w-[600px] transform translate-x-full transition-transform duration-700 z-[3]',
                    'flex flex-col bg-black/95 backdrop-blur-2xl border-l border-white/10',
                    { 'translate-x-0': isMenuOpen },
                )}
            >
                <div className="flex-1 flex flex-col justify-center px-8 md:px-16 overflow-y-auto">
                    <nav className="py-20">
                        <ul className="space-y-1">
                            {MENU_LINKS.map((link, idx) => (
                                <li key={link.name} className="group/item">
                                    <Link
                                        href={link.url}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="relative w-full text-left flex items-baseline gap-6 py-2"
                                    >
                                        <span className="text-sm font-mono text-white/30 group-hover/item:text-primary transition-colors duration-300">
                                            {(idx + 1).toString().padStart(2, '0')}
                                        </span>
                                        
                                        <div className="relative overflow-hidden">
                                            <span 
                                                className={cn(
                                                    "block text-3xl md:text-5xl font-anton uppercase text-white/90 transition-transform duration-500 will-change-transform",
                                                    "group-hover/item:-translate-y-full"
                                                )}
                                            >
                                                {link.name}
                                            </span>
                                            <span 
                                                className={cn(
                                                    "absolute top-full left-0 block text-3xl md:text-5xl font-anton uppercase text-primary transition-transform duration-500 will-change-transform",
                                                    "group-hover/item:-translate-y-full"
                                                )}
                                            >
                                                {link.name}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="p-8 md:p-16 border-t border-white/10 bg-white/[0.02]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-6">Socials</h4>
                            <ul className="grid grid-cols-2 gap-4">
                                {SOCIAL_LINKS && SOCIAL_LINKS.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-white/60 hover:text-white transition-colors hover:underline decoration-primary/50 underline-offset-4"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                             <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-6">Contact</h4>
                             <div className="space-y-4">
                                <a href={`mailto:${GENERAL_INFO.email}`} className="block text-xl md:text-2xl font-anton text-white hover:text-primary transition-colors">
                                    Send an Email
                                </a>
                                <p className="text-sm text-white/60">{GENERAL_INFO.phone}</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
