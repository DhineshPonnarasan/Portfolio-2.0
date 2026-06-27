'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/motion-prefs';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type DividerVariant = 'wave' | 'tilt' | 'chunks';

interface Props {
    variant?: DividerVariant;
    className?: string;
    /** Tailwind height utility. Default `h-16`. */
    heightClass?: string;
}

/**
 * Subtle section divider that subtly scrubs as you scroll past it.
 * Three visual variants — choose whichever fits the surrounding sections:
 *
 * - `wave`: a smooth horizontal sine curve (default)
 * - `tilt`: a slanted wedge
 * - `chunks`: stepped pixel-art bars
 *
 * All variants:
 *  - Honour `prefers-reduced-motion` (they snap into place, no scrub).
 *  - Use a GSAP `scrollTrigger: { scrub: true }` for the parallax-y reveal.
 */
const SectionDivider = ({ variant = 'wave', className, heightClass = 'h-16' }: Props) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const reducedMotion = useReducedMotion();

    useGSAP(
        () => {
            if (!ref.current) return;
            if (reducedMotion) {
                gsap.set(ref.current, { y: 0, opacity: 1 });
                return;
            }
            gsap.fromTo(
                ref.current,
                { y: 24, opacity: 0.4 },
                {
                    y: -24,
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    },
                },
            );
        },
        { scope: ref, dependencies: [reducedMotion] },
    );

    return (
        <div
            ref={ref}
            className={cn(
                'relative w-full overflow-hidden pointer-events-none select-none',
                heightClass,
                className,
            )}
            aria-hidden="true"
        >
            {variant === 'wave' && (
                <svg
                    viewBox="0 0 1200 80"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full text-white/10"
                >
                    <path
                        d="M0 40 Q 150 0 300 40 T 600 40 T 900 40 T 1200 40 V80 H0 Z"
                        fill="currentColor"
                    />
                    <path
                        d="M0 40 Q 150 80 300 40 T 600 40 T 900 40 T 1200 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-primary/30"
                    />
                </svg>
            )}

            {variant === 'tilt' && (
                <svg
                    viewBox="0 0 1200 80"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                >
                    <polygon points="0,80 1200,0 1200,80" fill="rgba(255,255,255,0.06)" />
                    <polygon points="0,80 600,30 1200,80" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
                </svg>
            )}

            {variant === 'chunks' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-2 w-full max-w-5xl items-center gap-1 px-6">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <span
                                key={i}
                                className="block flex-1 rounded-sm bg-white/10"
                                style={{ height: `${4 + ((i * 37) % 16)}px` }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionDivider;
