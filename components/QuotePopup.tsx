"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

interface QuotePopupProps {
    isOpen: boolean;
    quote: { text: string; author: string } | null;
    onClose: () => void;
    animationKey: number;
    duration?: number;
    className?: string;
}

const QuotePopup: React.FC<QuotePopupProps> = ({
    isOpen,
    quote,
    onClose,
    animationKey,
    duration = 8000,
    className = '',
}) => {
    const containerClasses = [
        'absolute left-0 top-full mt-4 w-[min(320px,calc(100vw-3rem))] sm:w-[360px] pointer-events-auto',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <AnimatePresence>
                {isOpen && quote && (
                    <motion.div
                        key={animationKey}
                        initial={{ opacity: 0, y: -12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className={containerClasses}
                    >
                        <div className="group/popup relative overflow-hidden rounded-3xl border border-white/10 bg-[#050c07]/85 backdrop-blur-2xl shadow-[0_25px_65px_rgba(0,0,0,0.55)] p-6 pr-7 text-left">
                            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-primary/30 opacity-0 transition duration-500 group-hover/popup:opacity-100" />
                            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 via-transparent to-white/5 opacity-60" />
                            <div
                                className="pointer-events-none absolute inset-0 opacity-15"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(115deg, rgba(50,255,88,0.15) 0%, transparent 55%), radial-gradient(circle at top, rgba(255,255,255,0.2), transparent 45%)',
                                }}
                            />
                            <div
                                className="pointer-events-none absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                                    backgroundSize: '18px 18px',
                                    maskImage: 'radial-gradient(circle at top, black 60%, transparent 100%)',
                                }}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/popup:opacity-100" />
                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_60%)] opacity-20 animate-[scanline_6s_linear_infinite]" />

                            <button
                                aria-label="Close quote popup"
                                onClick={onClose}
                                className="absolute right-3 top-3 text-white/60 hover:text-white transition-colors"
                            >
                                <X className="size-4" strokeWidth={2} />
                            </button>

                            <div className="relative mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.45em] text-white/55">
                                <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_var(--primary)]" />
                                motivation for today
                            </div>

                            <div className="flex items-start gap-4 pr-6">
                                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#102315] text-primary text-2xl font-black">
                                    “
                                    <span className="absolute inset-0 rounded-2xl border border-primary/40" />
                                </div>
                                <p className="text-lg sm:text-xl text-white leading-relaxed font-semibold">
                                    {quote.text}
                                </p>
                            </div>

                            <p className="mt-6 text-xs tracking-[0.45em] uppercase text-primary font-semibold">
                                {quote.author}
                            </p>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                                <div
                                    key={`progress-${animationKey}`}
                                    className="h-full bg-gradient-to-r from-white via-primary to-primary shadow-[0_0_25px_rgba(50,255,88,0.6)]"
                                    style={{ animation: `quoteProgress ${duration}ms linear forwards` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <style jsx global>{`
                @keyframes quoteProgress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }

                @keyframes scanline {
                    0% {
                        transform: translateY(-100%);
                    }
                    100% {
                        transform: translateY(100%);
                    }
                }
            `}</style>
        </>
    );
};

export default QuotePopup;
