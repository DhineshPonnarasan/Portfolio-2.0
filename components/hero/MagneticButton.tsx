'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/motion-prefs';

interface Props {
    href: string;
    children: React.ReactNode;
    className?: string;
    /** Maximum translation (px) at the cursor hot-spot. Default 12. */
    strength?: number;
    /** Optional click handler (still respects href). */
    onClick?: () => void;
}

/**
 * Magnetic button that subtly chases the cursor within its own bounding box.
 * Capped at 12 px so it stays tasteful and never feels "tied to the cursor".
 *
 * - Uses `gsap.quickTo` for an extremely cheap, frame-aligned tween (no React
 *   re-renders, no spring physics).
 * - Honours `prefers-reduced-motion` — reduced motion skips the tween entirely
 *   and renders a static button.
 * - Sets `data-cursor="link"` so the custom cursor can react to hover.
 */
const MagneticButton = ({
    href,
    children,
    className,
    strength = 12,
    onClick,
}: Props) => {
    const ref = useRef<HTMLAnchorElement | null>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (!ref.current) return;
        if (reducedMotion) return;

        const el = ref.current;
        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

        const handleMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - (rect.left + rect.width / 2);
            const relY = e.clientY - (rect.top + rect.height / 2);
            xTo(Math.max(-strength, Math.min(strength, relX * 0.25)));
            yTo(Math.max(-strength, Math.min(strength, relY * 0.25)));
        };

        const handleLeave = () => {
            xTo(0);
            yTo(0);
        };

        window.addEventListener('mousemove', handleMove, { passive: true });
        el.addEventListener('mouseleave', handleLeave);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            el.removeEventListener('mouseleave', handleLeave);
            xTo(0);
            yTo(0);
        };
    }, [strength, reducedMotion]);

    return (
        <Link
            ref={ref}
            href={href}
            onClick={onClick}
            data-cursor="link"
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-300 will-change-transform',
                className,
            )}
        >
            {children}
        </Link>
    );
};

export default MagneticButton;
