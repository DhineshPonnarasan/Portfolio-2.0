'use client';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MusicPlayer from './MusicPlayer';
import { useActiveSection } from '@/hooks/useActiveSection';

const MENU_LINKS = [
    {
        name: 'Home',
        url: '/',
        color: 'bg-yellow-500 text-black',
        sectionId: 'banner',
    },
    {
        name: 'About Me',
        url: '/#about-me',
        color: 'bg-blue-500 text-white',
        sectionId: 'about-me',
    },
    {
        name: 'Education',
        url: '/#education',
        color: 'bg-teal-500 text-black',
        sectionId: 'education',
    },
    {
        name: 'Experience',
        url: '/#experience',
        color: 'bg-indigo-500 text-white',
        sectionId: 'experience',
    },
    {
        name: 'Projects',
        url: '/#selected-projects',
        color: 'bg-red-500 text-white',
        sectionId: 'selected-projects',
    },
    {
        name: 'Skills',
        url: '/#my-stack',
        color: 'bg-purple-500 text-white',
        sectionId: 'my-stack',
    },
    {
        name: 'Open Source',
        url: '/#open-source',
        color: 'bg-pink-500 text-white',
        sectionId: 'open-source',
    },
    {
        name: 'Publications',
        url: '/#publications',
        color: 'bg-orange-500 text-white',
        sectionId: 'publications',
    },
    {
        name: 'Architecture',
        url: '/architecture',
        color: 'bg-emerald-400 text-black',
        sectionId: null,
    },
];

const SECTION_IDS = MENU_LINKS.map((l) => l.sectionId).filter(
    (id): id is string => id !== null,
);

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const activeSection = useActiveSection(SECTION_IDS);
    const prefetchedRef = useRef<Set<string>>(new Set());

    const smartPrefetch = useCallback((href: string) => {
        if (typeof router === 'undefined') return;
        if (prefetchedRef.current.has(href)) return;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        prefetchedRef.current.add(href);
        try {
            router.prefetch(href);
        } catch {
            // Ignore — Next.js throws on invalid routes; not worth crashing UI.
        }
    }, [router]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
        return () => document.body.classList.remove('menu-open');
    }, [isMenuOpen]);

    // Track scroll to apply a subtle shrink + stronger background to the
    // navbar once the user has scrolled past the fold.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const onScroll = () => setIsScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <div
                className={cn(
                    'sticky top-0 z-[4] flex items-center justify-between gap-4 transition-all duration-300',
                    isScrolled ? 'px-3 md:px-6 pt-3' : 'px-5 md:px-10 pt-5',
                )}
            >
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
                    <div />
                )}

                <div className="flex items-center gap-4">
                    {/* Music Player - Home Only */}
                    {pathname === '/' && <MusicPlayer />}

                    {/* Menu Button */}
                    <button
                        className={cn(
                            'group size-12 relative z-[2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full',
                        )}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={isMenuOpen}
                        aria-controls="primary-navigation"
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

            {/* Active section indicator — visible on the home page only */}
            {pathname === '/' && activeSection && !isMenuOpen && (
                <div
                    className={cn(
                        'fixed top-3 left-1/2 -translate-x-1/2 z-[3] pointer-events-none transition-all duration-500',
                        isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
                    )}
                    aria-hidden="true"
                >
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-[10px] font-mono uppercase tracking-[0.3em] text-white/70">
                        {MENU_LINKS.find((l) => l.sectionId === activeSection)?.name ?? activeSection}
                    </span>
                </div>
            )}

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
                id="primary-navigation"
                className={cn(
                    'menu-panel fixed top-0 right-0 h-[100dvh] w-full md:w-[600px] transform translate-x-full transition-transform duration-700 z-[3]',
                    'flex flex-col bg-black/95 backdrop-blur-2xl border-l border-white/10',
                    { 'translate-x-0': isMenuOpen },
                )}
                role="dialog"
                aria-modal="true"
                aria-label="Primary navigation"
            >
                <div className="flex-1 flex flex-col justify-center px-8 md:px-16 overflow-y-auto">
                    <nav className="py-20">
                        <ul className="space-y-1">
                            {MENU_LINKS.map((link, idx) => {
                                const isActive =
                                    pathname === '/' && link.sectionId === activeSection;
                                return (
                                    <li key={link.name} className="group/item">
                                        <Link
                                            href={link.url}
                                            onClick={() => setIsMenuOpen(false)}
                                            onMouseEnter={() => smartPrefetch(link.url)}
                                            onFocus={() => smartPrefetch(link.url)}
                                            className={cn(
                                                'relative w-full text-left flex items-baseline gap-6 py-2 outline-none',
                                                isActive && 'is-active-nav',
                                            )}
                                            aria-current={isActive ? 'true' : undefined}
                                        >
                                            <span className="text-sm font-mono text-white/30 group-hover/item:text-primary transition-colors duration-300">
                                                {(idx + 1).toString().padStart(2, '0')}
                                            </span>

                                            <div className="relative overflow-hidden">
                                                <span
                                                    className={cn(
                                                        'block text-3xl md:text-5xl font-anton uppercase transition-transform duration-500 will-change-transform',
                                                        isActive
                                                            ? 'text-primary'
                                                            : 'text-white/90 group-hover/item:text-primary',
                                                        'group-hover/item:-translate-y-full',
                                                    )}
                                                >
                                                    {link.name}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'absolute top-full left-0 block text-3xl md:text-5xl font-anton uppercase transition-transform duration-500 will-change-transform',
                                                        'text-primary group-hover/item:-translate-y-full',
                                                    )}
                                                >
                                                    {link.name}
                                                </span>
                                            </div>

                                            {/* Active underline */}
                                            {isActive && (
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute left-0 right-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                                                />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
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
                                <a
                                    href={`mailto:${GENERAL_INFO.email}`}
                                    className="block text-xl md:text-2xl font-anton text-white hover:text-primary transition-colors"
                                >
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
