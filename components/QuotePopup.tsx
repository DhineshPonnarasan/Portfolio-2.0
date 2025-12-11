'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuotePopupProps {
    text: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const QuotePopup = ({ text, isVisible, onClose, duration = 15000 }: QuotePopupProps) => {
    const [progress, setProgress] = useState(0);

    // Split quote and author
    const parts = text.split('–');
    const quoteText = parts[0]?.trim();
    const author = parts[1]?.trim() || 'Unknown';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key={text}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="absolute top-20 left-5 z-[50] max-w-[90vw] w-[350px] pointer-events-auto"
                >
                    {/* Glassmorphism Container */}
                    <div className="relative overflow-hidden rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl">
                        {/* Decorative Gradient Glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

                        {/* Content */}
                        <div className="relative p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-white/5 text-primary">
                                    <Quote size={16} className="fill-current" />
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    className="p-1 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                                    aria-label="Close"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Quote Text */}
                            <div className="space-y-3">
                                <p className="text-lg font-medium text-white leading-relaxed font-serif">
                                    &quot;{quoteText}&quot;
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="h-[1px] w-8 bg-primary/50" />
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                        {author}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: duration / 1000, ease: 'linear' }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>

                    {/* Arrow Pointer */}
                    <div className="absolute -top-2 left-8 w-4 h-4 bg-zinc-900 border-t border-l border-white/10 transform rotate-45" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuotePopup;
