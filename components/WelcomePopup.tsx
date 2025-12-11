'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PopupTheme = 'professional' | 'modern' | 'vibrant';
export type PopupPosition = 'center' | 'bottom-right' | 'top';

interface WelcomePopupProps {
    /** The message text to display */
    message: string;
    /** Controls visibility of the popup */
    isVisible: boolean;
    /** Callback when popup requests to close (timeout or manual) */
    onClose: () => void;
    /** Duration in milliseconds before auto-close. Default: 8000ms */
    duration?: number;
    /** Visual theme variant. Default: 'modern' */
    theme?: PopupTheme;
    /** Screen positioning. Default: 'bottom-right' */
    position?: PopupPosition;
}

/**
 * WelcomePopup Component
 * 
 * Displays a timed notification message with a progress bar and multiple theme options.
 * 
 * Themes:
 * - Professional: Blue gradient, clean look
 * - Modern: Dark background, neon accent border
 * - Vibrant: Purple/Orange gradient
 * 
 * Positions:
 * - Center: Modal style
 * - Bottom-Right: Floating near chat widget
 * - Top: Banner style
 */
const WelcomePopup = ({
    message,
    isVisible,
    onClose,
    duration = 8000,
    theme = 'modern',
    position = 'bottom-right'
}: WelcomePopupProps) => {
    // Timer Logic
    useEffect(() => {
        if (!isVisible) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [isVisible, duration, onClose]);

    // Theme Styles configuration
    const themeStyles = {
        professional: "bg-gradient-to-r from-blue-600 to-blue-800 text-white border-none",
        modern: "bg-zinc-900 text-white border border-primary/50 shadow-[0_4px_20px_rgba(0,255,100,0.15)]",
        vibrant: "bg-gradient-to-br from-purple-600 to-orange-500 text-white border-none"
    };

    // Position Styles configuration
    const positionStyles = {
        center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "bottom-right": "bottom-24 right-6 md:right-10 origin-bottom-right",
        top: "top-6 left-1/2 -translate-x-1/2"
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={cn(
                        "fixed z-[100] w-[calc(100vw-40px)] md:w-[400px] rounded-lg p-5 shadow-xl backdrop-blur-sm overflow-hidden",
                        themeStyles[theme],
                        positionStyles[position]
                    )}
                    role="alert"
                    aria-live="polite"
                >
                    <div className="flex gap-4 items-start relative z-10">
                        {/* Content */}
                        <div className="flex-1">
                            <p className="text-sm font-medium leading-relaxed">
                                {message}
                            </p>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="shrink-0 -mt-1 -mr-1 p-1.5 rounded-full hover:bg-white/20 transition-colors"
                            aria-label="Close notification"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Optional Decorative Particle (for modern/vibrant themes) */}
                    {theme !== 'professional' && (
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomePopup;
