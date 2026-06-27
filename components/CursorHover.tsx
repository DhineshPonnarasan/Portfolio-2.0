'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/motion-prefs';

interface Props {
    children: ReactNode;
    className?: string;
    /** Glow color — defaults to the green primary token. */
    glowColor?: string;
    /** Glow opacity 0..1. Default 0.35. */
    intensity?: number;
    /** Whether to listen for mouse moves. Default true. */
    enabled?: boolean;
}

/**
 * Wraps any element in a `position: relative` shell that paints a soft
 * radial-gradient highlight following the mouse. The position is tracked
 * via two CSS variables (`--cursor-glow-x`, `--cursor-glow-y`) so the
 * effect stays on the GPU and never re-renders React.
 *
 * Honours `prefers-reduced-motion` by short-circuiting the listener.
 */
const CursorHover = ({
    children,
    className,
    glowColor = 'rgba(16, 185, 129, 0.35)',
    intensity = 0.35,
    enabled = true,
}: Props) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (!ref.current) return;
        if (!enabled) return;
        if (reducedMotion) return;

        const el = ref.current;
        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            el.style.setProperty('--cursor-glow-x', `${e.clientX - rect.left}px`);
            el.style.setProperty('--cursor-glow-y', `${e.clientY - rect.top}px`);
        };

        el.addEventListener('mousemove', onMove);
        return () => el.removeEventListener('mousemove', onMove);
    }, [enabled, reducedMotion]);

    return (
        <div
            ref={ref}
            className={cn('relative isolate', className)}
            style={{
                // The pseudo-element is built in globals.css; expose a CSS
                // variable for the highlight color so callers can tint it.
                ['--cursor-glow-color' as never]: glowColor,
                ['--cursor-glow-intensity' as never]: String(intensity),
            }}
        >
            {children}
        </div>
    );
};

export default CursorHover;
