'use client';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { MoveUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import Link from 'next/link';
import QuotePopup from './QuotePopup';

const TECH_QUOTES = [
    "Code is like humor. When you have to explain it, it’s bad. – Cory House",
    "First, solve the problem. Then, write the code. – John Johnson",
    "Simplicity is the soul of efficiency. – Austin Freeman",
    "Make it work, make it right, make it fast. – Kent Beck",
    "Clean code always looks like it was written by someone who cares. – Robert C. Martin",
    "The only way to do great work is to love what you do. – Steve Jobs",
    "It’s not a bug; it’s an undocumented feature.",
    "Talk is cheap. Show me the code. – Linus Torvalds",
    "Programs must be written for people to read, and only incidentally for machines to execute. – Harold Abelson",
    "Truth can only be found in one place: the code. – Robert C. Martin"
];

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
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [quote, setQuote] = useState<{ text: string; visible: boolean }>({ text: '', visible: false });
    const quoteTimer = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    const handleLogoClick = (e: React.MouseEvent) => {
        // We don't prevent default so navigation still happens if needed, 
        // but since it's likely already on home or just refreshing, it's fine.
        // If user is already at '/', next/link prevents full reload which is good.
        
        const randomQuote = TECH_QUOTES[Math.floor(Math.random() * TECH_QUOTES.length)];
        setQuote({ text: randomQuote, visible: true });
        
        if (quoteTimer.current) clearTimeout(quoteTimer.current);
        
        quoteTimer.current = setTimeout(() => {
            setQuote(prev => ({ ...prev, visible: false }));
        }, 15000);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (quoteTimer.current) clearTimeout(quoteTimer.current);
        };
    }, []);

    return (
        <>
            <div className="sticky top-0 z-[4]">
                <Link
                    href="/"
                    onClick={handleLogoClick}
                    className="absolute top-5 left-5 z-[5] font-anton text-2xl tracking-wider mix-blend-difference text-white hover:text-primary transition-colors"
                >
                    ~/import_dhinesh 
                </Link>

                <QuotePopup 
                    text={quote.text} 
                    isVisible={quote.visible} 
                    onClose={() => {
                        setQuote(prev => ({ ...prev, visible: false }));
                        if (quoteTimer.current) clearTimeout(quoteTimer.current);
                    }}
                />

                <button
                    className={cn(
                        'group size-12 absolute top-5 right-5 md:right-10 z-[2]',
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
                    'fixed top-0 right-0 h-[100dvh] w-[500px] max-w-[calc(100vw-3rem)] transform translate-x-full transition-transform duration-700 z-[3] overflow-hidden gap-y-14',
                    'flex flex-col lg:justify-center py-10',
                    { 'translate-x-0': isMenuOpen },
                )}
            >
                <div
                    className={cn(
                        'fixed inset-0 scale-150 translate-x-1/2 rounded-[50%] bg-zinc-900/95 backdrop-blur-sm duration-700 delay-150 z-[-1]',
                        {
                            'translate-x-0': isMenuOpen,
                        },
                    )}
                ></div>

                <div className="grow flex md:items-center w-full max-w-[300px] mx-8 sm:mx-auto">
                    <div className="flex gap-10 lg:justify-between max-lg:flex-col w-full">
                        <div className="max-lg:order-2">
                            <p className="text-muted-foreground mb-5 md:mb-8">
                                SOCIAL
                            </p>
                            <ul className="space-y-3">
                                {SOCIAL_LINKS && SOCIAL_LINKS.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-lg capitalize hover:underline"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="">
                            <p className="text-muted-foreground mb-5 md:mb-8">
                                MENU
                            </p>
                            <ul className="space-y-3">
                                {MENU_LINKS.map((link) => (
                                    <li key={link.name}>
                                        <button
                                            onClick={() => {
                                                router.push(link.url);
                                                setIsMenuOpen(false);
                                            }}
                                            className="group text-xl flex items-center gap-3"
                                        >
                                            <span
                                                className={cn(
                                                    'size-3.5 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-[200%] transition-all',
                                                    link.color,
                                                )}
                                            >
                                                <MoveUpRight
                                                    size={8}
                                                    className="scale-0 group-hover:scale-100 transition-all"
                                                />
                                            </span>
                                            {link.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-[300px] mx-8 sm:mx-auto">
                    <p className="text-muted-foreground mb-4">GET IN TOUCH</p>
                    <a href={`mailto:${GENERAL_INFO.email}`} className="block hover:text-white transition-colors mb-2">
                        {GENERAL_INFO.email}
                    </a>
                    <a href={`tel:${GENERAL_INFO.phone}`} className="block hover:text-white transition-colors">
                        {GENERAL_INFO.phone}
                    </a>
                </div>
            </div>
        </>
    );
};

export default Navbar;
